import Navbar from "./navbar";
import { useLoaderData, Link } from "react-router-dom";
import { getTrackingSummoners } from "../search";

export async function loader() {
  const summoners = await getTrackingSummoners();
  return { summoners };
}

export default function Tracking() {
  const {summoners} = useLoaderData();
  return (
    <>
      <Navbar />
      <h1>Currently Tracking Players</h1>
      <nav>
      {summoners.length ? (
            <ul>
              {summoners.map((summoner) => (
                <li key={summoner.createdAt}>
                  <Link to={`/summoners/${summoner.selectedReigion}/${summoner.summonerName}`}>
                    {summoner.summonerName}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No Summoners</i>
            </p>
          )}
      </nav>
    </>
  );
}
