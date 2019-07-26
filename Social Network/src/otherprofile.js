import React from "react";
import axios from "./axios";
import { ProfilePic } from "./profilepic";
import { FriendButton } from "./friendbutton";
import { MiniProfilePic } from "./miniprofilepic";
import { Link } from "react-router-dom";

export class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        axios
            .post("/otheruser", { id: this.props.match.params.id })
            .then(res => {
                if (res.data.same) {
                    this.props.history.push("/");
                } else if (!res.data.userProf.name) {
                    this.setState({
                        error: "No Such User!"
                    });
                } else {
                    this.setState({
                        bio: res.data.userProf.bio,
                        profile_creation_date: res.data.userProf.created_at.slice(
                            0,
                            10
                        ),
                        email: res.data.userProf.email,
                        name: res.data.userProf.name,
                        surname: res.data.userProf.surname,
                        imageUrl: res.data.userProf.pic_url,
                        commonFriends: res.data.commonFriends
                    });
                }
                if (!res.data.commonFriends.length) {
                    this.setState({
                        error2: "No Common Friends with that User!"
                    });
                }
            });
    }

    render() {
        let bio = this.state.bio || "No Bio yet";
        let imageUrl = this.state.imageUrl || "/placeholder.gif";
        return (
            <div className="profipage">
                <div className="leftprof">
                    <div>
                        <div>
                            <p id="nosuchuser"> {this.state.error} </p>
                        </div>
                        {!this.state.error && (
                            <div className="personaldata">
                                <div>
                                    <ProfilePic
                                        imageUrl={imageUrl}
                                        surname={this.state.surname}
                                        name={this.state.name}
                                    />
                                    <FriendButton
                                        profileOwner={
                                            this.props.match.params.id
                                        }
                                        loggedInProfileId={
                                            this.props.loggedInProfileId
                                        }
                                    />
                                </div>
                                <div className="bioedit">
                                    <h2>
                                        {this.state.name} {this.state.surname}
                                    </h2>
                                    <p>
                                        <strong>Member since: </strong>
                                        {new Date(
                                            this.props.profile_creation_date
                                        ).toLocaleString()}
                                    </p>
                                    <p>
                                        <strong>Bio: </strong>
                                    </p>
                                    <p>{bio}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="cfriends">
                        <div>
                            <p id="nosuchuser"> {this.state.error2} </p>
                        </div>
                        {!this.state.error2 && (
                            <h1> Common Friends with {this.state.name}</h1>
                        )}
                        {this.state.commonFriends &&
                            this.state.commonFriends.map(friend => (
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
                </div>
            </div>
        );
    }
}
