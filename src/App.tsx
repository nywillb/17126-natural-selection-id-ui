
import * as React from 'react';
// import "App.styl"

import "./bootstrap.min.css";
import Navbar from "./Navbar";

import SelectScreen from "./SelectScreen";
import LogScreen from "./LogScreen";

interface AppState {
	currentRun: string | null;
}

export default class App extends React.Component<{}, AppState> {
	constructor(props: {}) {
		super(props)
		this.state = {
			currentRun: null
		}
	}

	selectRun(filename: string) {
		alert(filename);
		this.setState({
			currentRun: filename
		})
	}

	render() {
		return <div>
			<Navbar />
			{this.state.currentRun ? <LogScreen run={this.state.currentRun} /> : <SelectScreen selectRun={this.selectRun.bind(this)} />}
		</div>;
	}
}