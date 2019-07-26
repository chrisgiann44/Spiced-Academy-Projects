export default function reducer(state = {}, action) {
    if (action.type === "ADD_ANIMALS") {
        return { ...state, list: action.list };
    }
    if (action.type === "GET_FRIENDS") {
        let friends = action.friendslist.data.data;
        let trueFriends = [];
        let wannabeFriends = [];
        let friendRequests = [];
        for (let i = 0; i < friends.length; i++) {
            if (friends[i].accepted) {
                trueFriends.push(friends[i]);
            } else if (
                !friends[i].accepted &&
                friends[i].sender_id != action.friendslist.data.user
            ) {
                wannabeFriends.push(friends[i]);
            } else {
                friendRequests.push(friends[i]);
            }
        }
        return {
            ...state,
            user: action.friendslist.data.user,
            trueFriends: trueFriends,
            wannabeFriends: wannabeFriends,
            friendRequests: friendRequests
        };
    }
    if (action.type === "DELETE_FRIENDS") {
        state = {
            ...state,
            friendRequests: state.friendRequests.filter(friend => {
                if (friend.id != action.friend) {
                    return {
                        friend
                    };
                }
            })
        };
    }
    if (action.type === "DENY_FRIENDS") {
        state = {
            ...state,
            wannabeFriends: state.wannabeFriends.filter(friend => {
                if (friend.id != action.friend) {
                    return {
                        friend
                    };
                }
            })
        };
    }
    if (action.type === "ACCEPT_FRIENDS") {
        state = {
            ...state,
            wannabeFriends: state.wannabeFriends.filter(friend => {
                if (friend.id != action.friend) {
                    return {
                        friend
                    };
                } else {
                    state.trueFriends.push(friend);
                }
            })
        };
    }
    if (action.type === "GET_MESSAGES") {
        state = {
            ...state,
            chatMessages: action.messages.reverse()
        };
    }
    if (action.type === "ADD_MESSAGE") {
        state = {
            ...state,
            chatMessages: state.chatMessages.concat(action.message).slice(-10)
        };
    }
    if (action.type === "HISTORY") {
        let newMessage = action.messages.data.reverse();
        state = {
            ...state,
            chatMessages: newMessage.concat(state.chatMessages)
        };
    }
    if (action.type === "LIVE_USERS") {
        state = {
            ...state,
            liveusers: action.users
        };
    }
    if (action.type === "POP_UP") {
        state = {
            ...state,
            popup: action.message
        };
    }
    return state;
}
