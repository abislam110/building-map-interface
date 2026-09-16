# Innovation Hall Map API (Python / FastAPI)

This is the backend for the indoor-map frontend. It owns all building and
location data and serves it as JSON. The React frontend fetches from it.

## Requirements

- Python 3.10+

## Run locally

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

- API base: http://localhost:8000
- Interactive docs (Swagger UI): http://localhost:8000/docs

## Endpoints

| Method | Path                                 | Description                          |
| ------ | ------------------------------------ | ------------------------------------ |
| GET    | `/health`                            | Liveness probe                       |
| GET    | `/api/building`                      | Full building + all locations        |
| GET    | `/api/building/locations`            | List of locations (pins)             |
| GET    | `/api/building/locations/{id}`       | A single location by id              |

Responses use camelCase keys (e.g. `mapImage`, `videoUrl`) so the frontend
consumes them directly.

## Where the data lives

Edit **`app/data.py`** — it holds the building, its address, the map image
path, and every location (pins, descriptions, video URLs, 360 panorama URLs).
This is the only file you need to change to adapt the app to a real building.

Coordinates are `{ x, y }` percentages (0-100) measured from the top-left of
the map image, so pins stay aligned at any image size or zoom.

Media/map assets themselves live in the frontend's `public/` folder
(`public/maps`, `public/videos`, `public/panoramas`); `data.py` just points at
those paths.

## Connecting the frontend

The frontend reads the backend URL from the `API_URL` env var (server-side),
defaulting to `http://localhost:8000`. To point it elsewhere, set it in the
frontend project root:

```bash
# .env.local (in the project root, not in backend/)
API_URL=http://localhost:8000
```

If the backend is unreachable, the frontend renders a bundled sample-data
snapshot and shows a notice banner. Run this backend for live data.

## CORS

Configure allowed origins with the `ALLOWED_ORIGINS` env var (comma-separated).
Defaults to `*` for local development.

```bash
ALLOWED_ORIGINS=https://your-frontend.example.com uvicorn app.main:app --port 8000
```
