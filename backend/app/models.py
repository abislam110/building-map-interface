"""
Pydantic models for the single-building indoor map API.

These mirror the frontend's TypeScript types in `lib/types.ts`. If you change
a shape here, update that file too so the client stays in sync.
"""

from enum import Enum

from pydantic import BaseModel, Field


class LocationCategory(str, Enum):
    """Category of a location. Controls the pin color + icon on the frontend.

    Add a new category by adding a member here AND a matching entry in the
    frontend's `lib/categories.tsx` (plus a `--pin-*` token in globals.css).
    """

    entrance = "entrance"
    amenity = "amenity"
    room = "room"
    facility = "facility"
    outdoor = "outdoor"


class MapCoordinates(BaseModel):
    """A point on the map, as percentages (0-100) from the map image's
    top-left. Percentages keep pins aligned at any rendered size or zoom."""

    x: float = Field(..., ge=0, le=100)
    y: float = Field(..., ge=0, le=100)


class BuildingLocation(BaseModel):
    """A single point of interest inside the building."""

    id: str
    name: str
    category: LocationCategory
    description: str
    coordinates: MapCoordinates
    thumbnail: str | None = None
    video_url: str | None = Field(default=None, serialization_alias="videoUrl")
    panorama_url: str | None = Field(default=None, serialization_alias="panoramaUrl")


class Building(BaseModel):
    """The building rendered by the app. Exactly one per deployment."""

    id: str
    name: str
    address: str
    map_image: str = Field(..., serialization_alias="mapImage")
    locations: list[BuildingLocation]


# Serialize with camelCase aliases so the JSON matches what the React client
# expects (e.g. `videoUrl`, `mapImage`) without any client-side remapping.
def to_client_json(model: BaseModel):
    return model.model_dump(by_alias=True, exclude_none=True)
