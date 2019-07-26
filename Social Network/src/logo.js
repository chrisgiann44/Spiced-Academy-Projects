import React from "react";

export class Logo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <img
                id="logo"
                src="/logo.png"
                onClick={() => this.props.history.push("/")}
            />
        );
    }
}
