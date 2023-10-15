import axios from "axios";

// export async function getTrackingSummoners() {
//   try {
//     const response = await axios.get("http://localhost:3001/trackingSummoners");
//     return response.data;
//   } catch (error) {
//     console.log("error");
//     return [];
//   }
// }

// export async function trackSummoner(name, reigion) {
//   let summoner = {
//     summonerName: name,
//     createdAt: Date.now(),
//     selectedReigion: reigion,
//   };
//   try {
//     await axios.post("http://localhost:3001/trackSummoner", summoner);
//   } catch (error) {
//     console.log("error");
//   }
// }

// export async function stopTracking(name) {
//   let summoner = { name, createdAt: Date.now() };
//   try {
//     await axios.post("http://localhost:3001/stopTracking", summoner);
//   } catch (error) {
//     console.log("error");
//   }
// }

// export async function getSummoner(name) {
//   return name;
// }

export async function testTrack(name, reigion, playerId, recent, id) {
  const summoner = {
    summonerName: name,
    puuid: playerId,
    selectedReigion: reigion,
    mostRecentMatch: recent,
    playerId: id,
  };
  try {
    const info = await axios.post(
      "https://lptracker-server.onrender.com/addSummoner",
      summoner
    );
    // console.log(info.data);
  } catch (error) {
    console.log("error");
  }
}

export async function testGetAllSummoners() {
  try {
    const response = await axios.get(
      "https://lptracker-server.onrender.com/getTrackingSummoners"
    );
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("error");
    return [];
  }
}

export async function testGetSummoner(name) {
  const summonerName = name;
  try {
    const response = await axios.get(
      `https://lptracker-server.onrender.com/getSummoner/${summonerName}`
    );
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("error");
    return [];
  }
}

export async function testDeleteSummoner(name) {
  const summonerName = name;
  try {
    const response = await axios.delete(
      `https://lptracker-server.onrender.com/deleteSummoner/${summonerName}`
    );
    console.log(response.data);
  } catch (error) {
    console.log("error");
  }
}

export async function getMatchHistory(playerName) {
    const name = playerName;
    try {
      const response = await axios.get(
        `https://lptracker-server.onrender.com/getMatchHistory/${name}`
      );
    //   console.log(response.data);
      return response.data;
    } catch (error) {
      console.log("error");
      return [];
    }
  }