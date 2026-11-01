#!/usr/bin/env python3
"""Serve clean nested routes without redirecting to a trailing slash."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlsplit
import argparse
ROOT = Path(__file__).resolve().parents[1] / 'dist'
class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs): super().__init__(*args,directory=str(ROOT),**kwargs)
    def do_GET(self):
        path=urlsplit(self.path).path
        candidate=ROOT / path.lstrip('/') / 'index.html'
        if candidate.is_file(): self.path=path.rstrip('/')+'/index.html'
        return super().do_GET()
    def end_headers(self):
        self.send_header('Cache-Control','no-cache')
        self.send_header('X-Content-Type-Options','nosniff')
        super().end_headers()
parser=argparse.ArgumentParser();parser.add_argument('--port',type=int,default=4173)
args=parser.parse_args()
print(f'Miranda preview: http://localhost:{args.port}',flush=True)
ThreadingHTTPServer(('127.0.0.1',args.port),Handler).serve_forever()
