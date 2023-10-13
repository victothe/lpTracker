const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "Helimon13$",
  host: "localhost",
  port: 5432,
  database: "summoners",
});


module.exports = pool;