from flask import Flask, render_template, abort
import pymongo

app = Flask(__name__)
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["eventDB"]
users = db["users"]

@app.route("/certificate/<apaar_id>/<cert_id>")
def certificate_page(apaar_id, cert_id):
    user = users.find_one({"apaarID": apaar_id})
    if not user:
        abort(404)
    
    cert = next((c for c in user.get("certificates", []) if c["certificateId"] == cert_id), None)
    if not cert:
        abort(404)

    import hashlib
    import datetime
    signature_text = f"Verified by EventDB | Sign Date: {datetime.datetime.now().strftime('%d-%m-%Y')}"
    hash_input = f"{user['apaarID']}-{cert['certificateId']}-{datetime.datetime.now().strftime('%d-%m-%Y')}"
    signature_hash = hashlib.sha256(hash_input.encode()).hexdigest()[:10]
    signature_full = f"{signature_text} | ID: {signature_hash}"

    return render_template("certificate.html", user=user, cert=cert, signature=signature_full)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
