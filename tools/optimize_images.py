"""
Kompres & resize foto portofolio / produk sebelum di-upload.

Pakai:
    python3 tools/optimize_images.py

- Mengecilkan foto di assets/img/portfolio dan assets/img/products
  ke lebar/tinggi maksimal 1600px, kualitas JPG 80, dan menghapus data EXIF.
- Otomatis memutar foto sesuai orientasi kamera HP.
- File .png/.webp/.jpeg/.heic (jika didukung) dikonversi menjadi .jpg.
- Foto asli disimpan di folder _original/ (aman, tidak hilang).
Butuh: pip install pillow
"""
from pathlib import Path
import shutil

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
FOLDERS = [ROOT / "assets/img/portfolio", ROOT / "assets/img/products"]
MAX = 1600
QUALITY = 80
EXTS = {".jpg", ".jpeg", ".png", ".webp", ".heic"}


def optimize(path: Path) -> None:
    backup_dir = path.parent / "_original"
    backup_dir.mkdir(exist_ok=True)
    backup = backup_dir / path.name
    if not backup.exists():
        shutil.copy2(path, backup)

    before = path.stat().st_size
    with Image.open(backup) as im:
        im = ImageOps.exif_transpose(im)
        im.thumbnail((MAX, MAX), getattr(Image, "Resampling", Image).LANCZOS)
        if im.mode in ("RGBA", "P", "LA"):
            bg = Image.new("RGB", im.size, (13, 11, 12))
            bg.paste(im.convert("RGBA"), mask=im.convert("RGBA").split()[-1])
            im = bg
        out = path.with_suffix(".jpg")
        im.convert("RGB").save(out, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    if out != path:
        path.unlink()
    after = out.stat().st_size
    print(f"  {out.name:28s} {before/1024:8.0f} KB -> {after/1024:6.0f} KB")


def main() -> None:
    for folder in FOLDERS:
        files = [f for f in sorted(folder.iterdir()) if f.suffix.lower() in EXTS and f.is_file()]
        print(f"{folder.relative_to(ROOT)}  ({len(files)} file)")
        for f in files:
            try:
                optimize(f)
            except Exception as e:  # noqa: BLE001
                print(f"  ! gagal {f.name}: {e}")
    print("Selesai. Pastikan nama file di assets/js/data.js berakhiran .jpg")


if __name__ == "__main__":
    main()
