import React from "react";

export function MiniProfilePic({ imageUrl, name, surname, clickHandler }) {
    return (
        <img
            id="miniprofpic"
            src={imageUrl}
            alt={`${name} ${surname}`}
            onClick={clickHandler}
            onError={e => (e.target.src = "/placeholder.gif")}
        />
    );
}
