// server/utils/cargarFacturas.js
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { pool } from '../conexion_bd.js';


export async function loadInvoicesToDatabase() {
    const filePath = path.resolve('server/data/ainvoice.csv');
    const ainvoices = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
                ainvoices.push([
                    row.id_invoice,
                    row.id_transaction,
                    row.invoice_period,
                    parseFloat(row.invoice_amount),
                    parseFloat(row.amount_paid)
                ]);
            })
            .on('end', async () => {
                try {
                    const sql = `
                        INSERT INTO ainvoice 
                        (id_invoice, id_transaction, invoice_period, invoice_amount, amount_paid) 
                        VALUES ?
                    `;
                    const [result] = await pool.query(sql, [ainvoices]);

                    console.log(`✅ Inserted ${result.affectedRows} invoices.`);
                    resolve();
                } catch (error) {
                    console.error('❌ Error inserting invoices:', error.message);
                    reject(error);
                }
            })
            .on('error', (err) => {
                console.error('❌ Error reading invoices CSV file:', err.message);
                reject(err);
            });
    });
}
