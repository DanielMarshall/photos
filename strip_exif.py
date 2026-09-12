import os
import sys
import piexif

folder = sys.argv[1]
stripped = 0
errors = []

for name in os.listdir(folder):
    if not name.lower().endswith(".jpg"):
        continue
    path = os.path.join(folder, name)
    try:
        piexif.remove(path)
        stripped += 1
    except Exception as e:
        errors.append((name, str(e)))

print(f"Stripped EXIF from {stripped} files")
if errors:
    print(f"{len(errors)} files had no EXIF or errored:")
    for name, err in errors[:20]:
        print(f"  {name}: {err}")
