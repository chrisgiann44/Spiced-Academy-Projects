import React from "react";
import { connect } from "react-redux";
import axios from "./axios";
import { Logo } from "./logo";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { ProfilePic } from "./profilepic";
import { Uploader } from "./uploader";
import { FindPeople } from "./findpeople";
import Friends from "./friends";
import { Profile } from "./profile";
import Chat from "./chat";
import { OtherProfile } from "./otherprofile";
import { CSSTransition } from "react-transition-group";
import Dum from "./dummycomponent";
import { getFriends } from "./actions";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderVisible: false
        };
    }
    componentDidMount() {
        this.props.dispatch(getFriends());
        axios.get("/getuser").then(res => {
            this.setState({
                bio: res.data.bio,
                id: res.data.id,
                profile_creation_date: res.data.created_at.slice(0, 10),
                email: res.data.email,
                name: res.data.name,
                surname: res.data.surname,
                imageUrl: res.data.pic_url || "./placeholder.gif"
            });
        });
    }

    render() {
        return (
            <div className="loginpage">
                <BrowserRouter>
                    <React.Fragment>
                        <div className="bar">
                            <div className="logoleftup">
                                <Route
                                    path="*"
                                    render={props => (
                                        <Logo history={props.history} />
                                    )}
                                />
                            </div>
                            <Link to={"/user"}>Find Users</Link>
                            <Link to={"/"}>Profile</Link>
                            <Link to={"/chat"}>Live Chat</Link>
                            <Link to={"/friends"}>Friends</Link>
                            <a href="/logout">Logout</a>
                            <Route
                                render={({ history }) => (
                                    <div className="profilepic2">
                                        <p>Wannabe Friends Requests</p>
                                        <div
                                            id="span"
                                            onClick={() =>
                                                history.push("/friends")
                                            }
                                        >
                                            {this.props.wannabeFriends &&
                                                this.props.wannabeFriends
                                                    .length}
                                        </div>
                                    </div>
                                )}
                            />
                            <Route
                                render={({ history }) => (
                                    <div className="profilepic2">
                                        <p>Unreplied Friends Requests</p>
                                        <div
                                            id="span"
                                            onClick={() =>
                                                history.push("/friends")
                                            }
                                        >
                                            {this.props.friendRequests &&
                                                this.props.friendRequests
                                                    .length}
                                        </div>
                                    </div>
                                )}
                            />
                            <Route
                                render={({ history }) => (
                                    <div className="profilepic2">
                                        <p>Live Users Now!</p>
                                        <div
                                            id="span"
                                            onClick={() =>
                                                history.push("/chat")
                                            }
                                        >
                                            {this.props.liveusers &&
                                                this.props.liveusers.length}
                                        </div>
                                    </div>
                                )}
                            />
                            <div className="profilepic">
                                <ProfilePic
                                    imageUrl={
                                        this.state.imageUrl ||
                                        "/placeholder.gif"
                                    }
                                    surname={this.state.surname}
                                    name={this.state.name}
                                    clickHandler={() => {
                                        if (this.state.uploaderVisible) {
                                            this.setState({
                                                uploaderVisible: false
                                            });
                                        } else {
                                            this.setState({
                                                uploaderVisible: true
                                            });
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <CSSTransition
                            in={this.state.uploaderVisible}
                            timeout={1000}
                            classNames="uploader"
                            mountOnEnter
                            appear
                            unmountOnExit
                        >
                            <div className="uploader">
                                <Uploader
                                    changeImage={img =>
                                        this.setState({ imageUrl: img })
                                    }
                                    clickHandler={() => {
                                        if (this.state.uploaderVisible) {
                                            this.setState({
                                                uploaderVisible: false
                                            });
                                        } else {
                                            this.setState({
                                                uploaderVisible: true
                                            });
                                        }
                                    }}
                                />
                            </div>
                        </CSSTransition>
                        <div>
                            <Route
                                exact
                                path="/"
                                render={() => (
                                    <div className="profile">
                                        <Profile
                                            imageUrl={this.state.imageUrl}
                                            surname={this.state.surname}
                                            name={this.state.name}
                                            bio={this.state.bio}
                                            profile_creation_date={
                                                this.state.profile_creation_date
                                            }
                                            changeBio={bio => {
                                                this.setState({ bio: bio });
                                            }}
                                        />
                                    </div>
                                )}
                            />
                            <Route
                                exact
                                path="/user/:id"
                                render={props => (
                                    <OtherProfile
                                        key={props.match.url}
                                        match={props.match}
                                        profile_creation_date={
                                            this.state.profile_creation_date
                                        }
                                        loggedInProfileId={this.state.id}
                                        history={props.history}
                                    />
                                )}
                            />
                        </div>
                        <Route exact path="/friends" component={Friends} />
                        <Route exact path="/chat" component={Chat} />
                        <Route exact path="/user" component={FindPeople} />
                        <Route exact path="/petros" component={Dum} />
                        <CSSTransition
                            in={this.props.popup == true}
                            timeout={2000}
                            classNames="popup"
                            mountOnEnter
                            appear
                            unmountOnExit
                        >
                            <div className="popup">
                                <p>New Friend Request</p>
                            </div>
                        </CSSTransition>
                    </React.Fragment>
                </BrowserRouter>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        trueFriends: state.trueFriends,
        wannabeFriends: state.wannabeFriends,
        friendRequests: state.friendRequests,
        liveusers: state.liveusers,
        popup: state.popup
    };
};

export default connect(mapStateToProps)(App);
