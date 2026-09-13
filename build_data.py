import piexif
import json
import os
import re

EXPORTS = "C:/Users/dashi/Pictures/Camera Roll/exports"
CAMROLL = "C:/Users/dashi/Pictures/Camera Roll"
SAVED = "C:/Users/dashi/Pictures/Saved Pictures"
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
    # STACK-2-Spider is a single (unstacked) shot from the same session as
    # STACK-P9040321 -- same source frame, no separate original exists.
    "STACK-2-Spider.jpg": os.path.join(CAMROLL, "2026_09_04", "P9040321.ORF"),
    # Zerene PMax stack outputs carry zero EXIF -- map to the source RAW.
    "STACK-DANDELION-ZS-PMax.jpg": os.path.join(CAMROLL, "2026_09_04", "P9040361_01.ORF"),
    "Grub Stack PMax.jpg": os.path.join(SAVED, "Grub Single RAW.ORF"),
    "13092026_095951P9130128glitter oil 40Stacked.jpg": os.path.join(CAMROLL, "13092026_095951P9130128glitter oil.jpg"),
    "13092026_100420P9130288glitter oil 16Stacked.jpg": os.path.join(CAMROLL, "13092026_100420P9130288glitter oil.jpg"),
    "13092026_105840P9130459glitter oi 9Stackedl.jpg": os.path.join(CAMROLL, "13092026_105840P9130459glitter oil.jpg"),
    "13092026_131948P9130028_01glitter oil mc-20 32Stacked.jpg": os.path.join(CAMROLL, "13092026_131948P9130028_01glitter oil mc-20.jpg"),
    "13092026_132219P9130202_01glitter oil mc-20 22Stacked.jpg": os.path.join(EXPORTS, "13092026_132219P9130202_01glitter oil mc-20.jpg"),
    "13092026_132615P9130301_01glitter oil mc-20 10stacked.jpg": os.path.join(EXPORTS, "13092026_132615P9130301_01glitter oil mc-20.jpg"),
}
UNRESOLVED = set()

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
    "Timmy.JPG", "Timmy2.JPG", "Timmy3.JPG", "Timmy4.JPG", "Timmy5.JPG",
}
# Taken at mum & dad's house in Hornsby Heights (same visit as Sprout)
HORNSBY_HEIGHTS = {
    "Sprout.jpg", "Nathan and Zeke1.jpg", "Nathan and Zeke2.jpg",
    "Nathan.jpg", "mum - Diana.jpg",
}
PLANES = {
    "Plane - Quatari.jpg", "Plane - Virgin.jpg",
    # early-evening plane-spotting session on 2026-09-11, before the
    # P9111035+ night macro spider session -- same day, different subject
    "11092026_172707P9110001.jpg", "11092026_172854P9110003.jpg",
    "11092026_173133P9110005.jpg", "11092026_173147P9110006.jpg",
    "11092026_173500P9110010.jpg", "11092026_173648P9110013.jpg",
    "11092026_174001P9110019.jpg", "11092026_185659P9110024.jpg",
    "11092026_190153P9110025.jpg",
}
UNCATEGORIZED_GLADESVILLE = {"Bus-Stop.jpg"}

# Taken at work (Artarmon), not home -- first names only, no employer/address published
ARTARMON_TITLES = {
    "Billy.JPG": "Billy",
    "Chloe-kiani.JPG": "Kiani",
    "Slava.JPG": "Slava",
}

# (title, description) supplied by the photographer, keyed by original filename.
TITLES = {
    # Experiments in Liquids -- sequential by shoot order, filenames hidden
    # from the public site. Negativish is a color-inverted variant of the
    # immediately preceding shot, not a new experiment, hence "8a". Where
    # both a stack composite and its plain sample-slice sibling are separate
    # site entries, they share one number distinguished by suffix.
    "13092026_095951P9130128glitter oil 40Stacked.jpg": ("Experiment #1", ""),
    "13092026_100420P9130288glitter oil 16Stacked.jpg": ("Experiment #2", ""),
    "13092026_100530P9130342glitter oil.jpg": ("Experiment #3", ""),
    "13092026_102322P9130373glitter oil.jpg": ("Experiment #4", ""),
    "13092026_102344P9130374glitter oil.jpg": ("Experiment #5", ""),
    "13092026_103907P9130382glitter oil.jpg": ("Experiment #6", ""),
    "13092026_104026P9130383glitter oil.jpg": ("Experiment #7", ""),
    "13092026_104210P9130388glitter oil.jpg": ("Experiment #8", ""),
    "13092026_104233P9130389glitter oil Negativish.jpg": ("Experiment #8a", ""),
    "13092026_104646P9130394glitter oil.jpg": ("Experiment #9", ""),
    "13092026_104923P9130397glitter oil.jpg": ("Experiment #10", ""),
    "13092026_105840P9130459glitter oi 9Stackedl.jpg": ("Experiment #11", ""),
    "13092026_105930P9130554glitter oil.jpg": ("Experiment #12", ""),
    "13092026_131750P9130002glitter oil mc-20.jpg": ("Experiment #13", ""),
    "13092026_131948P9130028_01glitter oil mc-20 32Stacked.jpg": ("Experiment #14", ""),
    "13092026_132032P9130105_01glitter oil mc-20.jpg": ("Experiment #15", ""),
    "13092026_132219P9130202_01glitter oil mc-20 22Stacked.jpg": ("Experiment #16 Stack", ""),
    "13092026_132219P9130202_01glitter oil mc-20.jpg": ("Experiment #16 Example Slice", ""),
    "13092026_132615P9130301_01glitter oil mc-20 10stacked.jpg": ("Experiment #17 Stack", ""),
    "13092026_132615P9130301_01glitter oil mc-20.jpg": ("Experiment #17 Example Slice", ""),
    "13092026_132725P9130483_01glitter oil mc-20.jpg": ("Experiment #18", ""),
    "13092026_132831P9130485_01glitter oil mc-20.jpg": ("Experiment #19", ""),
    "13092026_132858P9130486_01glitter oil mc-20.jpg": ("Experiment #20", ""),
    "13092026_133011P9130487_01glitter oil mc-20.jpg": ("Experiment #21", ""),
    "13092026_133107P9130488_01glitter oil mc-20.jpg": ("Experiment #22", ""),
    "13092026_133445P9130490_01glitter oil mc-20.jpg": ("Experiment #23", ""),
    "Timmy.JPG": ("Timmy", ""),
    "Timmy2.JPG": ("Timmy", ""),
    "Timmy3.JPG": ("Timmy", ""),
    "Timmy4.JPG": ("Timmy", ""),
    "Timmy5.JPG": ("Timmy", ""),
    "Nathan and Zeke1.jpg": ("Nathan and Zeke", ""),
    "Nathan and Zeke2.jpg": ("Nathan and Zeke", ""),
    "Nathan.jpg": ("Nathan", ""),
    "mum - Diana.jpg": ("Diana", ""),
    "Bus-Stop.jpg": ("Bus Stop", ""),
    "STACK-2-Spider.jpg": ("Garden Orb Weaver One", "Stacked photo"),
    "STACK-P9040321.jpg": ("Garden Orb Weaver One", "Sample stack slice"),
    "Orb Weaver1.jpg": ("Golden Orb Weaver One", "Too busy making a web to pose for a good photo this time, but I know where you live now."),
    "Orb Weaver2.jpg": ("Golden Orb Weaver One", ""),
    "Orb Weaver3.jpg": ("Golden Orb Weaver One", ""),
    "Spider back.jpg": ("Garden Orb Weaver Two", "Had a chance to get a shot of the back of one of these."),
    "Grub and Slug.jpg": ("Grub and Slug", ""),
    "Spider underside.jpg": ("Garden Orb Weaver Two", "Having a snack (despite the filename, this isn't actually an underside shot)."),
    "11092026_200012P9111035 under spider stack.jpg": ("Garden Orb Weaver Three", "Stack of 5 — couldn't get a good stack, as I brushed its web with the diffuser and it proceeded to do repairs, so I tried to get the following array of action shots instead."),
    "11092026_200012P9111035.jpg": ("Garden Orb Weaver Three", "Stack sample slice"),
    "11092026_200200P9111040.jpg": ("Garden Orb Weaver Three", "Spinnerets"),
    "11092026_200213P9111041.jpg": ("Garden Orb Weaver Three", "Leg on line"),
    "11092026_200240P9111043.jpg": ("Garden Orb Weaver Three", "Pedipalp on line"),
    "11092026_200243P9111044.jpg": ("Garden Orb Weaver Three", "Baby got abdomen!"),
    "11092026_200244P9111045.jpg": ("Garden Orb Weaver Three", "Claw on line"),
    "11092026_200254P9111048.jpg": ("Garden Orb Weaver Three", "Transferring line between legs"),
    "11092026_200303P9111050.jpg": ("Garden Orb Weaver Three", "I guess it has an \"outie\"?"),
    "11092026_200310P9111051.jpg": ("Garden Orb Weaver Three", "I've currently run out of descriptions"),
    "11092026_200341P9111055.jpg": ("Garden Orb Weaver Three", ""),
    "11092026_200351P9111056.jpg": ("Garden Orb Weaver Three", "The spider's knees?"),
    "11092026_200357P9111057.jpg": ("Garden Orb Weaver Three", "Working the line"),
    "11092026_200402P9111059.jpg": ("Garden Orb Weaver Three", "Dew and remains of previous victims?"),
    "11092026_200404P9111060.jpg": ("Garden Orb Weaver Three", ""),
    "11092026_200407P9111061.jpg": ("Garden Orb Weaver Three", "Both palps on deck"),
    "11092026_200828P9111073.jpg": ("Garden Orb Weaver Four", "Just a couple of quick snaps"),
    "11092026_200832P9111074.jpg": ("Garden Orb Weaver Four", "Just a couple of quick snaps"),
    "11092026_201904P9111337 stack.jpg": ("Garden Orb Weaver Five", "Quick 4-photo stack"),
    "11092026_201904P9111337.jpg": ("Garden Orb Weaver Five", "Sample slice"),
    "12092026_081712P9120050wasp.jpg": ("Wasp nest just starting", "Eggs just laid"),
    "12092026_081712P9120052wasp stack.jpg": ("Wasp nest just starting", "4-photo stack"),
    "12092026_081712P9120052wasp.jpg": ("Wasp nest just starting", "Sample slice photo"),
    "12092026_185356P9120006UV Spider 2stack.jpg": ("Garden Orb Weaver Five", "2-photo stack taken under UV light. Pretty terrible due to wind, but I will try again."),
    "STACK-DANDELION-ZS-PMax.jpg": ("Dandelion", "36-frame stack"),
    "STACK-DANDELIONP9040361_01.jpg": ("Dandelion", "Sample stack slice"),
    "Grub Stack PMax.jpg": ("Grub", "Stacked photo"),
    "Grub Single Sample.jpg": ("Grub", "Sample stack slice"),
    "Plane - Virgin.jpg": ("Virgin", "I'm not a plane guy so haven't identified any of these -- feel free to let me know what they are."),
    "Plane - Quatari.jpg": ("Qatar 1", ""),
    "11092026_172707P9110001.jpg": ("Qantas 1", ""),
    "11092026_172854P9110003.jpg": ("Qantas 2", ""),
    "11092026_173133P9110005.jpg": ("Qatar 2", ""),
    "11092026_173147P9110006.jpg": ("Qatar 2", ""),
    "11092026_173500P9110010.jpg": ("Silhouette", "Just liked this silhouette below the planes"),
    "11092026_173648P9110013.jpg": ("Silhouette #2", ""),
    "11092026_174001P9110019.jpg": ("Qantas 3", ""),
    "11092026_185659P9110024.jpg": ("Timelapse of a plane", ""),
    "11092026_190153P9110025.jpg": ("Timelapse #2", ""),
}

# Display-order override: sort as if taken right after P9111337 (same subject,
# Garden Orb Weaver Five) even though it was actually shot the next evening.
SORT_OVERRIDE = {
    "12092026_185356P9120006UV Spider 2stack.jpg": "2026:09:11 20:19:05",
}

GARDEN_START = "131127"
GARDEN_END = "134238"
TOWNHALL_START = "142257"
TOWNHALL_END = "142342"
QVB_START = "143005"
QVB_END = "143821"
DH_PIANO_START = "152343"
DH_PIANO_END = "152405"

def classify(original, dt):
    if "Sydney CBD" in original:
        m = re.match(r"^(\d{8})_(\d{6})", original)
        time_code = m.group(2) if m else None
        if time_code and GARDEN_START <= time_code <= GARDEN_END:
            return "Chinese Garden of Friendship", None, "Darling Harbour, Sydney (water dragons & waterfall)"
        if time_code and TOWNHALL_START <= time_code <= TOWNHALL_END:
            return "Sydney Town Hall", None, "Town Hall, Sydney (Ukraine solidarity protest)"
        if time_code and QVB_START <= time_code <= QVB_END:
            return "Queen Victoria Building", None, "QVB, Sydney (public piano, clock, mall interior)"
        if time_code and DH_PIANO_START <= time_code <= DH_PIANO_END:
            return "Darling Harbour Piano", None, "Darling Harbour, Sydney"
        if time_code and time_code > GARDEN_END:
            return "Sydney CBD", None, "Darling Harbour to Wynyard, Sydney"
        return "Sydney CBD", None, "Darling Harbour area, Sydney"
    if original in ARTARMON_TITLES:
        return "Artarmon", None, "Artarmon"
    if original in HORNSBY_HEIGHTS:
        return "Hornsby Heights", None, "Hornsby Heights, Sydney (mum & dad's house)"
    if original in PEOPLE:
        return "Gladesville", "People", "Home"
    if original in PLANES:
        return "Gladesville", "Planes", "Home"
    if original in UNCATEGORIZED_GLADESVILLE:
        return "Gladesville", "Uncategorized", "Home"
    if "glitter oi" in original.lower():
        return "Gladesville", "Experiments in Liquids", "Home"
    return "Gladesville", "Garden", "Home"

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

        title, description = TITLES.get(original, (ARTARMON_TITLES.get(original, ""), ""))

        items.append({
            "thumb": f"images/thumbs/{slug}.jpg",
            "medium": f"images/medium/{slug}.jpg",
            "full": f"images/full/{slug}.jpg",
            "original_filename": original,
            "caption": caption(original),
            "title": title,
            "description": description,
            "category": category,
            "subcategory": subcategory,
            "location": location,
            "settings": settings,
        })

    # sort by datetime when available (with manual overrides), falling back to filename
    def sort_key(item):
        original = item["original_filename"]
        dt = SORT_OVERRIDE.get(original) or (item["settings"]["datetime"] if item["settings"] else None)
        return (dt is None, dt or item["thumb"])
    items.sort(key=sort_key)

    # Experiments in Liquids: show year-month only, not the exact day/time --
    # applied after sorting so ordering still uses full precision.
    for item in items:
        if item["category"] == "Gladesville" and item["subcategory"] == "Experiments in Liquids":
            if item["settings"] and item["settings"].get("datetime"):
                item["settings"]["datetime"] = item["settings"]["datetime"][:7].replace(":", "-")

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
