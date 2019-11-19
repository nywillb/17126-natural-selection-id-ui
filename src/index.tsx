import * as React from 'react';
import * as ReactDOM from "react-dom";

import App from './App';
// import "./styles.styl";

let appDiv = document.createElement("div");
appDiv.id = "app";
document.body.appendChild(appDiv);

ReactDOM.render(<App />, document.getElementById("app"));
