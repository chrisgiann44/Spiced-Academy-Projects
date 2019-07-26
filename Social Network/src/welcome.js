import React from "react";
import { HashRouter, Route } from "react-router-dom";
import { Register } from "./register";
import { Login } from "./login";
import { Logo } from "./logo";

export class Welcome extends React.Component {
    render() {
        return (
            <div className="welcome">
                <h1> Welcome to Join.me</h1>
                <div className="logo">
                    <Logo />
                </div>
                <h2> Join the Community! </h2>
                <HashRouter>
                    <div className="registration">
                        <Route exact path="/" component={Register} />
                        <Route path="/login" component={Login} />
                    </div>
                </HashRouter>
            </div>
        );
    }
}
