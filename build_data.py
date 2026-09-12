import piexif
import json
import os
import re

EXPORTS = "C:/Users/dashi/Pictures/Camera Roll/exports"
CAMROLL = "C:/Users/dashi/Pictures/Camera Roll"
PHOTOS = "C:/Users/dashi/photos"

# stack-composite -> resolved source file (for camera settings only)
SOURCE_MAP = {
    "11092026_200012P9111035 under spider stack.jpg": os.path.join(EXPORTS, "11092026_200012P9111035.jpg"),
    "11092026_201904P9111337 stack.jpg": os.path.join(EXPORTS, "11092026_201904P9111337.jpg"),
    "12092026_081712P9120052wasp stack.jpg": os.path.join(EXPORTS, "12092026_081712P9120052wasp.jpg"),
    "12092026_131947P9120308Sydney CBD 8stack.jpg": os.path.join(CAMROLL, "12092026_131947P9120308Sydney CBD.jpg"),
    "12092026_132044P9120399_01Sydney CBD 8stack.jpg": os.path.join(CAMROLL, "12092026_132044P9120399_01Sydney CBD.jpg"),
    "12092026_185356P9120006UV Spider 2stack.jpg": os.path.join(CAMROLL, "12092026_185356P9120006UV Spider.jpg"),
    "STACK-P9040321.jpg": os.path.join(CAMROLL, "2026_09_04", "P9040321.ORF"),
}
UNRESOLVED = {"STACK-2-Spider.jpg"}

def rat(x):
    if x is None:
        return None
    return x[0] / x[1] if x[1] else None

def fmt_shutter(x):
    v = rat(x)
    if v is None:
        return None
    if v >= 1:
        return f"{v:g}s"
    denom = round(1 / v)
    return f"1/{denom}s"

def fmt_aperture(x):
    v = rat(x)
    return f"f/{v:g}" if v is not None else None

def fmt_focal(x):
    v = rat(x)
    return f"{v:g}mm" if v is not None else None

def get_settings(path):
    try:
        exif = piexif.load(path)
    except Exception:
        return None
    ex = exif.get("Exif", {})
    z = exif.get("0th", {})
    aperture = fmt_aperture(ex.get(piexif.ExifIFD.FNumber))
    shutter = fmt_shutter(ex.get(piexif.ExifIFD.ExposureTime))
    iso = ex.get(piexif.ExifIFD.ISOSpeedRatings)
    focal = fmt_focal(ex.get(piexif.ExifIFD.FocalLength))
    lens = ex.get(piexif.ExifIFD.LensModel)
    lens = lens.decode(errors="ignore").strip("\x00").strip() if lens else None
    model = z.get(piexif.ImageIFD.Model)
    model = model.decode(errors="ignore").strip() if model else None
    dt = ex.get(piexif.ExifIFD.DateTimeOriginal)
    dt = dt.decode(errors="ignore") if dt else None
    if not any([aperture, shutter, iso, focal, lens, dt]):
        return None
    return {
        "aperture": aperture,
        "shutter": shutter,
        "iso": iso,
        "focal": focal,
        "lens": lens,
        "camera": model,
        "datetime": dt,
    }

def caption(original):
    no_ext = re.sub(r"\.[Jj][Pp][Gg]$", "", original)
    dated = re.match(r"^\d{8}_\d{6}P\d+(.*)$", no_ext)
    if dated:
        text = dated.group(1)
        text = re.sub(r"^_?0*\d*", "", text)
        text = re.sub(r"-\s*copy$", "", text, flags=re.I)
        return text.strip()
    return re.sub(r"[-_]+", " ", no_ext).strip()

PEOPLE = {
    "Nathan and Zeke1.jpg", "Nathan and Zeke2.jpg",
    "Nathan.jpg", "mum - Diana.jpg",
    "Timmy.JPG", "Timmy2.JPG", "Timmy3.JPG", "Timmy4.JPG", "Timmy5.JPG",
}
PLANES = {"Plane - Quatari.jpg", "Plane - Virgin.jpg"}
UNCATEGORIZED_GLADESVILLE = {"Bus-Stop.jpg"}

# Taken at work (Artarmon), not home -- first names only, no employer/address published
ARTARMON_TITLES = {
    "Billy.JPG": "Billy",
    "Chloe-kiani.JPG": "Kiani",
    "Slava.JPG": "Slava",
}

GARDEN_START = "131127"
GARDEN_END = "134238"

def classify(original, dt):
    if "Sydney CBD" in original:
        m = re.match(r"^(\d{8})_(\d{6})", original)
        time_code = m.group(2) if m else None
        if time_code and GARDEN_START <= time_code <= GARDEN_END:
            return "Chinese Garden of Friendship", None, "Darling Harbour, Sydney (water dragons & waterfall)"
        if time_code and time_code > GARDEN_END:
            return "Sydney CBD", None, "Darling Harbour to Wynyard, Sydney"
        return "Sydney CBD", None, "Darling Harbour area, Sydney"
    if original in ARTARMON_TITLES:
        return "Artarmon", None, "Artarmon"
    if original == "Sprout.jpg":
        return "Hornsby Heights", None, "Hornsby Heights, Sydney"
    if original in PEOPLE:
        return "Gladesville", "People", "Home"
    if original in PLANES:
        return "Gladesville", "Planes", "Home"
    if original in UNCATEGORIZED_GLADESVILLE:
        return "Gladesville", "Uncategorized", "Home (unconfirmed)"
    return "Gladesville", "Insects", "Home"

def main():
    with open(os.path.join(PHOTOS, "manifest.tsv"), encoding="utf-8") as f:
        lines = [l.rstrip("\n") for l in f if l.strip()]

    items = []
    unresolved_report = []

    for line in lines:
        slug, original = line.split("\t")
        own_path = os.path.join(EXPORTS, original)
        settings = get_settings(own_path)
        if settings is None and original in SOURCE_MAP:
            settings = get_settings(SOURCE_MAP[original])
        if settings is None and original in UNRESOLVED:
            unresolved_report.append(original)

        dt = settings["datetime"] if settings else None
        category, subcategory, location = classify(original, dt)

        items.append({
            "thumb": f"images/thumbs/{slug}.jpg",
            "medium": f"images/medium/{slug}.jpg",
            "full": f"images/full/{slug}.jpg",
            "original_filename": original,
            "caption": caption(original),
            "title": ARTARMON_TITLES.get(original, ""),
            "description": "",
            "category": category,
            "subcategory": subcategory,
            "location": location,
            "settings": settings,
        })

    # sort by datetime when available, falling back to filename
    def sort_key(item):
        dt = item["settings"]["datetime"] if item["settings"] else None
        return (dt is None, dt or item["thumb"])
    items.sort(key=sort_key)

    with open(os.path.join(PHOTOS, "images.json"), "w", encoding="utf-8") as f:
        json.dump(items, f, indent=2)

    print(f"Wrote {len(items)} items")
    from collections import Counter
    cats = Counter((i["category"], i["subcategory"]) for i in items)
    for k, v in sorted(cats.items(), key=lambda x: -x[1]):
        print(f"  {k}: {v}")
    print(f"Unresolved settings (no source found): {unresolved_report}")
    no_settings = [i["original_filename"] for i in items if i["settings"] is None]
    print(f"Total with no settings at all: {len(no_settings)} -> {no_settings}")

if __name__ == "__main__":
    main()
