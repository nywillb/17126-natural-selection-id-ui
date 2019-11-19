import * as React from 'react';

interface RunCardProps {
    name: string;
    key: number;
    onClick(filename: string): void;
}

export default class RunCard extends React.Component<RunCardProps, {}> {
    render() {
        let nameComponents = this.props.name.substring(0, this.props.name.length - 5).split("-");
        let datetime = new Date(parseInt(nameComponents[0]));
        let label = nameComponents[1]
        let matchPhase = nameComponents[2]

        let badge: JSX.Element | null;

        if (matchPhase == "auto") {
            badge = <span className="badge badge-primary">Auto</span>
        } else if (matchPhase == "teleop") {
            badge = <span className="badge badge-success">TeleOp</span>
        } else {
            badge = null
        }

        return <div className="card">
            <div className="card-body">
                <h5 className="card-title">{label} {badge}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{datetime.toLocaleString()}</h6>
                <button onClick={() => this.props.onClick(this.props.name)} className="btn btn-primary">View</button>
            </div>
        </div>
    }
}