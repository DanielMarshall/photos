import piexif, os, sys

folder = sys.argv[1]
samples = sys.argv[2:] if len(sys.argv) > 2 else None

def summarize(path):
    try:
        exif = piexif.load(path)
        ex = exif.get("Exif", {})
        z = exif.get("0th", {})
        def g(ifd, tag):
            return ifd.get(tag)
        aperture = g(ex, piexif.ExifIFD.FNumber)
        shutter = g(ex, piexif.ExifIFD.ExposureTime)
        iso = g(ex, piexif.ExifIFD.ISOSpeedRatings)
        focal = g(ex, piexif.ExifIFD.FocalLength)
        lens = g(ex, piexif.ExifIFD.LensModel)
        model = g(z, piexif.ImageIFD.Model)
        dt = g(ex, piexif.ExifIFD.DateTimeOriginal)
        has_any = any([aperture, shutter, iso, focal, lens, model, dt])
        return has_any, dict(aperture=aperture, shutter=shutter, iso=iso, focal=focal, lens=lens, model=model, dt=dt)
    except Exception as e:
        return False, str(e)

names = samples if samples else sorted(os.listdir(folder))
for name in names:
    if not name.lower().endswith(".jpg"):
        continue
    path = os.path.join(folder, name)
    has_any, info = summarize(path)
    print(name, "HAS_SETTINGS" if has_any else "NO_SETTINGS", info)
