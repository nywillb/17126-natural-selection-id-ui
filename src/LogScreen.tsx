import * as React from 'react';
import LoadingIndicator from './LoadingIndicator';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, TooltipProps, CustomizedProps } from "recharts";

import "./LogScreen.styl"

import * as api from "./api"

interface LogScreenProps {
    run: string
}

interface LogScreenState {
    loading: boolean,
    logData: LogData | null
}

interface LogData {
    matchDetails: MatchDetails
    logs: LogItem[]
}

interface MatchDetails {
    label: string,
    startTime: number,
    isRed: boolean,
    isAuto: boolean,
    startedAtBuildingZone: boolean
}

interface LogItem {
    time: number,
    context: string,
    datapoint: number,
}

export default class LogScreen extends React.Component<LogScreenProps, LogScreenState> {
    constructor(props: LogScreenProps) {
        super(props);

        this.state = {
            loading: true,
            logData: null,
        }

        this.load()
    }

    async load() {
        this.setState({
            loading: false,
            logData: await api.get("log/" + this.props.run) as LogData,
        })
    }

    render() {
        if (this.state.loading || !this.state.logData) {
            return <div className="container">
                <LoadingIndicator wide /> :
            </div>
        }

        let badge: JSX.Element;

        if (this.state.logData.matchDetails.isAuto) {
            badge = <span className="badge badge-primary">Auto</span>
        } else {
            badge = <span className="badge badge-success">TeleOp</span>
        }

        return <div>
            <div className="jumbotron jumbotron-fluid">
                <div className="container">
                    <h1 className="display-4">{this.state.logData.matchDetails.label} {badge}</h1>
                    <ul>
                        {this.state.logData.matchDetails.isRed == true && <li>Red Alliance</li>}
                        {this.state.logData.matchDetails.isRed == false && <li>Blue Alliance</li>}
                        {this.state.logData.matchDetails.startedAtBuildingZone == true && <li>Started at Building Zone</li>}
                        {this.state.logData.matchDetails.startedAtBuildingZone == false && <li>Started at Loading Zone</li>}
                        {this.state.logData.matchDetails.startTime && <li>Match started at {new Date(this.state.logData.matchDetails.startTime).toLocaleString()}</li>}
                    </ul>
                </div>
            </div>
            <div className="container">
                <LineChart data={this.state.logData.logs} width={1000} height={300}>
                    <Line type="monotone" dataKey="datapoint" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="time" tick={<CustomizedAxisTick />} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                </LineChart>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Timestamp</th>
                            <th scope="col">Context</th>
                            <th scope="col">Datapoint</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.logData.logs.map((log, i) => {
                            return <tr key={i}>
                                <th scope="row">{i}</th>
                                <td>{new Date(log.time).toLocaleString()}</td>
                                <td>{log.context}</td>
                                <td>{log.datapoint}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    }
}

const CustomTooltip = (props: TooltipProps) => {
    if (props.active && props.payload) {
        return (
            <div className="custom-tooltip">
                <strong>{(props.payload[0].payload as LogItem).context}</strong>
                <pre><code>{(props.payload[0].payload as LogItem).datapoint}</code></pre>
                <small>{new Date((props.payload[0].payload as LogItem).time).toLocaleTimeString()}</small>
            </div>
        );
    }

    return null;
};

class CustomizedAxisTick extends React.Component<any> {
    render() {
        const {
            x, y, stroke, payload,
        } = this.props;

        return (
            <g transform={`translate(${x},${y})`}>
                <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">{new Date(payload.value).toLocaleTimeString()}</text>
            </g>
        );
    }
}