const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./routes/router");
require("dotenv").config();
const pool = require("./db");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const corsOptions = {
  origin: "*",
  credintials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use("/", router);

app.post("/addSummoner", async (req, res) => {
  try {
    const { summonerName, selectedReigion } = req.body;
    console.log(`now tracking ${summonerName} ${selectedReigion}`);
    const newSummoner = await pool.query(
      "INSERT INTO info (description, reigion) VALUES($1, $2) RETURNING *",
      [summonerName, selectedReigion]
    );

    res.json(newSummoner.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/getTrackingSummoners", async (req, res) => {
  try {
    const allSummoners = await pool.query("SELECT * FROM info");
    res.json(allSummoners.rows);
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/getSummoner/:summonerName", async (req, res) => {
  try {
    const { summonerName } = req.params;
    const summoner = await pool.query(
      "SELECT * FROM info WHERE description = $1",
      [summonerName]
    );
    res.json(summoner.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

app.delete("/deleteSummoner/:summonerName", async (req, res) => {
  try {
    const { summonerName } = req.params;
    const deleteSummoner = await pool.query(
      "DELETE FROM info WHERE description = $1",
      [summonerName]
    );
    res.json(`${summonerName} was deleted`)
  } catch (error) {
    console.log(error.message);
  }
});

const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
