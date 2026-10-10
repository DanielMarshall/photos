"""Merge an exported crop-edits.json into CROPS in script.js.

    python merge_crops.py "<path to crop-edits.json>" [--check]
    python apply_crops.py


Same semantics as getEffectiveConfig() in script.js: an edit's `final`
replaces the base final, an edit's `details` replaces the whole base details
list, and anything the edit doesn't mention is kept.
"""
import json, os, sys
os.chdir(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ".")
from make_crop_review import load_site_config

EDITS = sys.argv[1]
DRY = "--check" in sys.argv   # only verify the round trip, change nothing

def js_key(k):
    return "'" + k + "'" if "'" not in k else json.dumps(k)

def num(v):
    return repr(v) if isinstance(v, float) else str(v)

def spec(d, with_label=False):
    if d.get("full"):
        return "{ full: true }"
    parts = []
    if with_label:
        parts.append(f"label: {json.dumps(d.get('label', ''))}")
    parts.append(f"ratio: [{num(d['ratio'][0])}, {num(d['ratio'][1])}]")
    parts.append(f"center: [{num(d['center'][0])}, {num(d['center'][1])}]")
    parts.append(f"size: {num(d['size'])}")
    return "{ " + ", ".join(parts) + " }"

def render(crops):
    out = ["  const CROPS = {"]
    for name, e in crops.items():
        out.append(f"    {js_key(name)}: {{")
        if e.get("final"):
            out.append(f"      final: {spec(e['final'])},")
        if e.get("details"):
            out.append("      details: [")
            for d in e["details"]:
                out.append(f"        {spec(d, True)},")
            out.append("      ],")
        out.append("    },")
    out.append("  };")
    return out

src = open("script.js", encoding="utf-8").read()
lines = src.split("\n")
s = lines.index("  const CROPS = {")
e = next(i for i in range(s, len(lines)) if lines[i] == "  };")
crops = load_site_config()["CROPS"]

# Round-trip check: regenerating the untouched CROPS must reproduce the file exactly.
if render(crops) != lines[s:e + 1]:
    a, b = render(crops), lines[s:e + 1]
    for i, (x, y) in enumerate(zip(a, b)):
        if x != y:
            print("ROUND-TRIP MISMATCH at block line", i, "\n  gen:", x, "\n  src:", y); break
    sys.exit(1)
print("round-trip OK,", len(crops), "entries")
if DRY:
    sys.exit(0)

edits = json.load(open(EDITS, encoding="utf-8"))
items = {i["original_filename"]: i for i in json.load(open("images.json", encoding="utf-8"))}
changed = []
for name, ed in edits.items():
    assert name in items, f"unknown photo {name}"
    assert not items[name].get("sample_of"), f"slice {name}"
    base = crops.get(name, {})
    merged = dict(base)
    if "final" in ed: merged["final"] = ed["final"]
    if "details" in ed: merged["details"] = ed["details"]
    if not merged.get("details"): merged.pop("details", None)
    if not merged.get("final"): merged.pop("final", None)
    if merged != base:
        crops[name] = merged
        changed.append((name, "new" if not base else "updated", sorted(ed.keys())))
lines[s:e + 1] = render(crops)
open("script.js", "w", encoding="utf-8", newline="").write("\n".join(lines))
for c in changed: print(" ", c)
print(len(changed), "entries merged;", len(crops), "total")
