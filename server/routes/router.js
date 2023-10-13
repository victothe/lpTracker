require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");

let trackingSummoners = [];

router.get("/api/RIOT/getPlayer", async (req, res) => {
  try {
    const name = req.query.summonerName;
    const reigion = req.query.selectedReigion;
    const url =
      "https://" +
      reigion +
      ".api.riotgames.com/lol/summoner/v4/summoners/by-name/" +
      name +
      "?api_key=" +
      process.env.RIOT_API_KEY;
    const response = await axios.get(url);
    const data = response.data;
    res.json(data);
  } catch (error) {
    console.error("Error making external API request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/api/RIOT/getRank", async (req, res) => {
  try {
    const id = req.query.summonerId;
    const reigion = req.query.selectedReigion;
    const url =
      "https://" +
      reigion +
      ".api.riotgames.com/lol/league/v4/entries/by-summoner/" +
      id +
      "?api_key=" +
      process.env.RIOT_API_KEY;
    const response = await axios.get(url);
    const data = response.data;
    res.json(data);
  } catch (error) {
    console.error("Error making external API request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/api/RIOT/inGame", async (req, res) => {
  try {
    const id = req.query.summonerId;
    const reigion = req.query.selectedReigion;
    const url =
      "https://" +
      reigion +
      ".api.riotgames.com/lol/spectator/v4/active-games/by-summoner/" +
      id +
      "?api_key=" +
      process.env.RIOT_API_KEY;
    const response = await axios.get(url);
    const data = response.data;
    res.json(data);
  } catch (error) {
    // console.error("Error making external API request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/api/RIOT/getMatches", async (req, res) => {
  try {
    const puuid = req.query.summonerPuuid;
    const genReigion = req.query.selectedReigion;
    const url =
      "https://" +
      genReigion +
      ".api.riotgames.com/lol/match/v5/matches/by-puuid/" +
      puuid +
      "/ids?start=0&count=10" +
      "&api_key=" +
      process.env.RIOT_API_KEY;
    const response = await axios.get(url);
    const data = response.data;
    res.json(data);
  } catch (error) {
    console.error("Error making external API request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/api/RIOT/getMatchInfo", async (req, res) => {
  try {
    const match = req.query.matchId;
    const genReigion = req.query.selectedReigion;
    const url =
      "https://" +
      genReigion +
      ".api.riotgames.com/lol/match/v5/matches/" +
      match +
      "?api_key=" +
      process.env.RIOT_API_KEY;
    const response = await axios.get(url);
    const data = response.data;
    res.json(data);
  } catch (error) {
    console.error("Error making external API request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// router.post("/trackSummoner", async (req, res) => {
//   try {
//     const summoner = req.body;
//     trackingSummoners.push(summoner);
//     console.log(trackingSummoners);
//   } catch (error) {
//     console.error("Error making external API request:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// router.post("/stopTracking", async (req, res) => {
//   try {
//     const remove = req.body.name;
//     for (let i = 0; i < trackingSummoners.length; i++) {
//       if (trackingSummoners[i].summonerName === remove) {
//         trackingSummoners.splice(i, 1);
//       }
//     }
//   } catch (error) {
//     console.error("Error making external API request:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// router.get("/trackingSummoners", async (req, res) => {
//   try {
//     const summoners = trackingSummoners;
//     res.json(summoners);
//   } catch (error) {
//     console.error("Error making external API request:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

module.exports = router;
