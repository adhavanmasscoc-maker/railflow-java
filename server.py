import http.server
import socketserver
import os
import sys

PORT = int(os.environ.get("PORT", 8080))
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def run():
    port = PORT
    for _ in range(10):
        try:
            with socketserver.TCPServer(("", port), Handler) as httpd:
                print("\n======================================================")
                print(f" 🚆 RailFlow Python Server is LIVE at:")
                print(f" 👉 http://localhost:{port}/")
                print(f" 👉 http://127.0.0.1:{port}/")
                print("======================================================\n")
                print(" ✨ Zero external dependencies - Python standard library")
                print(" Press Ctrl+C to stop.\n")
                httpd.serve_forever()
        except OSError as e:
            if "Address already in use" in str(e) or getattr(e, 'winerror', None) == 10048:
                print(f"[!] Port {port} is in use, trying port {port + 1}...")
                port += 1
            else:
                raise e

if __name__ == "__main__":
    run()
