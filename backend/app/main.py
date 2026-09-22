"""
FastAPI backend for the single-building indoor map.

It owns all building + location data (see `data.py`) and serves it as JSON
that the React frontend fetches. Responses use camelCase keys so the client
consumes them directly with no remapping.

Run locally:
    cd backend
    python -m venv .venv && source .venv/bin/activate
    pip install -r requirements.txt
    uvicorn app.main:app --reload --port 8000

Interactive API docs: http://localhost:8000/docs
"""

import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .data import add_location, get_building, get_location
from .models import LocationCreate, to_client_json

app = FastAPI(
    title="Innovation Hall Map API",
    description="Data source for the single-building indoor map frontend.",
    version="1.0.0",
)

# Allow the Next.js frontend to call this API from the browser or server.
# Set ALLOWED_ORIGINS to a comma-separated list in production, e.g.
# "https://your-app.vercel.app". Defaults to "*" for local development.
_origins = os.getenv("ALLOWED_ORIGINS", "*")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if _origins == "*" else [o.strip() for o in _origins.split(",")],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/health", tags=["meta"])
def health():
    """Liveness probe."""
    return {"status": "ok"}


@app.get("/api/building", tags=["building"])
def read_building():
    """The full building, including all locations. This is the primary
    endpoint the frontend calls to render the whole experience."""
    return to_client_json(get_building())


@app.get("/api/building/locations", tags=["building"])
def read_locations():
    """Just the list of locations (pins)."""
    return [to_client_json(loc) for loc in get_building().locations]


@app.get("/api/building/locations/{location_id}", tags=["building"])
def read_location(location_id: str):
    """A single location by id."""
    location = get_location(location_id)
    if location is None:
        raise HTTPException(status_code=404, detail="Location not found")
    return to_client_json(location)


@app.post("/api/building/locations", status_code=201, tags=["building"])
def create_location(payload: LocationCreate):
    """Create a new pin/location and return it (with its server-generated id).
    The frontend calls this when a user adds a pin via the map UI."""
    location = add_location(payload)
    return to_client_json(location)
