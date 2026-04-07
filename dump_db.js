import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

async function dump() {
    const db = await open({
        filename: 'backend/dairy.sqlite',
        driver: sqlite3.Database
    });

    try {
        console.log("--- STAFF ---");
        const staff = await db.all("SELECT * FROM staff");
        staff.forEach(s => console.log(JSON.stringify(s)));

        console.log("\n--- SETTINGS ---");
        const settings = await db.all("SELECT * FROM settings");
        settings.forEach(s => console.log(JSON.stringify(s)));

        console.log("\n--- CUSTOMERS ---");
        const customers = await db.all("SELECT * FROM customers");
        customers.forEach(c => console.log(JSON.stringify(c)));
    } catch (e) {
        console.log("Database looks empty or tables not yet created (Wait for server restart)");
    }
    
    await db.close();
}

dump();
