import json
import os
import re
import subprocess
import sys
import shutil

PHOTOS = "C:/Users/dashi/photos"
BORDER_SCRIPT = "C:/Users/dashi/Claude Local Session/exifborder.py"
BORDER_CONFIG = "C:/Users/dashi/Claude Local Session/exifborder.toml"
TMP_OUT = "C:/Users/dashi/photos/_border_tmp"

FRAME_RE = re.compile(r"(\d+)[\s-]*(?:frame|photo)|stack of (\d+)", re.I)

# exifborder.py only normalizes camera/lens names on its own EXIF-read path,
# not for manual CLI overrides -- replicate its lookup table here.
CAMERA_NAMES = {
    "OM-1MarkII": "OM-1 Mark II",
    "OM-1 Mark II": "OM-1 Mark II",
    "OM-1": "OM-1",
    "E-M1MarkIII": "E-M1 Mark III",
}
LENS_NAMES = {
    "OM 90mm F3.5": "M.Zuiko 90mm f/3.5 Macro",
    "OM 90mm F3.5 + MC-20": "M.Zuiko 90mm f/3.5 Macro + MC-20 2x Teleconverter",
}

def frame_count(description):
    if not description:
        return None
    m = FRAME_RE.search(description)
    return (m.group(1) or m.group(2)) if m else None

def to_date(dt):
    if not dt:
        return None
    date_part = dt.split(" ")[0]
    return date_part.replace(":", "-")

def main():
    # optional: pass original_filename(s) as argv to only (re)process those,
    # instead of every item -- avoids double-bordering already-done images.
    whitelist = set(sys.argv[1:]) or None

    with open(os.path.join(PHOTOS, "images.json"), encoding="utf-8") as f:
        items = json.load(f)

    os.makedirs(TMP_OUT, exist_ok=True)
    done, skipped = 0, 0

    for item in items:
        if whitelist is not None and item["original_filename"] not in whitelist:
            continue
        settings = item.get("settings")
        if not settings:
            skipped += 1
            continue

        title = item.get("title") or item.get("caption") or item["original_filename"]
        medium_path = os.path.join(PHOTOS, item["medium"].replace("/", os.sep))
        slug = os.path.splitext(os.path.basename(medium_path))[0]

        cmd = [
            sys.executable, BORDER_SCRIPT, medium_path,
            "--config", BORDER_CONFIG,
            "--title", title,
            "--outdir", TMP_OUT,
            "--suffix", "",
            "--overwrite",
        ]
        if item.get("location"):
            cmd += ["--location", item["location"]]
        if settings.get("camera"):
            cmd += ["--camera", CAMERA_NAMES.get(settings["camera"], settings["camera"])]
        if settings.get("lens"):
            cmd += ["--lens", LENS_NAMES.get(settings["lens"], settings["lens"])]
        if settings.get("shutter"):
            cmd += ["--shutter", settings["shutter"].rstrip("s")]
        if settings.get("aperture"):
            cmd += ["--aperture", settings["aperture"]]
        if settings.get("iso"):
            cmd += ["--iso", str(settings["iso"])]
        if settings.get("focal"):
            cmd += ["--focal", settings["focal"]]
        date = to_date(settings.get("datetime"))
        if date:
            cmd += ["--date", date]
        frames = frame_count(item.get("description"))
        if frames:
            cmd += ["--frames", frames]

        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"FAILED: {item['original_filename']}")
            print(result.stderr[-500:])
            skipped += 1
            continue

        # exifborder writes <slug>.jpg (suffix "") into TMP_OUT since we pass
        # --outdir there directly (no source subfolder nesting).
        out_file = os.path.join(TMP_OUT, slug + ".jpg")
        if not os.path.exists(out_file):
            print(f"MISSING OUTPUT: {item['original_filename']} -> expected {out_file}")
            skipped += 1
            continue
        shutil.move(out_file, medium_path)
        done += 1

    print(f"Bordered {done} medium images, skipped {skipped}")

if __name__ == "__main__":
    main()
