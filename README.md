# Load Excel Data into MySQL and Fetch Data Using API

## Introduction
This project was developed as part of my learning journey in integrating Excel data with a MySQL database and creating an API using Node.js. The project aims to demonstrate how to load data from an Excel file into a database, query the data using an API, and handle common challenges encountered during the process. 

The following key concepts were explored:
- Setting up a MySQL database
- Importing Excel data into the database
- Connecting MySQL with a Node.js application
- Creating and testing an API using Express
- Troubleshooting database and API issues

---

## Concepts

1. **MySQL Database Setup**: Understanding how to install and configure MySQL on Windows, create databases and tables, and import data efficiently.
2. **Node.js Integration**: Learning how to set up a Node.js application, connect it with MySQL, and manage sensitive information using environment variables.
3. **Express API Development**: Using Express to build a RESTful API that interacts with the database.
4. **Error Handling**: Addressing authentication and connection issues, and debugging API errors.

---

## Step-by-Step Process

### 1. Setting Up MySQL

#### Install MySQL
- Download and install MySQL using the MySQL Installer for Windows.
- Set up a root password and note the default port (3306).

#### Create Database and Table
- Created a new database `stocks_data`:
  ```sql
  CREATE DATABASE stocks_data;
  ```
- Created a `fund_data` table to store financial data:
  ```sql
  CREATE TABLE fund_data (
      id INT AUTO_INCREMENT PRIMARY KEY,
      ticker VARCHAR(50),
      date DATE,
      net_asset_value FLOAT
  );
  ```

#### Import Excel Data
- Converted the Excel file into a CSV format.
- Imported the CSV data into MySQL using:
  ```sql
  LOAD DATA INFILE 'path/to/file.csv' INTO TABLE fund_data
  FIELDS TERMINATED BY ','
  LINES TERMINATED BY '\n';
  ```

---

### 2. Setting Up Node.js

#### Initialize the Project
- Installed Node.js and created a new project:
  ```bash
  npm init -y
  ```
- Installed required dependencies:
  ```bash
  npm install express mysql dotenv
  ```

#### Configure Database Connection
- Created a `db.js` file for database connection:
  ```javascript
  const mysql = require('mysql');
  require('dotenv').config();

  const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
  });

  connection.connect((err) => {
      if (err) throw err;
      console.log('Connected to MySQL database.');
  });

  module.exports = connection;
  ```
- Used a `.env` file to store credentials securely:
  ```plaintext
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=your_password
  DB_NAME=stocks_data
  ```

#### Create the API
- Built an API endpoint in `index.js`:
  ```javascript
  const express = require('express');
  const db = require('./db');

  const app = express();
  const PORT = 3000;

  app.get('/api/stock/:ticker', (req, res) => {
      const { ticker } = req.params;
      const query = 'SELECT * FROM fund_data WHERE ticker = ?';

      db.query(query, [ticker], (err, results) => {
          if (err) {
              console.error(err);
              res.status(500).send('Server error');
          } else {
              res.json(results);
          }
      });
  });

  app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
  });
  ```

---

## Errors Encountered and Solutions

### 1. Authentication Error: `ER_NOT_SUPPORTED_AUTH_MODE`
- **Issue**: MySQL 8.0 uses the `caching_sha2_password` authentication method, which is incompatible with the `mysql` client.
- **Solution**:
  - Changed the authentication method to `mysql_native_password`:
    ```sql
    ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
    FLUSH PRIVILEGES;
    ```
  - Restarted the MySQL service.
  - Alternatively, switched to the `mysql2` client:
    ```bash
    npm uninstall mysql
    npm install mysql2
    ```

### 2. Database Connection Errors
- **Issue**: Incorrect credentials or MySQL service not running.
- **Solution**:
  - Verified the `.env` file credentials.
  - Restarted the MySQL service via `services.msc`.
  - Tested the connection using:
    ```bash
    mysql -u root -p
    ```

### 3. CSV Import Issues
- **Issue**: CSV formatting errors during import.
- **Solution**:
  - Ensured proper CSV formatting with correct delimiters.
  - Used `MySQL Workbench` as an alternative to import data interactively.

---

## Key Learnings

1. **MySQL and Node.js Integration**
   - The `mysql2` library offers better compatibility with modern MySQL versions.
   - Using environment variables improves security when handling database credentials.

2. **Error Debugging**
   - MySQL service restarts often resolve configuration-related issues.
   - Understanding authentication protocols is essential for troubleshooting.

3. **API Development**
   - Express simplifies RESTful API creation.
   - Using query parameters makes APIs dynamic and flexible.

4. **CSV Data Import**
   - Converting Excel to CSV is efficient for data migration.
   - Validating data format before import prevents common errors.

---

## Running the Project

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/repository-name.git
   cd repository-name
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the `.env` file with your MySQL credentials.
4. Start the server:
   ```bash
   node index.js
   ```
5. Test the API:
   - **Endpoint**: `http://localhost:3000/api/stock/:ticker`
   - Replace `:ticker` with a valid stock ticker.

---

## License
This project is licensed under the MIT License.
