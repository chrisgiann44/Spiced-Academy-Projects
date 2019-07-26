import React from "react";

export function ProfilePic({ imageUrl, name, surname, clickHandler }) {
    return (
        <img
            id="profpic"
            src={imageUrl}
            alt={`${name} ${surname}`}
            onClick={clickHandler}
        />
    );
}
