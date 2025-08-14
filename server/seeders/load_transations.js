// server/utils/loadTransactions.js
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { pool } from '../conexion_bd.js';

export async function loadTransactionsToDatabase() {
    const filePath = path.resolve('server/data/transaction_luis.csv');
    const transactions = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
                transactions.push([
                    row.id_transaction,
                    row.id_user,
                    row.transaction_date,
                    parseFloat(row.amount), // Ensure number
                    row.transaction_states,
                    row.transaction_type || 'sale', // 👈 If missing, use "sale"
                    row.platform_name
                ]);
            })
            .on('end', async () => {
                try {
                    const sql = `
                        INSERT INTO transactions 
                        (id_transaction, id_user, transaction_date, amount, transaction_states, transaction_type, platform_name) 
                        VALUES ?
                    `;
                    const [result] = await pool.query(sql, [transactions]);

                    console.log(`✅ Inserted ${result.affectedRows} transactions.`);
                    resolve();
                } catch (error) {
                    console.error('❌ Error inserting transactions:', error.message);
                    reject(error);
                }
            })
            .on('error', (err) => {
                console.error('❌ Error reading transactions CSV file:', err.message);
                reject(err);
            });
    });
}
