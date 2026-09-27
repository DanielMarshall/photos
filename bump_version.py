"""Stamps a new cache version into index.html.

    python bump_version.py

index.html loads style.css and script.js as `?v=<version>`, and script.js
fetches images.json with the same version. Browsers keep all three cached
until the version changes, so bump it whenever any of them changes.
build_data.py calls this automatically after writing images.json.
"""
import os
import re
from datetime import datetime

PHOTOS = os.path.dirname(os.path.abspath(__file__))
INDEX = os.path.join(PHOTOS, "index.html")


def bump():
    version = datetime.now().strftime("%Y%m%d-%H%M%S")
    with open(INDEX, encoding="utf-8") as f:
        html = f.read()
    html, n = re.subn(r'((?:style\.css|script\.js)\?v=)[\w.-]+', r"\g<1>" + version, html)
    if n != 2:
        raise SystemExit(f"Expected 2 versioned links in index.html, found {n}")
    with open(INDEX, "w", encoding="utf-8", newline="") as f:
        f.write(html)
    print(f"Cache version is now {version}")
    return version


if __name__ == "__main__":
    bump()
