import * as React from "react";
import * as ReactDOM from "react-dom";

import AppContainer from "./containers/App";

// FIXME: Remove !
const baseURL = process.env.API_URL!;

ReactDOM.render(
  <AppContainer baseURL={baseURL} />,
  document.getElementById("app"),
);
