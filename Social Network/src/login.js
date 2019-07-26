import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    submit() {
        axios
            .post("/login", {
                name: this.state.name,
                surname: this.state.surname,
                email: this.state.email,
                password: this.state.password
            })
            .then(({ data }) => {
                if (data.userId) {
                    location.href = "/";
                } else if (data.error) {
                    this.setState({
                        error: "Oops! Something went wrong, please try again!"
                    });
                }
            });
    }
    handleChange({ target }) {
        this.setState({
            [target.name]: target.value
        });
    }
    render() {
        return (
            <div className="RegForm">
                <p> {this.state.error} </p>
                <input
                    autoFocus
                    name="email"
                    placeholder="Email"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    autoFocus
                    name="password"
                    placeholder="Password"
                    type="password"
                    onChange={e => this.handleChange(e)}
                />
                <button onClick={() => this.submit()}>Login</button>
                <h2>
                    Not a member? <Link to="/"> Register </Link>
                </h2>
            </div>
        );
    }
}
