import * as React from 'react';
// import "Navbar.styl"

interface NavbarProps {
    currentLog?: string
}

export default class Navbar extends React.Component<NavbarProps, {}> {
    render() {
        return <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="#">🗺️ Intelligent Design {this.props.currentLog && <span className="badge badge-primary">{this.props.currentLog}</span>}</a>
            </nav>
        </div>;
    }
}