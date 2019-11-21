import * as React from 'react';
import "./SelectScreen.styl"

import * as api from "./api"

import LoadingIndicator from './LoadingIndicator';
import RunCard from './RunCard';

interface SelectScreenState {
    loading: boolean,
    logs: string[]
}

interface SelectScreenProps {
    selectRun(filename: string): void
}

export default class SelectScreen extends React.Component<SelectScreenProps, SelectScreenState> {
    constructor(props: SelectScreenProps) {
        super(props);

        this.state = {
            loading: true,
            logs: [],
        }

        this.load()
    }

    async load() {
        this.setState({
            logs: await api.get("listLogs"),
            loading: false
        })
    }

    selectRun(filename: string) {
        this.props.selectRun(filename);
    }

    render() {
        return <div className="selectScreen">
            <blockquote className="upper blockquote text-center">
                <p className="mb-0">I have called this principle, by which each slight variation, if useful, is preserved, by the term of Natural Selection.</p>
                <footer className="blockquote-footer">Charles Darwin in <cite title="The Origin of Species">The Origin of Species</cite></footer>
            </blockquote>
            <hr className="divider" />
            <div className="container">
                <h3>Select a run</h3>
                {this.state.loading ?
                    <LoadingIndicator wide /> :
                    this.state.logs.reverse().map((item, i) => {
                        return <RunCard name={item} key={i} onClick={this.selectRun.bind(this)} />
                    })
                }
            </div>
        </div>
    }
}