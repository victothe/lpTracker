import { ChangeEvent, useState } from "react";
import { Link, Form, useLoaderData, Outlet } from "react-router-dom";
import Navbar from "./navbar";

export default function Root() {
  const [searchText, setSearchText] = useState("");
  const [selectedReigion, setSelectedReigion] = useState("na1");
  function handleChange(event) {
    setSearchText(event.currentTarget.value);
  }

  return (
    <>
      <Navbar />
      <h2>League of Legends LP Tracker</h2>
      {/* <h4>Find a player and get notified when they finish a game</h4> */}
      <Form
        action={"summoners/" + selectedReigion + "/" + searchText}
        method="post"
      >
        <input type="text" name="name" onChange={handleChange}></input>
        <select
          name="reigion"
          value={selectedReigion}
          onChange={(e) => setSelectedReigion(e.target.value)}
        >
          <option value="na1">NA</option>
          <option value="kr">KR</option>
          <option value="euw1">EUW</option>
        </select>
        <button type="submit">Search Summoner</button>
      </Form>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
