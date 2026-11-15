"""Build store products from the three Wood State catalogue PDFs.

Writes photos to backend_new/public/catalog/ and product rows to
backend_new/database/data/catalog-products.json.

Sofa selling prices and 3+2 vs L-shape labels are read from the printed
price block. Dining tables and the luxury sofa book have no prices, so
those selling prices are assigned here.
"""

from __future__ import annotations

import json
import os
from collections import defaultdict

import pymupdf
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ATTACH = os.environ.get(
    "CATALOG_PDF_DIR",
    r"c:\Users\PC\.cursor\projects\c-Users-PC-Desktop-New-folder-furniture-furniture\attachments\ef9289c1-d470-4c4a-ba02-a9787069fc98",
)
PUBLIC = os.path.join(ROOT, "backend_new", "public", "catalog")
DATA = os.path.join(ROOT, "backend_new", "database", "data", "catalog-products.json")

# Exemplar pages whose net-price line was read by eye.
SOFA_PRICE_BY_PAGE = {
    2: 35000,
    4: 35000,
    23: 37500,
    42: 40000,
    54: 42500,
    60: 45000,
    68: 47500,
    71: 50000,
    72: 42000,
    99: 48000,
}


def save_jpeg(pix: pymupdf.Pixmap, path: str, max_w: int = 1100, quality: int = 76) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    image = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    if image.width > max_w:
        height = int(image.height * max_w / image.width)
        image = image.resize((max_w, height), Image.Resampling.LANCZOS)
    image.save(path, "JPEG", quality=quality, optimize=True)


def color_name(image: Image.Image) -> str:
    small = image.resize((48, 32), Image.Resampling.BOX)
    buckets: dict[str, int] = defaultdict(int)
    for r, g, b in small.getdata():
        high, low = max(r, g, b), min(r, g, b)
        if high < 45 or low > 215:
            continue
        if high - low < 18:
            buckets["ivory" if high > 165 else "grey" if high > 105 else "charcoal"] += 1
            continue
        if r > 100 and g > 50 and b < 55 and g > b + 25:
            buckets["mustard"] += 1
        elif r > 140 and g < 90 and b < 90:
            buckets["burgundy"] += 1
        elif r > 150 and g > 90 and b < 90:
            buckets["cognac"] += 1
        elif g > 80 and b > r + 12 and b >= g - 10:
            buckets["teal"] += 1
        elif b > r + 25 and b > 90:
            buckets["navy"] += 1
        elif g > r + 12 and g > b and g > 70:
            buckets["emerald"] += 1
        elif r > 110 and b > 90 and g < r - 10 and b > g:
            buckets["plum"] += 1
        elif r > g > b and r > 110:
            buckets["walnut"] += 1
        else:
            buckets["stone"] += 1
    return max(buckets, key=buckets.get) if buckets else "neutral"


def tone_phrase(tone: str) -> str:
    return {
        "ivory": "an ivory upholstery",
        "cream": "a cream upholstery",
        "grey": "a grey upholstery",
        "walnut": "a warm wood-and-fabric finish",
        "cognac": "a honey-toned finish",
        "charcoal": "a charcoal upholstery",
        "mustard": "a mustard velvet upholstery",
        "stone": "a neutral stone-coloured upholstery",
        "neutral": "a neutral upholstery",
        "navy": "a navy upholstery",
        "teal": "a teal upholstery",
        "emerald": "an emerald velvet upholstery",
        "plum": "a plum velvet upholstery",
        "burgundy": "a burgundy upholstery",
    }.get(tone, "a tailored upholstery")


def line_signature(image: Image.Image) -> bytes:
    gray = image.convert("L").resize((120, 24), Image.Resampling.BOX)
    return bytes(1 if pixel < 150 else 0 for pixel in gray.getdata())


def price_block_rows(page: pymupdf.Page) -> list[Image.Image]:
    pix = page.get_pixmap(matrix=pymupdf.Matrix(2.2, 2.2), clip=pymupdf.Rect(28, 545, 210, 760), alpha=False)
    image = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    pixels = image.load()
    rows: list[tuple[int, int]] = []
    in_run = False
    start = 0
    for y in range(image.height):
        ink = 0
        for x in range(0, image.width, 2):
            r, g, b = pixels[x, y]
            if r < 80 and g < 80 and b < 80:
                ink += 1
        hit = ink > 8
        if hit and not in_run:
            start = y
            in_run = True
        elif not hit and in_run:
            if y - start > 10:
                rows.append((start, y))
            in_run = False
    if in_run and image.height - start > 10:
        rows.append((start, image.height))
    return [image.crop((0, top, image.width, bottom)) for top, bottom in rows]


def sofa_number(page_number: int) -> int:
    """PDF page -> printed SOFA number. SOFA 41 is not in the book."""
    if page_number <= 41:
        return page_number - 1
    return page_number


def dining_products(doc: pymupdf.Document) -> list[dict]:
    products = []
    out_dir = os.path.join(PUBLIC, "dining")
    for page in doc:
        codes = []
        for block in page.get_text("dict")["blocks"]:
            if block.get("type") != 0:
                continue
            for line in block["lines"]:
                text = "".join(span["text"] for span in line["spans"]).strip().replace(" ", "").upper()
                if text.startswith("WSDT") and text[4:].isdigit():
                    codes.append((line["bbox"][1], text))
        images = []
        for info in page.get_image_info():
            width = info["bbox"][2] - info["bbox"][0]
            height = info["bbox"][3] - info["bbox"][1]
            if info.get("cs-name") == "DeviceGray" or width < 180 or height < 140:
                continue
            images.append(info)
        codes.sort(key=lambda item: item[0])
        images.sort(key=lambda info: info["bbox"][1])
        if len(codes) != len(images):
            if codes:
                raise SystemExit(f"Dining page {page.number + 1}: {len(codes)} codes, {len(images)} photos")
            continue
        for (_, code), info in zip(codes, images):
            number = int(code.replace("WSDT", ""))
            pix = page.get_pixmap(matrix=pymupdf.Matrix(1.35, 1.35), clip=pymupdf.Rect(info["bbox"]), alpha=False)
            filename = f"wsdt-{number:02d}.jpg"
            path = os.path.join(out_dir, filename)
            save_jpeg(pix, path)
            tone = color_name(Image.open(path))
            # Selling prices step through a luxury-dining band. The PDF has no prices.
            price = [42900, 46900, 49900, 54900, 58900, 62900, 66900, 71900][number % 8]
            original = [78000, 85000, 92000, 99000, 108000, 115000, 122000, 132000][number % 8]
            offer = round((1 - price / original) * 100)
            top = {
                "ivory": "a pale stone top",
                "grey": "a grey marble-look top",
                "walnut": "a warm wood-grain top",
                "cognac": "a honey wood top",
                "charcoal": "a dark polished top",
                "mustard": "a golden stone top",
                "stone": "a polished stone top",
                "neutral": "a polished top",
                "cream": "a cream stone top",
            }.get(tone, "a polished stone or wood top")
            products.append(
                {
                    "sku": code,
                    "name": f"Shreejee Blessings Wood Luxury Dining Set {code}",
                    "price": price,
                    "original_price": original,
                    "category": "dining-table-sets",
                    "subcategory": "Luxury Dining Sets",
                    "image": f"/catalog/dining/{filename}",
                    "rating": round(4.4 + (number % 5) * 0.1, 1),
                    "reviews": 6 + (number % 19),
                    "in_stock": True,
                    "is_featured": number <= 6,
                    "hot_offer": number % 3 == 0,
                    "offer_percentage": offer,
                    "description": (
                        f"Model {code} from our luxury dining catalogue. The set pairs {top} with "
                        f"upholstered dining chairs and a solid base made for everyday family meals. "
                        f"Seat count, table length, and finish can be adjusted at our Delhi workshop "
                        f"before delivery across India."
                    ),
                }
            )
    return products


def sofa_products(doc: pymupdf.Document) -> list[dict]:
    price_of_signature: dict[bytes, int] = {}
    shape_of_signature: dict[bytes, str] = {}
    for page_number, price in SOFA_PRICE_BY_PAGE.items():
        rows = price_block_rows(doc[page_number - 1])
        if len(rows) < 4:
            raise SystemExit(f"Price block on sofa page {page_number} has {len(rows)} lines")
        price_of_signature[line_signature(rows[1])] = price
    for page_number, shape in ((2, "3+2"), (72, "l-shape")):
        rows = price_block_rows(doc[page_number - 1])
        shape_of_signature[line_signature(rows[3])] = shape

    products = []
    out_dir = os.path.join(PUBLIC, "sofas")
    for page_index in range(1, 100):
        page = doc[page_index]
        page_number = page_index + 1
        number = sofa_number(page_number)
        rows = price_block_rows(page)
        if len(rows) < 4:
            raise SystemExit(f"Sofa page {page_number} price block has {len(rows)} lines")
        price_key = line_signature(rows[1])
        shape_key = line_signature(rows[3])
        if price_key not in price_of_signature:
            raise SystemExit(f"Unrecognised price line on sofa page {page_number}")
        if shape_key not in shape_of_signature:
            raise SystemExit(f"Unrecognised shape line on sofa page {page_number}")
        price = price_of_signature[price_key]
        shape = shape_of_signature[shape_key]
        original = price * 2
        pix = page.get_pixmap(matrix=pymupdf.Matrix(2, 2), clip=pymupdf.Rect(48, 158, 392, 348), alpha=False)
        filename = f"sofa-{number:03d}.jpg"
        path = os.path.join(out_dir, filename)
        save_jpeg(pix, path)
        tone = color_name(Image.open(path))
        if shape == "l-shape":
            subcategory = "L-Shaped Sofas"
            kind = "L-shaped sofa"
            detail = (
                f"L-shaped seating with {tone_phrase(tone)}, loose cushions, and a layout that turns a corner "
                f"of the living room. The catalogue net price is ₹{price:,} for the set, half the marked price."
            )
        else:
            subcategory = "3+2 Sofa Sets"
            kind = "3+2 seater sofa set"
            detail = (
                f"Customisable 3+2 seater set with {tone_phrase(tone)}. The catalogue net price is ₹{price:,} "
                f"for the full set, which is 50% off the marked price of ₹{original:,}."
            )
        products.append(
            {
                "sku": f"SOFA-{number:03d}",
                "name": f"Shreejee Blessings Wood Sofa {number:03d}",
                "price": price,
                "original_price": original,
                "category": "sofa-sets",
                "subcategory": subcategory,
                "image": f"/catalog/sofas/{filename}",
                "rating": round(4.5 + (number % 4) * 0.1, 1),
                "reviews": 10 + (number % 24),
                "in_stock": True,
                "is_featured": number <= 6,
                "hot_offer": True,
                "offer_percentage": 50,
                "description": (
                    f"Sofa {number:03d} from our sofa catalogue, a {kind}. {detail} "
                    f"Fabric, leg finish, and exact size can be changed at our Delhi workshop."
                ),
            }
        )
    return products


def luxury_sofa_products(doc: pymupdf.Document) -> list[dict]:
    products = []
    out_dir = os.path.join(PUBLIC, "luxury-sofas")
    prices = [54900, 58900, 62900, 66900, 71900, 76900, 82900, 88900]
    originals = [98000, 105000, 112000, 120000, 128000, 138000, 148000, 160000]
    for index, page in enumerate(doc, start=1):
        photos = [
            info
            for info in page.get_image_info()
            if info.get("cs-name") != "DeviceGray"
            and (info["bbox"][2] - info["bbox"][0]) > 200
        ]
        if not photos:
            raise SystemExit(f"Luxury sofa page {index} has no photo")
        info = max(photos, key=lambda item: (item["bbox"][2] - item["bbox"][0]) * (item["bbox"][3] - item["bbox"][1]))
        pix = page.get_pixmap(matrix=pymupdf.Matrix(1.6, 1.6), clip=pymupdf.Rect(info["bbox"]), alpha=False)
        filename = f"lux-{index:02d}.jpg"
        path = os.path.join(out_dir, filename)
        save_jpeg(pix, path, max_w=1200, quality=74)
        tone = color_name(Image.open(path))
        price = prices[(index - 1) % len(prices)]
        original = originals[(index - 1) % len(originals)]
        wide = pix.width > pix.height * 1.35
        if wide:
            subcategory = "L-Shaped Sofas"
            kind = "wide luxury sofa, often an L-shape or long three-seater"
        else:
            subcategory = "Luxury Sofa Sets"
            kind = "luxury sofa set dressed as a full living-room arrangement"
        products.append(
            {
                "sku": f"LUX-SOFA-{index:02d}",
                "name": f"Shreejee Blessings Wood Luxury Sofa {index:02d}",
                "price": price,
                "original_price": original,
                "category": "sofa-sets",
                "subcategory": subcategory,
                "image": f"/catalog/luxury-sofas/{filename}",
                "rating": round(4.6 + (index % 3) * 0.1, 1),
                "reviews": 4 + (index % 11),
                "in_stock": True,
                "is_featured": index <= 4,
                "hot_offer": index % 2 == 0,
                "offer_percentage": round((1 - price / original) * 100),
                "description": (
                    f"Luxury sofa {index:02d}, photographed as a finished room setting. "
                    f"It is a {kind} in {tone_phrase(tone)}. "
                    f"Upholstery, cushion fill, and the exact 3+2 or sectional layout can be made to order "
                    f"at our Delhi workshop, with delivery across India."
                ),
            }
        )
    return products


def main() -> None:
    dining = pymupdf.open(os.path.join(ATTACH, "LUXURY_DINING_TABLE.pdf"))
    sofas = pymupdf.open(os.path.join(ATTACH, "wood_state_sofa_catalog.pdf"))
    luxury = pymupdf.open(os.path.join(ATTACH, "Wood_State_Luaxry_Sofa.pdf"))
    products = dining_products(dining) + sofa_products(sofas) + luxury_sofa_products(luxury)
    dining.close()
    sofas.close()
    luxury.close()
    skus = [item["sku"] for item in products]
    if len(skus) != len(set(skus)):
        raise SystemExit("Duplicate SKUs")
    os.makedirs(os.path.dirname(DATA), exist_ok=True)
    with open(DATA, "w", encoding="utf-8") as handle:
        json.dump(products, handle, indent=2, ensure_ascii=False)
        handle.write("\n")
    print(f"products {len(products)} -> {DATA}")


if __name__ == "__main__":
    main()
