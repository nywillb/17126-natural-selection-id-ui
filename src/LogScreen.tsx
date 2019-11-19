import * as React from 'react';
import LoadingIndicator from './LoadingIndicator';
import { Scatter } from 'react-chartjs-2';

import "./LogScreen.styl"

import * as api from "./api"
import { ChartDataSets } from 'chart.js';

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

const colors = ["#ff6384", "#36a2eb", "#4bc0c0", "#f67019"]

export default class LogScreen extends React.Component<LogScreenProps, LogScreenState> {
    chartRef: React.Ref<Element>;

    constructor(props: LogScreenProps) {
        super(props);

        this.state = {
            loading: true,
            logData: null,
        }

        this.chartRef = React.createRef()

        this.load()
    }

    async load() {
        this.setState({
            loading: false,
            logData: await api.get("log/" + this.props.run) as LogData,
        })
    }

    downloadChartImage() {
        let ctx = document.querySelector("canvas") as HTMLCanvasElement;
        let url = ctx.toDataURL("image/png");
        window.open(url, "_blank")
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

        let datasets: Chart.ChartDataSets[] = [];
        let contexts = this.state.logData.logs.map((log) => log.context).filter((item, pos, self) => self.indexOf(item) == pos);

        for (const i in contexts) {
            if (contexts.hasOwnProperty(i)) {
                const context = contexts[i];
                datasets.push({
                    label: context,
                    backgroundColor: colors[parseInt(i) % colors.length],
                    borderColor: colors[parseInt(i) % colors.length],
                    showLine: true,
                    fill: false,
                    data: this.state.logData.logs.filter((log) => log.context == context).map((log) => ({ x: log.time, y: log.datapoint }))
                })
            }
        }

        console.log({ datasets: datasets });

        return <div>
            <div className="jumbotron jumbotron-fluid">
                <div className="container">
                    <h1 className="display-4">{this.state.logData.matchDetails.label} {badge}</h1>
                    <ul>
                        {this.state.logData.matchDetails.isRed == true && <li>Red Alliance</li>}
                        {this.state.logData.matchDetails.isRed == false && <li>Blue Alliance</li>}
                        {this.state.logData.matchDetails.startedAtBuildingZone == true && <li>Started at Building Zone</li>}
                        {this.state.logData.matchDetails.startedAtBuildingZone == false && <li>Started at Loading Zone</li>}
                        {this.state.logData.matchDetails.startTime != 0 && <li>Match started at {new Date(this.state.logData.matchDetails.startTime).toLocaleString()}</li>}
                    </ul>
                    <div className="btn-group" role="group" aria-label="Basic example">
                        <a download href={`/api/log/${this.props.run}`} className="btn btn-outline-light">Download match JSON</a>
                        <button onClick={this.downloadChartImage.bind(this)} className="btn btn-outline-light">Download chart (for notebook)</button>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="bg-white chart-container">
                    <Scatter data={{ datasets: datasets }} options={{
                        scales: {
                            xAxes: [{
                                ticks: {
                                    callback: (value) => new Date(value).toLocaleTimeString()
                                }
                            }]
                        },
                        tooltips: {
                            callbacks: {
                                title: (tooltipItem) => new Date(tooltipItem[0].xLabel as number).toLocaleTimeString(),
                                label: (tooltipItem, data) => (data.datasets as ChartDataSets[])[tooltipItem.datasetIndex as number].label + ": " + tooltipItem.value
                            }
                        }
                    }} />
                </div>
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
        </div >
    }
}