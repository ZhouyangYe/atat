const util = require('util');
const mysql = require('mysql');
const logger = require('@/utils/logger');
const config = require('./config');

/**
 * Connection to the database.
 */
const db = mysql.createPool({
  connectionLimit: config.LIMIT,
  host: config.HOSTNAME,
  user: config.USER,
  password: config.PASSWORD,
  database: config.DATABASE,
});

db.getConnection((err, connection) => {
  if (err) {
    logger.error(`Cannot connect to database: ${err.message}`);
  }

  if (connection) {
    connection.release();
  }

  return;
});

db.query = util.promisify(db.query);

module.exports = db;
