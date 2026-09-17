"""
RailFlow Heuristic Conflict Solver & Optimization Service (python_backend/optimizer.py)
"""
import os
import sys

# Import core implementation from scripts/optimizer.py
scripts_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "scripts"))
if scripts_dir not in sys.path:
    sys.path.insert(0, scripts_dir)

from optimizer import app, calculate_best_platform, calculate_penalty, DEFAULT_PLATFORMS

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    print(f"🚆 RailFlow Python Optimizer Engine starting on http://localhost:{port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
