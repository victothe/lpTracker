const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
  user: "summoners_user",
  password: process.env.POOL_PASSWORD,
  host: process.env.HOST,
  port: 5432,
  database: "summoners",
  ssl: true
});


module.exports = pool;