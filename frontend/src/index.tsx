import * as React from "react";
import * as ReactDOM from "react-dom";

import AppContainer from "./containers/App";

import Album from "./types/album";
import Artist from "./types/artist";
import Label from "./types/label";
import PlayingTrack from "./types/playing_track";
import Track from "./types/track";

// FIXME: Remove !
const baseURL = process.env.API_URL!;

ReactDOM.render(
  <AppContainer baseURL={baseURL} />,
  document.getElementById("app"),
);
