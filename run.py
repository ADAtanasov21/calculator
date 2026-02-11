#!/usr/bin/env python3
"""
Web Calculator Runner - Serves the HTML/CSS/JS application locally.
Opens the calculator in your default browser automatically.
"""

import os
import webbrowser
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler
from threading import Thread


def start_server(port=8000):
    """Start a local HTTP server."""
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    handler = SimpleHTTPRequestHandler
    server = HTTPServer(('127.0.0.1', port), handler)
    
    print(f"\n{'='*50}")
    print("   Functional Calculator - Web Server")
    print(f"{'='*50}")
    print(f"\nServer started at: http://localhost:{port}")
    print(f"Open your browser and go to: http://localhost:{port}")
    print("\nPress Ctrl+C to stop the server.\n")
    
    # Open browser automatically
    time.sleep(1)  # Give server a moment to start
    try:
        webbrowser.open(f'http://localhost:{port}')
    except:
        pass
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n\nServer stopped.")
        server.server_close()


if __name__ == "__main__":
    start_server()

