import os
import sqlite3
from datetime import UTC, datetime
from pathlib import Path
from uuid import uuid4

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename


BASE_DIR = Path(__file__).resolve().parent
DB_PATH = Path(os.environ.get("DATABASE_URL", BASE_DIR / "rxpharmacy.db"))
UPLOAD_DIR = Path(os.environ.get("UPLOAD_DIR", BASE_DIR / "uploads"))
MAX_UPLOAD_MB = int(os.environ.get("MAX_UPLOAD_MB", "8"))
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "pdf", "webp"}


app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = MAX_UPLOAD_MB * 1024 * 1024
CORS(app)


CATEGORIES = [
    (1, "Vitamins & Supplements"),
    (2, "Diabetes Care"),
    (3, "Skin Care"),
    (4, "Cold & Allergy"),
    (5, "Pain Relief"),
    (6, "Heart Care"),
    (7, "Antibiotics"),
    (8, "Digestive Health"),
    (9, "Eye Care"),
    (10, "Ayurvedic"),
    (11, "Baby Care"),
    (12, "Women Care"),
    (13, "Men Care"),
    (14, "Mental Wellness"),
    (15, "Bone & Joint"),
]


SEED_PRODUCTS = [
    ("Dolo 650 Tablet", "Micro Labs", 4, 32.50, 140, 0, "Paracetamol 650mg", "Relieves fever and mild to moderate pain.", "Nausea, allergic rash, liver injury on overdose.", "Take after food as directed by a doctor.", "Avoid alcohol and overdose.", "Store below 30C."),
    ("Crocin Advance 500mg", "GSK", 4, 20.00, 180, 0, "Paracetamol 500mg", "Used for fever, headache, and body ache.", "Usually mild; rare allergy.", "Use the lowest effective dose.", "Consult doctor in liver disease.", "Store in a cool dry place."),
    ("Calpol 500 Tablet", "GSK", 4, 18.75, 95, 0, "Paracetamol 500mg", "Fever and pain relief.", "Nausea or stomach discomfort.", "Follow label or prescription.", "Do not combine with other paracetamol products.", "Keep away from children."),
    ("Brufen 400 Tablet", "Abbott", 5, 28.00, 70, 0, "Ibuprofen 400mg", "Pain, swelling, and inflammation.", "Acidity, stomach pain, dizziness.", "Take with food.", "Avoid in kidney disease or stomach ulcer unless prescribed.", "Store below 25C."),
    ("Combiflam Tablet", "Sanofi", 5, 42.00, 65, 0, "Ibuprofen 400mg + Paracetamol 325mg", "Fever with body pain and inflammation.", "Acidity, nausea, dizziness.", "Take after meals.", "Avoid alcohol and duplicate painkillers.", "Store in original strip."),
    ("Aspirin 75mg Tablet", "Zydus", 6, 12.00, 120, 1, "Aspirin 75mg", "Blood thinner used in heart care.", "Bleeding, acidity, bruising.", "Take exactly as prescribed.", "Do not stop suddenly without medical advice.", "Store away from moisture."),
    ("Ecosprin AV 75 Capsule", "USV", 6, 58.00, 84, 1, "Aspirin 75mg + Atorvastatin 10mg", "Helps prevent heart attack and stroke.", "Bleeding risk, muscle pain, acidity.", "Take at the same time daily.", "Requires doctor supervision.", "Store below 30C."),
    ("Atorva 10 Tablet", "Zydus", 6, 88.00, 88, 1, "Atorvastatin 10mg", "Lowers cholesterol.", "Muscle pain, headache, nausea.", "Usually taken at night.", "Avoid in pregnancy and active liver disease.", "Store below 30C."),
    ("Amlong 5 Tablet", "Micro Labs", 6, 36.00, 100, 1, "Amlodipine 5mg", "Controls high blood pressure.", "Ankle swelling, flushing, headache.", "Take daily as prescribed.", "Monitor blood pressure regularly.", "Store in a cool dry place."),
    ("Metformin 500 Tablet", "USV", 2, 24.00, 160, 1, "Metformin 500mg", "Controls blood sugar in type 2 diabetes.", "Nausea, loose motion, metallic taste.", "Take with meals.", "Avoid in severe kidney disease.", "Store below 30C."),
    ("Glycomet GP 1 Tablet", "USV", 2, 110.00, 64, 1, "Glimepiride 1mg + Metformin 500mg", "Diabetes control.", "Low blood sugar, nausea.", "Take with food.", "Do not skip meals.", "Store in original pack."),
    ("Cetcip 10 Tablet", "Cipla", 4, 17.00, 135, 0, "Cetirizine 10mg", "Allergy, sneezing, runny nose.", "Sleepiness, dry mouth.", "Take preferably at night.", "Avoid driving if drowsy.", "Store below 30C."),
    ("Allegra 120mg Tablet", "Sanofi", 4, 178.00, 73, 0, "Fexofenadine 120mg", "Allergic rhinitis and hives.", "Headache, nausea, sleepiness.", "Take before food or as advised.", "Avoid fruit juice near dosing.", "Store in a dry place."),
    ("Azithral 500 Tablet", "Alembic", 7, 121.00, 52, 1, "Azithromycin 500mg", "Bacterial infections.", "Diarrhea, nausea, abdominal pain.", "Complete the prescribed course.", "Do not self-medicate antibiotics.", "Store below 30C."),
    ("Augmentin 625 Duo", "GSK", 7, 218.00, 40, 1, "Amoxicillin 500mg + Clavulanic Acid 125mg", "Bacterial infections.", "Diarrhea, rash, nausea.", "Take with food.", "Complete full course.", "Store away from heat."),
    ("Ciplox 500 Tablet", "Cipla", 7, 45.00, 58, 1, "Ciprofloxacin 500mg", "Bacterial infections.", "Nausea, tendon pain, dizziness.", "Take as prescribed.", "Avoid antacids near dosing.", "Store below 30C."),
    ("Pantocid 40 Tablet", "Sun Pharma", 8, 105.00, 115, 0, "Pantoprazole 40mg", "Acidity and reflux.", "Headache, nausea, abdominal discomfort.", "Take before breakfast.", "Long-term use needs medical advice.", "Store below 30C."),
    ("Omez 20 Capsule", "Dr Reddy's", 8, 68.00, 99, 0, "Omeprazole 20mg", "Acidity, heartburn, ulcer symptoms.", "Headache, gas, nausea.", "Take before food.", "Consult doctor if symptoms persist.", "Store in a cool dry place."),
    ("Digene Gel Mint", "Abbott", 8, 110.00, 75, 0, "Magaldrate + Simethicone", "Quick relief from acidity and gas.", "Constipation or chalky taste.", "Shake well before use.", "Separate from some antibiotics.", "Store tightly closed."),
    ("Vitamin D3 60K Capsule", "Carbamide Forte", 1, 155.00, 90, 0, "Cholecalciferol 60000 IU", "Vitamin D deficiency support.", "High calcium symptoms if overused.", "Usually once weekly when prescribed.", "Avoid excessive dosing.", "Store away from sunlight."),
    ("Shelcal 500 Tablet", "Torrent", 1, 128.00, 110, 0, "Calcium Carbonate + Vitamin D3", "Bone health and calcium support.", "Constipation, bloating.", "Take after meals.", "Separate from thyroid medicine.", "Store below 30C."),
    ("Zincovit Tablet", "Apex", 1, 165.00, 140, 0, "Multivitamins + Minerals", "Nutritional supplementation.", "Nausea, stomach upset.", "Take after food.", "Do not exceed recommended dose.", "Store in dry place."),
    ("Becosules Capsule", "Pfizer", 1, 52.00, 130, 0, "Vitamin B Complex", "B-vitamin supplementation.", "Mild stomach upset.", "Take after meals.", "Use as directed.", "Store below 30C."),
    ("Volini Spray", "Sun Pharma", 5, 245.00, 56, 0, "Diclofenac topical", "Muscle and joint pain relief.", "Skin irritation.", "Spray on affected area.", "Do not apply on broken skin.", "Keep away from flame."),
    ("Moov Pain Relief Cream", "Reckitt", 5, 180.00, 82, 0, "Methyl Salicylate + Menthol", "Back pain and sprain relief.", "Local irritation.", "Apply gently to affected area.", "External use only.", "Close cap tightly."),
    ("Candid Cream", "Glenmark", 3, 116.00, 68, 0, "Clotrimazole 1%", "Fungal skin infections.", "Burning or irritation.", "Apply thin layer as directed.", "External use only.", "Store below 25C."),
    ("Acnelak CLZ Cream", "Menarini", 3, 240.00, 45, 1, "Clindamycin + Zinc", "Acne treatment.", "Dryness, peeling, irritation.", "Apply as prescribed.", "Avoid eyes and sun exposure.", "Store in cool place."),
    ("Suncros SPF 50 Gel", "Sun Pharma", 3, 720.00, 38, 0, "Sunscreen SPF 50", "Sun protection.", "Rare irritation.", "Apply 20 minutes before sun exposure.", "Reapply as needed.", "Store below 30C."),
    ("Refresh Tears Eye Drop", "Allergan", 9, 165.00, 66, 0, "Carboxymethylcellulose", "Dry eye relief.", "Temporary blurred vision.", "Instill as needed.", "Do not touch dropper tip.", "Discard as per label."),
    ("Moxicip Eye Drop", "Cipla", 9, 198.00, 34, 1, "Moxifloxacin", "Bacterial eye infection.", "Eye irritation, watering.", "Use as prescribed.", "Antibiotic eye drops need doctor advice.", "Store as instructed."),
    ("Chyawanprash", "Dabur", 10, 215.00, 85, 0, "Amla + Ayurvedic herbs", "General wellness support.", "May affect sugar levels.", "Use recommended serving size.", "Diabetic patients should check label.", "Close lid tightly."),
    ("Liv 52 Tablet", "Himalaya", 10, 135.00, 92, 0, "Herbal liver support", "Liver wellness support.", "Mild stomach discomfort.", "Use as directed.", "Consult doctor for liver disease.", "Store in dry place."),
    ("Himalaya Septilin Syrup", "Himalaya", 10, 145.00, 60, 0, "Ayurvedic immune blend", "Immune support.", "Mild stomach upset.", "Use measuring cup.", "Consult doctor for children.", "Store below 30C."),
    ("Pampers Baby Dry Pants M", "P&G", 11, 399.00, 50, 0, "Baby diaper pants", "Baby hygiene.", "Rash if changed infrequently.", "Change regularly.", "Discontinue if rash worsens.", "Store dry."),
    ("Johnson Baby Lotion", "Johnson & Johnson", 11, 210.00, 78, 0, "Baby moisturizing lotion", "Baby skin moisturization.", "Rare irritation.", "Apply after bath.", "External use only.", "Keep bottle closed."),
    ("Pregnacare Tablet", "Vitabiotics", 12, 435.00, 42, 0, "Prenatal multivitamin", "Nutritional support in pregnancy.", "Nausea, constipation.", "Take after food.", "Use under medical advice in pregnancy.", "Store below 25C."),
    ("Folic Acid 5mg Tablet", "Zydus", 12, 18.00, 125, 0, "Folic Acid 5mg", "Folate supplementation.", "Usually well tolerated.", "Take as advised.", "Pregnancy dosing should follow doctor advice.", "Store below 30C."),
    ("Revital H Capsule", "Sun Pharma", 13, 345.00, 80, 0, "Multivitamin + Ginseng", "Energy and wellness support.", "Stomach upset, sleep disturbance.", "Take after breakfast.", "Avoid late evening use.", "Store in dry place."),
    ("Protinex Powder", "Danone", 13, 620.00, 55, 0, "Protein supplement", "Protein nutrition support.", "Bloating in some users.", "Mix as per label.", "Check sugar content if diabetic.", "Keep container sealed."),
    ("Serlift 50 Tablet", "Cipla", 14, 178.00, 48, 1, "Sertraline 50mg", "Depression and anxiety disorders.", "Nausea, sleep change, sexual dysfunction.", "Take daily as prescribed.", "Do not stop abruptly.", "Store below 30C."),
    ("Nexito 10 Tablet", "Sun Pharma", 14, 120.00, 57, 1, "Escitalopram 10mg", "Anxiety and depression.", "Nausea, sleepiness, dry mouth.", "Take as prescribed.", "Needs doctor supervision.", "Store in dry place."),
    ("Jointace C2 Tablet", "Vitabiotics", 15, 375.00, 44, 0, "Collagen + Glucosamine + Vitamins", "Joint health support.", "Stomach upset.", "Take with food.", "Consult doctor in shellfish allergy.", "Store below 25C."),
    ("Cartigen Forte Tablet", "Pharmed", 15, 520.00, 36, 0, "Glucosamine + Chondroitin", "Osteoarthritis support.", "Nausea, bloating.", "Use regularly as advised.", "Consult doctor if diabetic.", "Store dry."),
]


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def row_to_dict(row):
    return dict(row) if row else None


def json_error(message, status=400):
    return jsonify({"message": message, "error": message}), status


def now_iso():
    return datetime.now(UTC).isoformat(timespec="seconds").replace("+00:00", "Z")


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def init_db():
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    with get_db() as db:
        db.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                phone TEXT,
                password_hash TEXT NOT NULL,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS categories (
                category_id INTEGER PRIMARY KEY,
                name TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS products (
                product_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                brand TEXT,
                category_id INTEGER NOT NULL,
                price REAL NOT NULL,
                stock_qty INTEGER NOT NULL DEFAULT 0,
                requires_prescription INTEGER NOT NULL DEFAULT 0,
                composition TEXT,
                uses TEXT,
                side_effects TEXT,
                dosage TEXT,
                warnings TEXT,
                storage TEXT,
                description TEXT,
                created_at TEXT NOT NULL,
                FOREIGN KEY (category_id) REFERENCES categories(category_id)
            );

            CREATE TABLE IF NOT EXISTS cart (
                cart_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                qty INTEGER NOT NULL DEFAULT 1,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                UNIQUE(user_id, product_id),
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS orders (
                order_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                total_amount REAL NOT NULL,
                delivery_fee REAL NOT NULL DEFAULT 0,
                payment_method TEXT NOT NULL DEFAULT 'Cash on Delivery',
                status TEXT NOT NULL DEFAULT 'confirmed',
                address_json TEXT,
                created_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS order_items (
                order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                qty INTEGER NOT NULL,
                price_at_purchase REAL NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(product_id)
            );

            CREATE TABLE IF NOT EXISTS prescriptions (
                prescription_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                filename TEXT NOT NULL,
                stored_filename TEXT NOT NULL,
                file_url TEXT NOT NULL,
                notes TEXT,
                status TEXT NOT NULL DEFAULT 'pending',
                uploaded_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            );
            """
        )

        db.executemany(
            "INSERT OR IGNORE INTO categories (category_id, name) VALUES (?, ?)",
            CATEGORIES,
        )

        count = db.execute("SELECT COUNT(*) AS total FROM products").fetchone()["total"]
        if count == 0:
            db.executemany(
                """
                INSERT INTO products
                (name, brand, category_id, price, stock_qty, requires_prescription,
                 composition, uses, side_effects, dosage, warnings, storage,
                 description, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                [
                    (
                        name,
                        brand,
                        category_id,
                        price,
                        stock_qty,
                        rx,
                        composition,
                        uses,
                        side_effects,
                        dosage,
                        warnings,
                        storage,
                        uses,
                        now_iso(),
                    )
                    for (
                        name,
                        brand,
                        category_id,
                        price,
                        stock_qty,
                        rx,
                        composition,
                        uses,
                        side_effects,
                        dosage,
                        warnings,
                        storage,
                    ) in SEED_PRODUCTS
                ],
            )


def product_payload(row):
    data = row_to_dict(row)
    if not data:
        return None
    data["requires_prescription"] = bool(data["requires_prescription"])
    data["price"] = float(data["price"])
    data["stock_qty"] = int(data["stock_qty"])
    return data


def get_cart_rows(db, user_id):
    return db.execute(
        """
        SELECT c.cart_id, c.user_id, c.product_id, c.qty,
               p.name, p.brand, p.category_id, p.price, p.stock_qty,
               p.requires_prescription, p.composition
        FROM cart c
        JOIN products p ON p.product_id = c.product_id
        WHERE c.user_id = ?
        ORDER BY c.updated_at DESC, c.cart_id DESC
        """,
        (user_id,),
    ).fetchall()


def cart_item_payload(row):
    data = row_to_dict(row)
    data["requires_prescription"] = bool(data["requires_prescription"])
    data["price"] = float(data["price"])
    data["qty"] = int(data["qty"])
    data["stock_qty"] = int(data["stock_qty"])
    return data


@app.route("/")
def home():
    return jsonify(
        {
            "message": "CureNest Flask backend running",
            "database": str(DB_PATH),
            "endpoints": [
                "/products",
                "/register",
                "/login",
                "/cart/<user_id>",
                "/orders/<user_id>",
                "/prescriptions/<user_id>",
            ],
        }
    )


@app.route("/health")
def health():
    return jsonify({"status": "ok", "time": now_iso()})


@app.route("/categories")
def categories():
    with get_db() as db:
        rows = db.execute("SELECT * FROM categories ORDER BY category_id").fetchall()
    return jsonify([row_to_dict(row) for row in rows])


@app.route("/products")
@app.route("/api/products")
def products():
    q = (request.args.get("q") or "").strip().lower()
    category_id = request.args.get("category_id") or request.args.get("cat")
    rx = request.args.get("rx")

    sql = "SELECT * FROM products WHERE 1 = 1"
    params = []
    if q:
        sql += " AND (LOWER(name) LIKE ? OR LOWER(brand) LIKE ? OR LOWER(composition) LIKE ?)"
        like = f"%{q}%"
        params.extend([like, like, like])
    if category_id:
        sql += " AND category_id = ?"
        params.append(category_id)
    if rx in {"0", "1", "true", "false"}:
        sql += " AND requires_prescription = ?"
        params.append(1 if rx in {"1", "true"} else 0)
    sql += " ORDER BY product_id"

    with get_db() as db:
        rows = db.execute(sql, params).fetchall()
    return jsonify([product_payload(row) for row in rows])


@app.route("/products/<int:product_id>")
@app.route("/api/products/<int:product_id>")
def product_detail(product_id):
    with get_db() as db:
        row = db.execute("SELECT * FROM products WHERE product_id = ?", (product_id,)).fetchone()
    product = product_payload(row)
    if not product:
        return json_error("Product not found", 404)
    return jsonify(product)


@app.route("/api/medicines")
def medicines_alias():
    return products()


@app.route("/api/medicines/<int:product_id>")
def medicine_detail_alias(product_id):
    return product_detail(product_id)


@app.route("/register", methods=["POST"])
@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    phone = (data.get("phone") or "").strip()
    password = data.get("password") or ""

    if not name or not email or not password:
        return json_error("Name, email, and password are required")
    if "@" not in email:
        return json_error("Enter a valid email address")
    if len(password) < 6:
        return json_error("Password must be at least 6 characters")

    try:
        with get_db() as db:
            cur = db.execute(
                """
                INSERT INTO users (name, email, phone, password_hash, created_at)
                VALUES (?, ?, ?, ?, ?)
                """,
                (name, email, phone, generate_password_hash(password), now_iso()),
            )
            user_id = cur.lastrowid
    except sqlite3.IntegrityError:
        return json_error("Email is already registered", 409)

    return jsonify({"message": "User registered successfully", "user_id": user_id}), 201


@app.route("/login", methods=["POST"])
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    with get_db() as db:
        user = db.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()

    if not user or not check_password_hash(user["password_hash"], password):
        return json_error("Invalid email or password", 401)

    return jsonify(
        {
            "message": "Login successful",
            "user_id": user["user_id"],
            "name": user["name"],
            "email": user["email"],
            "phone": user["phone"],
        }
    )


@app.route("/cart", methods=["POST"])
@app.route("/api/cart", methods=["POST"])
def add_to_cart():
    data = request.get_json(silent=True) or {}
    try:
        user_id = int(data.get("user_id"))
        product_id = int(data.get("product_id"))
        qty = max(1, min(10, int(data.get("qty", 1))))
    except (TypeError, ValueError):
        return json_error("Valid user_id, product_id, and qty are required")

    with get_db() as db:
        user = db.execute("SELECT user_id FROM users WHERE user_id = ?", (user_id,)).fetchone()
        product = db.execute("SELECT stock_qty FROM products WHERE product_id = ?", (product_id,)).fetchone()
        if not user:
            return json_error("User not found", 404)
        if not product:
            return json_error("Product not found", 404)
        if product["stock_qty"] <= 0:
            return json_error("Product is out of stock", 409)

        db.execute(
            """
            INSERT INTO cart (user_id, product_id, qty, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(user_id, product_id) DO UPDATE SET
                qty = MIN(10, cart.qty + excluded.qty),
                updated_at = excluded.updated_at
            """,
            (user_id, product_id, qty, now_iso(), now_iso()),
        )
        row = db.execute(
            """
            SELECT cart_id FROM cart
            WHERE user_id = ? AND product_id = ?
            """,
            (user_id, product_id),
        ).fetchone()

    return jsonify({"message": "Added to cart", "cart_id": row["cart_id"]}), 201


@app.route("/cart/<int:user_id>", methods=["GET"])
@app.route("/api/cart/<int:user_id>", methods=["GET"])
def get_cart(user_id):
    with get_db() as db:
        rows = get_cart_rows(db, user_id)
    return jsonify([cart_item_payload(row) for row in rows])


@app.route("/cart/<int:cart_id>", methods=["PUT"])
@app.route("/api/cart/<int:cart_id>", methods=["PUT"])
def update_cart(cart_id):
    data = request.get_json(silent=True) or {}
    try:
        qty = max(1, min(10, int(data.get("qty"))))
    except (TypeError, ValueError):
        return json_error("Valid qty is required")

    with get_db() as db:
        cur = db.execute(
            "UPDATE cart SET qty = ?, updated_at = ? WHERE cart_id = ?",
            (qty, now_iso(), cart_id),
        )
        if cur.rowcount == 0:
            return json_error("Cart item not found", 404)

    return jsonify({"message": "Cart updated", "cart_id": cart_id, "qty": qty})


@app.route("/cart/<int:cart_id>", methods=["DELETE"])
@app.route("/api/cart/<int:cart_id>", methods=["DELETE"])
def delete_cart(cart_id):
    with get_db() as db:
        cur = db.execute("DELETE FROM cart WHERE cart_id = ?", (cart_id,))
        if cur.rowcount == 0:
            return json_error("Cart item not found", 404)
    return jsonify({"message": "Cart item removed"})


@app.route("/orders", methods=["POST"])
@app.route("/api/orders", methods=["POST"])
@app.route("/api/order", methods=["POST"])
def place_order():
    data = request.get_json(silent=True) or {}
    try:
        user_id = int(data.get("user_id"))
    except (TypeError, ValueError):
        return json_error("Valid user_id is required")

    payment_method = data.get("payment_method") or "Cash on Delivery"
    address = data.get("address")

    with get_db() as db:
        cart_rows = get_cart_rows(db, user_id)
        if not cart_rows:
            return json_error("Cart is empty", 409)

        for item in cart_rows:
            if item["qty"] > item["stock_qty"]:
                return json_error(f"Only {item['stock_qty']} units available for {item['name']}", 409)

        subtotal = sum(float(item["price"]) * int(item["qty"]) for item in cart_rows)
        delivery_fee = 0 if subtotal >= 299 else 50
        total = round(subtotal + delivery_fee, 2)

        cur = db.execute(
            """
            INSERT INTO orders
            (user_id, total_amount, delivery_fee, payment_method, status, address_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (user_id, total, delivery_fee, payment_method, "confirmed", str(address or ""), now_iso()),
        )
        order_id = cur.lastrowid

        db.executemany(
            """
            INSERT INTO order_items (order_id, product_id, name, qty, price_at_purchase)
            VALUES (?, ?, ?, ?, ?)
            """,
            [
                (order_id, item["product_id"], item["name"], item["qty"], item["price"])
                for item in cart_rows
            ],
        )

        for item in cart_rows:
            db.execute(
                "UPDATE products SET stock_qty = stock_qty - ? WHERE product_id = ?",
                (item["qty"], item["product_id"]),
            )
        db.execute("DELETE FROM cart WHERE user_id = ?", (user_id,))

    return jsonify({"message": "Order placed successfully", "order_id": order_id, "total_amount": total}), 201


@app.route("/orders/<int:user_id>", methods=["GET"])
@app.route("/api/orders/<int:user_id>", methods=["GET"])
def get_user_orders(user_id):
    with get_db() as db:
        orders = db.execute(
            "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC, order_id DESC",
            (user_id,),
        ).fetchall()
        payload = []
        for order in orders:
            order_data = row_to_dict(order)
            items = db.execute(
                "SELECT product_id, name, qty, price_at_purchase FROM order_items WHERE order_id = ?",
                (order["order_id"],),
            ).fetchall()
            order_data["items"] = [row_to_dict(item) for item in items]
            order_data["total_amount"] = float(order_data["total_amount"])
            payload.append(order_data)
    return jsonify(payload)


@app.route("/orders", methods=["GET"])
@app.route("/api/orders", methods=["GET"])
def get_all_orders():
    with get_db() as db:
        rows = db.execute("SELECT * FROM orders ORDER BY created_at DESC, order_id DESC").fetchall()
    return jsonify([row_to_dict(row) for row in rows])


@app.route("/prescriptions", methods=["POST"])
@app.route("/api/prescriptions", methods=["POST"])
def upload_prescription():
    user_id = request.form.get("user_id")
    notes = request.form.get("notes", "")
    file = request.files.get("prescription")

    if not user_id:
        return json_error("user_id is required")
    if not file or not file.filename:
        return json_error("Prescription file is required")
    if not allowed_file(file.filename):
        return json_error("Only PDF, PNG, JPG, JPEG, and WEBP files are allowed")

    original_name = secure_filename(file.filename)
    ext = original_name.rsplit(".", 1)[1].lower()
    stored_name = f"{uuid4().hex}.{ext}"
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    file.save(UPLOAD_DIR / stored_name)

    with get_db() as db:
        user = db.execute("SELECT user_id FROM users WHERE user_id = ?", (user_id,)).fetchone()
        if not user:
            return json_error("User not found", 404)
        cur = db.execute(
            """
            INSERT INTO prescriptions
            (user_id, filename, stored_filename, file_url, notes, status, uploaded_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user_id,
                original_name,
                stored_name,
                f"/uploads/{stored_name}",
                notes,
                "pending",
                now_iso(),
            ),
        )

    return jsonify({"message": "Prescription uploaded", "prescription_id": cur.lastrowid}), 201


@app.route("/prescriptions/<int:user_id>", methods=["GET"])
@app.route("/api/prescriptions/<int:user_id>", methods=["GET"])
def get_prescriptions(user_id):
    with get_db() as db:
        rows = db.execute(
            """
            SELECT prescription_id, user_id, filename, file_url, notes, status, uploaded_at
            FROM prescriptions
            WHERE user_id = ?
            ORDER BY uploaded_at DESC, prescription_id DESC
            """,
            (user_id,),
        ).fetchall()
    return jsonify([row_to_dict(row) for row in rows])


@app.route("/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_DIR, filename)


init_db()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    debug = os.environ.get("FLASK_DEBUG", "0") == "1"
    app.run(host="0.0.0.0", port=port, debug=debug)
