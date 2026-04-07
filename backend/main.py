from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
import os
from typing import List, Dict, Any
from datetime import datetime
from pydantic import BaseModel

app = FastAPI(title="🥛 Swaraaj Milk Dairy Cloud API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Configuration (Pulls automatically from Railway environment)
# Defaults are for local development
DB_CONFIG = {
    "host": os.getenv("MYSQLHOST", "localhost"),
    "user": os.getenv("MYSQLUSER", "root"),
    "password": os.getenv("MYSQLPASSWORD", ""),
    "database": os.getenv("MYSQLDATABASE", "railway"),
    "port": int(os.getenv("MYSQLPORT", 3306))
}

# Add connection retry for cloud stability
def get_db():
    try:
        return mysql.connector.connect(**DB_CONFIG)
    except Exception as e:
        print(f"❌ DB Connection Error: {e}")
        raise HTTPException(status_code=500, detail="Cloud Database connection failed")

@app.on_event("startup")
def startup():
    # Initialize Database Tables
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS staff (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            phone VARCHAR(20) UNIQUE NOT NULL,
            subRole VARCHAR(50) NOT NULL
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS customers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            phone VARCHAR(20) UNIQUE NOT NULL,
            defaultQuantity FLOAT DEFAULT 1.5,
            status VARCHAR(20) DEFAULT 'active',
            rate FLOAT DEFAULT 50.0,
            assignedStaffId INT,
            FOREIGN KEY(assignedStaffId) REFERENCES staff(id)
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS deliveries (
            id INT AUTO_INCREMENT PRIMARY KEY,
            customerId INT NOT NULL,
            staffId INT,
            date VARCHAR(20) NOT NULL,
            quantity FLOAT NOT NULL,
            status VARCHAR(20) DEFAULT 'pending',
            FOREIGN KEY(customerId) REFERENCES customers(id),
            FOREIGN KEY(staffId) REFERENCES staff(id)
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS bills (
            id INT AUTO_INCREMENT PRIMARY KEY,
            customerId INT NOT NULL,
            month VARCHAR(20) NOT NULL,
            totalQuantity FLOAT NOT NULL,
            amount FLOAT NOT NULL,
            status VARCHAR(20) DEFAULT 'unpaid',
            FOREIGN KEY(customerId) REFERENCES customers(id)
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS settings (
            `key` VARCHAR(50) PRIMARY KEY,
            value TEXT NOT NULL
        )
    """)
    # Defaults
    cursor.execute("INSERT IGNORE INTO settings (`key`, value) VALUES ('shopName', 'Swaraaj Milk Dairy')")
    cursor.execute("INSERT IGNORE INTO settings (`key`, value) VALUES ('milkRate', '50.0')")
    cursor.execute("INSERT IGNORE INTO staff (name, phone, subRole) VALUES ('Swaraaj Owner', '9149405624', 'owner')")
    
    db.commit()
    cursor.close()
    db.close()

# --- ENDPOINTS ---

@app.get("/")
def read_root():
    return {"message": "Cloud Backend Active (Python/MySQL)"}

@app.get("/api/settings")
def get_settings():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM settings")
    settings = {row['key']: row['value'] for row in cursor.fetchall()}
    cursor.close()
    db.close()
    return settings

@app.post("/api/settings")
def save_settings(updates: Dict[str, Any]):
    db = get_db()
    cursor = db.cursor()
    for k, v in updates.items():
        cursor.execute("INSERT INTO settings (`key`, value) VALUES (%s, %s) ON DUPLICATE KEY UPDATE value = %s", (k, str(v), str(v)))
    db.commit()
    cursor.close()
    db.close()
    return {"success": True}

@app.get("/api/staff")
def get_staff():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM staff")
    res = cursor.fetchall()
    cursor.close()
    db.close()
    return res

@app.post("/api/staff")
def add_staff(data: Dict[str, Any]):
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("INSERT INTO staff (name, phone, subRole) VALUES (%s, %s, %s)", (data['name'], data['phone'], data['subRole']))
        db.commit()
        return {"success": True}
    except:
        raise HTTPException(status_code=400, detail="Error adding staff")
    finally:
        cursor.close()
        db.close()

@app.get("/api/customers")
def get_customers():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM customers")
    res = cursor.fetchall()
    cursor.close()
    db.close()
    return res

@app.post("/api/customers")
def add_customer(data: Dict[str, Any]):
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("INSERT INTO customers (name, phone, defaultQuantity, rate, status, assignedStaffId) VALUES (%s, %s, %s, %s, %s, %s)", 
                       (data['name'], data['phone'], data.get('defaultQuantity', 1.5), data.get('rate', 50.0), 'active', data.get('assignedStaffId')))
        db.commit()
        return {"id": cursor.lastrowid}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        db.close()

@app.get("/api/deliveries")
def get_deliveries():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM deliveries")
    all_d = cursor.fetchall()
    grouped = {}
    for d in all_d:
        date = d['date']
        if date not in grouped: grouped[date] = []
        grouped[date].append(d)
    cursor.close()
    db.close()
    return grouped

@app.post("/api/deliveries")
def save_deliveries(logs: List[Dict[str, Any]]):
    db = get_db()
    cursor = db.cursor()
    for l in logs:
        # MySQL UPSERT
        cursor.execute("""
            INSERT INTO deliveries (customerId, date, quantity, status, staffId) 
            VALUES (%s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE quantity = VALUES(quantity), status = VALUES(status), staffId = VALUES(staffId)
        """, (l['customerId'], l['date'], l['quantity'], l['status'], l.get('staffId')))
    db.commit()
    cursor.close()
    db.close()
    return {"success": True}

@app.get("/api/bills")
def get_bills():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM bills")
    res = cursor.fetchall()
    cursor.close()
    db.close()
    return res

@app.post("/api/bills/status")
def update_bill_status(data: Dict[str, Any]):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("UPDATE bills SET status = %s WHERE customerId = %s", (data['status'], data['customerId']))
    db.commit()
    cursor.close()
    db.close()
    return {"success": True}

@app.post("/api/bills/generate")
def generate_bills(data: Dict[str, Any]):
    month = data['month']
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM customers")
    customers = cursor.fetchall()
    
    for c in customers:
        cursor.execute("SELECT quantity FROM deliveries WHERE customerId = %s AND date LIKE %s AND status = 'delivered'", (c['id'], f"{month}%"))
        logs = cursor.fetchall()
        total_q = sum([l['quantity'] for l in logs])
        amount = total_q * c['rate']
        
        if total_q > 0:
            cursor.execute("""
                INSERT INTO bills (customerId, month, totalQuantity, amount, status)
                VALUES (%s, %s, %s, %s, 'unpaid')
                ON DUPLICATE KEY UPDATE totalQuantity = VALUES(totalQuantity), amount = VALUES(amount)
            """, (c['id'], month, total_q, amount))
    
    db.commit()
    cursor.close()
    db.close()
    return {"success": True}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
