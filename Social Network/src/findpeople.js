import React, { useState, useEffect } from "react";
import axios from "./axios";
import { ProfilePic } from "./profilepic";
import { Link } from "react-router-dom";

export function FindPeople() {
    const [user, setUser] = useState([]);
    const [searchValue, setSearchValue] = useState("");

    useEffect(
        () => {
            axios.get(`/getusers/${searchValue}`).then(res => {
                setUser(res.data);
            });
        },
        [searchValue]
    );

    return (
        <div>
            <div className="findusers">
                <input
                    className="findusersinput"
                    onChange={e => setSearchValue(e.target.value)}
                    placeholder="Find Users"
                />
            </div>
            <div>
                {user.map(user => (
                    <div key={user.id} className="personaldata">
                        <div>
                            <ProfilePic
                                imageUrl={user.pic_url || "placeholder.gif"}
                                surname={user.surname}
                                name={user.name}
                            />
                        </div>
                        <div className="bioedit">
                            <Link to={`/user/${user.id}`}>
                                <h2
                                    style={{
                                        color: "red"
                                    }}
                                >
                                    {user.name} {user.surname}
                                </h2>
                            </Link>
                            <strong>Member since: </strong>
                            <p>{new Date(user.created_at).toLocaleString()}</p>
                            <strong>Bio: </strong>
                            <p>{user.bio || "No Bio yet"}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
