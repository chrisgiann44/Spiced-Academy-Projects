import React from "react";
import { ProfilePic } from "./profilepic";
import { Bio } from "./bioeditor";

export class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="personaldata">
                <div>
                    <ProfilePic
                        imageUrl={this.props.imageUrl}
                        surname={this.props.surname}
                        name={this.props.name}
                    />
                </div>
                <div className="bioedit">
                    <h2>
                        {this.props.name} {this.props.surname}
                    </h2>
                    <p>
                        <strong>Member since: </strong>
                        {new Date(
                            this.props.profile_creation_date
                        ).toLocaleString()}
                    </p>
                    <Bio
                        bio={this.props.bio}
                        changeBio={this.props.changeBio}
                    />
                </div>
            </div>
        );
    }
}
