
# Performance Test Luis Cera

This project contains an API to manage authors, users, transactions, and invoices.

---

## Requirements

- Node.js (version 16 or higher recommended)  
- npm (comes with Node.js)  
- MySQL database configured and running  
- `.env` file configured with the database connection details  

---

## Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd prueba_desempeño_luiscera/prueba_desempeño
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

- Create a `.env` file in the project root if it doesn't exist.  
- Add the necessary variables, for example:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=db_transactions
PORT=3000
```

Make sure these values match your MySQL database setup.

---

## Usage

### Load initial data (seeders)

To insert initial data into the database (authors, users, transactions, invoices), run:

```bash
node server/seeders/run_seeders.js
```

If you encounter invalid data errors, check the data format in the seeders or the database structure.

---

### Start the server

To run the server (API):

```bash
npm run dev
```

Make sure the port configured in `.env` is available.

---

## Testing the API with Postman

1. Open Postman.  
2. Create a new request.  
3. Use the base URL (e.g., `http://localhost:3000/api`) and add the route you want to test, for example:  
   - `GET /api/authors`  
   - `POST /api/invoices`  
4. Set headers (for example, `Content-Type: application/json`) and body if needed.  
5. Send the request and check the response.

---

## Contact

For questions or help, you can contact me at:  
**Luis Daniel** — ceraluis4@domain.com
