const spicedPg = require("spiced-pg");

// Setting up the query //

const dbUrl =
    process.env.DATABASE_URL ||
    "postgres:postgres:postgres@localhost:5432/socialnetwork";
const db = spicedPg(dbUrl);

// adding queries //

module.exports.addUser = function addUser(name, surname, email, password) {
    return db.query(
        `INSERT INTO users (name, surname, email, password)
        VALUES ($1,$2,$3,$4)
        RETURNING id, name, surname, email;
        `,
        [name, surname, email, password]
    );
};

module.exports.findUser = function findUser(email) {
    return db.query(
        `SELECT users.id, name, surname, email, password, bio, pic_url, created_at
        FROM users
        WHERE email=$1;
        `,
        [email]
    );
};

module.exports.findUserbyId = function findUserbyId(id) {
    return db.query(
        `SELECT users.id, name, surname, email, password, bio, pic_url, created_at
        FROM users
        WHERE id=$1;
        `,
        [id]
    );
};

module.exports.findUserId = function findUser(id) {
    return db.query(
        `SELECT users.id, name, surname, email, password, bio, pic_url, created_at
        FROM users
        WHERE id=$1;
        `,
        [id]
    );
};

module.exports.insertImg = function insertImg(userId, url) {
    return db.query(
        `UPDATE users
        SET pic_url=$2
        WHERE id=$1;`,
        [userId, url]
    );
};

module.exports.insertBio = function insertBio(userId, bio) {
    return db.query(
        `UPDATE users
        SET bio=$2
        WHERE id=$1;`,
        [userId, bio]
    );
};

module.exports.findnewUsers = function findnewUsers() {
    return db.query(
        `SELECT id, name, surname, bio, pic_url, created_at FROM users
        ORDER BY id DESC
        LIMIT 5;
        `,
        []
    );
};

module.exports.findreqUsers = function findreqUsers(val) {
    return db.query(
        `SELECT id, name, surname, bio, pic_url, created_at FROM users WHERE name ILIKE $1 or surname ILIKE $1;`,
        [val + "%"]
    );
};

module.exports.findfriendshipreq = function findfriendshipreq(
    sender,
    receiver
) {
    return db.query(
        `SELECT accepted, sender_id FROM friendships
        WHERE (sender_id=$1 and receiver_id=$2)
        OR (receiver_id=$1 and sender_id=$2)
        ;`,
        [sender, receiver]
    );
};

module.exports.deletefriend = function deletefriend(sender, receiver) {
    return db.query(
        `
        DELETE from friendships
        WHERE (sender_id=$1 and receiver_id=$2)
        OR (receiver_id=$1 and sender_id=$2)
        ;`,
        [sender, receiver]
    );
};

module.exports.addfriend = function addfriend(sender, receiver) {
    return db.query(
        `
        INSERT INTO friendships (sender_id, receiver_id)
        VALUES ($1, $2)
        ;`,
        [sender, receiver]
    );
};

module.exports.acceptfriend = function acceptfriend(sender, receiver) {
    return db.query(
        `
        UPDATE friendships
        SET accepted = true
        WHERE (sender_id=$1 and receiver_id=$2)
        OR (receiver_id=$1 and sender_id=$2)
        ;`,
        [sender, receiver]
    );
};

module.exports.findfriends = function findfriends(sender) {
    return db.query(
        `
        SELECT users.id, name, surname, pic_url, accepted, sender_id
        FROM friendships
        JOIN users
        ON (accepted = false AND sender_id = $1 AND receiver_id = users.id)
        OR (accepted = false AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)
        ;`,
        [sender]
    );
};

module.exports.addMessage = function addMessage(sender_id, message) {
    return db.query(
        `INSERT INTO messages (sender_id, message)
        VALUES ($1,$2)
        RETURNING message, id, created_at
        `,
        [sender_id, message]
    );
};

module.exports.getMessages = function getMessages() {
    return db.query(
        `
        SELECT messages.id, name, surname, pic_url, sender_id, message, messages.created_at
        FROM messages
        JOIN users
        ON (sender_id = users.id)
        ORDER BY id DESC
        LIMIT 10
        ;`
    );
};

module.exports.checkHistory = function checkHistory(id) {
    return db.query(
        `
        SELECT messages.id, name, surname, pic_url, sender_id, message, messages.created_at
        FROM messages
        JOIN users
        ON (sender_id = users.id)
        WHERE messages.id < $1
        ORDER BY id DESC
        LIMIT 10
        ;`,
        [id]
    );
};

module.exports.findCommonFriends = function findCommonFriends(
    userId,
    profileOwnerId
) {
    return db.query(
        `
        (
        SELECT sender_id AS user_id, users.name, users.surname, users.pic_url, users.id FROM friendships JOIN users
        ON (sender_id = users.id) WHERE receiver_id = $1 AND accepted=true
        UNION
        SELECT receiver_id AS user_id, users.name, users.surname, users.pic_url, users.id FROM friendships JOIN users
        ON (receiver_id = users.id) WHERE sender_id = $1 AND accepted=true
        )
        INTERSECT
        (
        SELECT sender_id AS user_id, users.name, users.surname, users.pic_url, users.id FROM friendships JOIN users
        ON (sender_id = users.id) WHERE receiver_id = $2 AND accepted=true
        UNION
        SELECT receiver_id AS user_id, users.name, users.surname, users.pic_url, users.id FROM friendships JOIN users
        ON (receiver_id = users.id) WHERE sender_id = $2 AND accepted=true
    );`,
        [userId, profileOwnerId]
    );
};
