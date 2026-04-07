import express from 'express';
import cors from 'cors';
import { initializeDb } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

let db;

// Initialize Server and Database
async function startServer() {
  db = await initializeDb();

  // Root route for server verification
  app.get('/', (req, res) => {
    res.send('<h1>🥛 Swaraaj Milk Dairy API</h1><p>Server is running. Mobile apps can connect via /api endpoints.</p>');
  });
  
  // STAFF ENDPOINTS
  app.get('/api/staff', async (req, res) => {
    const staff = await db.all('SELECT * FROM staff');
    res.json(staff);
  });
  
  app.post('/api/staff', async (req, res) => {
    const { name, phone, subRole } = req.body;
    try {
      const result = await db.run('INSERT INTO staff (name, phone, subRole) VALUES (?, ?, ?)', [name, phone, subRole]);
      res.json({ id: result.lastID, name, phone, subRole });
    } catch (err) {
      res.status(400).json({ error: 'Phone number may already exist.' });
    }
  });

  app.delete('/api/staff/:phone', async (req, res) => {
    await db.run('DELETE FROM staff WHERE phone = ?', [req.params.phone]);
    res.json({ success: true });
  });

  // CUSTOMERS ENDPOINTS
  app.get('/api/customers', async (req, res) => {
    const customers = await db.all('SELECT * FROM customers');
    res.json(customers);
  });

  app.post('/api/customers', async (req, res) => {
    const { name, phone, defaultQuantity, rate } = req.body;
    try {
      const result = await db.run(
        'INSERT INTO customers (name, phone, defaultQuantity, rate, status) VALUES (?, ?, ?, ?, ?)',
        [name, phone, defaultQuantity || 1.5, rate || 50.0, 'active']
      );
      res.json({ id: result.lastID, name, phone, defaultQuantity, rate, status: 'active' });
    } catch (err) {
       res.status(400).json({ error: 'Customer already exists.' });
    }
  });

  // DELIVERIES ENDPOINTS
  app.get('/api/deliveries', async (req, res) => {
    // We can group them by date dynamically similar to frontend structure
    const all = await db.all('SELECT * FROM deliveries');
    const grouped = {};
    all.forEach(d => {
      if (!grouped[d.date]) grouped[d.date] = [];
      grouped[d.date].push(d);
    });
    res.json(grouped);
  });

  app.post('/api/deliveries', async (req, res) => {
    // Accept array of deliveries to bulk insert/update
    const deliveriesArray = req.body; // array of { customerId, date, quantity, status }
    for (let d of deliveriesArray) {
      // Check if exists
      const existing = await db.get('SELECT * FROM deliveries WHERE customerId = ? AND date = ?', [d.customerId, d.date]);
      if (existing) {
        await db.run('UPDATE deliveries SET quantity = ?, status = ? WHERE id = ?', [d.quantity, d.status, existing.id]);
      } else {
        await db.run('INSERT INTO deliveries (customerId, date, quantity, status) VALUES (?, ?, ?, ?)', [d.customerId, d.date, d.quantity, d.status]);
      }
    }
    res.json({ success: true });
  });

  // BILLS ENDPOINTS
  app.get('/api/bills', async (req, res) => {
    const bills = await db.all('SELECT * FROM bills');
    res.json(bills);
  });

  app.post('/api/bills/status', async (req, res) => {
    const { customerId, status } = req.body;
    await db.run('UPDATE bills SET status = ? WHERE customerId = ?', [status, customerId]);
    res.json({ success: true });
  });

  app.post('/api/bills/generate', async (req, res) => {
    const { month } = req.body; // e.g. "2026-04"
    const customers = await db.all('SELECT * FROM customers');
    
    for (let c of customers) {
      // Sum deliveries for this customer in this month
      const logs = await db.all('SELECT quantity FROM deliveries WHERE customerId = ? AND date LIKE ? AND status = ?', [c.id, `${month}%`, 'delivered']);
      const totalQuantity = logs.reduce((sum, l) => sum + l.quantity, 0);
      const amount = totalQuantity * (c.rate || 50.0);
      
      if (totalQuantity > 0) {
        const existing = await db.get('SELECT * FROM bills WHERE customerId = ? AND month = ?', [c.id, month]);
        if (existing) {
          // Only update if not paid yet or just refresh
          await db.run('UPDATE bills SET totalQuantity = ?, amount = ? WHERE id = ?', [totalQuantity, amount, existing.id]);
        } else {
          await db.run('INSERT INTO bills (customerId, month, totalQuantity, amount, status) VALUES (?, ?, ?, ?, ?)', [c.id, month, totalQuantity, amount, 'unpaid']);
        }
      }
    }
    res.json({ success: true });
  });

  // SETTINGS ENDPOINTS
  app.get('/api/settings', async (req, res) => {
    const raw = await db.all('SELECT * FROM settings');
    const settings = {};
    raw.forEach(s => settings[s.key] = s.value);
    res.json(settings);
  });

  app.post('/api/settings', async (req, res) => {
    const updates = req.body; // { shopName: '...', milkRate: '...' }
    for (const [key, value] of Object.entries(updates)) {
      await db.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [key, value.toString()]);
    }
    res.json({ success: true });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on all interfaces at PORT ${PORT}`);
    console.log(`📱 For mobile devices, use http://192.168.1.10:${PORT}`);
    console.log(`💻 For local browser, use http://localhost:${PORT}`);
  });
}

startServer();
