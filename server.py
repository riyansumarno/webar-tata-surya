from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os, webbrowser, threading
PORT = 8000
ROOT = Path(__file__).resolve().parent
os.chdir(ROOT)
class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control','no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma','no-cache')
        self.send_header('Expires','0')
        super().end_headers()
url=f'http://localhost:{PORT}/'
print('\nWebAR Tata Surya')
print('Local URL :', url)
print('Tekan Ctrl+C untuk menghentikan server.\n')
threading.Timer(0.8, lambda: webbrowser.open(url)).start()
ThreadingHTTPServer(('127.0.0.1',PORT), Handler).serve_forever()
