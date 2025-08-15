import express from "express";
import dotenv from "dotenv";
import { pool } from "./conexion_bd.js";

dotenv.config();

const app = express();
app.use(express.json());

/* ===============================
   PROBAR CONEXIÓN
================================*/
app.get('/test-connection', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        res.json({ message: "✅ Conexión a la base de datos exitosa" });
    } catch (error) {
        res.status(500).json({ message: "❌ Error de conexión", error: error.message });
    }
});

/* ===============================
   CRUD USERS
================================*/
// CREATE
app.post('/users', async (req, res) => {
    const { name, email } = req.body;
    try {
        const [result] = await pool.query(
            "INSERT INTO users (name, email) VALUES (?, ?)",
            [name, email]
        );
        res.status(201).json({ message: "✅ Usuario creado", id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: "❌ Error al crear usuario", error: error.message });
    }
});

// READ
app.get('/users', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM users");
        res.json({ count: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ message: "❌ Error al obtener usuarios", error: error.message });
    }
});

// UPDATE
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        const [result] = await pool.query(
            "UPDATE users SET name=?, email=? WHERE id=?",
            [name, email, id]
        );
        res.json({ message: "✅ Usuario actualizado", affectedRows: result.affectedRows });
    } catch (error) {
        res.status(500).json({ message: "❌ Error al actualizar usuario", error: error.message });
    }
});

// DELETE
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query("DELETE FROM users WHERE id=?", [id]);
        res.json({ message: "✅ Usuario eliminado", affectedRows: result.affectedRows });
    } catch (error) {
        res.status(500).json({ message: "❌ Error al eliminar usuario", error: error.message });
    }
});

/* ===============================
   CRUD TRANSACTIONS
================================*/
// CREATE
app.post('/transactions', async (req, res) => {
    const { user_id, amount, date } = req.body;
    try {
        const [result] = await pool.query(
            "INSERT INTO transactions (user_id, amount, date) VALUES (?, ?, ?)",
            [user_id, amount, date]
        );
        res.status(201).json({ message: "✅ Transacción creada", id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: "❌ Error al crear transacción", error: error.message });
    }
});

// READ
app.get('/transactions', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM transactions");
        res.json({ count: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ message: "❌ Error al obtener transacciones", error: error.message });
    }
});

// UPDATE
app.put('/transactions/:id', async (req, res) => {
    const { id } = req.params;
    const { user_id, amount, date } = req.body;
    try {
        const [result] = await pool.query(
            "UPDATE transactions SET user_id=?, amount=?, date=? WHERE id=?",
            [user_id, amount, date, id]
        );
        res.json({ message: "✅ Transacción actualizada", affectedRows: result.affectedRows });
    } catch (error) {
        res.status(500).json({ message: "❌ Error al actualizar transacción", error: error.message });
    }
});

// DELETE
app.delete('/transactions/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query("DELETE FROM transactions WHERE id=?", [id]);
        res.json({ message: "✅ Transacción eliminada", affectedRows: result.affectedRows });
    } catch (error) {
        res.status(500).json({ message: "❌ Error al eliminar transacción", error: error.message });
    }
});


// CREATE
app.post('/ainvoice', async (req, res) => {
    const { invoice_number, amount, date } = req.body;
    try {
        const [result] = await pool.query(
            "INSERT INTO ainvoice (invoice_number, amount, date) VALUES (?, ?, ?)",
            [invoice_number, amount, date]
        );
        res.status(201).json({ message: "✅ Factura creada", id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: "❌ Error al crear factura", error: error.message });
    }
});

// READ
app.get('/ainvoice', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM ainvoice");
        res.json({ count: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ message: "❌ Error al obtener facturas", error: error.message });
    }
});

// UPDATE
app.put('/ainvoice/:id', async (req, res) => {
    const { id } = req.params;
    const { invoice_number, amount, date } = req.body;
    try {
        const [result] = await pool.query(
            "UPDATE ainvoice SET invoice_number=?, amount=?, date=? WHERE id=?",
            [invoice_number, amount, date, id]
        );
        res.json({ message: "✅ Factura actualizada", affectedRows: result.affectedRows });
    } catch (error) {
        res.status(500).json({ message: "❌ Error al actualizar factura", error: error.message });
    }
});

// DELETE
app.delete('/ainvoice/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query("DELETE FROM ainvoice WHERE id=?", [id]);
        res.json({ message: "✅ Factura eliminada", affectedRows: result.affectedRows });
    } catch (error) {
        res.status(500).json({ message: "❌ Error al eliminar factura", error: error.message });
    }
});

// Consultas avanzadas 

// total paid by each client
app.get('/report/total-paid', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                u.id_user,
                u.name_user,
                SUM(i.amount_paid) AS total_paid
            FROM users u
            INNER JOIN transactions t ON u.id_user = t.id_user
            INNER JOIN invoice i ON t.id_transaction = i.id_transaction
            GROUP BY u.id_user, u.name_user
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "❌ Error al obtener el total pagado", error: error.message });
    }
});

// pending invoices with clients

app.get('/report/pending-invoices', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                i.id_invoice,
                u.name_user,
                t.id_transaction,
                t.transaction_date,
                i.invoice_amount,
                i.amount_paid,
                (i.invoice_amount - i.amount_paid) AS pending_amount
            FROM invoice i
            INNER JOIN transactions t ON i.id_transaction = t.id_transaction
            INNER JOIN users u ON t.id_user = u.id_user
            WHERE i.amount_paid < i.invoice_amount
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "❌ Error al obtener facturas pendientes", error: error.message });
    }
});


// transactions by platform

app.get('/report/platform-transactions/:platform', async (req, res) => {
    const { platform } = req.params;
    try {
        const [rows] = await pool.query(`
            SELECT 
                t.id_transaction,
                t.platform_name,
                t.transaction_date,
                t.amount,
                u.name_user,
                i.id_invoice,
                i.invoice_amount,
                i.amount_paid
            FROM transactions t
            INNER JOIN users u ON t.id_user = u.id_user
            LEFT JOIN invoice i ON t.id_transaction = i.id_transaction
            WHERE t.platform_name = ?
        `, [platform]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "❌ Error al obtener transacciones por plataforma", error: error.message });
    }
});



/* ===============================
   INICIO SERVIDOR
================================*/
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server listening at http://localhost:${PORT}`);
});
