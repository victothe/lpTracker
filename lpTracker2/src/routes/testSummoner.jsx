import { ChangeEvent, useState, useEffect } from "react";
import axios from "axios";
import { getTrackingSummoners, stopTracking, trackSummoner } from "../search";
import { useLoaderData } from "react-router-dom";
import "./summoner.css";
import Navbar from "./navbar";

export async function loader({ params }) {
  // const playerName = await getSummoner(params.summonerName);
  const playerName = params.summonerName;
  const reigion = params.reigion;
  return { playerName, reigion };
}

// need to get backend to create new summoner?
export async function action({ params }) {
  // const summoner = await createSummoner(params.summonerName);
  return null;
}

export default function App() {
  const [searchText, setSearchText] = useState("");
  const [selectedReigion, setSelectedReigion] = useState("");
  const [trackingDisabled, setTrackingDisabled] = useState(false);
  const [trackingPlayers, setTrackingPlayers] = useState([]);

  useEffect(() => {
    setSearchText(playerName);
    setSelectedReigion(reigion);
    // setTrackingPlayers(getTrackingSummoners());
    async function fetchData() {
      try {
        const data = await getTrackingSummoners();
        setTrackingPlayers(data);
      } catch (error) {
        console.error("error: ", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (searchText !== "" && selectedReigion !== "") {
      searchPlayerFromServer();
    }
  }, [searchText, selectedReigion]);

  const { playerName, reigion } = useLoaderData();

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
    if (playerData.name !== "") {
      getPlayerRankFromServer();
      checkInGame();

      for (let i = 0; i < trackingPlayers.length; i++) {
        if (trackingPlayers[i].summonerName === playerData.name) {
          setTrackingDisabled(true);
        }
      }
    }
  }, [playerData]);

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

  return (
    <>
      <Navbar />
      {playerData.name !== "" ? (
        <>
          <p>{playerData.name}</p>
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
              trackSummoner(playerData.name, selectedReigion);
              setTrackingDisabled(true);
              console.log(trackingPlayers);
            }}
          >
            Track Player
          </button>
          <button
            disabled={!trackingDisabled}
            onClick={() => {
              stopTracking(playerData.name);
              setTrackingDisabled(false);
            }}
          >
            Stop Tracking
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
        <>
          <p>No Ranked Data</p>
        </>
      )}
      {currentGameInfo.gameQueueConfigId === null ? (
        <>
          <p>Not Currently In Game</p>
        </>
      ) : (
        <>
          <p>CURRENTLY IN GAME</p>
        </>
      )}
    </>
  );
}
