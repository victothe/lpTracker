import { ChangeEvent, useState, useEffect } from "react";
import "./summoner.css";
import axios from "axios";
import { useLoaderData } from "react-router-dom";
import { getSummoner } from "../search";

export async function loader({ params }) {
  const playerName = await getSummoner(params.summonerName);
  return { playerName };
}

function App() {
  const [showReady, setShowReady] = useState(false);
  const [showMatchList, setShowMatchList] = useState(false);
  const [recentMatches, setRecentMatches] = useState([]);
  // this might be bad practice
  const [hookmatchesInfo, sethookMatchesInfo] = useState([]);
  let matchesInfo = [];
  const [selectedReigion, setSelectedReigion] = useState("na1");
  const [searchDisabled, setsearchDisabled] = useState(false);
  const [searchText, setSearchText] = useState("");
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
  const [currentChampId, setCurrentChampId] = useState(0);
  //need to fix this, maybe write function to get from RIOT and put in seperate file
  let allChamps = [
    "Annie",
    "Olaf",
    "Galio",
    "Twisted Fate",
    "Xin Zhao",
    "Urgot",
    "LeBlanc",
    "Vladimir",
    "Fiddlesticks",
    "Kayle",
    "Master Yi",
    "Alistar",
    "Ryze",
    "Sion",
    "Sivir",
    "Soraka",
    "Teemo",
    "Tristana",
    "Warwick",
    "Nunu & Willump",
    "Miss Fortune",
    "Ashe",
    "Tryndamere",
    "Jax",
    "Morgana",
    "Zilean",
    "Singed",
    "Evelynn",
    "Twitch",
    "Karthus",
    "Cho'Gath",
    "Amumu",
    "Rammus",
    "Anivia",
    "Shaco",
    "Dr.Mundo",
    "Sona",
    "Kassadin",
    "Irelia",
    "Janna",
    "Gangplank",
    "Corki",
    "Karma",
    "Taric",
    "Veigar",
    "Trundle",
    "Swain",
    "Caitlyn",
    "Blitzcrank",
    "Malphite",
    "Katarina",
    "Nocturne",
    "Maokai",
    "Renekton",
    "JarvanIV",
    "Elise",
    "Orianna",
    "Wukong",
    "Brand",
    "LeeSin",
    "Vayne",
    "Rumble",
    "Cassiopeia",
    "Skarner",
    "Heimerdinger",
    "Nasus",
    "Nidalee",
    "Udyr",
    "Poppy",
    "Gragas",
    "Pantheon",
    "Ezreal",
    "Mordekaiser",
    "Yorick",
    "Akali",
    "Kennen",
    "Garen",
    "Leona",
    "Malzahar",
    "Talon",
    "Riven",
    "Kog'Maw",
    "Shen",
    "Lux",
    "Xerath",
    "Shyvana",
    "Ahri",
    "Graves",
    "Fizz",
    "Volibear",
    "Rengar",
    "Varus",
    "Nautilus",
    "Viktor",
    "Sejuani",
    "Fiora",
    "Ziggs",
    "Lulu",
    "Draven",
    "Hecarim",
    "Kha'Zix",
    "Darius",
    "Jayce",
    "Lissandra",
    "Diana",
    "Quinn",
    "Syndra",
    "AurelionSol",
    "Kayn",
    "Zoe",
    "Zyra",
    "Kai'sa",
    "Seraphine",
    "Gnar",
    "Zac",
    "Yasuo",
    "Vel'Koz",
    "Taliyah",
    "Camille",
    "Akshan",
    "Braum",
    "Jhin",
    "Kindred",
    "Jinx",
    "TahmKench",
    "Viego",
    "Senna",
    "Lucian",
    "Zed",
    "Kled",
    "Ekko",
    "Qiyana",
    "Vi",
    "Aatrox",
    "Nami",
    "Azir",
    "Yuumi",
    "Samira",
    "Thresh",
    "Illaoi",
    "Rek'Sai",
    "Ivern",
    "Kalista",
    "Bard",
    "Rakan",
    "Xayah",
    "Ornn",
    "Sylas",
    "Neeko",
    "Aphelios",
    "Rell",
    "Pyke",
    "Vex",
    "Yone",
    "Sett",
    "Lillia",
    "Gwen",
  ];
  const [timeStarted, setTimeStarted] = useState("");

  function handleChange(event) {
    setSearchText(event.currentTarget.value);
  }

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
      getMatches();
    }
  }, [playerData]);

  useEffect(() => {
    let date = new Date(currentGameInfo.gameStartTime);
    setTimeStarted(date.toString());
  }, [currentGameInfo]);

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
      for (let i = 0; i < response.data.participants.length; i++) {
        if (response.data.participants[i].summonerId === playerData.id) {
          setCurrentChampId(response.data.participants[i].championId);
        }
      }
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

  const getMatches = async () => {
    //list rank, champ played, win/loss, lp change
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
      setRecentMatches(response.data);
    } catch (error) {
      // if not in game
      setRecentMatches([]);
      console.error("error fetching data from server", error);
    }
  };
  useEffect(() => {
    if (recentMatches.length !== 0) {
      getMatchesInfo();
    }
  }, [recentMatches]);

  const getMatchesInfo = async () => {
    //get individual match information
    //setMatchesInfo([]);
    matchesInfo = [];
    //maybe make this a hookstate
    let genReigion = "americas";
    if (selectedReigion === "kr") {
      genReigion = "asia";
    } else if (selectedReigion === "euw1") {
      genReigion = "europe";
    }
    for (let i = 0; i < recentMatches.length; i++) {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/RIOT/getMatchInfo?matchId=${recentMatches[i]}&selectedReigion=${genReigion}`
        );
        //setMatchesInfo([...matchesInfo, response.data]);
        matchesInfo.push(response.data);
      } catch (error) {
        // if match doesn't exist
        console.error("error fetching data from server", error);
      }
    }
    sethookMatchesInfo(matchesInfo);
  };
  useEffect(() => {
    if (hookmatchesInfo.length === 10) {
      // MatchList();
      setShowReady(true);
    }
  }, [hookmatchesInfo]);

  function MatchList() {
    // each i in MatchesInfo has metadata and info, info contains individual summoner information
    let playerMatchInfo = [];
    for (let i = 0; i < hookmatchesInfo.length; i++) {
      for (let j = 0; j < hookmatchesInfo[i].info.participants.length; j++) {
        if (
          hookmatchesInfo[i].info.participants[j].summonerName ===
          playerData.name
        ) {
          playerMatchInfo.push(hookmatchesInfo[i].info.participants[j]);
          playerMatchInfo[i].key = i;
          // add in key
          break;
        }
      }
    }

    const listItems = playerMatchInfo.map((match) => (
      <li key={match.key}>
        {match.win === true ? (
          <>
            <p>WIN</p>
          </>
        ) : (
          <>
            <p>LOSS</p>
          </>
        )}
      </li>
    ));
    return <ul>{listItems}</ul>;
  }

  return (
    <>
      <h2>League of Legends Summoner Tracker</h2>
      <h4>Find a player and get notified when they finish a game</h4>
      <input type="text" onChange={handleChange}></input>
      <select
        value={selectedReigion}
        onChange={(e) => setSelectedReigion(e.target.value)}
      >
        <option value="na1">NA</option>
        <option value="kr">KR</option>
        <option value="euw1">EUW</option>
      </select>
      <button
        onClick={() => {
          setShowReady(false);
          searchPlayerFromServer();
          setsearchDisabled(true);
          setTimeout(() => {
            setsearchDisabled(false);
          }, 3000);
        }}
        disabled={!searchText || searchDisabled}
      >
        Search for Player
      </button>
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
            onClick={() => setsearchDisabled(true)}
            disabled={searchDisabled}
          >
            Track Player
          </button>
          <button
            onClick={() => {
              setsearchDisabled(false);
            }}
          >
            Stop Tracking
          </button>
          {/* <button
            onClick={() => {
              getMatchesInfo();
            }}
          >
            Get match info
          </button> */}
          <button
            onClick={() => {
              setShowMatchList(!showMatchList);
            }}
            disabled={!showReady}
          >
            show recent matches
          </button>
          {showReady && showMatchList && <MatchList />}
        </>
      ) : (
        <>
          <p>No Player Data</p>
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
          <p>PLAYING:{allChamps[currentChampId]} *not correct</p>
          <p>STARTED: {timeStarted}</p>
        </>
      )}
    </>
  );
}

export default App;
