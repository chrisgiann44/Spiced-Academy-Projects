import React from "react";
import { connect } from "react-redux";
import {
    getFriends,
    deleteFriends,
    denyFriends,
    acceptFriends
} from "./actions";
import { MiniProfilePic } from "./miniprofilepic";
import { Link } from "react-router-dom";

class Friends extends React.Component {
    componentDidMount() {
        this.props.dispatch(getFriends());
    }

    render() {
        if (!this.props) {
            return null;
        }
        return (
            <React.Fragment>
                <div className="friendswrapper">
                    <div className="friendcol">
                        <h3>Wannabe Friends</h3>
                        {this.props.friendRequests &&
                            (this.props.wannabeFriends.length == 0 ? (
                                <p>no wannabeFriends</p>
                            ) : (
                                <p>{this.props.wannabeFriends.length}</p>
                            ))}
                        {this.props.wannabeFriends &&
                            this.props.wannabeFriends.map(friend => (
                                <div
                                    key={friend.id}
                                    className="minipersonaldata"
                                >
                                    <div>
                                        <MiniProfilePic
                                            imageUrl={
                                                friend.pic_url ||
                                                "placeholder.gif"
                                            }
                                            surname={friend.surname}
                                            name={friend.name}
                                        />
                                    </div>
                                    <div className="minibioedit">
                                        <Link to={`/user/${friend.id}`}>
                                            <h4
                                                style={{
                                                    color: "red"
                                                }}
                                            >
                                                {friend.name} {friend.surname}
                                            </h4>
                                        </Link>
                                        <button
                                            onClick={() =>
                                                this.props.dispatch(
                                                    acceptFriends(friend.id)
                                                )
                                            }
                                        >
                                            Accept Request
                                        </button>
                                        <button
                                            onClick={() =>
                                                this.props.dispatch(
                                                    denyFriends(friend.id)
                                                )
                                            }
                                        >
                                            Deny Request
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                    <div className="friendcol">
                        <h3>Already Friends</h3>
                        {this.props.friendRequests &&
                            (this.props.trueFriends.length == 0 ? (
                                <p>no Existing Friends</p>
                            ) : (
                                <p>{this.props.trueFriends.length}</p>
                            ))}
                        {this.props.trueFriends &&
                            this.props.trueFriends.map(friend => (
                                <div
                                    key={friend.id}
                                    className="minipersonaldata"
                                >
                                    <div>
                                        <MiniProfilePic
                                            imageUrl={
                                                friend.pic_url ||
                                                "placeholder.gif"
                                            }
                                            surname={friend.surname}
                                            name={friend.name}
                                        />
                                    </div>
                                    <div className="minibioedit">
                                        <Link to={`/user/${friend.id}`}>
                                            <h4
                                                style={{
                                                    color: "red"
                                                }}
                                            >
                                                {friend.name} {friend.surname}
                                            </h4>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                    </div>
                    <div className="friendcol">
                        <h3>Sent Friend Requests</h3>
                        {this.props.friendRequests &&
                            (this.props.friendRequests.length == 0 ? (
                                <p>no friend Requests Sent</p>
                            ) : (
                                <p>{this.props.friendRequests.length}</p>
                            ))}
                        {this.props.friendRequests &&
                            this.props.friendRequests.map(friend => (
                                <div
                                    key={friend.id}
                                    className="minipersonaldata"
                                >
                                    <div>
                                        <MiniProfilePic
                                            imageUrl={
                                                friend.pic_url ||
                                                "placeholder.gif"
                                            }
                                            surname={friend.surname}
                                            name={friend.name}
                                        />
                                    </div>
                                    <div className="minibioedit">
                                        <Link to={`/user/${friend.id}`}>
                                            <h4
                                                style={{
                                                    color: "red"
                                                }}
                                            >
                                                {friend.name} {friend.surname}
                                            </h4>
                                        </Link>
                                        <button
                                            onClick={() =>
                                                this.props.dispatch(
                                                    deleteFriends(friend.id)
                                                )
                                            }
                                        >
                                            Cancel Request
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        trueFriends: state.trueFriends,
        wannabeFriends: state.wannabeFriends,
        friendRequests: state.friendRequests
    };
};

export default connect(mapStateToProps)(Friends);
