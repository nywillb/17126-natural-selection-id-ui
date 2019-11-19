import * as React from 'react';

interface LoadingIndicatorProps {
    wide?: boolean;
    padding?: number;
}

export default class LoadingIndicator extends React.Component<LoadingIndicatorProps, {}> {
    render() {
        return <div className={this.props.wide ? "d-flex justify-content-center" : ""}>
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    }
}