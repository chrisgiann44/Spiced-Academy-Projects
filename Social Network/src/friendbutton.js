import React, { useState, useEffect } from "react";
import axios from "./axios";

export function FriendButton(props) {
    const [friendshipstatus, setfriendshipstatus] = useState({});

    useEffect(
        () => {
            axios.get(`/getfriendship/${props.profileOwner}`).then(res => {
                setfriendshipstatus(res.data);
            });
        },
        [props.profileOwner]
    );

    function deleteFriend() {
        axios
            .post(`/deletefriend`, {
                profileOwner: props.profileOwner
            })
            .then(setfriendshipstatus({ existingreq: false }));
    }

    function addFriend() {
        axios
            .post(`/addfriend`, {
                profileOwner: props.profileOwner
            })
            .then(
                setfriendshipstatus({
                    existingreq: true,
                    existinguser: true
                })
            );
    }

    function acceptFriend() {
        axios
            .post(`/acceptfriend`, {
                profileOwner: props.profileOwner
            })
            .then(
                setfriendshipstatus({
                    existingfriend: true
                })
            );
    }

    return (
        <div>
            {friendshipstatus.existingreq && friendshipstatus.existinguser && (
                <button onClick={deleteFriend}>Cancel Friend Request</button>
            )}
            {friendshipstatus.existingreq && !friendshipstatus.existinguser && (
                <div>
                    <button onClick={acceptFriend}>
                        Accept Friend Request
                    </button>
                    <button onClick={deleteFriend}>Deny Friend Request</button>
                </div>
            )}
            {friendshipstatus.existingfriend && (
                <div>
                    <button onClick={deleteFriend}>Unfriend</button>
                </div>
            )}
            {!friendshipstatus.existingreq &&
                !friendshipstatus.existingfriend && (
                    <button onClick={addFriend}>Send Friend Request</button>
                )}
        </div>
    );
}
