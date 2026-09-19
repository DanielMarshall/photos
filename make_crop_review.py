"""Builds crop-review/index.html: a local, offline form listing every Final
Frame / Detail crop with a name and description box, for naming details in one
sitting. Not part of the published site (crop-review/ is gitignored).

    python make_crop_review.py

Then open crop-review/index.html, fill things in, press Export, and hand the
downloaded crop-details.json (or the copied text) back to be merged into the
site. Re-run this script any time the crops in script.js change.
"""
import html
import json
import os
import subprocess

from PIL import Image

PHOTOS = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(PHOTOS, "crop-review")
THUMB_BOX = (560, 420)  # crop previews fit inside this


def load_site_config():
    """CROPS, SECTION_ORDER and SECTION_LABELS, evaluated straight from script.js."""
    js = r"""
    const s = require('fs').readFileSync(process.argv[1], 'utf8');
    const grab = (name, open, close, end) => {
      const a = s.indexOf(name);
      const b = s.indexOf(end, a);
      return eval('(' + s.slice(a + name.length, b).trim().replace(/;$/, '') + ')');
    };
    const out = {
      CROPS: grab('const CROPS = ', '{', '}', '// Photos with no curated crop'),
      SECTION_ORDER: grab('const SECTION_ORDER = ', '[', ']', 'const SECTION_LABELS'),
      SECTION_LABELS: grab('const SECTION_LABELS = ', '{', '}', '// Shown on each category'),
    };
    process.stdout.write(JSON.stringify(out));
    """
    res = subprocess.run(["node", "-e", js, os.path.join(PHOTOS, "script.js")],
                         capture_output=True, text=True, check=True, encoding="utf-8")
    return json.loads(res.stdout)


def rect_from_spec(spec, nw, nh):
    """Same maths as rectFromSpec() in script.js."""
    h = spec["size"]
    w = h * nh * spec["ratio"][0] / spec["ratio"][1] / nw
    x = min(max(spec["center"][0] - w / 2, 0), 1 - w)
    y = min(max(spec["center"][1] - h / 2, 0), 1 - h)
    return x, y, w, h


def main():
    cfg = load_site_config()
    crops = cfg["CROPS"]
    items = json.load(open(os.path.join(PHOTOS, "images.json"), encoding="utf-8"))
    by_name = {i["original_filename"]: i for i in items}
    hidden_slices = {i["original_filename"] for i in items if i.get("sample_of")}

    os.makedirs(os.path.join(OUT, "img"), exist_ok=True)
    for f in os.listdir(os.path.join(OUT, "img")):
        os.remove(os.path.join(OUT, "img", f))

    # group photos in the same order as the site's category cards
    order = [f"{c}|{s}" for c, s in cfg["SECTION_ORDER"]]
    def group_key(i):
        return f"{i['category']}|{i['subcategory']}"
    groups = {}
    for i in items:
        if i["original_filename"] in crops and i["original_filename"] not in hidden_slices:
            groups.setdefault(group_key(i), []).append(i)
    ordered = [k for k in order if k in groups] + [k for k in groups if k not in order]

    sections, n_details, n_photos = [], 0, 0
    for key in ordered:
        photos = []
        for item in groups[key]:
            name = item["original_filename"]
            entry = crops[name]
            slug = os.path.splitext(os.path.basename(item["full"]))[0]
            im = Image.open(os.path.join(PHOTOS, item["full"]))
            nw, nh = im.size
            frames = []

            def render(spec, tag):
                x, y, w, h = rect_from_spec(spec, nw, nh)
                c = im.crop((round(x * nw), round(y * nh), round((x + w) * nw), round((y + h) * nh)))
                c.thumbnail(THUMB_BOX, Image.LANCZOS)
                fn = f"{slug}__{tag}.jpg"
                c.convert("RGB").save(os.path.join(OUT, "img", fn), quality=86)
                return fn, [round(x, 5), round(y, 5), round(w, 5), round(h, 5)]

            final = None
            if entry.get("final"):
                fn, rect = render(entry["final"], "final")
                final = {"img": fn, "rect": rect, "ratio": entry["final"]["ratio"]}
            details = []
            for n, d in enumerate(entry.get("details") or []):
                fn, rect = render(d, f"d{n + 1}")
                details.append({"img": fn, "rect": rect, "ratio": d["ratio"], "label": d["label"]})
            n_details += len(details)
            n_photos += 1
            photos.append({
                "file": name,
                "title": item["title"] or item["caption"] or name,
                "thumb": "../" + item["thumb"],
                "aspect": round(nw / nh, 4),
                "final": final,
                "details": details,
            })
        sections.append({"key": key, "label": cfg["SECTION_LABELS"].get(key, key), "photos": photos})

    data = json.dumps({"sections": sections}, ensure_ascii=False).replace("</", "<\\/")
    page = PAGE.replace("/*__DATA__*/", data)
    with open(os.path.join(OUT, "index.html"), "w", encoding="utf-8") as f:
        f.write(page)
    print(f"{n_photos} photos, {n_details} details -> {os.path.join(OUT, 'index.html')}")


PAGE = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Crop details</title>
<style>
  :root { --bg:#151513; --card:#1f1f1c; --line:#313029; --fg:#ece9e2; --muted:#9b9993; --accent:#7fbf9e; --warn:#e0b458; }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--fg); font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; }
  header { position:sticky; top:0; z-index:10; background:rgba(21,21,19,.96); backdrop-filter:blur(6px); border-bottom:1px solid var(--line); padding:.7rem 1.2rem; display:flex; gap:1rem; align-items:center; flex-wrap:wrap; }
  header h1 { font-size:1.05rem; margin:0; font-weight:600; }
  header .stat { color:var(--muted); font-size:.85rem; }
  header .spacer { flex:1; }
  header label { color:var(--muted); font-size:.85rem; display:flex; gap:.4rem; align-items:center; cursor:pointer; }
  button { font:inherit; font-size:.85rem; background:transparent; color:var(--fg); border:1px solid rgba(255,255,255,.35); border-radius:20px; padding:.4rem 1rem; cursor:pointer; }
  button:hover { border-color:#fff; }
  button.primary { background:var(--accent); color:#0c1a12; border-color:var(--accent); font-weight:600; }
  main { max-width:1100px; margin:0 auto; padding:1rem 1.2rem 5rem; }
  .intro { color:var(--muted); font-size:.88rem; margin:.4rem 0 1.4rem; max-width:760px; }
  h2.section { margin:2.4rem 0 .9rem; font-size:1.1rem; color:var(--accent); border-bottom:1px solid var(--line); padding-bottom:.35rem; }
  .photo { background:var(--card); border:1px solid var(--line); border-radius:10px; padding:1rem; margin:0 0 1rem; }
  .photo.done { border-color:#3a6b52; }
  .photo > .head { display:flex; gap:1rem; align-items:baseline; flex-wrap:wrap; margin-bottom:.8rem; }
  .photo > .head .t { font-weight:600; }
  .photo > .head .f { color:var(--muted); font:.72rem ui-monospace,Consolas,monospace; word-break:break-all; }
  .row { display:grid; grid-template-columns:240px 1fr; gap:1rem; }
  @media (max-width:760px) { .row { grid-template-columns:1fr; } }
  .ctx { position:relative; align-self:start; }
  .ctx img { display:block; width:100%; border-radius:6px; }
  .ctx .box { position:absolute; border:2px solid; border-radius:2px; pointer-events:none; }
  .ctx .box.final { border-color:rgba(255,255,255,.85); border-style:dashed; }
  .ctx .box.detail { border-color:var(--warn); }
  .ctx .box span { position:absolute; top:-1px; left:-1px; background:var(--warn); color:#111; font:700 .68rem/1 sans-serif; padding:2px 4px; border-radius:2px 0 2px 0; }
  .ctx .legend { color:var(--muted); font-size:.7rem; margin-top:.35rem; }
  .crops { display:flex; flex-direction:column; gap:1rem; }
  .crop { display:grid; grid-template-columns:minmax(200px,340px) 1fr; gap:1rem; align-items:start; }
  @media (max-width:760px) { .crop { grid-template-columns:1fr; } }
  .crop img { display:block; max-width:100%; border-radius:6px; background:#000; }
  .crop .cap { color:var(--muted); font-size:.72rem; margin-top:.3rem; }
  .crop.final .cap b { color:var(--fg); }
  .fields label { display:block; font-size:.72rem; color:var(--muted); margin:0 0 .2rem; text-transform:uppercase; letter-spacing:.05em; }
  .fields input, .fields textarea { width:100%; background:#151513; color:var(--fg); border:1px solid var(--line); border-radius:6px; padding:.5rem .6rem; font:inherit; }
  .fields input:focus, .fields textarea:focus { outline:none; border-color:var(--accent); }
  .fields textarea { min-height:5.2rem; resize:vertical; }
  .fields .gap { height:.7rem; }
  .fields .changed { border-color:var(--warn); }
  .none { color:var(--muted); font-size:.85rem; }
  #out { width:100%; min-height:10rem; margin-top:1rem; background:#0e0e0d; color:#cfcfca; border:1px solid var(--line); border-radius:8px; padding:.7rem; font:.75rem ui-monospace,Consolas,monospace; }
  #toast { position:fixed; bottom:1.2rem; left:50%; transform:translateX(-50%); background:var(--accent); color:#0c1a12; padding:.55rem 1.1rem; border-radius:20px; font-weight:600; opacity:0; transition:opacity .25s; pointer-events:none; }
  #toast.show { opacity:1; }
</style>
</head>
<body>
<header>
  <h1>Crop details</h1>
  <span class="stat" id="stat"></span>
  <span class="spacer"></span>
  <label><input type="checkbox" id="onlyDetails"> Only photos with details</label>
  <button id="reset" title="Discard everything typed on this page">Clear my edits</button>
  <button class="primary" id="export">Export</button>
</header>
<main>
  <p class="intro">Every crop on the site, as it will be framed. Give each <b>detail</b> a name (it becomes the button label) and, if you like, a description. Everything you type is saved in this browser as you go; press <b>Export</b> when you're done to download <code>crop-details.json</code> and copy it to your clipboard, then hand it back. In the small photo, the dashed box is the Final Frame and the numbered gold boxes are the details.</p>
  <div id="sections"></div>
  <textarea id="out" readonly placeholder="Exported JSON appears here (also downloaded and copied)."></textarea>
</main>
<div id="toast"></div>
<script id="data" type="application/json">/*__DATA__*/</script>
<script>
(function () {
  const DATA = JSON.parse(document.getElementById('data').textContent);
  const KEY = 'crop-details-form-v1';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { saved = {}; }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {} };
  const fid = (file, i, k) => file + '#' + i + '#' + k;
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const pct = (v) => (v * 100).toFixed(3) + '%';
  const ratioText = (r) => r[0] + ':' + r[1];

  const root = document.getElementById('sections');
  const cards = [];

  DATA.sections.forEach((sec) => {
    const wrap = el('div'); wrap.append(el('h2', 'section', sec.label));
    sec.photos.forEach((p) => {
      const card = el('div', 'photo');
      const head = el('div', 'head'); head.append(el('span', 't', p.title), el('span', 'f', p.file)); card.append(head);
      const row = el('div', 'row');

      const ctx = el('div', 'ctx');
      const img = el('img'); img.src = p.thumb; img.loading = 'lazy'; img.alt = p.title; ctx.append(img);
      const boxFor = (rect, cls, n) => {
        const b = el('div', 'box ' + cls);
        b.style.left = pct(rect[0]); b.style.top = pct(rect[1]); b.style.width = pct(rect[2]); b.style.height = pct(rect[3]);
        if (n) b.append(el('span', '', String(n)));
        ctx.append(b);
      };
      if (p.final) boxFor(p.final.rect, 'final');
      p.details.forEach((d, i) => boxFor(d.rect, 'detail', i + 1));
      const legend = p.final ? 'dashed = Final Frame' + (p.details.length ? ', gold = details' : '') : (p.details.length ? 'gold = details (Final Frame is the whole image)' : '');
      if (legend) ctx.append(el('div', 'legend', legend));
      row.append(ctx);

      const crops = el('div', 'crops');
      if (p.final) {
        const c = el('div', 'crop final');
        const im = el('img'); im.src = 'img/' + p.final.img; im.loading = 'lazy'; im.alt = 'Final Frame';
        const left = el('div'); left.append(im, (() => { const cap = el('div', 'cap'); cap.innerHTML = '<b>Final Frame</b> · ' + ratioText(p.final.ratio) + ' crop'; return cap; })());
        c.append(left, el('div', 'none', p.details.length ? '' : 'No details on this photo yet.'));
        crops.append(c);
      } else if (!p.details.length) {
        crops.append(el('div', 'none', 'Whole image, no details.'));
      }
      const inputs = [];
      p.details.forEach((d, i) => {
        const c = el('div', 'crop');
        const im = el('img'); im.src = 'img/' + d.img; im.loading = 'lazy'; im.alt = d.label;
        const left = el('div'); const cap = el('div', 'cap'); cap.innerHTML = '<b>Detail ' + (i + 1) + '</b> · ' + ratioText(d.ratio) + ' crop';
        left.append(im, cap);

        const fields = el('div', 'fields');
        const nameId = fid(p.file, i, 'label'), descId = fid(p.file, i, 'description');
        const nameL = el('label', '', 'Name (button label)'); const name = el('input'); name.type = 'text'; name.value = saved[nameId] != null ? saved[nameId] : d.label; name.dataset.orig = d.label;
        const descL = el('label', '', 'Description'); const desc = el('textarea'); desc.value = saved[descId] != null ? saved[descId] : ''; desc.placeholder = 'Optional — what is this detail showing?'; desc.dataset.orig = '';
        const mark = (inp) => inp.classList.toggle('changed', inp.value !== inp.dataset.orig);
        [[name, nameId], [desc, descId]].forEach(([inp, id]) => {
          mark(inp);
          inp.addEventListener('input', () => { saved[id] = inp.value; persist(); mark(inp); refresh(); });
        });
        fields.append(nameL, name, el('div', 'gap'), descL, desc);
        c.append(left, fields);
        crops.append(c);
        inputs.push({ name, desc, orig: d.label });
      });
      row.append(crops);
      card.append(row);
      wrap.append(card);
      cards.push({ p, card, inputs });
    });
    root.append(wrap);
  });

  const stat = document.getElementById('stat');
  const only = document.getElementById('onlyDetails');
  function refresh() {
    let details = 0, touched = 0;
    cards.forEach((c) => {
      let done = c.inputs.length > 0;
      c.inputs.forEach((f) => {
        details++;
        const changed = f.name.value !== f.orig || f.desc.value.trim() !== '';
        if (changed) touched++; else done = false;
      });
      c.card.classList.toggle('done', done);
      c.card.hidden = only.checked && !c.p.details.length;
    });
    stat.textContent = cards.length + ' photos · ' + details + ' details · ' + touched + ' named or described';
  }
  only.addEventListener('change', refresh);
  refresh();

  function buildExport() {
    const out = {};
    cards.forEach((c) => {
      if (!c.inputs.length) return;
      out[c.p.file] = { details: c.inputs.map((f) => ({ label: f.name.value.trim() || f.orig, description: f.desc.value.trim() })) };
    });
    return JSON.stringify(out, null, 2);
  }
  const toast = (msg) => { const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2600); };
  document.getElementById('export').addEventListener('click', () => {
    const json = buildExport();
    const out = document.getElementById('out'); out.value = json;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' })); a.download = 'crop-details.json';
    document.body.appendChild(a); a.click(); a.remove();
    let copied = false;
    try { if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(json); copied = true; } } catch (e) {}
    if (!copied) { out.select(); try { copied = document.execCommand('copy'); } catch (e) {} }
    toast(copied ? 'Downloaded crop-details.json and copied to clipboard' : 'Downloaded crop-details.json (text is in the box below)');
  });
  document.getElementById('reset').addEventListener('click', () => {
    if (!confirm('Discard everything you have typed on this page?')) return;
    saved = {}; persist(); location.reload();
  });
})();
</script>
</body>
</html>
"""

if __name__ == "__main__":
    main()
