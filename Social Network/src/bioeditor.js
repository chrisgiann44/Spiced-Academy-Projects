import React from "react";
import axios from "./axios";
import { CSSTransition } from "react-transition-group";

export class Bio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textAreaVisible: false,
            editButtonVisible: true
        };
    }

    async saveBio() {
        if (this.state.bio != undefined) {
            await axios.post("/savebio", {
                bioText: this.state.bio
            });
            await this.props.changeBio(this.state.bio);
        }
    }

    handleChange(e) {
        this.setState({
            bio: e.target.value
        });
    }

    render() {
        let bio = this.props.bio || "Write your Bio mate!!";
        return (
            <div>
                <div>
                    <strong>Bio: </strong> {bio}
                </div>
                <div>
                    {this.state.editButtonVisible && (
                        <button
                            onClick={() => {
                                if (this.state.textAreaVisible) {
                                    this.setState({
                                        textAreaVisible: false,
                                        editButtonVisible: true
                                    });
                                } else {
                                    this.setState({
                                        textAreaVisible: true,
                                        editButtonVisible: false
                                    });
                                }
                            }}
                        >
                            Edit Bio
                        </button>
                    )}
                    <CSSTransition
                        in={this.state.textAreaVisible}
                        timeout={3100}
                        classNames="texteditor"
                        unmountOnExit
                    >
                        <div>
                            <textarea
                                rows="7"
                                cols="70"
                                defaultValue={bio}
                                onChange={e => this.handleChange(e)}
                            />
                            <button
                                onClick={() => {
                                    this.saveBio();
                                    this.setState({
                                        textAreaVisible: false,
                                        editButtonVisible: true
                                    });
                                }}
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    this.setState({
                                        textAreaVisible: false,
                                        editButtonVisible: true
                                    });
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </CSSTransition>
                </div>
            </div>
        );
    }
}
