import { ChangeEvent, useState, useEffect } from "react";
import axios from "axios";
import {
  testTrack,
  testGetAllSummoners,
  testGetSummoner,
  testDeleteSummoner,
  getMatchHistory,
} from "../search";
import { useLoaderData, redirect } from "react-router-dom";
import "./summoner.css";
import Navbar from "./navbar";

// page loader
export async function loader({ params }) {
  const playerName = params.summonerName;
  const reigion = params.reigion;
  const matches = await getMatchHistory(playerName);
  if (matches.length !== 0 && matches.length >= 1) {
    for (let i = 1; i < matches.length; i++) {
      if (matches[i].rank === matches[i - 1].rank) {
        matches[i].change = matches[i].lp - matches[i - 1].lp;
      }
    }
  }
  return { playerName, reigion, matches };
}

// uhhhh figure out...
export async function action({ params }) {
  // const summoner = await createSummoner(params.summonerName);
  return null;
}

export default function App() {
  const [searchText, setSearchText] = useState("");
  const [selectedReigion, setSelectedReigion] = useState("");
  const [trackingDisabled, setTrackingDisabled] = useState(false);
  const [trackingPlayers, setTrackingPlayers] = useState([]);
  const [mostRecentMatch, setMostRecentMatch] = useState([]);
  const [sortedMatches, setSortedmatches] = useState([]);

  // execute on page render
  useEffect(() => {
    setSearchText(playerName);
    setSelectedReigion(reigion);

    // gets currently tracking players
    async function fetchData() {
      try {
        const data = await testGetAllSummoners();
        setTrackingPlayers(data);
      } catch (error) {
        console.error("error: ", error);
      }
    }
    fetchData();
  }, []);

  // search for player once searchText and selectedReigion are set
  useEffect(() => {
    if (searchText !== "" && selectedReigion !== "") {
      searchPlayerFromServer();
    }
  }, [searchText, selectedReigion]);

  const { playerName, reigion, matches } = useLoaderData();

  const [playerData, setPlayerData] = useState({
    name: "",
    profileIconId: 0,
    accountId: "",
    revisionDate: 0,
    id: "",
    puuid: "",
    summonerLevel: 0,
  });
  const [playerRank, setPlayerRank] = useState({
    queueType: "",
    tier: "",
    rank: "",
    leaguePoints: null,
    wins: null,
    losses: null,
  });
  const [currentGameInfo, setCurrentGameInfo] = useState({
    gameQueueConfigId: null,
    gameStartTime: 0,
    participants: [],
  });

  const searchPlayerFromServer = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/RIOT/getPlayer?summonerName=${searchText}&selectedReigion=${selectedReigion}`
      );
      setPlayerData({
        profileIconId: response.data.profileIconId,
        name: response.data.name,
        accountId: response.data.accountId,
        revisionDate: response.data.revisionDate,
        id: response.data.id,
        puuid: response.data.puuid,
        summonerLevel: response.data.summonerLevel,
      });
    } catch (error) {
      console.error("error fetching data from server", error);
      setPlayerData({
        name: "",
        profileIconId: 0,
        accountId: "",
        revisionDate: 0,
        id: "",
        puuid: "",
        summonerLevel: 0,
      });
      setPlayerRank({
        queueType: "",
        tier: "",
        rank: "",
        leaguePoints: null,
        wins: null,
        losses: null,
      });
    }
  };

  useEffect(() => {
    // if playerData is valid, get rank and checkInGame
    if (playerData.name !== "") {
      getPlayerRankFromServer();
      checkInGame();
      getMatch();
      // if player is already being tracked, disable tracking button
      for (let i = 0; i < trackingPlayers.length; i++) {
        if (trackingPlayers[i].description === playerData.name) {
          setTrackingDisabled(true);
        }
      }

      // reverses matches array
      if (matches.length !== 0) {
        setSortedmatches(matches.reverse());
      }
    }
  }, [playerData]);

  // useEffect(() => {
  //   if (sortedMatches.length !== 0 && sortedMatches.length >= 1) {
  //     for (let i = 1; i < sortedMatches.length; i++) {
  //       if (sortedMatches[i].rank === sortedMatches[i - 1].rank) {
  //         sortedMatches[i].change =
  //           sortedMatches[i].lp - sortedMatches[i - 1].lp;
  //       }
  //     }
  //   }
  // }, [sortedMatches]);

  const getPlayerRankFromServer = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/RIOT/getRank?summonerId=${playerData.id}&selectedReigion=${selectedReigion}`
      );
      setPlayerRank({
        queueType: "",
        tier: "",
        rank: "",
        leaguePoints: null,
        wins: null,
        losses: null,
      });
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].queueType === "RANKED_SOLO_5x5") {
          setPlayerRank({
            queueType: response.data[i].queueType,
            tier: response.data[i].tier,
            rank: response.data[i].rank,
            leaguePoints: response.data[i].leaguePoints,
            wins: response.data[i].wins,
            losses: response.data[i].losses,
          });
        }
      }
    } catch (error) {
      // if solo rank doesn't exist
      console.error("error fetching data from server", error);
      setPlayerRank({
        queueType: "",
        tier: "",
        rank: "",
        leaguePoints: null,
        wins: null,
        losses: null,
      });
    }
  };

  const checkInGame = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/RIOT/inGame?summonerId=${playerData.id}&selectedReigion=${selectedReigion}`
      );
      setCurrentGameInfo({
        gameQueueConfigId: response.data.gameQueueConfigId,
        gameStartTime: response.data.gameStartTime,
        participants: response.data.participants,
      });
    } catch (error) {
      // if not in game
      setCurrentGameInfo({
        gameQueueConfigId: null,
        gameStartTime: 0,
        participants: [],
      });
      console.error("error fetching data from server", error);
    }
  };

  const getMatch = async () => {
    let genReigion = "americas";
    if (selectedReigion === "kr") {
      genReigion = "asia";
    } else if (selectedReigion === "euw1") {
      genReigion = "europe";
    }
    try {
      const response = await axios.get(
        `http://localhost:3001/api/RIOT/getMatches?summonerPuuid=${playerData.puuid}&selectedReigion=${genReigion}`
      );
      setMostRecentMatch(response.data);
      // console.log(response.data);
    } catch (error) {
      // if not in game
      console.error("error fetching data from server", error);
    }
  };

  function secondsToMinutesAndSeconds(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Create a formatted string
    const timeString = `${minutes}m ${seconds}s`;

    return timeString;
  }

  function unixTimestampToTimeString(unixTimestamp) {
    // Create a Date object using the Unix timestamp (in milliseconds)
    const date = new Date(unixTimestamp * 1000);

    // Extract the components (hours, minutes, seconds)
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    // const seconds = date.getUTCSeconds().toString().padStart(2, '0');

    // Format the time string
    const timeString = `${hours}:${minutes}`;

    return timeString;
  }

  return (
    <>
      <Navbar />
      {playerData.name !== "" ? (
        <>
          <h4>{playerData.name}</h4>
          <img
            width="100"
            height="100"
            src={
              "http://ddragon.leagueoflegends.com/cdn/13.19.1/img/profileicon/" +
              playerData.profileIconId +
              ".png"
            }
          />
          <p>LEVEL: {playerData.summonerLevel}</p>

          <button
            disabled={trackingDisabled}
            onClick={() => {
              testTrack(
                playerData.name,
                selectedReigion,
                playerData.puuid,
                mostRecentMatch[0],
                playerData.id
              );
              setTrackingDisabled(true);
            }}
          >
            start tracking summoner
          </button>
          <button
            disabled={!trackingDisabled}
            onClick={() => {
              testDeleteSummoner(playerData.name);
              setTrackingDisabled(false);
            }}
          >
            stop tracking summoner
          </button>
        </>
      ) : (
        <>
          <p>Loading...</p>
        </>
      )}
      {playerRank.queueType !== "" ? (
        <>
          <p>
            Ranked Solo: {playerRank.tier} {playerRank.rank}{" "}
            {playerRank.leaguePoints}LP
          </p>
          <p>
            {playerRank.wins}W {playerRank.losses}L
          </p>
        </>
      ) : (
        <>{/* <p>No Ranked Data</p> */}</>
      )}
      {currentGameInfo.gameQueueConfigId === null ? (
        <>{/* <p>Not Currently In Game</p> */}</>
      ) : (
        <>
          <p>CURRENTLY IN GAME</p>
        </>
      )}
      {sortedMatches.length ? (
        <ul>
          <h3>MATCH HISTORY</h3>
          {sortedMatches.map((match) => (
            <li key={match.gamestart}>
              {match.winloss && "WIN"} {!match.winloss && "LOSS"} {match.lp} LP{" "}
              {match.rank} Length: {secondsToMinutesAndSeconds(match.length)}{" "}
            </li>
          ))}
        </ul>
      ) : (
        <p>
          <i>No Games Tracked</i>
        </p>
      )}
    </>
  );
}
