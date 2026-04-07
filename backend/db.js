import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const dbPath = path.resolve(__dirname, 'dairy.sqlite');

export async function initializeDb() {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Create tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS staff (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      subRole TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      defaultQuantity REAL DEFAULT 1.5,
      status TEXT DEFAULT 'active',
      rate REAL DEFAULT 50.0
    );

    CREATE TABLE IF NOT EXISTS deliveries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customerId INTEGER NOT NULL,
      date TEXT NOT NULL,
      quantity REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      FOREIGN KEY(customerId) REFERENCES customers(id)
    );

    CREATE TABLE IF NOT EXISTS bills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customerId INTEGER NOT NULL,
      month TEXT NOT NULL,
      totalQuantity REAL NOT NULL,
      amount REAL NOT NULL,
      status TEXT DEFAULT 'unpaid',
      FOREIGN KEY(customerId) REFERENCES customers(id)
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    -- Load Default App Settings
    INSERT OR IGNORE INTO settings (key, value) VALUES ('shopName', 'Swaraaj Milk Dairy');
    INSERT OR IGNORE INTO settings (key, value) VALUES ('milkRate', '50.0');

    -- Enroll Primary Owner
    INSERT OR IGNORE INTO staff (name, phone, subRole) VALUES ('Swaraaj Owner', '9149405624', 'owner');
  `);

  console.log('Database trained and tables created successfully.');
  return db;
}
