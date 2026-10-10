import piexif
import json
import os
import re

from PIL import Image

EXPORTS = "C:/Users/dashi/Pictures/Camera Roll/exports"
CAMROLL = "C:/Users/dashi/Pictures/Camera Roll"
SAVED = "C:/Users/dashi/Pictures/Saved Pictures"
PHOTOS = "C:/Users/dashi/photos"

# stack-composite -> resolved source file (for camera settings only)
SOURCE_MAP = {
    "11092026_200012P9111035 under spider stack.jpg": os.path.join(EXPORTS, "11092026_200012P9111035.jpg"),
    "11092026_201904P9111337 stack.jpg": os.path.join(EXPORTS, "11092026_201904P9111337.jpg"),
    "25092026_175348P9250067 10stacked.jpg": os.path.join(EXPORTS, "25092026_175348P9250067.jpg"),
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
    "16092026_184141P9160208 indoor macro 24stacked.jpg": os.path.join(EXPORTS, "16092026_184141P9160208 indoor macro.jpg"),
    "16092026_184614P9160360 indoor macro 40stacked.jpg": os.path.join(EXPORTS, "16092026_184614P9160360 indoor macro.jpg"),
    "16092026_184801P9160518 indoor macro 50stacked.jpg": os.path.join(EXPORTS, "16092026_184801P9160518 indoor macro.jpg"),
    "13092026_105840P9130459glitter oi 9Stackedl.jpg": os.path.join(CAMROLL, "13092026_105840P9130459glitter oil.jpg"),
    "13092026_131948P9130028_01glitter oil mc-20 32Stacked.jpg": os.path.join(CAMROLL, "13092026_131948P9130028_01glitter oil mc-20.jpg"),
    "13092026_132219P9130202_01glitter oil mc-20 22Stacked.jpg": os.path.join(EXPORTS, "13092026_132219P9130202_01glitter oil mc-20.jpg"),
    "13092026_132615P9130301_01glitter oil mc-20 10stacked.jpg": os.path.join(EXPORTS, "13092026_132615P9130301_01glitter oil mc-20.jpg"),
    "14092026_192938P9140110work and moss 20stacked.jpg": os.path.join(EXPORTS, "14092026_192938P9140110work and moss.jpg"),
    "14092026_193312P9140182work and moss mass stack.jpg": os.path.join(EXPORTS, "14092026_193312P9140182work and moss.jpg"),
    "14092026_193540P9140324work and moss 30 stack.jpg": os.path.join(EXPORTS, "14092026_193540P9140324work and moss.jpg"),
    "14092026_194038P9140624work and moss messy 100stack.jpg": os.path.join(EXPORTS, "14092026_194038P9140624work and moss.jpg"),
    "14092026_194042P9140652work and moss 50 stacked.jpg": os.path.join(CAMROLL, "2026_09_14", "14092026_194042P9140652work and moss.jpg"),
    "15092026_140211P9150010 fluids redux 12stacked.jpg": os.path.join(CAMROLL, "2026_09_15", "P9150010.ORF"),
    "15092026_140325P9150080 fluids redux 12 stack.jpg": os.path.join(CAMROLL, "2026_09_14", "15092026_140325P9150080 fluids redux.jpg"),
    "15092026_140445P9150300 fluids redux 17stacked.jpg": os.path.join(EXPORTS, "15092026_140445P9150300 fluids redux.jpg"),
    "15092026_141441P9150645 fluids redux 20stacked.jpg": os.path.join(EXPORTS, "15092026_141441P9150645 fluids redux.jpg"),
    "15092026_141528P9150748 fluids redux 40stacked.jpg": os.path.join(EXPORTS, "15092026_141528P9150748 fluids redux.jpg"),
    "15092026_170642P9150014_01 mickaels flowers 25stacked.jpg": os.path.join(EXPORTS, "15092026_170642P9150014_01 mickaels flowers.jpg"),
    "15092026_170801P9150100 mickaels flowers 25 stacked.jpg": os.path.join(EXPORTS, "15092026_170801P9150100 mickaels flowers.jpg"),
    # No suffix in either the composite's or the source's filename -- distinct
    # from the same day's "P9150707_01 fluids redux" frame (different photo,
    # coincidentally sharing the base frame number).
    "P9150707 20 stacked.jpg": os.path.join(CAMROLL, "2026_09_15", "15092026_091907P9150707 garden.jpg"),
    "15092026_190107P9150185 mirror 30stacked.jpg": os.path.join(EXPORTS, "15092026_190107P9150185 mirror.jpg"),
    "19092026_123136P9190262 whelk 28stacked ----.jpg": os.path.join(EXPORTS, "19092026_123136P9190262 whelk.jpg"),
    "19092026_123302P9190280 barnicles 1 10stacked ------.jpg": os.path.join(EXPORTS, "19092026_123302P9190280 barnicles 1.jpg"),
    "19092026_123346P9190370 barnicles 2 40stacked ----.jpg": os.path.join(EXPORTS, "19092026_123346P9190370 barnicles 2.jpg"),
    "26092026_082303P9260062 Boronia Park Reserve 23 stacked --- .jpg": os.path.join(EXPORTS, "26092026_082303P9260062 Boronia Park Reserve.jpg"),
    "26092026_094554P9260195 Boronia Park Reserve 40stacked --- .jpg": os.path.join(EXPORTS, "26092026_094554P9260195 Boronia Park Reserve.jpg"),
    "26092026_095531P9260330 Boronia Park Reserve 50stacked --- .jpg": os.path.join(EXPORTS, "26092026_095531P9260330 Boronia Park Reserve.jpg"),
    "26092026_101617P9260670 Boronia Park Reserve seed pod 31stacked --- .jpg": os.path.join(EXPORTS, "26092026_101617P9260670 Boronia Park Reserve.jpg"),
    "26092026_101723P9260730 Boronia Park Reserve snail shell 22stacked ---.jpg": os.path.join(EXPORTS, "26092026_101723P9260730 Boronia Park Reserve.jpg"),
    "26092026_101803P9260821 Boronia Park Reserve snail shell 42stacked ---.jpg": os.path.join(EXPORTS, "26092026_101803P9260821 Boronia Park Reserve.jpg"),
    "26092026_102753P9261010 Boronia Park Reserve 10stacked ---.jpg": os.path.join(EXPORTS, "26092026_102753P9261010 Boronia Park Reserve.jpg"),
    "20260926_143832P9260094 flower 33stacked ---.jpg": os.path.join(EXPORTS, "20260926_143832P9260094.jpg"),
    "20260926_145309P9260265 seed base 20stacked ---.jpg": os.path.join(EXPORTS, "20260926_145309P9260265.jpg"),
    "20260926_145730P9260352 seeds 18stacked.jpg": os.path.join(EXPORTS, "20260926_145730P9260352.jpg"),
    "20260926_150310P9260463_01 flower 60stacked --- .jpg": os.path.join(EXPORTS, "20260926_150310P9260463_01.jpg"),
    "20260926_150556P9260541_01 barbs 31stacked ---.jpg": os.path.join(EXPORTS, "20260926_150556P9260541_01.jpg"),
    "20260926_183141P9260001_03 seed base in purple 23stacked.jpg": os.path.join(EXPORTS, "20260926_183141P9260001_03.jpg"),
    "20260926_183357P9260145_01 green light seed base 50stacked ---.jpg": os.path.join(EXPORTS, "20260926_183357P9260145_01.jpg"),
    "20260926_183521P9260242_01 seed base 70stacked ---.jpg": os.path.join(EXPORTS, "20260926_183521P9260242_01.jpg"),
    "20260926_183643P9260348_01 seed base natural light 52stacked -- .jpg": os.path.join(EXPORTS, "20260926_183643P9260348_01.jpg"),
    "20260927_115255P9270115 24stacked St Andrew's Cross.jpg": os.path.join(EXPORTS, "20260927_115255P9270115.jpg"),
    "20260927_171711P9270310 star hologram 42stacked ---.jpg": os.path.join(EXPORTS, "20260927_171711P9270310.jpg"),
    "20260927_172009P9270403 grid holographic 40stacked ---.jpg": os.path.join(EXPORTS, "20260927_172009P9270403.jpg"),
    "20260927_172605P9270620 heart holographic 20stacked ---.jpg": os.path.join(EXPORTS, "20260927_172605P9270620.jpg"),
    "20260927_193046P9270030 cockroach 40stacked ---.jpg": os.path.join(EXPORTS, "20260927_193046P9270030.jpg"),
    "20260927_193054P9270124_01 cockroach 26stacked ---.jpg": os.path.join(EXPORTS, "20260927_193054P9270124_01.jpg"),
    "20260927_193129P9270185 cockroach 12stacked ---.jpg": os.path.join(EXPORTS, "20260927_193129P9270185.jpg"),
    "20260927_193430P9270395_01 cockroack face 40stacked.jpg": os.path.join(EXPORTS, "20260927_193430P9270395_01.jpg"),
    "20260927_193541P9270495 cockroach profile 60stacked ---.jpg": os.path.join(EXPORTS, "20260927_193541P9270495.jpg"),
    "20260929_171118P9290218 62stacked caterpillar.jpg": os.path.join(EXPORTS, "20260929_171118P9290218.jpg"),
    "20260929_171507P9290385 caterpillar 38stacked.jpg": os.path.join(EXPORTS, "20260929_171507P9290385.jpg"),
    "20260929_173229P9290474 flowers 40stacked ---.jpg": os.path.join(EXPORTS, "20260929_173229P9290474.jpg"),
    "20260930_165926P9300168 flowers at work 50stacked.jpg": os.path.join(EXPORTS, "20260930_165926P9300168.jpg"),
    "20260930_185113P9300243 droplets 45stacked ---.jpg": os.path.join(EXPORTS, "20260930_185113P9300243.jpg"),
    "20260930_185519P9300383 droplets 30stacked ---.jpg": os.path.join(EXPORTS, "20260930_185519P9300383.jpg"),
    "20260930_185619P9300473 drops 13stacked ---.jpg": os.path.join(EXPORTS, "20260930_185619P9300473.jpg"),
    "20260930_191030P9300530 cicada through drops 30stacked---.jpg": os.path.join(EXPORTS, "20260930_191030P9300530.jpg"),
    "20261003_124918PA030245 under-leaf seeds 30stacked ---.jpg": os.path.join(EXPORTS, "20261003_124918PA030245.jpg"),
    "20261003_125048PA030274 pond surface 20stacked---.jpg": os.path.join(EXPORTS, "20261003_125048PA030274.jpg"),
    "20261003_130050PA030372 beetle 7stacked---.jpg": os.path.join(EXPORTS, "20261003_130050PA030372.jpg"),
    "20261003_130511PA030491 fungus 20stacked.jpg": os.path.join(EXPORTS, "20261003_130511PA030491.jpg"),
    "20261003_131054PA030526 berries 20stacked ---.jpg": os.path.join(EXPORTS, "20261003_131054PA030526.jpg"),
    "20261003_131223PA030554 moth 8stacked---.jpg": os.path.join(EXPORTS, "20261003_131223PA030554.jpg"),
    "20261003_131304PA030626 moth 26stacked.jpg": os.path.join(EXPORTS, "20261003_131304PA030626.jpg"),
    "20261003_131549PA030682 flower 13stacked.jpg": os.path.join(EXPORTS, "20261003_131549PA030682.jpg"),
    "20261003_131853PA030721 fly 7stacked.jpg": os.path.join(EXPORTS, "20261003_131853PA030721.jpg"),
    "20261003_132121PA030808 spider 7stacked.jpg": os.path.join(EXPORTS, "20261003_132121PA030808.jpg"),
    "20261003_143324PA030905 Zeke 6stacked.jpg": os.path.join(EXPORTS, "20261003_143324PA030905.jpg"),
    "20261003_145404PA031210 eggs 16stacked.jpg": os.path.join(EXPORTS, "20261003_145404PA031210.jpg"),
    "20261003_145832PA031304 cicada shell 36stacked.jpg": os.path.join(EXPORTS, "20261003_145832PA031304.jpg"),
    "20261003_152343PA031418 moth 13stacked.jpg": os.path.join(EXPORTS, "20261003_152343PA031418.jpg"),
}
SOURCE_MAP['10102026_123313PA100668 4 butterfly 60stacked.tif'] = os.path.join(EXPORTS, '10102026_123313PA100668 4.tif')
SOURCE_MAP['10102026_123424PA100721 wingtip 60stacked.tif'] = os.path.join(EXPORTS, '10102026_123424PA100722 wing 1.tif')
SOURCE_MAP['20261010_123624PA100900 butterfly hairy eye 76stacked.tif'] = os.path.join(EXPORTS, '20261010_123624PA100900.tif')
UNRESOLVED = set()

# Camera settings for photos whose source frame can no longer be found (the
# Camera Roll's older date folders have since been moved away), recovered from
# earlier commits. Without these, rebuilding images.json silently drops their
# settings, pushes them to the end of their grids, and makes the border
# pipeline think they never had a border.
_fallback_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "settings_fallback.json")
FALLBACK_SETTINGS = json.load(open(_fallback_path, encoding="utf-8")) if os.path.exists(_fallback_path) else {}

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
# Annual family birthday gathering at mum & dad's, 3 Oct 2026: mostly
# garden macro (handheld stacks, cropped 10% each edge at tier generation),
# plus a few shots from the drive there and back.
# Shots from the drive to and from the 3 Oct gathering. No GPS in the files;
# placed from what's in frame (Canon's building, the Pymble Hotel sign) and
# the timestamps. The arm shot has nothing to place it, so it keeps the
# Hornsby Heights pin via its location text.
ON_THE_ROAD = {
    "20261003_111043PA030151.jpg": "Macquarie Park, under a motorway overpass near Lane Cove Road",
    "20261003_111234PA030152.jpg": "Canon Australia, Lane Cove Road, Macquarie Park",
    "20261003_112831PA030165.jpg": "In the car, on the way to Hornsby Heights",
    "20261003_153927PA031432.jpg": "Pacific Highway, Pymble (by the Pymble Hotel)",
}
HORNSBY_OCT = {
    "20261003_124918PA030245 under-leaf seeds 30stacked ---.jpg",
    "20261003_124918PA030245.jpg",
    "20261003_125048PA030274 pond surface 20stacked---.jpg",
    "20261003_125048PA030274.jpg",
    "20261003_130050PA030372 beetle 7stacked---.jpg",
    "20261003_130050PA030372.jpg",
    "20261003_130511PA030491 fungus 20stacked.jpg",
    "20261003_130511PA030491.jpg",
    "20261003_131054PA030526 berries 20stacked ---.jpg",
    "20261003_131054PA030526.jpg",
    "20261003_131223PA030554 moth 8stacked---.jpg",
    "20261003_131223PA030554.jpg",
    "20261003_131304PA030626 moth 26stacked.jpg",
    "20261003_131304PA030626.jpg",
    "20261003_131549PA030682 flower 13stacked.jpg",
    "20261003_131549PA030682.jpg",
    "20261003_131853PA030721 fly 7stacked.jpg",
    "20261003_131853PA030721.jpg",
    "20261003_132121PA030808 spider 7stacked.jpg",
    "20261003_132121PA030808.jpg",
    "20261003_143324PA030905 Zeke 6stacked.jpg",
    "20261003_143324PA030905.jpg",
    "20261003_145404PA031210 eggs 16stacked.jpg",
    "20261003_145404PA031210.jpg",
    "20261003_145832PA031304 cicada shell 36stacked.jpg",
    "20261003_145832PA031304.jpg",
    "20261003_152343PA031418 moth 13stacked.jpg",
    "20261003_152343PA031418.jpg",
    "20261003_125415PA030322.jpg",
    "20261003_125522PA030337.jpg",
    "20261003_130130PA030396.jpg",
    "20261003_132438PA030848.jpg",
    "20261003_132439PA030849.jpg",
    "20261003_132441PA030851.jpg",
    "20261003_132805PA030854.jpg",
    "20261003_132808PA030855.jpg",
    "20261003_132814PA030856.jpg",
    "20261003_133048PA030864.jpg",
    "20261003_145115PA031180.jpg",
    "20261003_145119PA031181.jpg",
    "20261003_145124PA031182.jpg",
    "20261003_145217PA031184.jpg",
    "20261003_151422PA031400.jpg",
    "20261003_151446PA031402.jpg",
}
# Grey-headed flying foxes at the Riverglade Reserve camp on Tarban Creek,
# 4 Oct 2026 late afternoon into dark. Exported into an exports/ subfolder,
# so original_filename includes the folder name.
TARBAN_BATS = {
    "bats at tarban creek/PA040150.JPG",
    "bats at tarban creek/PA040164.JPG",
    "bats at tarban creek/PA040165.JPG",
    "bats at tarban creek/PA040173.JPG",
    "bats at tarban creek/PA040174.JPG",
    "bats at tarban creek/PA040175.JPG",
    "bats at tarban creek/PA040176.JPG",
    "bats at tarban creek/PA040179.JPG",
    "bats at tarban creek/PA040181.JPG",
    "bats at tarban creek/PA040185.JPG",
    "bats at tarban creek/PA040187.JPG",
    "bats at tarban creek/PA040190.JPG",
    "bats at tarban creek/PA040191.JPG",
    "bats at tarban creek/PA040193.JPG",
    "bats at tarban creek/PA040195.JPG",
    "bats at tarban creek/PA040199.JPG",
    "bats at tarban creek/PA040206.JPG",
    "bats at tarban creek/PA040215.JPG",
    "bats at tarban creek/PA040219.JPG",
    "bats at tarban creek/PA040230.JPG",
    "bats at tarban creek/PA040245.JPG",
    "bats at tarban creek/PA040271.JPG",
    "bats at tarban creek/PA040274.JPG",
    "bats at tarban creek/PA040275.JPG",
    "bats at tarban creek/PA040276.JPG",
    "bats at tarban creek/PA040277.JPG",
    "bats at tarban creek/PA040282.JPG",
    "bats at tarban creek/PA040285.JPG",
    "bats at tarban creek/PA040287.JPG",
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
UNCATEGORIZED_GLADESVILLE = {
    "Bus-Stop.jpg",
    "15092026_190107P9150185 mirror 30stacked.jpg",
    "15092026_190107P9150185 mirror.jpg",
    "17092026_163653P9170003 mix.jpg",
    "17092026_163709P9170006 mix.jpg",
    "17092026_163801P9170008 mix.jpg",
    "17092026_163818P9170009 mix.jpg",
    "17092026_163848P9170010 mix.jpg",
    "17092026_174152P9170014 mix.jpg",
    "18092026_195212P9180088 mix.jpg",
    "18092026_195938P9180089 mix.jpg",
}

# Taken at work (Artarmon), not home -- first names only, no employer/address published
ARTARMON_TITLES = {
    "Billy.JPG": "Billy",
    "Chloe-kiani.JPG": "Kiani",
    "Slava.JPG": "Slava",
}
# Macro shot around work in Artarmon (29 Sep afternoon)
ARTARMON_MACRO = {
    "20260929_171118P9290218 62stacked caterpillar.jpg",
    "20260929_171118P9290218.jpg",
    "20260929_171507P9290385 caterpillar 38stacked.jpg",
    "20260929_171507P9290385.jpg",
    "20260929_173229P9290474 flowers 40stacked ---.jpg",
    "20260929_173229P9290474.jpg",
    "20260930_165926P9300168 flowers at work 50stacked.jpg",
    "20260930_165926P9300168.jpg",
}
ARTARMON_PEOPLE = {
    "14092026_170006P9140017 Alex Chin.jpg",
    "14092026_170020P9140018 Alex Eye.jpg",
    "14092026_170023P9140019 Alex Eye.jpg",
    "14092026_170026P9140020 Alex Eye.jpg",
    "14092026_170402P9140021 Alex.jpg",
    "14092026_170435P9140025 Alex.jpg",
}
KITCHEN_MOSS = {
    "14092026_192938P9140110work and moss 20stacked.jpg",
    "14092026_192938P9140110work and moss.jpg",
    "14092026_193312P9140182work and moss mass stack.jpg",
    "14092026_193312P9140182work and moss.jpg",
    "14092026_193540P9140324work and moss 30 stack.jpg",
    "14092026_193540P9140324work and moss.jpg",
    "14092026_194038P9140624work and moss messy 100stack.jpg",
    "14092026_194038P9140624work and moss.jpg",
    "14092026_194042P9140652work and moss 50 stacked.jpg",
}
FLUIDS_REDUX = {
    "15092026_140105P9150003 fluids redux.jpg",
    "15092026_140211P9150010 fluids redux 12stacked.jpg",
    "15092026_140325P9150080 fluids redux 12 stack.jpg",
    "15092026_140445P9150300 fluids redux 17stacked.jpg",
    "15092026_140445P9150300 fluids redux.jpg",
    "15092026_141441P9150645 fluids redux 20stacked.jpg",
    "15092026_141441P9150645 fluids redux.jpg",
    "15092026_141528P9150748 fluids redux 40stacked.jpg",
    "15092026_141528P9150748 fluids redux.jpg",
}
FLUIDS_3 = {
    "20092026_114444P9200084 fluids 3.jpg",
    "20092026_114701P9200120 fluids 3.jpg",
    "20092026_114703P9200140 fluids 3.jpg",
    "20092026_114703P9200144 fluids 3.jpg",
    "20092026_114703P9200145 fluids 3.jpg",
    "20092026_114703P9200148 fluids 3.jpg",
    "20092026_114704P9200152 fluids 3.jpg",
    "20092026_114807P9200179 fluids 3.jpg",
    "20092026_114807P9200181 fluids 3.jpg",
    "20092026_114808P9200185 fluids 3.jpg",
    "20092026_114808P9200191 fluids 3.jpg",
    "20092026_114826P9200193 fluids 3.jpg",
    "20092026_114829P9200203 fluids 3.jpg",
    "20092026_114848P9200226 fluids 3.jpg",
    "20092026_114850P9200244 fluids 3.jpg",
    "20092026_115620P9200305 fluids 3.jpg",
    "20092026_115637P9200307 fluids 3.jpg",
    "20092026_120040P9200313 fluids 3.jpg",
    "24092026_185400P9240322 drops on polariser.jpg",
    # More droplets on the polariser, 30 Sep evening
    "20260930_185113P9300243 droplets 45stacked ---.jpg",
    "20260930_185113P9300243.jpg",
    "20260930_185519P9300383 droplets 30stacked ---.jpg",
    "20260930_185519P9300383.jpg",
    "20260930_185619P9300473 drops 13stacked ---.jpg",
    "20260930_185619P9300473.jpg",
    "20260930_191030P9300530 cicada through drops 30stacked---.jpg",
    "20260930_191030P9300530.jpg",
}
MICHAELS_FLOWERS = {
    "15092026_170642P9150014_01 mickaels flowers 25stacked.jpg",
    "15092026_170642P9150014_01 mickaels flowers.jpg",
    "15092026_170801P9150100 mickaels flowers 25 stacked.jpg",
    "15092026_170801P9150100 mickaels flowers.jpg",
}
MICHAELS_FENDER = {
    "15092026_174550P9150027_01 michael fender.jpg",
    "15092026_174604P9150028_01 michael fender.jpg",
    "15092026_174630P9150030_01 michael fender.jpg",
    "15092026_174636P9150031_01 michael fender.jpg",
    "15092026_174652P9150033_01 michael fender.jpg",
}
MICHAELS_STUDIO = {
    "16092026_190157P9161030 michael at work.jpg",
    "16092026_190202P9161031 michael at work.jpg",
    "16092026_190248P9161032 michael at work.jpg",
    "16092026_190840P9161042 michael at work.jpg",
    "16092026_190852P9161043 michael at work.jpg",
    "16092026_190956P9161046 michael at work.jpg",
    "16092026_191112P9161049 michael at work.jpg",
    "16092026_191219P9161050 michael at work.jpg",
    "16092026_191221P9161051 michael at work.jpg",
    "16092026_191228P9161053 michael at work.jpg",
    "16092026_191231P9161054 michael at work.jpg",
    "16092026_191236P9161055 michael at work.jpg",
    "16092026_191238P9161056 michael at work.jpg",
    "16092026_191241P9161057 michael at work.jpg",
}
# Where the one-off "mix" photos were taken, when it isn't home. The 17 Sep
# set was all shot within two minutes at the Ashfield car park and its shop
# entrance; City Glow is on the drive home. The two 18 Sep possum-watching
# shots were in the back yard, so they take the default ("Home").
LOCATION_OVERRIDE = {
    "17092026_163653P9170003 mix.jpg": "Ashfield",
    "17092026_163709P9170006 mix.jpg": "Ashfield",
    "17092026_163801P9170008 mix.jpg": "Ashfield",
    "17092026_163818P9170009 mix.jpg": "Ashfield",
    "17092026_163848P9170010 mix.jpg": "Ashfield",
    "17092026_174152P9170014 mix.jpg": "Gladesville",
}
# Banjo Paterson Park, Gladesville: shoreline macro plus telephoto across the
# bay to Abbotsford (19 Sep).
BANJO_PATERSON = {
    "19092026_122745P9190108 waterline.jpg",
    "19092026_123136P9190262 whelk 28stacked ----.jpg",
    "19092026_123302P9190280 barnicles 1 10stacked ------.jpg",
    "19092026_123346P9190370 barnicles 2 40stacked ----.jpg",
    "19092026_123136P9190262 whelk.jpg",
    "19092026_123302P9190280 barnicles 1.jpg",
    "19092026_123346P9190370 barnicles 2.jpg",
    "19092026_123821P9190438 bay landscape.jpg",
    "19092026_123845P9190465 bay landscape.jpg",
    "19092026_124002P9190470 bay landscape.jpg",
    "19092026_124127P9190474 bay landscape.jpg",
    "19092026_124151P9190493 bay landscape.jpg",
    "19092026_124259P9190514 bay landscape.jpg",
    "19092026_124357P9190535 bay landscape.jpg",
    "19092026_124517P9190537 bay landscape.jpg",
    "19092026_124549P9190540 bay landscape.jpg",
}
# Boronia Park Reserve, Hunters Hill (26 Sep morning): macro of spiders,
# a snail shell and various finds on a walk. Location is a best-guess
# suburb-level placement, not confirmed -- nudge PLACES in script.js if wrong.
BORONIA_PARK = {
    "26092026_082303P9260062 Boronia Park Reserve 23 stacked --- .jpg",
    "26092026_082303P9260062 Boronia Park Reserve.jpg",
    "26092026_093849P9260136 Boronia Park Reserve.jpg",
    "26092026_094554P9260195 Boronia Park Reserve 40stacked --- .jpg",
    "26092026_094554P9260195 Boronia Park Reserve.jpg",
    "26092026_095000P9260226 Boronia Park Reserve.jpg",
    "26092026_095012P9260261 Boronia Park Reserve.jpg",
    "26092026_095032P9260263 Boronia Park Reserve.jpg",
    "26092026_095531P9260330 Boronia Park Reserve 50stacked --- .jpg",
    "26092026_095531P9260330 Boronia Park Reserve.jpg",
    "26092026_095539P9260343 Boronia Park Reserve.jpg",
    "26092026_095617P9260351 Boronia Park Reserve.jpg",
    "26092026_095628P9260353 Boronia Park Reserve.jpg",
    "26092026_100049P9260375 Boronia Park Reserve.jpg",
    "26092026_100456P9260521 Boronia Park Reserve.jpg",
    "26092026_100510P9260527 Boronia Park Reserve.jpg",
    "26092026_100517P9260528 Boronia Park Reserve.jpg",
    "26092026_101617P9260670 Boronia Park Reserve seed pod 31stacked --- .jpg",
    "26092026_101617P9260670 Boronia Park Reserve.jpg",
    "26092026_101723P9260730 Boronia Park Reserve snail shell 22stacked ---.jpg",
    "26092026_101723P9260730 Boronia Park Reserve.jpg",
    "26092026_101803P9260821 Boronia Park Reserve snail shell 42stacked ---.jpg",
    "26092026_101803P9260821 Boronia Park Reserve.jpg",
    "26092026_102753P9261010 Boronia Park Reserve 10stacked ---.jpg",
    "26092026_102753P9261010 Boronia Park Reserve.jpg",
}
ANTS = {
    "19092026_140734P9190560 ants.jpg",
    "19092026_140742P9190570 ants.jpg",
    "19092026_140743P9190571 ants.jpg",
    "19092026_140744P9190572 ants.jpg",
    "19092026_140744P9190573 ants.jpg",
    "19092026_140746P9190574 ants.jpg",
    "19092026_140747P9190575 ants.jpg",
    "19092026_140750P9190578 ants.jpg",
    "19092026_140755P9190583 ants.jpg",
    "19092026_140756P9190586 ants.jpg",
    "19092026_140808P9190600 ants.jpg",
    "19092026_140817P9190606 ants.jpg",
    "19092026_140817P9190607 ants.jpg",
    "19092026_140819P9190611 ants.jpg",
}
# A dying cockroach Michael found (27 Sep evening), shot with side lighting
# and no flash. Its own section at the photographer's request.
MICHAELS_COCKROACH = {
    "20260927_193046P9270030 cockroach 40stacked ---.jpg",
    "20260927_193046P9270030.jpg",
    "20260927_193054P9270124_01 cockroach 26stacked ---.jpg",
    "20260927_193054P9270124_01.jpg",
    "20260927_193129P9270185 cockroach 12stacked ---.jpg",
    "20260927_193129P9270185.jpg",
    "20260927_193430P9270395_01 cockroack face 40stacked.jpg",
    "20260927_193430P9270395_01.jpg",
    "20260927_193541P9270495 cockroach profile 60stacked ---.jpg",
    "20260927_193541P9270495.jpg",
}
INDOOR_MACRO = {
    "16092026_184141P9160208 indoor macro 24stacked.jpg",
    "16092026_184141P9160208 indoor macro.jpg",
    "16092026_184614P9160360 indoor macro 40stacked.jpg",
    "16092026_184614P9160360 indoor macro.jpg",
    "16092026_184801P9160518 indoor macro 50stacked.jpg",
    "16092026_184801P9160518 indoor macro.jpg",
    # Farmer's Friend (Bidens pilosa) seed, 26 Sep evening: living-room
    # tripod + coloured-light experiments
    "20260926_183141P9260001_03 seed base in purple 23stacked.jpg",
    "20260926_183141P9260001_03.jpg",
    "20260926_183357P9260145_01 green light seed base 50stacked ---.jpg",
    "20260926_183357P9260145_01.jpg",
    "20260926_183521P9260242_01 seed base 70stacked ---.jpg",
    "20260926_183521P9260242_01.jpg",
    "20260926_183643P9260348_01 seed base natural light 52stacked -- .jpg",
    "20260926_183643P9260348_01.jpg",
    # Holographic surfaces, 27 Sep evening
    "20260927_171711P9270310 star hologram 42stacked ---.jpg",
    "20260927_171711P9270310.jpg",
    "20260927_172009P9270403 grid holographic 40stacked ---.jpg",
    "20260927_172009P9270403.jpg",
    "20260927_172605P9270620 heart holographic 20stacked ---.jpg",
    "20260927_172605P9270620.jpg",
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
    "13092026_132219P9130202_01glitter oil mc-20.jpg": ("Experiment #16: Example Slice", ""),
    "13092026_132615P9130301_01glitter oil mc-20 10stacked.jpg": ("Experiment #17 Stack", ""),
    "13092026_132615P9130301_01glitter oil mc-20.jpg": ("Experiment #17: Example Slice", ""),
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
    "15092026_190107P9150185 mirror 30stacked.jpg": ("Self Portrait Stack", "The lens, looking at itself in a mirror."),
    "15092026_190107P9150185 mirror.jpg": ("Self Portrait: Example Slice", "Sample stack slice"),
    "STACK-2-Spider.jpg": ("Garden Orb Weaver One Stack", "Stacked photo"),
    "STACK-P9040321.jpg": ("Garden Orb Weaver One: Example Slice", "Sample stack slice"),
    "Orb Weaver1.jpg": ("Large Orb Weaver", "Too busy making a web to pose for a good photo this time, but I know where you live now."),
    "Orb Weaver2.jpg": ("Large Orb Weaver II", ""),
    "Orb Weaver3.jpg": ("Large Orb Weaver III", ""),
    "Spider back.jpg": ("Garden Orb Weaver Two", "Had a chance to get a shot of the back of one of these."),
    "Grub and Slug.jpg": ("Grub and Slug", ""),
    "Spider underside.jpg": ("Garden Orb Weaver Two", "Having a snack (despite the filename, this isn't actually an underside shot)."),
    "11092026_200012P9111035 under spider stack.jpg": ("Garden Orb Weaver Three Stack", "Stack of 5 — couldn't get a good stack, as I brushed its web with the diffuser and it proceeded to do repairs, so I tried to get the following array of action shots instead."),
    "11092026_200012P9111035.jpg": ("Garden Orb Weaver Three: Example Slice", "Stack sample slice"),
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
    "11092026_201904P9111337 stack.jpg": ("Garden Orb Weaver Five Stack", "Quick 4-photo stack"),
    "11092026_201904P9111337.jpg": ("Garden Orb Weaver Five: Example Slice", "Sample slice"),
    "12092026_081712P9120050wasp.jpg": ("Young Wasp Nest: Fresh Eggs", "Eggs just laid"),
    "12092026_081712P9120052wasp stack.jpg": ("Young Wasp Nest Stack", "4-photo stack"),
    "12092026_081712P9120052wasp.jpg": ("Young Wasp Nest: Example Slice", "Sample slice photo"),
    "12092026_185356P9120006UV Spider 2stack.jpg": ("Garden Orb Weaver Five Under UV", "2-photo stack taken under UV light. Pretty terrible due to wind, but I will try again."),
    "25092026_174459P9250013.jpg": ("Garden Orb Weaver Six", ""),
    "25092026_175348P9250067 10stacked.jpg": ("Garden Orb Weaver Six Stack", "10-photo stack"),
    "25092026_175348P9250067.jpg": ("Garden Orb Weaver Six: Example Slice", "Sample slice"),
    "STACK-DANDELION-ZS-PMax.jpg": ("Dandelion Stack", "36-frame stack"),
    "STACK-DANDELIONP9040361_01.jpg": ("Dandelion: Example Slice", "Sample stack slice"),
    "Grub Stack PMax.jpg": ("Grub Stack", "Stacked photo"),
    "Grub Single Sample.jpg": ("Grub: Example Slice", "Sample stack slice"),
    "Plane - Virgin.jpg": ("Virgin", "I'm not a plane guy so haven't identified any of these -- feel free to let me know what they are."),
    "Plane - Quatari.jpg": ("Qatar", ""),
    "11092026_172707P9110001.jpg": ("Qantas", ""),
    "11092026_172854P9110003.jpg": ("Qantas II", ""),
    "11092026_173133P9110005.jpg": ("Qatar II", ""),
    "11092026_173147P9110006.jpg": ("Qatar II", ""),
    "11092026_173500P9110010.jpg": ("Silhouette", "Just liked this silhouette below the planes"),
    "11092026_173648P9110013.jpg": ("Silhouette II", ""),
    "11092026_174001P9110019.jpg": ("Qantas III", ""),
    "11092026_185659P9110024.jpg": ("Plane Light Trail", ""),
    "11092026_190153P9110025.jpg": ("Plane Light Trail II", ""),
    "13092026_161532P9130004last dinosaurs mc-20.jpg": ("Dinosaur", ""),
    "13092026_161823P9130015last dinosaurs mc-20.jpg": ("Dinosaur", ""),
    "13092026_161904P9130019last dinosaurs mc-20.jpg": ("Dinosaur", ""),
    "13092026_161919P9130022last dinosaurs mc-20.jpg": ("Dinosaur", ""),
    "13092026_162048P9130026_01last dinosaurs mc-20.jpg": ("Dinosaur", ""),
    "13092026_162051P9130028_02last dinosaurs mc-20.jpg": ("Dinosaur", ""),
    "13092026_162216P9130030_02last dinosaurs mc-20.jpg": ("Dinosaur", ""),
    "13092026_162221P9130031_02last dinosaurs mc-20.jpg": ("Dinosaur", ""),
    "13092026_162230P9130034_02last dinosaurs mc-20.jpg": ("Dinosaur", ""),
    "13092026_162239P9130036_02last dinosaurs mc-20.jpg": ("Dinosaur", ""),
    "13092026_162341P9130040_02last dinosaurs mc-20.jpg": ("Dinosaur", ""),
    "13092026_162344P9130042_02last dinosaurs mc-20.jpg": ("Dinosaur", ""),
    "13092026_162406P9130043_02last dinosaurs mc-20.jpg": ("Dinosaur", ""),
    "13092026_162433P9130044_02last dinosaurs mc-20.jpg": ("Dinosaur", ""),
    "13092026_162437P9130045_02last dinosaurs mc-20.jpg": ("Dinosaur", ""),
    "13092026_162454P9130047_02last dinosaurs mc-20.jpg": ("Dinosaur", ""),
    "13092026_162459P9130048_02last dinosaurs mc-20.jpg": ("Dinosaur", ""),
    "13092026_162516P9130049_02last dinosaurs mc-20.jpg": ("Dinosaur", ""),
    "13092026_162523P9130052_02last dinosaurs mc-20.jpg": ("Dinosaur", ""),
    "13092026_162533P9130054_02last dinosaurs mc-20.jpg": ("Dinosaur", ""),
    "13092026_162544P9130056_02last dinosaurs mc-20.jpg": ("Dinosaur", ""),
    "14092026_170006P9140017 Alex Chin.jpg": ("Alex: Chin", ""),
    "14092026_170020P9140018 Alex Eye.jpg": ("Alex: Eye", ""),
    "14092026_170023P9140019 Alex Eye.jpg": ("Alex: Eye II", ""),
    "14092026_170026P9140020 Alex Eye.jpg": ("Alex: Eye III", ""),
    "14092026_170402P9140021 Alex.jpg": ("Caught Mid-Laugh", ""),
    "14092026_170435P9140025 Alex.jpg": ("Caught Mid-Laugh II", ""),
    "14092026_192938P9140110work and moss 20stacked.jpg": ("Moss Stack", "Stacked photo"),
    "14092026_192938P9140110work and moss.jpg": ("Moss: Example Slice", "Sample stack slice"),
    "14092026_193312P9140182work and moss mass stack.jpg": ("Moss II Stack", "Stacked photo"),
    "14092026_193312P9140182work and moss.jpg": ("Moss II: Example Slice", "Sample stack slice"),
    "14092026_193540P9140324work and moss 30 stack.jpg": ("Moss III Stack", "Stacked photo"),
    "14092026_193540P9140324work and moss.jpg": ("Moss III: Example Slice", "Sample stack slice"),
    "14092026_194038P9140624work and moss messy 100stack.jpg": ("Moss IV Stack", "100-frame stack"),
    "14092026_194038P9140624work and moss.jpg": ("Moss IV: Example Slice", "Sample stack slice"),
    "14092026_194042P9140652work and moss 50 stacked.jpg": ("Moss V", "50-frame stack"),
    "15092026_140105P9150003 fluids redux.jpg": ("Experiment #24", ""),
    "15092026_140211P9150010 fluids redux 12stacked.jpg": ("Experiment #25", ""),
    "15092026_140325P9150080 fluids redux 12 stack.jpg": ("Experiment #26", ""),
    "15092026_140445P9150300 fluids redux 17stacked.jpg": ("Experiment #27 Stack", ""),
    "15092026_140445P9150300 fluids redux.jpg": ("Experiment #27: Example Slice", ""),
    "15092026_141441P9150645 fluids redux 20stacked.jpg": ("Experiment #28 Stack", ""),
    "15092026_141441P9150645 fluids redux.jpg": ("Experiment #28: Example Slice", ""),
    "15092026_141528P9150748 fluids redux 40stacked.jpg": ("Experiment #29 Stack", ""),
    "15092026_141528P9150748 fluids redux.jpg": ("Experiment #29: Example Slice", ""),
    "20092026_114444P9200084 fluids 3.jpg": ("Experiment #30", ""),
    "20092026_114701P9200120 fluids 3.jpg": ("Experiment #31", ""),
    "20092026_114703P9200140 fluids 3.jpg": ("Experiment #32", ""),
    "20092026_114703P9200144 fluids 3.jpg": ("Experiment #33", ""),
    "20092026_114703P9200145 fluids 3.jpg": ("Experiment #34", ""),
    "20092026_114703P9200148 fluids 3.jpg": ("Experiment #35", ""),
    "20092026_114704P9200152 fluids 3.jpg": ("Experiment #36", ""),
    "20092026_114807P9200179 fluids 3.jpg": ("Experiment #37", ""),
    "20092026_114807P9200181 fluids 3.jpg": ("Experiment #38", ""),
    "20092026_114808P9200185 fluids 3.jpg": ("Experiment #39", ""),
    "20092026_114808P9200191 fluids 3.jpg": ("Experiment #40", ""),
    "20092026_114826P9200193 fluids 3.jpg": ("Experiment #41", ""),
    "20092026_114829P9200203 fluids 3.jpg": ("Experiment #42", ""),
    "20092026_114848P9200226 fluids 3.jpg": ("Experiment #43", ""),
    "20092026_114850P9200244 fluids 3.jpg": ("Experiment #44", ""),
    "20092026_115620P9200305 fluids 3.jpg": ("Experiment #45", ""),
    "20092026_115637P9200307 fluids 3.jpg": ("Experiment #46", ""),
    "20092026_120040P9200313 fluids 3.jpg": ("Experiment #47", ""),
    "24092026_185400P9240322 drops on polariser.jpg": ("Experiment #48", "Water droplets on a polarising filter."),
    "15092026_170642P9150014_01 mickaels flowers 25stacked.jpg": ("Michael's Flowers Stack", "Stacked photo"),
    "15092026_170642P9150014_01 mickaels flowers.jpg": ("Michael's Flowers: Example Slice", "Sample stack slice"),
    "15092026_170801P9150100 mickaels flowers 25 stacked.jpg": ("Michael's Flowers II Stack", "Stacked photo"),
    "15092026_170801P9150100 mickaels flowers.jpg": ("Michael's Flowers II: Example Slice", "Sample stack slice"),
    "15092026_174550P9150027_01 michael fender.jpg": ("The Badge", ""),
    "15092026_174604P9150028_01 michael fender.jpg": ("Dialling It In", ""),
    "15092026_174630P9150030_01 michael fender.jpg": ("Fine-Tuning by Ear", ""),
    "15092026_174636P9150031_01 michael fender.jpg": ("Getting There", ""),
    "15092026_174652P9150033_01 michael fender.jpg": ("Caught Mid-Motion", ""),
    "16092026_190157P9161030 michael at work.jpg": ("Settling In", ""),
    "16092026_190202P9161031 michael at work.jpg": ("At the Desk", ""),
    "16092026_190248P9161032 michael at work.jpg": ("Mid-Sentence", ""),
    "16092026_190840P9161042 michael at work.jpg": ("Tea Break", ""),
    "16092026_190852P9161043 michael at work.jpg": ("Topping Up", ""),
    "16092026_190956P9161046 michael at work.jpg": ("Dialling In the Mix", ""),
    "16092026_191112P9161049 michael at work.jpg": ("Keys and Coffee", ""),
    "16092026_191219P9161050 michael at work.jpg": ("The Flash Strikes Back", ""),
    "16092026_191221P9161051 michael at work.jpg": ("Seeing Spots", ""),
    "16092026_191228P9161053 michael at work.jpg": ("Squint", ""),
    "16092026_191231P9161054 michael at work.jpg": ("Pose", ""),
    "16092026_191236P9161055 michael at work.jpg": ("My Eyes!", ""),
    "16092026_191238P9161056 michael at work.jpg": ("The Flash Wins", ""),
    "16092026_191241P9161057 michael at work.jpg": ("I Pray This Stops", ""),
    "16092026_184141P9160208 indoor macro 24stacked.jpg": ("Hard Drive Circuit Board", ""),
    "16092026_184141P9160208 indoor macro.jpg": ("Hard Drive Circuit Board: Example Slice", "Sample stack slice"),
    "16092026_184614P9160360 indoor macro 40stacked.jpg": ("Mandarin Peel", ""),
    "16092026_184614P9160360 indoor macro.jpg": ("Mandarin Peel: Example Slice", "Sample stack slice"),
    "16092026_184801P9160518 indoor macro 50stacked.jpg": ("Wine Cork", ""),
    "16092026_184801P9160518 indoor macro.jpg": ("Wine Cork: Example Slice", "Sample stack slice"),
    "17092026_163653P9170003 mix.jpg": ("Behind the Diffuser", ""),
    "17092026_163709P9170006 mix.jpg": ("The Diffuser", ""),
    "17092026_163801P9170008 mix.jpg": ("Night Car Park", ""),
    "17092026_163818P9170009 mix.jpg": ("Empty Car Park", ""),
    "17092026_163848P9170010 mix.jpg": ("Chain Link", ""),
    "17092026_174152P9170014 mix.jpg": ("City Glow", ""),
    "18092026_195212P9180088 mix.jpg": ("Where's the Possum?", "15 second exposure, no flash, focused on a possum that stayed hidden in the trees."),
    "18092026_195938P9180089 mix.jpg": ("Still No Possum", "30 second exposure, no flash, focused above and beyond the Hills Hoist on a possum that stayed hidden."),
    "19092026_122745P9190108 waterline.jpg": ("The Waterline", ""),
    "19092026_123136P9190262 whelk 28stacked ----.jpg": ("Whelk", "Stacked photo"),
    "19092026_123136P9190262 whelk.jpg": ("Whelk: Example Slice", "Sample stack slice"),
    "19092026_123302P9190280 barnicles 1 10stacked ------.jpg": ("Barnacles", "Stacked photo"),
    "19092026_123302P9190280 barnicles 1.jpg": ("Barnacles: Example Slice", "Sample stack slice"),
    "19092026_123346P9190370 barnicles 2 40stacked ----.jpg": ("Barnacles II", "Stacked photo"),
    "19092026_123346P9190370 barnicles 2.jpg": ("Barnacles II: Example Slice", "Sample stack slice"),
    # Boronia Park Reserve, 26 Sep morning
    "26092026_082303P9260062 Boronia Park Reserve 23 stacked --- .jpg": ("Garden Orb Weaver Seven Stack", "23-photo stack"),
    "26092026_082303P9260062 Boronia Park Reserve.jpg": ("Garden Orb Weaver Seven: Example Slice", "Sample slice"),
    "26092026_094554P9260195 Boronia Park Reserve 40stacked --- .jpg": ("Crab Spider", "Stacked photo"),
    "26092026_094554P9260195 Boronia Park Reserve.jpg": ("Crab Spider: Example Slice", "Sample stack slice"),
    "26092026_095531P9260330 Boronia Park Reserve 50stacked --- .jpg": ("Crab Spider II", "Stacked photo"),
    "26092026_095531P9260330 Boronia Park Reserve.jpg": ("Crab Spider II: Example Slice", "Sample stack slice"),
    "26092026_101617P9260670 Boronia Park Reserve seed pod 31stacked --- .jpg": ("Spider Egg Sac", "A spider's egg sac, a ball of golden silk hung in a web on a tree trunk. 31-photo stack."),
    "26092026_101617P9260670 Boronia Park Reserve.jpg": ("Spider Egg Sac: Example Slice", "Sample stack slice"),
    "26092026_101723P9260730 Boronia Park Reserve snail shell 22stacked ---.jpg": ("Snail Shell", "Stacked photo"),
    "26092026_101723P9260730 Boronia Park Reserve.jpg": ("Snail Shell: Example Slice", "Sample stack slice"),
    "26092026_101803P9260821 Boronia Park Reserve snail shell 42stacked ---.jpg": ("Snail Shell II", "Stacked photo"),
    "26092026_101803P9260821 Boronia Park Reserve.jpg": ("Snail Shell II: Example Slice", "Sample stack slice"),
    "26092026_102753P9261010 Boronia Park Reserve 10stacked ---.jpg": ("Flower Spider", "Stacked photo"),
    "26092026_102753P9261010 Boronia Park Reserve.jpg": ("Flower Spider: Example Slice", "Sample stack slice"),
    "26092026_093849P9260136 Boronia Park Reserve.jpg": ("Hairy Wood Ear", "A cluster of wood ear fungus on a fallen branch, each cup a few centimetres across. Fuzzy on the outside, smooth on the inside."),
    "26092026_095000P9260226 Boronia Park Reserve.jpg": ("Crab Spider III", ""),
    "26092026_095012P9260261 Boronia Park Reserve.jpg": ("Crab Spider IV", ""),
    "26092026_095032P9260263 Boronia Park Reserve.jpg": ("Crab Spider V", ""),
    "26092026_095539P9260343 Boronia Park Reserve.jpg": ("Crab Spider VI", ""),
    "26092026_095617P9260351 Boronia Park Reserve.jpg": ("Crab Spider VII", ""),
    "26092026_095628P9260353 Boronia Park Reserve.jpg": ("Crab Spider VIII", ""),
    "26092026_100049P9260375 Boronia Park Reserve.jpg": ("Wandering Trad Flower", ""),
    "26092026_100456P9260521 Boronia Park Reserve.jpg": ("Millipede", ""),
    "26092026_100510P9260527 Boronia Park Reserve.jpg": ("Millipede II", ""),
    "26092026_100517P9260528 Boronia Park Reserve.jpg": ("Millipede III", ""),
    # Afternoon macro at home, same day
    "20260926_143832P9260094 flower 33stacked ---.jpg": ("Flower", "Stacked photo"),
    "20260926_143832P9260094.jpg": ("Flower: Example Slice", "Sample stack slice"),
    "20260926_145309P9260265 seed base 20stacked ---.jpg": ("Farmer's Friend Seed Head", "The underside of a Farmer's Friend (Bidens pilosa) seed head from the back yard, its seeds fanned out from the centre. 20-photo stack."),
    "20260926_145309P9260265.jpg": ("Farmer's Friend Seed Head: Example Slice", "Sample stack slice"),
    "20260926_145730P9260352 seeds 18stacked.jpg": ("Farmer's Friend Seed Head II", "The same seed head against a warmer background. 18-photo stack."),
    "20260926_145730P9260352.jpg": ("Farmer's Friend Seed Head II: Example Slice", "Sample stack slice"),
    "20260926_150310P9260463_01 flower 60stacked --- .jpg": ("Flower II", "Stacked photo"),
    "20260926_150310P9260463_01.jpg": ("Flower II: Example Slice", "Sample stack slice"),
    "20260926_150556P9260541_01 barbs 31stacked ---.jpg": ("Farmer's Friend Barbs", "The awns at the tip of a single seed, each lined with backward-pointing barbs. 31-photo stack."),
    "20260926_150556P9260541_01.jpg": ("Farmer's Friend Barbs: Example Slice", "Sample stack slice"),
    # Farmer's Friend lighting experiments, 26 Sep evening (Indoor Macro)
    "20260926_183141P9260001_03 seed base in purple 23stacked.jpg": ("Farmer's Friend in Magenta", "A single Bidens pilosa (Farmer's Friend) seed from the back yard, lit with one magenta light. 23-photo stack."),
    "20260926_183141P9260001_03.jpg": ("Farmer's Friend in Magenta: Example Slice", "Sample stack slice"),
    "20260926_183357P9260145_01 green light seed base 50stacked ---.jpg": ("Farmer's Friend in Green", "The same Bidens pilosa seed under green light, which brings out the fine ridged texture along its body. 50-photo stack."),
    "20260926_183357P9260145_01.jpg": ("Farmer's Friend in Green: Example Slice", "Sample stack slice"),
    "20260926_183521P9260242_01 seed base 70stacked ---.jpg": ("Farmer's Friend", "The seed's torn-off base under plain white light, where it broke away from the seed head. 70-photo stack."),
    "20260926_183521P9260242_01.jpg": ("Farmer's Friend: Example Slice", "Sample stack slice"),
    "20260926_183643P9260348_01 seed base natural light 52stacked -- .jpg": ("Farmer's Friend Awns", "The other end of the seed in natural light: the awns, each lined with backward-pointing barbs that hook onto socks and fur. 52-photo stack."),
    "20260926_183643P9260348_01.jpg": ("Farmer's Friend Awns: Example Slice", "Sample stack slice"),
    # 27 Sep: St Andrew's Cross (garden, morning) and holograms (indoor, evening)
    "20260927_115255P9270115 24stacked St Andrew's Cross.jpg": ("St Andrew's Cross Spider", "A St Andrew's Cross spider in her web, holding her legs in pairs to form the X the species is named for. 24-photo stack."),
    "20260927_115255P9270115.jpg": ("St Andrew's Cross Spider: Example Slice", "Sample stack slice"),
    "20260927_171711P9270310 star hologram 42stacked ---.jpg": ("Holographic Stars", "Stars on a holographic surface, each one made of a fine mesh of tiny diffraction cells. 42-photo stack."),
    "20260927_171711P9270310.jpg": ("Holographic Stars: Example Slice", "Sample stack slice"),
    "20260927_172009P9270403 grid holographic 40stacked ---.jpg": ("Holographic Grid", "A holographic grid, its lines splitting into red and green depending on the angle of the light. 40-photo stack."),
    "20260927_172009P9270403.jpg": ("Holographic Grid: Example Slice", "Sample stack slice"),
    "20260927_172605P9270620 heart holographic 20stacked ---.jpg": ("Holographic Hearts", "Layered hearts floating at different depths in a holographic film. 20-photo stack."),
    "20260927_172605P9270620.jpg": ("Holographic Hearts: Example Slice", "Sample stack slice"),
    # Michael's Cockroach, 27 Sep evening
    "20260927_193046P9270030 cockroach 40stacked ---.jpg": ("Cockroach", "Head-on against a dark background, lit from the side with no flash. 40-photo stack."),
    "20260927_193046P9270030.jpg": ("Cockroach: Example Slice", "Sample stack slice"),
    "20260927_193054P9270124_01 cockroach 26stacked ---.jpg": ("Cockroach II", "The same pose a few seconds later. 26-photo stack."),
    "20260927_193054P9270124_01.jpg": ("Cockroach II: Example Slice", "Sample stack slice"),
    "20260927_193129P9270185 cockroach 12stacked ---.jpg": ("Cockroach III", "A brighter take, with the pale edges of the wings showing on either side of the head. 12-photo stack."),
    "20260927_193129P9270185.jpg": ("Cockroach III: Example Slice", "Sample stack slice"),
    "20260927_193430P9270395_01 cockroack face 40stacked.jpg": ("Cockroach Face", "Close in on the face: the eyes, the antenna sockets, and flecks of crud across the head. 40-photo stack."),
    "20260927_193430P9270395_01.jpg": ("Cockroach Face: Example Slice", "Sample stack slice"),
    "20260927_193541P9270495 cockroach profile 60stacked ---.jpg": ("Cockroach Profile", "Side-on: the dark eye, the ringed antenna and the plates behind the head. 60-photo stack."),
    "20260927_193541P9270495.jpg": ("Cockroach Profile: Example Slice", "Sample stack slice"),
    # Artarmon (work), 29 Sep afternoon
    "20260929_171118P9290218 62stacked caterpillar.jpg": ("Green Caterpillar", "A small green caterpillar working its way along the edge of a leaf. 62-photo stack."),
    "20260929_171118P9290218.jpg": ("Green Caterpillar: Example Slice", "Sample stack slice"),
    "20260929_171507P9290385 caterpillar 38stacked.jpg": ("Green Caterpillar II", "The same caterpillar a few minutes later, arched up at the leaf tip with its fine hairs catching the light. 38-photo stack."),
    "20260929_171507P9290385.jpg": ("Green Caterpillar II: Example Slice", "Sample stack slice"),
    "20260929_173229P9290474 flowers 40stacked ---.jpg": ("White Flowers", "A dense cluster of tiny white flower heads, each one a pincushion of fine threads. 40-photo stack."),
    "20260929_173229P9290474.jpg": ("White Flowers: Example Slice", "Sample stack slice"),
    "20260930_165926P9300168 flowers at work 50stacked.jpg": ("White Flowers II", "More of the same white flowers, with buds still tinged pink among the open heads. 50-photo stack."),
    "20260930_165926P9300168.jpg": ("White Flowers II: Example Slice", "Sample stack slice"),
    # Experiments in Liquids: droplets on the polariser, 30 Sep evening
    "20260930_185113P9300243 droplets 45stacked ---.jpg": ("Experiment #49", "Two large water droplets on a polarising filter, their edges picking up rainbow colours. 45-photo stack."),
    "20260930_185113P9300243.jpg": ("Experiment #49: Example Slice", "Sample stack slice"),
    "20260930_185519P9300383 droplets 30stacked ---.jpg": ("Experiment #50", "Smaller droplets, each one catching its own tiny rainbow from the polarised light. 30-photo stack."),
    "20260930_185519P9300383.jpg": ("Experiment #50: Example Slice", "Sample stack slice"),
    "20260930_185619P9300473 drops 13stacked ---.jpg": ("Experiment #51", "Flattened droplets scattered across a wash of colour from the polariser. 13-photo stack."),
    "20260930_185619P9300473.jpg": ("Experiment #51: Example Slice", "Sample stack slice"),
    "20260930_191030P9300530 cicada through drops 30stacked---.jpg": ("Experiment #52", "A cicada behind the droplets, with a tiny copy of it caught inside each drop. 30-photo stack."),
    "20260930_191030P9300530.jpg": ("Experiment #52: Example Slice", "Sample stack slice"),
    # Helicon Focus stacks (TIFF, EXIF intact from the first frame), 5 Oct.
    # Frame counts are the files each saved output was rendered from, per
    # Helicon's log (%LOCALAPPDATA%/HeliconFocus/HeliconFocus9.log).
    "ladybug with helicon stacker/2026-10-05 13-04-49 (A,R4,S2).tif": ("Transverse Ladybird", "A transverse ladybird on a green stem, seen from above. 54-photo stack, combined in Helicon Focus."),
    "ladybug with helicon stacker/2026-10-05 13-06-57 (B,R4,S2).tif": ("Transverse Ladybird II", "Head-on at leaf level, with fine white strands trailing from underneath. 93-photo stack, combined in Helicon Focus."),
    "ladybug with helicon stacker/2026-10-05 13-11-13 (C,S2).tif": ("Transverse Ladybird III", "Right in close on the head and its compound eye. 39-photo stack, combined in Helicon Focus."),
    "2026-10-05 14-02-40 (B,R4,S2) 10stacked.tif": ("Spiderlings", "A web full of newly hatched spiderlings, with a cluster sharp in the bottom left. The web made this a hard one to stack. 10-photo stack, combined in Helicon Focus."),
    "20261005_122952PA050032_01 - baby spiders.jpg": ("Spiderlings: Example Slice", "Sample stack slice"),
    # Helicon Focus stacks, 5 Oct afternoon (frame counts from Helicon's log).
    # St Andrew's Cross II was shot at 1/125 with flash; top 11% cropped for the sync band.
    "2026-10-05 16-47-06 (A,R4,S2) leaf spider.tif": ("Leaf Spider", "A knobbly brown spider tucked against a leaf. 15-photo stack, combined in Helicon Focus."),
    "2026-10-05 16-54-19 (B,R4,S2) spider eggs.tif": ("Spider Eggs", "A handful of eggs caught in strands of web on a leaf, one already empty. 14-photo stack, combined in Helicon Focus."),
    "2026-10-05 17-08-06 (C,S2) garden spider.tif": ("Garden Spider", "A hairy brown orb-weaver hanging in its web. 7-photo stack, combined in Helicon Focus."),
    "2026-10-05 17-09-41 (A,R6,S2) fat ant.tif": ("Female Flower Wasp", "A wingless female flower wasp, easily mistaken for a big ant. A dozen sat alone on leaves around the back yard one afternoon, each giving off a scent to call the winged males, which pick the females up and carry them off to mate. 39-photo stack, combined in Helicon Focus."),
    "2026-10-05 17-16-15 (A,R6,S2) wolf spider.tif": ("Lynx Spider", "A striped lynx spider spread across a leaf, its legs lined with long spines. 49-photo stack, combined in Helicon Focus."),
    "2026-10-05 17-23-35 (A,R6,S2) wolf spider.tif": ("Wolf Spider", "A small hunting spider on a reddening leaf. 15-photo stack, combined in Helicon Focus."),
    "2026-10-05 17-24-24 (A,R6,S2) wolf spider side.tif": ("Jumping Spider", "A jumping spider on a leaf, its big front eyes turned towards the camera. 53-photo stack, combined in Helicon Focus."),
    "2026-10-05 17-25-02 (A,R6,S2) wolf spider hanging out.tif": ("Lynx Spider II", "The striped lynx spider again, hanging under the edge of a leaf. 51-photo stack, combined in Helicon Focus."),
    "2026-10-05 17-30-04 (A,R6,S2)st andrews cross closeup.tif": ("St Andrew's Cross Spider II", "Close in on a St Andrew's Cross spider's furry white body and eyes. 11-photo stack, combined in Helicon Focus."),
    # 10 Oct: yellow admiral (Zerene stacks; settings from the paired single frames)
    '10102026_123313PA100668 4 butterfly 60stacked.tif': ('Yellow Admiral', "A yellow admiral (Vanessa itea, once Bassaris itea), caught in a little net cage in the back yard. It wouldn't settle on the flower, so it's shot against the netting. 60-photo stack, combined in Zerene Stacker."),
    '10102026_123313PA100668 4.tif': ('Yellow Admiral: Example Slice', 'Sample stack slice'),
    '10102026_123424PA100721 wingtip 60stacked.tif': ('Yellow Admiral Wingtip', "Close in on the edge of the yellow admiral's wing, every overlapping scale in focus. 60-photo stack, combined in Zerene Stacker."),
    '10102026_123424PA100722 wing 1.tif': ('Yellow Admiral Wingtip: Example Slice', 'Sample stack slice'),
    '20261010_123624PA100900 butterfly hairy eye 76stacked.tif': ('Yellow Admiral Hairy Eye', "The yellow admiral's compound eye is covered in fine hairs, a trait of the Vanessa butterflies. 76-photo stack, combined in Zerene Stacker."),
    '20261010_123624PA100900.tif': ('Yellow Admiral Hairy Eye: Example Slice', 'Sample stack slice'),
    '2026-10-05 19-00-38 (C,S2) female wasp.tif': ('Female Flower Wasp II', 'Another of the wingless female flower wasps, waiting alone on a leaf. 65-photo stack, combined in Helicon Focus.'),
    # Tarban Creek flying foxes, 4 Oct
    "bats at tarban creek/PA040150.JPG": ("Wrapped Up", ""),
    "bats at tarban creek/PA040164.JPG": ("Grey-headed Flying Fox", ""),
    "bats at tarban creek/PA040165.JPG": ("The Camp", ""),
    "bats at tarban creek/PA040173.JPG": ("The Drop", "A mother drops her newborn pup from the roost."),
    "bats at tarban creek/PA040174.JPG": ("The Drop II", "A mother drops her newborn pup from the roost."),
    "bats at tarban creek/PA040175.JPG": ("The Drop III", "A mother drops her newborn pup from the roost."),
    "bats at tarban creek/PA040176.JPG": ("After the Drop", ""),
    "bats at tarban creek/PA040179.JPG": ("After the Drop II", ""),
    "bats at tarban creek/PA040181.JPG": ("After the Drop III", ""),
    "bats at tarban creek/PA040185.JPG": ("Wrapped Up II", ""),
    "bats at tarban creek/PA040187.JPG": ("The Camp II", ""),
    "bats at tarban creek/PA040190.JPG": ("Silhouettes", ""),
    "bats at tarban creek/PA040191.JPG": ("Silhouettes II", ""),
    "bats at tarban creek/PA040193.JPG": ("Silhouettes III", ""),
    "bats at tarban creek/PA040195.JPG": ("Against the Sky", ""),
    "bats at tarban creek/PA040199.JPG": ("Roosting Together", ""),
    "bats at tarban creek/PA040206.JPG": ("Bat and Plane", ""),
    "bats at tarban creek/PA040215.JPG": ("The Camp III", ""),
    "bats at tarban creek/PA040219.JPG": ("Stretching Out", ""),
    "bats at tarban creek/PA040230.JPG": ("After Dark", ""),
    "bats at tarban creek/PA040245.JPG": ("After Dark II", ""),
    "bats at tarban creek/PA040271.JPG": ("After Dark III", ""),
    "bats at tarban creek/PA040274.JPG": ("Night Roost", ""),
    "bats at tarban creek/PA040275.JPG": ("Night Roost II", ""),
    "bats at tarban creek/PA040276.JPG": ("Night Roost III", ""),
    "bats at tarban creek/PA040277.JPG": ("Night Roost IV", ""),
    "bats at tarban creek/PA040282.JPG": ("Wings Open", ""),
    "bats at tarban creek/PA040285.JPG": ("Night Roost V", ""),
    "bats at tarban creek/PA040287.JPG": ("Night Roost VI", ""),
    # Hornsby Heights, family birthday gathering, 3 Oct
    "20261003_124918PA030245 under-leaf seeds 30stacked ---.jpg": ("Fern Spores", "The underside of a fern frond, lined with rows of spore clusters. 30-photo stack."),
    "20261003_124918PA030245.jpg": ("Fern Spores: Example Slice", "Sample stack slice"),
    "20261003_125048PA030274 pond surface 20stacked---.jpg": ("Pond Surface", "The garden pond, carpeted edge to edge with tiny floating plants. 20-photo stack."),
    "20261003_125048PA030274.jpg": ("Pond Surface: Example Slice", "Sample stack slice"),
    "20261003_130050PA030372 beetle 7stacked---.jpg": ("Yellow Ladybird", "A yellow and black ladybird at the tip of a leaf. 7-photo stack."),
    "20261003_130050PA030372.jpg": ("Yellow Ladybird: Example Slice", "Sample stack slice"),
    "20261003_130511PA030491 fungus 20stacked.jpg": ("Orange Bracket Fungus", "A bright orange bracket fungus growing out of old wood. 20-photo stack."),
    "20261003_130511PA030491.jpg": ("Orange Bracket Fungus: Example Slice", "Sample stack slice"),
    "20261003_131054PA030526 berries 20stacked ---.jpg": ("Orange Stems and Berries", "Bright orange stems carrying small green berries. 20-photo stack."),
    "20261003_131054PA030526.jpg": ("Orange Stems and Berries: Example Slice", "Sample stack slice"),
    "20261003_131223PA030554 moth 8stacked---.jpg": ("Moth on a Leaf", "A small moth resting on a broad leaf. 8-photo stack."),
    "20261003_131223PA030554.jpg": ("Moth on a Leaf: Example Slice", "Sample stack slice"),
    "20261003_131304PA030626 moth 26stacked.jpg": ("Moth on a Leaf II", "Closer in on the same moth, its furry head and striped legs in focus. 26-photo stack."),
    "20261003_131304PA030626.jpg": ("Moth on a Leaf II: Example Slice", "Sample stack slice"),
    "20261003_131549PA030682 flower 13stacked.jpg": ("Purple Salvia", "Deep purple salvia flowers opening from near-black buds. 13-photo stack."),
    "20261003_131549PA030682.jpg": ("Purple Salvia: Example Slice", "Sample stack slice"),
    "20261003_131853PA030721 fly 7stacked.jpg": ("Fly on a Branch", "A bristly fly sunning itself on a branch. 7-photo stack."),
    "20261003_131853PA030721.jpg": ("Fly on a Branch: Example Slice", "Sample stack slice"),
    "20261003_132121PA030808 spider 7stacked.jpg": ("Spider in the Shade", "A small long-legged spider hanging in the shadows of the garden. 7-photo stack."),
    "20261003_132121PA030808.jpg": ("Spider in the Shade: Example Slice", "Sample stack slice"),
    "20261003_143324PA030905 Zeke 6stacked.jpg": ("Zeke", "Zeke at the family birthday gathering. 6-photo stack."),
    "20261003_143324PA030905.jpg": ("Zeke: Example Slice", "Sample stack slice"),
    "20261003_145404PA031210 eggs 16stacked.jpg": ("Insect Eggs", "A neat cluster of insect eggs laid on a leaf. 16-photo stack."),
    "20261003_145404PA031210.jpg": ("Insect Eggs: Example Slice", "Sample stack slice"),
    "20261003_145832PA031304 cicada shell 36stacked.jpg": ("Cicada Shell", "An empty cicada shell left on old bark, wrapped in spider web. 36-photo stack."),
    "20261003_145832PA031304.jpg": ("Cicada Shell: Example Slice", "Sample stack slice"),
    "20261003_152343PA031418 moth 13stacked.jpg": ("Moth III", "A different moth, resting on a blue surface, its wings marked with pale spots. 13-photo stack."),
    "20261003_152343PA031418.jpg": ("Moth III: Example Slice", "Sample stack slice"),
    "20261003_111043PA030151.jpg": ("Concrete Pillar", ""),
    "20261003_111234PA030152.jpg": ("Canon Building", ""),
    "20261003_112831PA030165.jpg": ("Arm in the Sun", ""),
    "20261003_125415PA030322.jpg": ("Weimaraner", ""),
    "20261003_125522PA030337.jpg": ("Bee on Orange Blossom", ""),
    "20261003_130130PA030396.jpg": ("Beetle on a Leaf Tip", ""),
    "20261003_132438PA030848.jpg": ("Caterpillar on a Finger", ""),
    "20261003_132439PA030849.jpg": ("Caterpillar on a Finger II", ""),
    "20261003_132441PA030851.jpg": ("Caterpillar on a Finger III", ""),
    "20261003_132805PA030854.jpg": ("Caterpillar on a Leaf", ""),
    "20261003_132808PA030855.jpg": ("Caterpillar on a Leaf II", ""),
    "20261003_132814PA030856.jpg": ("Caterpillar on a Leaf III", ""),
    "20261003_133048PA030864.jpg": ("Caterpillar on a Leaf IV", ""),
    "20261003_145115PA031180.jpg": ("Butterfly", ""),
    "20261003_145119PA031181.jpg": ("Butterfly II", ""),
    "20261003_145124PA031182.jpg": ("Butterfly III", ""),
    "20261003_145217PA031184.jpg": ("In the Leaves", ""),
    "20261003_151422PA031400.jpg": ("Those Eyes", ""),
    "20261003_151446PA031402.jpg": ("Those Eyes II", ""),
    "20261003_153927PA031432.jpg": ("Distant City", ""),
    "19092026_123821P9190438 bay landscape.jpg": ("Yachts at Anchor", ""),
    "19092026_123845P9190465 bay landscape.jpg": ("Moored Yacht", ""),
    "19092026_124002P9190470 bay landscape.jpg": ("Moored Yacht II", ""),
    "19092026_124127P9190474 bay landscape.jpg": ("Rowing Club Jetty", "Across the bay in Abbotsford, where the Sydney Rowing Club and Abbotsford Rowing Club sit side by side."),
    "19092026_124151P9190493 bay landscape.jpg": ("Rowing Club Jetty II", "Across the bay in Abbotsford, where the Sydney Rowing Club and Abbotsford Rowing Club sit side by side."),
    "19092026_124259P9190514 bay landscape.jpg": ("Masts and Rooftops", ""),
    "19092026_124357P9190535 bay landscape.jpg": ("Palms and Chimneys", ""),
    "19092026_124517P9190537 bay landscape.jpg": ("Qantas Overhead", ""),
    "19092026_124549P9190540 bay landscape.jpg": ("Red Sail", ""),
    "19092026_140734P9190560 ants.jpg": ("Ants #1", ""),
    "19092026_140742P9190570 ants.jpg": ("Ants #2", ""),
    "19092026_140743P9190571 ants.jpg": ("Ants #3", ""),
    "19092026_140744P9190572 ants.jpg": ("Ants #4", ""),
    "19092026_140744P9190573 ants.jpg": ("Ants #5", ""),
    "19092026_140746P9190574 ants.jpg": ("Ants #6", ""),
    "19092026_140747P9190575 ants.jpg": ("Ants #7", ""),
    "19092026_140750P9190578 ants.jpg": ("Ants #8", ""),
    "19092026_140755P9190583 ants.jpg": ("Ants #9", ""),
    "19092026_140756P9190586 ants.jpg": ("Ants #10", ""),
    "19092026_140808P9190600 ants.jpg": ("Ants #11", ""),
    "19092026_140817P9190606 ants.jpg": ("Ants #12", ""),
    "19092026_140817P9190607 ants.jpg": ("Ants #13", ""),
    "19092026_140819P9190611 ants.jpg": ("Ants #14", ""),
    "P9150707 20 stacked.jpg": ("Wasp Nest II", ""),
    "12092026_123035P9120046_01Sydney CBD - Copy.jpg": ("Watching the Harbour", ""),
    "12092026_123056P9120052_01Sydney CBD - Copy.jpg": ("Watching the Harbour II", ""),
    "12092026_123301P9120055_01Sydney CBD - Copy.jpg": ("Darling Harbour Playground", ""),
    "12092026_123606P9120061_01Sydney CBD - Copy.jpg": ("Glass Reflections", ""),
    "12092026_123631P9120067_01Sydney CBD - Copy.jpg": ("Glass Reflections II", ""),
    "12092026_124003P9120074Sydney CBD - Copy.jpg": ("Spiral Balconies", "The Exchange at Darling Square, a six-storey civic hub designed by Japanese architecture firm Kengo Kuma & Associates, wrapped in spiralling balconies of Accoya timber."),
    "12092026_124436P9120089Sydney CBD - Copy.jpg": ("Spiral Balconies II", "The Exchange again: Kengo Kuma & Associates' spiral of Accoya timber balconies."),
    "12092026_124523P9120095Sydney CBD - Copy.jpg": ("Bin Chicken", ""),
    "12092026_124543P9120101Sydney CBD - Copy.jpg": ("Bin Chicken II", ""),
    "12092026_124552P9120107Sydney CBD - Copy.jpg": ("Bin Chicken III", ""),
    "12092026_124612P9120113Sydney CBD - Copy.jpg": ("Bin Chicken IV", ""),
    "12092026_124739P9120119Sydney CBD - Copy.jpg": ("Coordinated", ""),
    "12092026_124824P9120125Sydney CBD - Copy.jpg": ("Coordinated II", ""),
    "12092026_124839P9120128Sydney CBD - Copy.jpg": ("Good Boy", ""),
    "12092026_125221P9120136Sydney CBD - Copy.jpg": ("Are You Feeling Tipsy?", ""),
    "12092026_125843P9120169Sydney CBD - Copy.jpg": ("Mirror Maze", ""),
    "12092026_130047P9120183Sydney CBD - Copy.jpg": ("Sydney Tower", ""),
    "12092026_130156P9120189Sydney CBD - Copy.jpg": ("Splash", ""),
    "12092026_130258P9120201Sydney CBD - Copy.jpg": ("Splash II", ""),
    "12092026_130403P9120210Sydney CBD - Copy.jpg": ("Splash III", ""),
    "12092026_130418P9120213Sydney CBD - Copy.jpg": ("Splash IV", ""),
    "12092026_130420P9120216Sydney CBD - Copy.jpg": ("Splash V", ""),
    "12092026_130502P9120222Sydney CBD - Copy.jpg": ("Splash VI", ""),
    "12092026_135523P9120836Sydney CBD - Copy.jpg": ("Hanfu and a Coles Bag", ""),
    "12092026_141139P9120841Sydney CBD - Copy.jpg": ("Cranes Overhead", ""),
    "12092026_141147P9120842Sydney CBD - Copy.jpg": ("Cranes Overhead II", ""),
    "12092026_141340P9120843Sydney CBD - Copy.jpg": ("City Skyline", ""),
    "12092026_141433P9120844Sydney CBD - Copy.jpg": ("City Skyline II", ""),
    "12092026_141634P9120848Sydney CBD - Copy.jpg": ("Geometric Facade", ""),
    "12092026_141938P9120849Sydney CBD - Copy.jpg": ("Sydney Square Fountain", ""),
    "12092026_141956P9120850Sydney CBD - Copy.jpg": ("Sydney Square Fountain II", ""),
    "12092026_142001P9120851Sydney CBD - Copy.jpg": ("Sydney Square Fountain III", ""),
    "12092026_142012P9120853Sydney CBD - Copy.jpg": ("Sydney Square Fountain IV", ""),
    "12092026_151247P9120921Sydney CBD - Copy.jpg": ("Freed Assange", ""),
    "12092026_151433P9120928Sydney CBD.jpg": ("The Colombian Embassy", ""),
    "12092026_151617P9120932Sydney CBD.jpg": ("Streets of the CBD", ""),
    "12092026_151859P9120938Sydney CBD.jpg": ("Walk to the Lawn", ""),
    "12092026_152240P9120945Sydney CBD.jpg": ("TikTok Entertainment Centre", ""),
    "12092026_153629P9120952Sydney CBD.jpg": ("Checking In", ""),
    "12092026_154147P9120953Sydney CBD.jpg": ("Streets of the CBD II", ""),
    "12092026_154905P9120962Sydney CBD.jpg": ("Street Ping Pong", ""),
    "12092026_155157P9120967Sydney CBD.jpg": ("Concrete Jungle", ""),
    "12092026_155423P9120974Sydney CBD.jpg": ("Darling Harbour Marina", ""),
    "12092026_155609P9120984Sydney CBD.jpg": ("Darling Harbour Marina II", ""),
    "12092026_155917P9120993Sydney CBD.jpg": ("Glass Reflections III", ""),
    "12092026_160005P9120996Sydney CBD.jpg": ("Streets of the CBD III", ""),
    "12092026_160517P9121012Sydney CBD.jpg": ("Poison Ivy Cosplay", ""),
    "12092026_131127P9120236Sydney CBD - Copy.jpg": ("Garden Ornament", ""),
    "12092026_131238P9120245Sydney CBD - Copy.jpg": ("Carved in Stone", ""),
    "12092026_131505P9120257Sydney CBD - Copy.jpg": ("Koi", ""),
    "12092026_131508P9120260Sydney CBD - Copy.jpg": ("Koi II", ""),
    "12092026_131554P9120269Sydney CBD - Copy.jpg": ("Koi III", ""),
    "12092026_131600P9120275Sydney CBD - Copy.jpg": ("Koi IV", ""),
    "12092026_131717P9120284Sydney CBD - Copy.jpg": ("Garden Visitor", ""),
    "12092026_131721P9120287Sydney CBD - Copy.jpg": ("Garden Visitor II", ""),
    "12092026_131736P9120290Sydney CBD - Copy.jpg": ("Garden Visitor III", ""),
    "12092026_131947P9120308Sydney CBD 8stack.jpg": ("Water Dragon by the Tree", ""),
    "12092026_132044P9120399_01Sydney CBD 8stack.jpg": ("Water Dragon by the Tree II", ""),
    "12092026_132418P9120736_01Sydney CBD - Copy.jpg": ("Waterfall", ""),
    "12092026_132428P9120737_01Sydney CBD - Copy.jpg": ("Waterfall II", ""),
    "12092026_132503P9120740_01Sydney CBD - Copy.jpg": ("Waterfall III", ""),
    "12092026_132646P9120743_01Sydney CBD - Copy.jpg": ("Waterfall IV", ""),
    "12092026_132652P9120744_01Sydney CBD - Copy.jpg": ("Waterfall V", ""),
    "12092026_132706P9120746_01Sydney CBD - Copy.jpg": ("Waterfall VI", ""),
    "12092026_132713P9120747_01Sydney CBD - Copy.jpg": ("Waterfall VII", ""),
    "12092026_132725P9120748_01Sydney CBD - Copy.jpg": ("Waterfall VIII", ""),
    "12092026_132739P9120749_01Sydney CBD - Copy.jpg": ("Waterfall IX", ""),
    "12092026_132811P9120753_01Sydney CBD - Copy.jpg": ("Waterfall X", ""),
    "12092026_132910P9120755_01Sydney CBD - Copy.jpg": ("Waterfall XI", ""),
    "12092026_132938P9120758_01Sydney CBD - Copy.jpg": ("Waterfall XII", ""),
    "12092026_133003P9120761_01Sydney CBD - Copy.jpg": ("Waterfall XIII", ""),
    "12092026_133030P9120767_01Sydney CBD - Copy.jpg": ("Waterfall XIV", ""),
    "12092026_133346P9120771_01Sydney CBD - Copy.jpg": ("Pond Through the Blossoms", ""),
    "12092026_133401P9120772_01Sydney CBD - Copy.jpg": ("Pond Through the Blossoms II", ""),
    "12092026_133423P9120773_01Sydney CBD - Copy.jpg": ("Pond Through the Blossoms III", ""),
    "12092026_133447P9120775_01Sydney CBD - Copy.jpg": ("Pond Through the Blossoms IV", ""),
    "12092026_133616P9120781Sydney CBD - Copy.jpg": ("Sunbathing", ""),
    "12092026_133649P9120784Sydney CBD - Copy.jpg": ("Sunbathing II", ""),
    "12092026_133656P9120786Sydney CBD - Copy.jpg": ("Sunbathing III", ""),
    "12092026_134219P9120824Sydney CBD - Copy.jpg": ("Water Dragon on the Pavement", ""),
    "12092026_134230P9120825Sydney CBD - Copy.jpg": ("Water Dragon on the Pavement II", ""),
    "12092026_134238P9120826Sydney CBD - Copy.jpg": ("Water Dragon on the Pavement III", ""),
    "Sprout.jpg": ("Brussels Sprout", ""),
    "12092026_142257P9120855Sydney CBD - Copy.jpg": ("Speaking Up for Ukraine", ""),
    "12092026_142312P9120856Sydney CBD - Copy.jpg": ("Australia Help Ukraine", ""),
    "12092026_142320P9120857Sydney CBD - Copy.jpg": ("Russian Culture Kills", ""),
    "12092026_142342P9120858Sydney CBD - Copy.jpg": ("Flags on the Steps", ""),
    "12092026_152343P9120948Sydney CBD.jpg": ("Street Pianist", ""),
    "12092026_152405P9120951Sydney CBD.jpg": ("Street Pianist II", ""),
    "12092026_143005P9120861Sydney CBD - Copy.jpg": ("Piano Keys", ""),
    "12092026_143006P9120862Sydney CBD - Copy.jpg": ("Piano Keys II", ""),
    "12092026_143010P9120865Sydney CBD - Copy.jpg": ("Piano Keys III", ""),
    "12092026_143241P9120867Sydney CBD - Copy.jpg": ("QVB Pianist", ""),
    "12092026_143338P9120873Sydney CBD - Copy.jpg": ("QVB Pianist II", ""),
    "12092026_143338P9120874Sydney CBD - Copy.jpg": ("QVB Pianist III", ""),
    "12092026_143342P9120876Sydney CBD - Copy.jpg": ("QVB Pianist IV", ""),
    "12092026_143601P9120886Sydney CBD - Copy.jpg": ("Playing by Ear", ""),
    "12092026_143608P9120887Sydney CBD - Copy.jpg": ("Playing by Ear II", ""),
    "12092026_143612P9120892Sydney CBD - Copy.jpg": ("Playing by Ear III", ""),
    "12092026_143615P9120893Sydney CBD - Copy.jpg": ("Playing by Ear IV", ""),
    "12092026_143707P9120897Sydney CBD - Copy.jpg": ("The Royal Clock", ""),
    "12092026_143752P9120902Sydney CBD - Copy.jpg": ("By Appointment to the Queen", ""),
    "12092026_143821P9120906Sydney CBD - Copy.jpg": ("Inside the QVB", ""),
    "13092026_180538P9130001Frank.jpg": ("Frankie: Detail", ""),
    "13092026_183135P9130095_01Frank.jpg": ("Frankie: Detail II", ""),
    "13092026_183206P9130141_01Frank.jpg": ("Frankie: Detail III", ""),
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
    if original in ARTARMON_TITLES or original in ARTARMON_PEOPLE or original in ARTARMON_MACRO:
        return "Artarmon", None, "Artarmon"
    if original in KITCHEN_MOSS:
        return "Gladesville", "Moss", "Home"
    if original in FLUIDS_REDUX:
        return "Gladesville", "Experiments in Liquids", "Home"
    if original in FLUIDS_3:
        return "Gladesville", "Experiments in Liquids", "Home"
    if original in MICHAELS_COCKROACH:
        return "Gladesville", "Michael's Cockroach", "Home"
    if original in MICHAELS_FLOWERS:
        return "Gladesville", "Michael's Flowers", "Home"
    if original in MICHAELS_FENDER:
        return "Gladesville", "Michael's Fender", "Home"
    if original in MICHAELS_STUDIO:
        return "Gladesville", "Michael's Studio", "Home"
    if original in INDOOR_MACRO:
        return "Gladesville", "Indoor Macro", "Home"
    if original in BANJO_PATERSON:
        return "Gladesville", "Banjo Paterson Park", "Banjo Paterson Park, Gladesville"
    if original in TARBAN_BATS:
        return "Gladesville", "Tarban Creek Flying Foxes", "Tarban Creek (Riverglade Reserve), Gladesville"
    if original in BORONIA_PARK:
        return "Gladesville", "Boronia Park Reserve", "Boronia Park Reserve, Hunters Hill"
    if original in ANTS:
        return "Gladesville", "Ants", "Home"
    if original in ON_THE_ROAD:
        return "On the Road", None, ON_THE_ROAD[original]
    if original in HORNSBY_HEIGHTS or original in HORNSBY_OCT:
        return "Hornsby Heights", None, "Hornsby Heights, Sydney (mum & dad's house)"
    if original in PEOPLE:
        return "Gladesville", "People", "Home"
    if original in PLANES:
        return "Gladesville", "Planes", "Home"
    if original in UNCATEGORIZED_GLADESVILLE:
        return "Gladesville", "Uncategorized", LOCATION_OVERRIDE.get(original, "Home")
    if "glitter oi" in original.lower():
        return "Gladesville", "Experiments in Liquids", "Home"
    if "last dinosaurs" in original.lower():
        return "Gladesville", "Dinosaurs", "Gladesville"
    if original.lower().endswith("frank.jpg"):
        return "Gladesville", "Frank photos of Frankie", "Gladesville"
    return "Gladesville", "Garden", "Home"

# Stack composite -> its "Example Slice" photo, for the pairs SOURCE_MAP can't
# express (the stack's source there is a raw file, or a differently-named
# export). Every other pair is derived automatically: a stack whose SOURCE_MAP
# source is a published photo titled "... Example Slice".
# Wikipedia links for subjects identified with confidence AND confirmed to
# occur around Sydney (checked against each page, 2026-10-05). Family/genus
# pages where the species can't be told from the photo. Keyed by filename so a
# shared title can't link the wrong photo (e.g. the dragon artwork in "Water
# Dragon on the Pavement II/III" has no link). Shown in the lightbox as a
# "Wikipedia" button; a slice shows its stack's link.
WIKI_ORB = ('Orb-weaver spider', 'https://en.wikipedia.org/wiki/Orb-weaver_spider')
WIKI_ARGIOPE = ("St Andrew's Cross spider (Argiope keyserlingi)", 'https://en.wikipedia.org/wiki/Argiope_keyserlingi')
WIKI_LYNX = ('Lynx spider (Oxyopes)', 'https://en.wikipedia.org/wiki/Oxyopes')
WIKI_JUMPING = ('Jumping spider', 'https://en.wikipedia.org/wiki/Jumping_spider')
WIKI_CRAB = ('Crab spider (Thomisidae)', 'https://en.wikipedia.org/wiki/Thomisidae')
WIKI_PAPER_WASP = ('Paper wasp', 'https://en.wikipedia.org/wiki/Paper_wasp')
WIKI_BIDENS = ("Farmer's friend (Bidens pilosa)", 'https://en.wikipedia.org/wiki/Bidens_pilosa')
WIKI_TRANSVERSE = ('Transverse ladybird (Coccinella transversalis)', 'https://en.wikipedia.org/wiki/Coccinella_transversalis')
WIKI_ILLEIS = ('Fungus-eating ladybird (Illeis galbula)', 'https://en.wikipedia.org/wiki/Illeis_galbula')
WIKI_SORUS = ('Sorus (fern spore cluster)', 'https://en.wikipedia.org/wiki/Sorus')
WIKI_SALVINIA = ('Salvinia (floating fern)', 'https://en.wikipedia.org/wiki/Salvinia')
WIKI_WEIMARANER = ('Weimaraner', 'https://en.wikipedia.org/wiki/Weimaraner')
WIKI_HONEY_BEE = ('Western honey bee', 'https://en.wikipedia.org/wiki/Western_honey_bee')
WIKI_SALVIA = ('Salvia', 'https://en.wikipedia.org/wiki/Salvia')
WIKI_LYCAENIDAE = ('Gossamer-winged butterflies (Lycaenidae)', 'https://en.wikipedia.org/wiki/Lycaenidae')
WIKI_SHIELD_BUG = ('Shield bugs (Pentatomidae)', 'https://en.wikipedia.org/wiki/Pentatomidae')
WIKI_CICADA = ('Cicada', 'https://en.wikipedia.org/wiki/Cicada')
WIKI_BRUSSELS = ('Brussels sprout', 'https://en.wikipedia.org/wiki/Brussels_sprout')
WIKI_MOSS = ('Moss', 'https://en.wikipedia.org/wiki/Moss')
WIKI_BARNACLE = ('Barnacle', 'https://en.wikipedia.org/wiki/Barnacle')
WIKI_WOOD_EAR = ('Wood ear fungi (Auricularia)', 'https://en.wikipedia.org/wiki/Auricularia')
WIKI_TRAD = ('Wandering trad (Tradescantia fluminensis)', 'https://en.wikipedia.org/wiki/Tradescantia_fluminensis')
WIKI_MILLIPEDE = ('Millipede', 'https://en.wikipedia.org/wiki/Millipede')
WIKI_GARDEN_SNAIL = ('Garden snail (Cornu aspersum)', 'https://en.wikipedia.org/wiki/Cornu_aspersum')
WIKI_COCKROACH = ('Cockroach', 'https://en.wikipedia.org/wiki/Cockroach')
WIKI_IBIS = ('Australian white ibis', 'https://en.wikipedia.org/wiki/Australian_white_ibis')
WIKI_KOI = ('Koi', 'https://en.wikipedia.org/wiki/Koi')
WIKI_WATER_DRAGON = ('Australian water dragon', 'https://en.wikipedia.org/wiki/Australian_water_dragon')
WIKI_COCKATOO = ('Sulphur-crested cockatoo', 'https://en.wikipedia.org/wiki/Sulphur-crested_cockatoo')
WIKI_FLYING_FOX = ("Grey-headed flying fox", "https://en.wikipedia.org/wiki/Grey-headed_flying_fox")
WIKI_MALLOW = ('Mallow family (Malvaceae)', 'https://en.wikipedia.org/wiki/Malvaceae')
WIKI_PAPPUS = ('Pappus (seed parachutes)', 'https://en.wikipedia.org/wiki/Pappus_(botany)')
WIKI_DAISY = ('Daisy family (Asteraceae)', 'https://en.wikipedia.org/wiki/Asteraceae')
WIKI_PALM = ('Palm family (Arecaceae)', 'https://en.wikipedia.org/wiki/Arecaceae')
WIKI_LANTANA = ('Lantana (Lantana camara)', 'https://en.wikipedia.org/wiki/Lantana_camara')
WIKI_WESTRINGIA = ('Coastal rosemary (Westringia fruticosa)', 'https://en.wikipedia.org/wiki/Westringia_fruticosa')
WIKI_CITRUS = ('Citrus', 'https://en.wikipedia.org/wiki/Citrus')
WIKI_THYNNID = ('Flower wasps (Thynnidae)', 'https://en.wikipedia.org/wiki/Thynnidae')
WIKI_YELLOW_ADMIRAL = ('Yellow admiral (Vanessa itea)', 'https://en.wikipedia.org/wiki/Yellow_admiral')
WIKI_LINKS = {
    # Orb-weaver spider
    'STACK-2-Spider.jpg': [WIKI_ORB],
    'Orb Weaver1.jpg': [WIKI_ORB],
    'Orb Weaver2.jpg': [WIKI_ORB],
    'Orb Weaver3.jpg': [WIKI_ORB],
    'Spider back.jpg': [WIKI_ORB],
    'Spider underside.jpg': [WIKI_ORB],
    '11092026_200012P9111035 under spider stack.jpg': [WIKI_ORB],
    '11092026_200200P9111040.jpg': [WIKI_ORB],
    '11092026_200213P9111041.jpg': [WIKI_ORB],
    '11092026_200240P9111043.jpg': [WIKI_ORB],
    '11092026_200243P9111044.jpg': [WIKI_ORB],
    '11092026_200244P9111045.jpg': [WIKI_ORB],
    '11092026_200254P9111048.jpg': [WIKI_ORB],
    '11092026_200303P9111050.jpg': [WIKI_ORB],
    '11092026_200310P9111051.jpg': [WIKI_ORB],
    '11092026_200341P9111055.jpg': [WIKI_ORB],
    '11092026_200351P9111056.jpg': [WIKI_ORB],
    '11092026_200357P9111057.jpg': [WIKI_ORB],
    '11092026_200402P9111059.jpg': [WIKI_ORB],
    '11092026_200404P9111060.jpg': [WIKI_ORB],
    '11092026_200407P9111061.jpg': [WIKI_ORB],
    '11092026_200828P9111073.jpg': [WIKI_ORB],
    '11092026_200832P9111074.jpg': [WIKI_ORB],
    '11092026_201904P9111337 stack.jpg': [WIKI_ORB],
    '12092026_185356P9120006UV Spider 2stack.jpg': [WIKI_ORB],
    '25092026_174459P9250013.jpg': [WIKI_ORB],
    '25092026_175348P9250067 10stacked.jpg': [WIKI_ORB],
    '26092026_082303P9260062 Boronia Park Reserve 23 stacked --- .jpg': [WIKI_ORB],
    '2026-10-05 16-47-06 (A,R4,S2) leaf spider.tif': [WIKI_ORB],
    '2026-10-05 17-08-06 (C,S2) garden spider.tif': [WIKI_ORB],
    # St Andrew's Cross spider (Argiope keyserlingi)
    "20260927_115255P9270115 24stacked St Andrew's Cross.jpg": [WIKI_ARGIOPE],
    '2026-10-05 17-30-04 (A,R6,S2)st andrews cross closeup.tif': [WIKI_ARGIOPE],
    # Lynx spider (Oxyopes)
    '2026-10-05 17-16-15 (A,R6,S2) wolf spider.tif': [WIKI_LYNX],
    '2026-10-05 17-25-02 (A,R6,S2) wolf spider hanging out.tif': [WIKI_LYNX],
    # Jumping spider
    '2026-10-05 17-24-24 (A,R6,S2) wolf spider side.tif': [WIKI_JUMPING],
    # Crab spider (Thomisidae)
    '26092026_094554P9260195 Boronia Park Reserve 40stacked --- .jpg': [WIKI_CRAB],
    '26092026_095531P9260330 Boronia Park Reserve 50stacked --- .jpg': [WIKI_CRAB],
    '26092026_095000P9260226 Boronia Park Reserve.jpg': [WIKI_CRAB],
    '26092026_095012P9260261 Boronia Park Reserve.jpg': [WIKI_CRAB],
    '26092026_095032P9260263 Boronia Park Reserve.jpg': [WIKI_CRAB],
    '26092026_095539P9260343 Boronia Park Reserve.jpg': [WIKI_CRAB],
    '26092026_095617P9260351 Boronia Park Reserve.jpg': [WIKI_CRAB],
    '26092026_095628P9260353 Boronia Park Reserve.jpg': [WIKI_CRAB],
    '26092026_102753P9261010 Boronia Park Reserve 10stacked ---.jpg': [WIKI_CRAB],
    # Paper wasp
    '12092026_081712P9120052wasp stack.jpg': [WIKI_PAPER_WASP],
    'P9150707 20 stacked.jpg': [WIKI_PAPER_WASP],
    # Farmer's friend (Bidens pilosa)
    '20260926_145309P9260265 seed base 20stacked ---.jpg': [WIKI_BIDENS],
    '20260926_145730P9260352 seeds 18stacked.jpg': [WIKI_BIDENS],
    '20260926_150556P9260541_01 barbs 31stacked ---.jpg': [WIKI_BIDENS],
    '20260926_183141P9260001_03 seed base in purple 23stacked.jpg': [WIKI_BIDENS],
    '20260926_183357P9260145_01 green light seed base 50stacked ---.jpg': [WIKI_BIDENS],
    '20260926_183521P9260242_01 seed base 70stacked ---.jpg': [WIKI_BIDENS],
    '20260926_183643P9260348_01 seed base natural light 52stacked -- .jpg': [WIKI_BIDENS],
    # Transverse ladybird (Coccinella transversalis)
    'ladybug with helicon stacker/2026-10-05 13-04-49 (A,R4,S2).tif': [WIKI_TRANSVERSE],
    'ladybug with helicon stacker/2026-10-05 13-06-57 (B,R4,S2).tif': [WIKI_TRANSVERSE],
    'ladybug with helicon stacker/2026-10-05 13-11-13 (C,S2).tif': [WIKI_TRANSVERSE],
    # Fungus-eating ladybird (Illeis galbula)
    '20261003_130050PA030372 beetle 7stacked---.jpg': [WIKI_ILLEIS],
    # Sorus (fern spore cluster)
    '20261003_124918PA030245 under-leaf seeds 30stacked ---.jpg': [WIKI_SORUS],
    # Salvinia (floating fern)
    '20261003_125048PA030274 pond surface 20stacked---.jpg': [WIKI_SALVINIA],
    # Weimaraner
    '20261003_125415PA030322.jpg': [WIKI_WEIMARANER],
    '20261003_151422PA031400.jpg': [WIKI_WEIMARANER],
    '20261003_151446PA031402.jpg': [WIKI_WEIMARANER],
    # Western honey bee
    '20261003_125522PA030337.jpg': [WIKI_HONEY_BEE, WIKI_CITRUS],
    # Salvia
    '20261003_131549PA030682 flower 13stacked.jpg': [WIKI_SALVIA],
    # Gossamer-winged butterflies (Lycaenidae)
    '20261003_145115PA031180.jpg': [WIKI_LYCAENIDAE, WIKI_WESTRINGIA],
    '20261003_145119PA031181.jpg': [WIKI_LYCAENIDAE, WIKI_WESTRINGIA],
    '20261003_145124PA031182.jpg': [WIKI_LYCAENIDAE, WIKI_WESTRINGIA],
    # Shield bugs (Pentatomidae)
    '20261003_145404PA031210 eggs 16stacked.jpg': [WIKI_SHIELD_BUG],
    # Cicada
    '20261003_145832PA031304 cicada shell 36stacked.jpg': [WIKI_CICADA],
    # Brussels sprout
    'Sprout.jpg': [WIKI_BRUSSELS],
    # Moss
    '14092026_192938P9140110work and moss 20stacked.jpg': [WIKI_MOSS],
    '14092026_193312P9140182work and moss mass stack.jpg': [WIKI_MOSS],
    '14092026_193540P9140324work and moss 30 stack.jpg': [WIKI_MOSS],
    '14092026_194038P9140624work and moss messy 100stack.jpg': [WIKI_MOSS],
    '14092026_194042P9140652work and moss 50 stacked.jpg': [WIKI_MOSS],
    # Barnacle
    '19092026_123302P9190280 barnicles 1 10stacked ------.jpg': [WIKI_BARNACLE],
    '19092026_123346P9190370 barnicles 2 40stacked ----.jpg': [WIKI_BARNACLE],
    # Wood ear fungi (Auricularia)
    '26092026_093849P9260136 Boronia Park Reserve.jpg': [WIKI_WOOD_EAR],
    # Wandering trad (Tradescantia fluminensis)
    '26092026_100049P9260375 Boronia Park Reserve.jpg': [WIKI_TRAD],
    # Millipede
    '26092026_100456P9260521 Boronia Park Reserve.jpg': [WIKI_MILLIPEDE],
    '26092026_100510P9260527 Boronia Park Reserve.jpg': [WIKI_MILLIPEDE],
    '26092026_100517P9260528 Boronia Park Reserve.jpg': [WIKI_MILLIPEDE],
    # Garden snail (Cornu aspersum)
    '26092026_101723P9260730 Boronia Park Reserve snail shell 22stacked ---.jpg': [WIKI_GARDEN_SNAIL],
    '26092026_101803P9260821 Boronia Park Reserve snail shell 42stacked ---.jpg': [WIKI_GARDEN_SNAIL],
    # Cockroach
    '20260927_193046P9270030 cockroach 40stacked ---.jpg': [WIKI_COCKROACH],
    '20260927_193054P9270124_01 cockroach 26stacked ---.jpg': [WIKI_COCKROACH],
    '20260927_193129P9270185 cockroach 12stacked ---.jpg': [WIKI_COCKROACH],
    '20260927_193430P9270395_01 cockroack face 40stacked.jpg': [WIKI_COCKROACH],
    '20260927_193541P9270495 cockroach profile 60stacked ---.jpg': [WIKI_COCKROACH],
    # Australian white ibis
    '12092026_124523P9120095Sydney CBD - Copy.jpg': [WIKI_IBIS],
    '12092026_124543P9120101Sydney CBD - Copy.jpg': [WIKI_IBIS],
    '12092026_124552P9120107Sydney CBD - Copy.jpg': [WIKI_IBIS],
    '12092026_124612P9120113Sydney CBD - Copy.jpg': [WIKI_IBIS],
    # Koi
    '12092026_131505P9120257Sydney CBD - Copy.jpg': [WIKI_KOI],
    '12092026_131508P9120260Sydney CBD - Copy.jpg': [WIKI_KOI],
    '12092026_131554P9120269Sydney CBD - Copy.jpg': [WIKI_KOI],
    '12092026_131600P9120275Sydney CBD - Copy.jpg': [WIKI_KOI],
    # Australian water dragon
    '12092026_131947P9120308Sydney CBD 8stack.jpg': [WIKI_WATER_DRAGON],
    '12092026_132044P9120399_01Sydney CBD 8stack.jpg': [WIKI_WATER_DRAGON],
    '12092026_133616P9120781Sydney CBD - Copy.jpg': [WIKI_WATER_DRAGON],
    '12092026_133649P9120784Sydney CBD - Copy.jpg': [WIKI_WATER_DRAGON],
    '12092026_133656P9120786Sydney CBD - Copy.jpg': [WIKI_WATER_DRAGON],
    '12092026_134219P9120824Sydney CBD - Copy.jpg': [WIKI_WATER_DRAGON],
    # Sulphur-crested cockatoo
    '13092026_161532P9130004last dinosaurs mc-20.jpg': [WIKI_COCKATOO],
    '13092026_161823P9130015last dinosaurs mc-20.jpg': [WIKI_COCKATOO],
    '13092026_161904P9130019last dinosaurs mc-20.jpg': [WIKI_COCKATOO],
    '13092026_161919P9130022last dinosaurs mc-20.jpg': [WIKI_COCKATOO],
    '13092026_162048P9130026_01last dinosaurs mc-20.jpg': [WIKI_COCKATOO],
    '13092026_162051P9130028_02last dinosaurs mc-20.jpg': [WIKI_COCKATOO],
    '13092026_162216P9130030_02last dinosaurs mc-20.jpg': [WIKI_COCKATOO],
    '13092026_162221P9130031_02last dinosaurs mc-20.jpg': [WIKI_COCKATOO],
    '13092026_162230P9130034_02last dinosaurs mc-20.jpg': [WIKI_COCKATOO],
    '13092026_162239P9130036_02last dinosaurs mc-20.jpg': [WIKI_COCKATOO],
    '13092026_162341P9130040_02last dinosaurs mc-20.jpg': [WIKI_COCKATOO],
    '13092026_162344P9130042_02last dinosaurs mc-20.jpg': [WIKI_COCKATOO],
    '13092026_162406P9130043_02last dinosaurs mc-20.jpg': [WIKI_COCKATOO],
    '13092026_162433P9130044_02last dinosaurs mc-20.jpg': [WIKI_COCKATOO],
    '13092026_162437P9130045_02last dinosaurs mc-20.jpg': [WIKI_COCKATOO],
    '13092026_162454P9130047_02last dinosaurs mc-20.jpg': [WIKI_COCKATOO],
    '13092026_162459P9130048_02last dinosaurs mc-20.jpg': [WIKI_COCKATOO],
    '13092026_162516P9130049_02last dinosaurs mc-20.jpg': [WIKI_COCKATOO],
    '13092026_162523P9130052_02last dinosaurs mc-20.jpg': [WIKI_COCKATOO],
    '13092026_162533P9130054_02last dinosaurs mc-20.jpg': [WIKI_COCKATOO],
    '13092026_162544P9130056_02last dinosaurs mc-20.jpg': [WIKI_COCKATOO],
    # Mallow family (Malvaceae)
    '20260926_143832P9260094 flower 33stacked ---.jpg': [WIKI_MALLOW],
    '20260926_150310P9260463_01 flower 60stacked --- .jpg': [WIKI_MALLOW],
    # Pappus (seed parachutes)
    'STACK-DANDELION-ZS-PMax.jpg': [WIKI_PAPPUS],
    # Daisy family (Asteraceae)
    '20260929_173229P9290474 flowers 40stacked ---.jpg': [WIKI_DAISY],
    '20260930_165926P9300168 flowers at work 50stacked.jpg': [WIKI_DAISY],
    # Palm family (Arecaceae)
    '20261003_131054PA030526 berries 20stacked ---.jpg': [WIKI_PALM],
    # Lantana (Lantana camara)
    '15092026_170642P9150014_01 mickaels flowers 25stacked.jpg': [WIKI_LANTANA],
    '15092026_170801P9150100 mickaels flowers 25 stacked.jpg': [WIKI_LANTANA],
    # Flower wasps (Thynnidae): wingless female, identified 2026-10-05 from the
    # photographer's description (a dozen sitting alone on leaves, waiting)
    '2026-10-05 17-09-41 (A,R6,S2) fat ant.tif': [WIKI_THYNNID],
    '10102026_123313PA100668 4 butterfly 60stacked.tif': [WIKI_YELLOW_ADMIRAL],
    '10102026_123424PA100721 wingtip 60stacked.tif': [WIKI_YELLOW_ADMIRAL],
    '20261010_123624PA100900 butterfly hairy eye 76stacked.tif': [WIKI_YELLOW_ADMIRAL],
    '2026-10-05 19-00-38 (C,S2) female wasp.tif': [WIKI_THYNNID],
    # Grey-headed flying fox: every photo in the Tarban Creek section
    'bats at tarban creek/PA040150.JPG': [WIKI_FLYING_FOX],
    'bats at tarban creek/PA040164.JPG': [WIKI_FLYING_FOX],
    'bats at tarban creek/PA040165.JPG': [WIKI_FLYING_FOX],
    'bats at tarban creek/PA040173.JPG': [WIKI_FLYING_FOX],
    'bats at tarban creek/PA040174.JPG': [WIKI_FLYING_FOX],
    'bats at tarban creek/PA040175.JPG': [WIKI_FLYING_FOX],
    'bats at tarban creek/PA040176.JPG': [WIKI_FLYING_FOX],
    'bats at tarban creek/PA040179.JPG': [WIKI_FLYING_FOX],
    'bats at tarban creek/PA040181.JPG': [WIKI_FLYING_FOX],
    'bats at tarban creek/PA040185.JPG': [WIKI_FLYING_FOX],
    'bats at tarban creek/PA040187.JPG': [WIKI_FLYING_FOX],
    'bats at tarban creek/PA040190.JPG': [WIKI_FLYING_FOX],
    'bats at tarban creek/PA040191.JPG': [WIKI_FLYING_FOX],
    'bats at tarban creek/PA040193.JPG': [WIKI_FLYING_FOX],
    'bats at tarban creek/PA040195.JPG': [WIKI_FLYING_FOX],
    'bats at tarban creek/PA040199.JPG': [WIKI_FLYING_FOX],
    'bats at tarban creek/PA040206.JPG': [WIKI_FLYING_FOX],
    'bats at tarban creek/PA040215.JPG': [WIKI_FLYING_FOX],
    'bats at tarban creek/PA040219.JPG': [WIKI_FLYING_FOX],
    'bats at tarban creek/PA040230.JPG': [WIKI_FLYING_FOX],
    'bats at tarban creek/PA040245.JPG': [WIKI_FLYING_FOX],
    'bats at tarban creek/PA040271.JPG': [WIKI_FLYING_FOX],
    'bats at tarban creek/PA040274.JPG': [WIKI_FLYING_FOX],
    'bats at tarban creek/PA040275.JPG': [WIKI_FLYING_FOX],
    'bats at tarban creek/PA040276.JPG': [WIKI_FLYING_FOX],
    'bats at tarban creek/PA040277.JPG': [WIKI_FLYING_FOX],
    'bats at tarban creek/PA040282.JPG': [WIKI_FLYING_FOX],
    'bats at tarban creek/PA040285.JPG': [WIKI_FLYING_FOX],
    'bats at tarban creek/PA040287.JPG': [WIKI_FLYING_FOX],
}

SAMPLE_EXTRA = {
    "STACK-2-Spider.jpg": "STACK-P9040321.jpg",
    "STACK-DANDELION-ZS-PMax.jpg": "STACK-DANDELIONP9040361_01.jpg",
    "Grub Stack PMax.jpg": "Grub Single Sample.jpg",
    # Helicon TIFF keeps its own EXIF, so no SOURCE_MAP entry to pair through
    "2026-10-05 14-02-40 (B,R4,S2) 10stacked.tif": "20261005_122952PA050032_01 - baby spiders.jpg",
}
# A stack can have more than one example slice; these are the extras, shown
# after the primary one above.
SAMPLE_MORE = {
    "12092026_081712P9120052wasp stack.jpg": ["12092026_081712P9120050wasp.jpg"],
}

# Border geometry, mirrored from exifborder.Geometry (side margin and bottom
# band as fractions of the photo's long edge; the photo is pasted at
# (side, side)). Used to work out where the photo sits inside a bordered image.
BORDER_SIDE_FRAC = 0.030
BORDER_BOTTOM_FRAC = 0.102

def medium_frame(medium_path, bordered):
    """[x, y, w, h] (fractions of the medium image) of the photo area inside
    its baked-in border -- [0, 0, 1, 1] for the few mediums with no border."""
    if not bordered:
        return [0, 0, 1, 1]
    with Image.open(medium_path) as im:
        bw, bh = im.size
    for w in range(bw - 2, 0, -1):            # landscape / square: long edge is the width
        side = round(w * BORDER_SIDE_FRAC)
        if w + 2 * side == bw:
            h = bh - side - round(w * BORDER_BOTTOM_FRAC)
            if 0 < h <= w:
                return [side / bw, side / bh, w / bw, h / bh]
    for h in range(bh - 2, 0, -1):            # portrait: long edge is the height
        side = round(h * BORDER_SIDE_FRAC)
        if side + h + round(h * BORDER_BOTTOM_FRAC) == bh:
            w = bw - 2 * side
            if 0 < w < h:
                return [side / bw, side / bh, w / bw, h / bh]
    print(f"  ! could not work out the border layout of {medium_path}")
    return [0, 0, 1, 1]

def image_size(path):
    with Image.open(path) as im:
        return list(im.size)

def load_crop_state():
    """Which crop each medium/thumbnail currently shows (written by apply_crops.py)."""
    path = os.path.join(PHOTOS, "images", "crop_state.json")
    if os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    return {}

def link_samples(items):
    """Tag each stack with `samples` (a list) and each of its slices with
    `sample_of` -- all hold original_filenames. The site hides slices from the
    grids and reaches them through their stack's lightbox instead."""
    by_name = {i["original_filename"]: i for i in items}
    pairs = {stack: [slice_name] for stack, slice_name in SAMPLE_EXTRA.items()}
    for stack, src in SOURCE_MAP.items():
        slice_name = os.path.basename(src)
        if (stack in by_name and slice_name in by_name
                and by_name[slice_name]["title"].endswith("Example Slice")):
            pairs[stack] = [slice_name]
    for stack, more in SAMPLE_MORE.items():
        pairs.setdefault(stack, []).extend(more)
    for stack, slice_names in pairs.items():
        linked = [n for n in slice_names if stack in by_name and n in by_name]
        if not linked:
            continue
        by_name[stack]["samples"] = linked
        for n in linked:
            by_name[n]["sample_of"] = stack
    return [i["original_filename"] for i in items
            if i["title"].endswith("Example Slice") and "sample_of" not in i]

def main():
    with open(os.path.join(PHOTOS, "manifest.tsv"), encoding="utf-8") as f:
        lines = [l.rstrip("\n") for l in f if l.strip()]

    items = []
    unresolved_report = []
    crop_state = load_crop_state()

    for line in lines:
        slug, original = line.split("\t")
        own_path = os.path.join(EXPORTS, original)
        settings = get_settings(own_path)
        if settings is None and original in SOURCE_MAP:
            settings = get_settings(SOURCE_MAP[original])
        if settings is None and original in FALLBACK_SETTINGS:
            settings = dict(FALLBACK_SETTINGS[original])
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
            # original photo size, the crop the medium shows (null = whole
            # frame) and where the photo sits inside the medium's border --
            # the lightbox needs these to highlight a detail on hover.
            "size": image_size(os.path.join(PHOTOS, "images", "full", f"{slug}.jpg")),
            "medium_crop": crop_state.get(original, {}).get("medium"),
            "medium_frame": medium_frame(os.path.join(PHOTOS, "images", "medium", f"{slug}.jpg"), settings is not None),
        })
        if original in WIKI_LINKS:
            items[-1]["links"] = [{"label": label, "url": url} for label, url in WIKI_LINKS[original]]

    # sort by datetime when available (with manual overrides), falling back to filename
    def sort_key(item):
        original = item["original_filename"]
        dt = SORT_OVERRIDE.get(original) or (item["settings"]["datetime"] if item["settings"] else None)
        return (dt is None, dt or item["thumb"])
    items.sort(key=sort_key)

    unpaired_slices = link_samples(items)

    with open(os.path.join(PHOTOS, "images.json"), "w", encoding="utf-8") as f:
        json.dump(items, f, indent=2)

    # New photo list -> new cache version, so visitors pick it up.
    import bump_version
    bump_version.bump()

    print(f"Wrote {len(items)} items")
    print(f"Example slices with no stack to hang off (will show in the grid): {unpaired_slices}")
    from collections import Counter
    cats = Counter((i["category"], i["subcategory"]) for i in items)
    for k, v in sorted(cats.items(), key=lambda x: -x[1]):
        print(f"  {k}: {v}")
    print(f"Unresolved settings (no source found): {unresolved_report}")
    no_settings = [i["original_filename"] for i in items if i["settings"] is None]
    print(f"Total with no settings at all: {len(no_settings)} -> {no_settings}")

if __name__ == "__main__":
    main()
