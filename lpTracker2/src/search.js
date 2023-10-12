import axios from "axios";

export async function getTrackingSummoners() {
  try {
    const response = await axios.get("http://localhost:3001/trackingSummoners");
    return response.data;
  } catch (error) {
    console.log("error");
    return [];
  }
}

export async function trackSummoner(name, reigion) {
  let summoner = {
    summonerName: name,
    createdAt: Date.now(),
    selectedReigion: reigion,
  };
  try {
    await axios.post("http://localhost:3001/trackSummoner", summoner);
  } catch (error) {
    console.log("error");
  }
}

export async function stopTracking(name) {
  let summoner = { name, createdAt: Date.now() };
  try {
    await axios.post("http://localhost:3001/stopTracking", summoner);
  } catch (error) {
    console.log("error");
  }
}

export async function getSummoner(name) {
  return name;
}

function set(summoners) {}
