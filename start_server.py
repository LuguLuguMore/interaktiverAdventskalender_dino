import http.server
import socket
import socketserver
import webbrowser
from functools import partial
import os

PORT = 8000


def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = "127.0.0.1"
    finally:
        s.close()
    return ip


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    local_ip = get_local_ip()
    lan_url = f"http://{local_ip}:{PORT}/"

    # Aktualisiere js/lan-config.js automatisch, damit QR-Codes im WLAN sofort funktionieren
    with open(os.path.join("js", "lan-config.js"), "w", encoding="utf-8") as f:
        f.write("// Automatisch aktualisiert durch start_server.py für WLAN-QR-Codes\n")
        f.write(f'window.LAN_BASE_URL = "{lan_url}";\n')

    handler = partial(http.server.SimpleHTTPRequestHandler)

    print("=" * 60)
    print("  Interaktiver Adventskalender - Rexi & Tobi")
    print("=" * 60)
    print(f"  Lokal am PC:       http://localhost:{PORT}/")
    print(f"  Für QR-Codes/Natel: http://{local_ip}:{PORT}/")
    print("=" * 60)
    print("Tipp: Trage die Natel-URL in 'Ausmalbilder drucken' als")
    print("Basis-URL ein, damit das Smartphone im gleichen WLAN")
    print("die QR-Codes direkt öffnen kann.")
    print("Zum Beenden: Strg + C drücken.\n")

    with socketserver.TCPServer(("", PORT), handler) as httpd:
        webbrowser.open(f"http://localhost:{PORT}/index.html")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer beendet.")
