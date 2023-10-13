import Navbar from "./navbar";
import { useLoaderData, Link } from "react-router-dom";
import { testGetAllSummoners } from "../search";

export async function loader() {
  const summoners = await testGetAllSummoners();
  return { summoners };
}

export default function Tracking() {
  const { summoners } = useLoaderData();
  return (
    <>
      <Navbar />
      <h1>Currently Tracking Players</h1>
      <nav>
        {summoners.length ? (
          <ul>
            {summoners.map((summoner) => (
              <li key={summoner.info_id}>
                <Link
                  to={`/summoners/${summoner.reigion}/${summoner.description}`}
                >
                  {summoner.description}
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
