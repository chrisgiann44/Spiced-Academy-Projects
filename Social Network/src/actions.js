import axios from "./axios";

export function getList() {
    return axios.get("/getlist").then(data => {
        return {
            type: "ADD_ANIMALS",
            list: data
        };
    });
}

export function getFriends() {
    return axios.get("/getfriends").then(data => {
        return {
            type: "GET_FRIENDS",
            friendslist: data
        };
    });
}

export function deleteFriends(val) {
    return axios.post("/deletefriend", { user: val }).then(() => {
        return {
            type: "DELETE_FRIENDS",
            friend: val
        };
    });
}

export function denyFriends(val) {
    return axios.post("/deletefriend", { user: val }).then(() => {
        return {
            type: "DENY_FRIENDS",
            friend: val
        };
    });
}

export function acceptFriends(val) {
    return axios.post("/acceptfriend", { user: val }).then(() => {
        return {
            type: "ACCEPT_FRIENDS",
            friend: val
        };
    });
}

export function chatMessages(val) {
    return {
        type: "GET_MESSAGES",
        messages: val
    };
}

export function history(val) {
    return {
        type: "HISTORY",
        messages: val
    };
}

export function chatMessage(val) {
    return {
        type: "ADD_MESSAGE",
        message: val
    };
}

export function liveusers(val) {
    return {
        type: "LIVE_USERS",
        users: val
    };
}

export function popup(val) {
    return {
        type: "POP_UP",
        message: val
    };
}
