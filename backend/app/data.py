"""
============================================================================
THE FILE TO EDIT — all building + location data lives here.
============================================================================

To adapt this to your real building you should only need to touch this file
(and drop your assets into the frontend's /public folder). No API or frontend
code changes required.

STAND-IN ASSETS — replace when ready:
  - `map_image`  : generated placeholder floor plan served by the frontend at
                   /maps/building-floorplan.png. Swap for your real map export
                   (PNG/SVG/WEBP). Pin coordinates are percentages, so any
                   aspect ratio works.
  - PANORAMA_*   : public sample equirectangular photo. Replace with your own
                   360 images (drop them in the frontend's /public/panoramas).
  - VIDEO_*      : public sample MP4s. Replace with your own walkthrough clips
                   (drop them in the frontend's /public/videos).

Coordinates are { x, y } percentages measured from the TOP-LEFT of the map
image (0-100). The pin's pointer tip sits exactly on that point.
"""

import re
from uuid import uuid4

from .models import Building, BuildingLocation, LocationCreate, MapCoordinates

PANORAMA_STANDIN = "https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg"

VIDEO_STANDIN_A = (
    "https://commondatastorage.googleapis.com/"
    "gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
)
VIDEO_STANDIN_B = (
    "https://commondatastorage.googleapis.com/"
    "gtv-videos-bucket/sample/ForBiggerFun.mp4"
)

BUILDING = Building(
    id="innovation-hall",
    name="Innovation Hall",
    address="742 Maker Avenue - Floor 1",
    map_image="/maps/building-floorplan.png",
    locations=[
        BuildingLocation(
            id="main-entrance",
            name="Main Entrance",
            category="entrance",
            description=(
                "The primary street-level entrance. Accessible ramp on the "
                "east side and a covered drop-off zone directly out front."
            ),
            coordinates=MapCoordinates(x=50, y=91),
            panorama_url=PANORAMA_STANDIN,
        ),
        BuildingLocation(
            id="lobby",
            name="Main Lobby",
            category="room",
            description=(
                "Double-height reception area with the welcome desk, visitor "
                "check-in kiosks, and seating. Start any tour here."
            ),
            coordinates=MapCoordinates(x=50, y=66),
            thumbnail="/thumbnails/lobby.png",
            panorama_url=PANORAMA_STANDIN,
            video_url=VIDEO_STANDIN_A,
        ),
        BuildingLocation(
            id="auditorium",
            name="Grand Auditorium",
            category="room",
            description=(
                "220-seat auditorium used for keynotes and all-hands. "
                "Equipped with a full AV rig and a live-stream booth."
            ),
            coordinates=MapCoordinates(x=24, y=44),
            video_url=VIDEO_STANDIN_B,
        ),
        BuildingLocation(
            id="cafe",
            name="Corner Cafe",
            category="amenity",
            description=(
                "Coffee bar and grab-and-go counter. Open 7am-4pm on weekdays. "
                "Seating spills into the adjacent courtyard."
            ),
            coordinates=MapCoordinates(x=73, y=39),
            panorama_url=PANORAMA_STANDIN,
        ),
        BuildingLocation(
            id="innovation-lab",
            name="Innovation Lab",
            category="facility",
            description=(
                "Hardware prototyping lab with 3D printers, a laser cutter, and "
                "electronics benches. Badge access required."
            ),
            coordinates=MapCoordinates(x=39, y=24),
            panorama_url=PANORAMA_STANDIN,
            video_url=VIDEO_STANDIN_A,
        ),
        BuildingLocation(
            id="courtyard",
            name="Central Courtyard",
            category="outdoor",
            description=(
                "Landscaped open-air courtyard at the heart of the building. "
                "A quiet spot for breaks and informal meetings."
            ),
            coordinates=MapCoordinates(x=82, y=71),
            panorama_url=PANORAMA_STANDIN,
        ),
    ],
)


def get_building() -> Building:
    """Return the single building. Swap this for a DB/CMS lookup later."""
    return BUILDING


def get_location(location_id: str) -> BuildingLocation | None:
    """Return a single location by id, or None if it doesn't exist."""
    return next((loc for loc in BUILDING.locations if loc.id == location_id), None)


def _slugify(name: str) -> str:
    """Turn a display name into a URL-safe id, e.g. 'Conference Room B' ->
    'conference-room-b'."""
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return slug or "location"


def add_location(data: LocationCreate) -> BuildingLocation:
    """Create a new location, append it to the building, and return it.

    NOTE: this stores the pin in the in-memory `BUILDING` object, so new pins
    live only until the server restarts. Swap the body for a DB/CMS insert to
    make them durable — the frontend contract stays the same.
    """
    existing = {loc.id for loc in BUILDING.locations}
    location_id = _slugify(data.name)
    if location_id in existing:
        location_id = f"{location_id}-{uuid4().hex[:6]}"

    location = BuildingLocation(
        id=location_id,
        name=data.name,
        category=data.category,
        description=data.description,
        coordinates=data.coordinates,
        thumbnail=data.thumbnail,
        video_url=data.video_url,
        panorama_url=data.panorama_url,
    )
    BUILDING.locations.append(location)
    return location
