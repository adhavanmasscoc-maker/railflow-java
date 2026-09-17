"""
RailFlow Heuristic Conflict Solver & Computer Vision Optimization Engine
Runs sub-50ms penalty scoring, chokepoint telemetry streaming, and platform conflict resolution.
Operates via FastAPI + WebSockets, with built-in standard library fallback.
"""

import sys
import os
import time
import json
import math
import random
from typing import List, Dict, Any, Optional

# Standard penalty weight constants
WEIGHT_DENSITY = 40.0
WEIGHT_FOB = 0.40
WEIGHT_TRACK_DIST = 5.0

# Initial Hub Platforms State
DEFAULT_PLATFORMS = [
    {"id": 1, "name": "Platform 1", "density": 1.2, "fob_load": 42, "track_distance": 1, "train": "12622 Tamil Nadu Exp", "length_m": 600},
    {"id": 2, "name": "Platform 2", "density": 2.9, "fob_load": 91, "track_distance": 2, "train": "12638 Pandyan Exp", "length_m": 580},
    {"id": 3, "name": "Platform 3", "density": 0.8, "fob_load": 28, "track_distance": 3, "train": None, "length_m": 620},
    {"id": 4, "name": "Platform 4", "density": 1.4, "fob_load": 53, "track_distance": 4, "train": None, "length_m": 600},
    {"id": 5, "name": "Platform 5", "density": 2.2, "fob_load": 76, "track_distance": 5, "train": "20608 Vande Bharat", "length_m": 450},
    {"id": 6, "name": "Platform 6", "density": 0.5, "fob_load": 18, "track_distance": 6, "train": None, "length_m": 550},
    {"id": 7, "name": "Platform 7", "density": 1.1, "fob_load": 34, "track_distance": 7, "train": None, "length_m": 550},
    {"id": 8, "name": "Platform 8", "density": 0.4, "fob_load": 12, "track_distance": 8, "train": None, "length_m": 500},
]

def calculate_penalty(platform: Dict[str, Any], track_distance: Optional[float] = None) -> float:
    """
    Computes heuristic penalty score for a target platform.
    Penalty = (density * 40) + (fob_load * 0.4) + (track_distance * 5)
    Lower score = safer, less congested track allocation.
    """
    density = platform.get("density", 1.0)
    fob = platform.get("fob_load", 50.0)
    dist = track_distance if track_distance is not None else platform.get("track_distance", 1.0)
    return round((density * WEIGHT_DENSITY) + (fob * WEIGHT_FOB) + (dist * WEIGHT_TRACK_DIST), 2)

def calculate_best_platform(platforms: List[Dict[str, Any]], incoming_train: Dict[str, Any]) -> Dict[str, Any]:
    """
    Finds the optimal conflict-free platform minimizing crowd surge and passenger traversal.
    """
    available = [p for p in platforms if p.get("train") is None]
    if not available:
        # If all occupied, pick lowest density platform
        available = platforms

    return min(available, key=lambda p: calculate_penalty(p))

def estimate_cv_crowd_headcount(polygon_points: List[tuple], density_map: float) -> int:
    """
    Simulates OpenCV / YOLO zone headcount calculation from polygon bounding area.
    Area (m²) * density (persons/m²) = Headcount
    """
    # Shoelace formula for polygon area
    n = len(polygon_points)
    if n < 3:
        return 0
    area = 0.5 * abs(sum(polygon_points[i][0] * polygon_points[(i + 1) % n][1] -
                         polygon_points[(i + 1) % n][0] * polygon_points[i][1] for i in range(n)))
    return int(round(area * density_map))

# Try FastAPI implementation
try:
    from fastapi import FastAPI, WebSocket, WebSocketDisconnect
    from fastapi.middleware.cors import CORSMiddleware
    import asyncio
    import uvicorn

    app = FastAPI(title="RailFlow Heuristic Optimizer Engine", version="2.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    platforms_state = [dict(p) for p in DEFAULT_PLATFORMS]

    @app.get("/health")
    def health():
        return {"status": "ONLINE", "engine": "RailFlow Heuristic Solver v2.0", "timestamp": time.time()}

    @app.get("/api/platforms")
    def get_platforms():
        for p in platforms_state:
            p["penalty"] = calculate_penalty(p)
        return {"platforms": platforms_state}

    @app.post("/api/reallocate")
    def reallocate(payload: Dict[str, Any]):
        train = payload.get("train", {"trainNo": "12638", "name": "Pandyan Express"})
        best_p = calculate_best_platform(platforms_state, train)
        old_p = payload.get("currentPlatform", 2)
        
        # Update state
        for p in platforms_state:
            if p["id"] == old_p:
                p["train"] = None
                p["density"] = max(0.4, round(p["density"] * 0.45, 2))
            elif p["id"] == best_p["id"]:
                p["train"] = f"{train.get('trainNo', '')} {train.get('name', 'Express')}"
                p["density"] = min(3.0, round(p["density"] + 0.9, 2))

        return {
            "status": "REALLOCATED",
            "fromPlatform": old_p,
            "toPlatform": best_p["id"],
            "penaltyScore": calculate_penalty(best_p),
            "announcement": f"Attention please, Train {train.get('trainNo')} is arriving at Platform {best_p['id']} instead of Platform {old_p}. Please use Foot Over Bridge 2 for safe passage.",
            "timestamp": time.time()
        }

    @app.websocket("/ws/telemetry")
    async def telemetry_stream(websocket: WebSocket):
        await websocket.accept()
        try:
            while True:
                # Dynamically generate realistic live telemetry packet
                active_platform = random.choice([1, 2, 3, 4, 5, 6, 7, 8])
                density = round(random.uniform(0.5, 2.9), 2)
                fob_load = random.randint(25, 95)
                status = "CRITICAL_SURGE" if density > 2.5 else ("WARNING" if density > 1.5 else "SAFE")

                payload = {
                    "platform": active_platform,
                    "density": density,
                    "fob_load": fob_load,
                    "status": status,
                    "chokepoints": {
                        "concourse_north": round(random.uniform(0.8, 2.7), 2),
                        "concourse_south": round(random.uniform(0.6, 1.9), 2),
                        "fob_1_stairs": round(random.uniform(1.2, 3.1), 2),
                        "fob_2_escalator": round(random.uniform(0.9, 2.4), 2)
                    },
                    "timestamp": time.time()
                }
                await websocket.send_json(payload)
                await asyncio.sleep(1.5)
        except WebSocketDisconnect:
            pass

    def run_fastapi(port=8000):
        print(f"[OK] Starting FastAPI Optimizer Engine on http://localhost:{port}")
        uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")

except ImportError:
    # Standard library fallback if FastAPI or uvicorn is not installed
    import http.server
    import socketserver

    class StandardOptimizerHandler(http.server.SimpleHTTPRequestHandler):
        def do_GET(self):
            if self.path.startswith("/api/platforms") or self.path == "/health":
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                response = {
                    "status": "ONLINE",
                    "engine": "RailFlow Heuristics (StdLib Fallback)",
                    "platforms": DEFAULT_PLATFORMS,
                    "timestamp": time.time()
                }
                self.wfile.write(json.dumps(response).encode("utf-8"))
            else:
                super().do_GET()

        def do_POST(self):
            if self.path.startswith("/api/reallocate"):
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                best = calculate_best_platform(DEFAULT_PLATFORMS, {"trainNo": "12638"})
                response = {
                    "status": "REALLOCATED",
                    "toPlatform": best["id"],
                    "penalty": calculate_penalty(best),
                    "timestamp": time.time()
                }
                self.wfile.write(json.dumps(response).encode("utf-8"))
            else:
                self.send_response(404)
                self.end_headers()

    def run_stdlib(port=8000):
        with socketserver.TCPServer(("", port), StandardOptimizerHandler) as httpd:
            print(f"[OK] Starting Standard Library Optimizer on http://localhost:{port}")
            httpd.serve_forever()

if __name__ == "__main__":
    port = int(os.environ.get("OPTIMIZER_PORT", 8000))
    if 'uvicorn' in sys.modules and 'app' in locals():
        run_fastapi(port)
    else:
        run_stdlib(port)
