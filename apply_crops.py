"""Regenerates each photo's medium and thumbnail from its curated crops.

    python apply_crops.py [--dry-run]

For every photo with a Final Frame crop (script.js CROPS):
  * the medium image becomes that crop (then gets its border), and
  * the thumbnail becomes the first Detail if there is one, else the Final Frame.
Photos with no crop keep their whole-frame images.

Incremental: images/crop_state.json records which crop each photo's medium and
thumbnail currently show, and only photos whose crops have changed since are
redone -- including photos whose crop was removed, which go back to whole
frame. Re-run it after baking new crops into script.js. When it finishes it
rebuilds images.json so the site knows about the crops.
"""
import json
import os
import subprocess
import sys

from PIL import Image

from make_crop_review import load_site_config, rect_from_spec

PHOTOS = os.path.dirname(os.path.abspath(__file__))
STATE_PATH = os.path.join(PHOTOS, "images", "crop_state.json")
MEDIUM_MAX_W, MEDIUM_Q = 2048, 3
THUMB_MAX_W, THUMB_Q = 480, 5


def render(src, dst, rect, size, max_w, quality):
    """Crop `rect` (fractions of the original; None = whole frame), scale to at
    most max_w wide, and encode with the same settings the pipeline always used."""
    nw, nh = size
    scale = f"scale='min({max_w},iw)':-2"
    if rect:
        x, y, w, h = rect
        x0, y0 = round(x * nw), round(y * nh)
        cw, ch = min(nw - x0, round(w * nw)), min(nh - y0, round(h * nh))
        vf = f"crop={cw}:{ch}:{x0}:{y0},{scale}"
    else:
        vf = scale
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-vf", vf,
                    "-q:v", str(quality), dst], check=True)


def main():
    dry = "--dry-run" in sys.argv
    crops = load_site_config()["CROPS"]
    with open(os.path.join(PHOTOS, "images.json"), encoding="utf-8") as f:
        items = json.load(f)
    state = {}
    if os.path.exists(STATE_PATH):
        with open(STATE_PATH, encoding="utf-8") as f:
            state = json.load(f)

    def rounded(rect):
        return [round(v, 6) for v in rect]

    todo = []  # (item, want)
    for item in items:
        name = item["original_filename"]
        # Example slices never carry crops -- and one that used to (before it
        # became a slice) is put back to its whole frame.
        entry = {} if item.get("sample_of") else crops.get(name, {})
        nw, nh = item["size"]
        final = entry.get("final")
        final_rect = rounded(rect_from_spec(final, nw, nh)) if final and not final.get("full") else None
        details = entry.get("details") or []
        detail_rect = rounded(rect_from_spec(details[0], nw, nh)) if details else None
        want = {"medium": final_rect, "thumb": detail_rect or final_rect}
        have = state.get(name, {"medium": None, "thumb": None})
        if want != have:
            todo.append((item, want, have))

    print(f"{len(todo)} photos to redo "
          f"({sum(1 for _, w, h in todo if w['medium'] != h['medium'])} mediums, "
          f"{sum(1 for _, w, h in todo if w['thumb'] != h['thumb'])} thumbnails)")
    if dry or not todo:
        return

    bordered = []
    for item, want, have in todo:
        name = item["original_filename"]
        size = item["size"]
        full = os.path.join(PHOTOS, item["full"])
        if want["medium"] != have["medium"]:
            render(full, os.path.join(PHOTOS, item["medium"]), want["medium"], size, MEDIUM_MAX_W, MEDIUM_Q)
            if item.get("settings"):        # photos with no settings never had a border
                bordered.append(name)
        if want["thumb"] != have["thumb"]:
            render(full, os.path.join(PHOTOS, item["thumb"]), want["thumb"], size, THUMB_MAX_W, THUMB_Q)
        if want["medium"] or want["thumb"]:
            state[name] = want
        else:
            state.pop(name, None)
        print(f"  {item['title'] or name}")

    with open(STATE_PATH, "w", encoding="utf-8", newline="\n") as f:
        json.dump(state, f, indent=1, sort_keys=True)
        f.write("\n")

    if bordered:
        # the mediums above are clean (unbordered), so bordering them now is safe
        import apply_borders
        sys.argv = ["apply_borders.py"] + bordered
        apply_borders.main()

    import build_data
    build_data.main()


if __name__ == "__main__":
    main()
