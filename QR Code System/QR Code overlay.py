import qrcode
import pymongo
import fitz
from io import BytesIO
import requests
import os
from datetime import datetime
import hashlib

# Output folder
output_folder = "output_pdfs"
os.makedirs(output_folder, exist_ok=True)

# MongoDB connection
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["eventDB"]
users = db["users"]

# TrueType font for bold+italic signature
font_path = "arialbi.ttf"  # Place the TTF file in your project folder

# Fetch user
user = users.find_one({"apaarID": "APAAR002"})
if not user:
    raise Exception("User not found")

for cert in user.get("certificates", []):
    if "fileUrl" not in cert:
        print(f"❌ PDF URL not found for {cert['certificateId']}")
        continue

    # Fetch PDF from Google Drive direct link
    pdf_url = cert["fileUrl"]
    response = requests.get(pdf_url)
    if response.status_code != 200:
        print(f"❌ Could not fetch PDF for {cert['certificateId']}")
        continue
    pdf_bytes = response.content

    # --- Generate QR code pointing to Flask page ---
    qr_url = f"http://192.168.1.5:5000/certificate/{user['apaarID']}/{cert['certificateId']}"
    qr = qrcode.QRCode(
        version=2,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=3,
        border=2
    )
    qr.add_data(qr_url)
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="black", back_color="white")

    qr_bytes = BytesIO()
    qr_img.save(qr_bytes, format="PNG")
    qr_bytes.seek(0)

    # --- Open PDF ---
    doc = fitz.open("pdf", pdf_bytes)
    page = doc[0]

    # --- Insert QR code bottom-left ---
    qr_width = 120
    qr_height = 120
    rect_qr = fitz.Rect(30, page.rect.height - qr_height - 30,
                        30 + qr_width, page.rect.height - 30)
    page.insert_image(rect_qr, stream=qr_bytes.read())

    # --- Add signature bottom-right using insert_textbox ---
    signature_text = f"Verified by EventDB | Sign Date: {datetime.now().strftime('%d-%m-%Y')}"
    hash_input = f"{user['apaarID']}-{cert['certificateId']}-{datetime.now().strftime('%d-%m-%Y')}"
    signature_hash = hashlib.sha256(hash_input.encode()).hexdigest()[:10]
    signature_full = f"{signature_text} | ID: {signature_hash}"

    # Rectangle for bottom-right corner (adjust width as needed)
    rect_signature = fitz.Rect(page.rect.width - 350, page.rect.height - 50,
                               page.rect.width - 30, page.rect.height - 10)

    page.insert_textbox(
        rect_signature,
        signature_full,
        fontfile=font_path,
        fontsize=10,
        color=(0, 0, 0),
        align=1  # right-aligned
    )

    # --- Save PDF ---
    output_file = os.path.join(output_folder, f"{cert['certificateId']}_withQR.pdf")
    doc.save(output_file)
    doc.close()

    print(f"✅ QR code + signature added to {output_file}")


