// server/run_seeders.js
import { loadUsersToDatabase } from "./load_users.js";
import { loadTransactionsToDatabase } from "./load_transations.js";
import { loadInvoicesToDatabase } from "./load_ainvoice.js";

(async () => {
    try {
        console.log('🚀 Starting data load...');

        await loadUsersToDatabase();
        console.log('✅ Users loaded successfully.');

        await loadTransactionsToDatabase();
        console.log('✅ Transactions loaded successfully.');

        await loadInvoicesToDatabase();
        console.log('✅ Invoices loaded successfully.');

        console.log('🎉 All data was inserted successfully.');
    } catch (error) {
        console.error('❌ Error running seeders:', error.message);
    } finally {
        process.exit();
    }
})();
