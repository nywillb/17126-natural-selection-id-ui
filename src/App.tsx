
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
		let currentRun = window.location.hash.substr(1);
		this.state = {
			currentRun: currentRun
		}

		window.onpopstate = this.updateRun.bind(this)
	}

	selectRun(filename: string) {
		this.setState({
			currentRun: filename
		})
		history.pushState(null, filename, "#/" + filename)
	}

	updateRun() {
		let currentRun = window.location.hash.substr(1);
		if (currentRun) {
			this.setState({
				currentRun: currentRun
			})
		} else {
			this.setState({
				currentRun: null
			})
		}
	}

	render() {
		return <div>
			<Navbar />
			{this.state.currentRun ? <LogScreen run={this.state.currentRun} /> : <SelectScreen selectRun={this.selectRun.bind(this)} />}
		</div>;
	}
}