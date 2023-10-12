import React from "react";
import ReactDOM from "react-dom/client";
import App, {
  loader as appLoader,
  action as appAction,
} from "./routes/testSummoner.jsx";
import Tracking, { loader as trackingLoader } from "./routes/tracking.jsx";
import Root from "./routes/root.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "summoners/:reigion/:summonerName",
    element: <App />,
    loader: appLoader,
    action: appAction,
  },
  {
    path: "tracking",
    element: <Tracking />,
    loader: trackingLoader,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
