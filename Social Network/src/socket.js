import {
    chatMessages,
    chatMessage,
    history,
    liveusers,
    popup
} from "./actions";
import * as io from "socket.io-client";

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatMessages", msgs => store.dispatch(chatMessages(msgs)));
        socket.on("historyMessages", msgs => store.dispatch(history(msgs)));
        socket.on("chatMessage", msg => store.dispatch(chatMessage(msg)));

        socket.on("popup", msg => store.dispatch(popup(msg)));

        socket.on("onlineUsers", users =>
            store.dispatch(liveusers(Object.values(users)))
        );
    }
};
