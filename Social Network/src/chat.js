import React from "react";
import { connect } from "react-redux";
import { socket } from "./socket";
import { MiniProfilePic } from "./miniprofilepic";
import { Link } from "react-router-dom";

class Chat extends React.Component {
    constructor() {
        super();
        this.msgRef = React.createRef();
        this.txtRef = React.createRef();
        this.state = {};
    }

    componentDidUpdate() {
        this.msgRef.current.scrollTop =
            this.msgRef.current.scrollHeight - this.msgRef.current.offsetTop;
        if (this.msgRef.current.scrollHeight > 1500) {
            this.msgRef.current.scrollTo(0, 0);
        }
    }

    handleChange(e) {
        this.message = e.target.value;
    }

    saveMessage() {
        socket.emit("newchatMessage", this.message);
        this.txtRef.current.value = "";
    }

    logMessage(e) {
        if (e.key === "Enter" && e.shiftKey) {
            socket.emit("newchatMessage", this.message);
            this.txtRef.current.value = "";
        }
    }

    checkHistory() {
        socket.emit("checkHistory", this.props.chatMessages[0].id);
    }

    render() {
        if (!this.props) {
            return null;
        }
        return (
            <React.Fragment>
                <div className="livepage">
                    <div className="livechat">
                        <button
                            id="chatbtn"
                            onClick={() => {
                                this.checkHistory();
                            }}
                        >
                            Check Chat History
                        </button>
                        <div ref={this.msgRef} className="messages">
                            {this.props.chatMessages &&
                                this.props.chatMessages.map(msg => (
                                    <div key={msg.id} className="message">
                                        <img
                                            id="miniprofpic"
                                            src={
                                                msg.pic_url || "placeholder.gif"
                                            }
                                        />
                                        <div className="commentinfo">
                                            <p>
                                                {msg.name} {msg.surname} on{" "}
                                                <strong>
                                                    {new Date(
                                                        msg.created_at
                                                    ).toLocaleString()}
                                                </strong>
                                            </p>
                                            <p>{msg.message}</p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <div className="writeMessage">
                            <textarea
                                ref={this.txtRef}
                                rows="7"
                                cols="100"
                                placeholder="Write your response"
                                onChange={e => this.handleChange(e)}
                                onKeyDown={e => this.logMessage(e)}
                            />
                        </div>
                        <button
                            id="chatbtn"
                            onClick={() => {
                                this.saveMessage();
                            }}
                        >
                            Reply
                        </button>
                    </div>
                    <div className="liveusers">
                        <div>
                            <h1> Live Users </h1>
                            {this.props.liveusers &&
                                this.props.liveusers.map(user => (
                                    <div
                                        key={user.id}
                                        className="minipersonaldata"
                                    >
                                        <div>
                                            <MiniProfilePic
                                                imageUrl={
                                                    user.pic_url ||
                                                    "placeholder.gif"
                                                }
                                                surname={user.surname}
                                                name={user.name}
                                            />
                                        </div>
                                        <div className="minibioedit">
                                            <Link to={`/user/${user.id}`}>
                                                <h4
                                                    style={{
                                                        color: "red"
                                                    }}
                                                >
                                                    {user.name}
                                                </h4>
                                                <h4
                                                    style={{
                                                        color: "red"
                                                    }}
                                                >
                                                    {user.surname}
                                                </h4>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        chatMessages: state.chatMessages,
        liveusers: state.liveusers
    };
};

export default connect(mapStateToProps)(Chat);
