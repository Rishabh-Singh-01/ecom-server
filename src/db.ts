import mysql from 'mysql2/promise';

// import { db } from './db./ts';

const dbHost = process.env.DB_HOST || 'localhost';
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

// creating connection with server

let db: mysql.Pool;
(async () => {
  console.info('Configuring the database connection...');
  try {
    db = mysql.createPool({
      connectionLimit: 10,
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      decimalNumbers: true,
      dateStrings: true,
    });
    console.log('Connection pool created successfully');
  } catch (error) {
    console.error('Error creating connection pool:', error);
  }
})();

export default db!;
