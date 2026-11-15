"""Extract Wood State office-furniture catalogue photos, codes, and printed prices."""

from __future__ import annotations

import json
import os
import re

import pymupdf
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PDF = os.environ.get(
    "OFFICE_PDF",
    r"c:\Users\PC\.cursor\projects\c-Users-PC-Desktop-New-folder-furniture-furniture\attachments\ef9289c1-d470-4c4a-ba02-a9787069fc98\WSE_office-compressed.pdf",
)
OUT_DIR = os.path.join(ROOT, "backend_new", "public", "catalog", "office")
DATA = os.path.join(ROOT, "backend_new", "database", "data", "office-products.json")


def lines_of(page: pymupdf.Page) -> list[dict]:
    rows = []
    for block in page.get_text("dict")["blocks"]:
        if block.get("type") != 0:
            continue
        for line in block["lines"]:
            parts = []
            for span in line["spans"]:
                text = span["text"].strip()
                if text:
                    parts.append((span["bbox"][0], text))
            if not parts:
                continue
            rows.append(
                {
                    "x": line["bbox"][0],
                    "y": line["bbox"][1],
                    "text": " ".join(text for _, text in parts),
                    "parts": parts,
                }
            )
    return rows


def codes_of(lines: list[dict]) -> list[tuple[float, float, str]]:
    found = []
    for line in lines:
        index = 0
        parts = line["parts"]
        while index < len(parts):
            token = parts[index][1].replace(" ", "").upper()
            origin = parts[index][0]
            if token == "WS" or re.fullmatch(r"WS\d+[A-Z]?", token):
                code = token
                if code == "WS" and index + 1 < len(parts) and re.fullmatch(
                    r"\d+[A-Z]?", parts[index + 1][1].replace(" ", "").upper()
                ):
                    code = "WS" + parts[index + 1][1].replace(" ", "").upper()
                    index += 1
                    if (
                        index + 1 < len(parts)
                        and parts[index + 1][1].upper() == "N"
                        and parts[index + 1][0] - parts[index][0] < 40
                    ):
                        code += "N"
                        index += 1
                if re.fullmatch(r"WS\d+[A-Z]?", code):
                    found.append((origin, line["y"], code))
            index += 1
    return found


def subcategory_for(description: str) -> str:
    text = description.lower()
    if any(word in text for word in ("desk", "workstation", "credenza")):
        return "Executive Desks"
    if "table" in text:
        return "Office Tables"
    if "visitor" in text:
        return "Visitor Chairs"
    if "sofa" in text or "lounge" in text:
        return "Office Sofas"
    return "Office Chairs"


def title_for(code: str, description: str) -> str:
    lead = description.split("  ")[0].strip(" ,.-")
    lead = re.sub(r"\s+", " ", lead)[:48].strip()
    if not lead:
        lead = "Office chair"
    return f"Shreejee Blessings Wood {lead} {code}"[:180]


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    document = pymupdf.open(PDF)
    products = []
    used_codes: dict[str, int] = {}
    serial = 0
    for page_index, page in enumerate(document):
        if page_index == 0 or page_index == document.page_count - 1:
            continue
        lines = lines_of(page)
        codes = codes_of(lines)
        photos = []
        for info in page.get_image_info():
            box = info["bbox"]
            if box[2] - box[0] > 50 and box[3] - box[1] > 50:
                photos.append(box)
        photos.sort(key=lambda box: (box[1], box[0]))
        for box in photos:
            x0, y0, x1, y1 = box
            price = None
            for line in lines:
                match = re.search(r"Unit Price\s*(\d+)", line["text"])
                if match and abs(line["y"] - y0) < 45 and x0 - 10 < line["x"] < x1 + 40:
                    price = int(match.group(1))
                    break
            if price is None:
                nearest = None
                distance = 10**9
                for line in lines:
                    match = re.search(r"Unit Price\s*(\d+)", line["text"])
                    if not match or "Per Piece" in line["text"]:
                        continue
                    gap = abs(line["y"] - y0) + abs(line["x"] - x1)
                    if gap < distance and abs(line["y"] - y0) < 80:
                        distance = gap
                        nearest = int(match.group(1))
                price = nearest
            if not price:
                continue
            code = None
            best = 10**9
            for origin, code_y, candidate in codes:
                if y0 - 70 <= code_y <= y0 + 12 and x0 - 70 <= origin <= x1 + 40:
                    score = abs(origin - x0) + abs(code_y - (y0 - 16)) * 2
                    if score < best:
                        best = score
                        code = candidate
            serial += 1
            if not code:
                code = f"WSOFF{serial:03d}"
            used_codes[code] = used_codes.get(code, 0) + 1
            sku = code if used_codes[code] == 1 else f"{code}-{used_codes[code]}"
            description_parts = []
            for line in lines:
                if (
                    y0 + 55 < line["y"] < y1 + 12
                    and x0 - 15 < line["x"] < x1 + 30
                    and "Unit Price" not in line["text"]
                    and "Packing" not in line["text"]
                    and not line["text"].upper().startswith("WS")
                ):
                    description_parts.append(line["text"])
            detail = re.sub(r"\s+", " ", " ".join(description_parts)).strip(" ,.")
            if len(detail) < 8:
                detail = "Office seating from our workshop catalogue"
            original = int(round(price * 1.4 / 100.0) * 100)
            if original <= price:
                original = price + 1000
            clip = pymupdf.Rect(box)
            pixmap = page.get_pixmap(matrix=pymupdf.Matrix(2, 2), clip=clip, alpha=False)
            image = Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples)
            filename = f"{sku.lower()}.jpg"
            image.save(os.path.join(OUT_DIR, filename), "JPEG", quality=76, optimize=True)
            products.append(
                {
                    "sku": sku,
                    "name": title_for(sku, detail),
                    "price": price,
                    "original_price": original,
                    "category": "office",
                    "subcategory": subcategory_for(detail),
                    "image": f"/catalog/office/{filename}",
                    "rating": 4.6,
                    "reviews": 0,
                    "in_stock": True,
                    "is_featured": serial <= 8,
                    "hot_offer": True,
                    "offer_percentage": round((1 - price / original) * 100),
                    "description": (
                        f"Model {sku}. {detail}. "
                        f"Printed catalogue unit price is ₹{price:,}. "
                        f"Finish and upholstery can be adjusted at our Delhi workshop."
                    ),
                }
            )
    document.close()
    os.makedirs(os.path.dirname(DATA), exist_ok=True)
    with open(DATA, "w", encoding="utf-8") as handle:
        json.dump(products, handle, indent=2, ensure_ascii=False)
        handle.write("\n")
    print(f"office products {len(products)} -> {DATA}")


if __name__ == "__main__":
    main()
