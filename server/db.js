const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
  user: "postgres",
  password: process.env.POOL_PASSWORD,
  host: "localhost",
  port: 5432,
  database: "summoners",
});


module.exports = pool;