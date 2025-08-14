/* Responsible for loading users into the database */
import fs from 'fs'; // allows me to read files
import path from 'path'; // shows the current path
import csv from 'csv-parser';
import { pool } from '../conexion_bd.js';

export async function loadUsersToDatabase() {
    const filePath = path.resolve('server/data/users_luis.csv');
    const users = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
                users.push([
                    row.id_user,
                    row.name_user.trim(),
                    row.identification_number,
                    row.email,
                    row.phone,
                    row.address
                ]);
            })
            .on('end', async () => {
                try {
                    const sql = 'INSERT INTO users (id_user, name_user, identification_number, email, phone, address) VALUES ?';
                    const [result] = await pool.query(sql, [users]);

                    console.log(`✅ Inserted ${result.affectedRows} users.`);
                    resolve(); // Successfully finishes
                } catch (error) {
                    console.error('❌ Error inserting users:', error.message);
                    reject(error);
                }
            })
            .on('error', (err) => {
                console.error('❌ Error reading users CSV file:', err.message);
                reject(err);
            });
    });
}
