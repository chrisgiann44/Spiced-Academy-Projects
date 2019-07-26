const spicedPg = require("spiced-pg");

// Setting up the query //

const dbUrl =
    process.env.DATABASE_URL ||
    "postgres:postgres:postgres@localhost:5432/imageboard";
const db = spicedPg(dbUrl);

// adding queries //

module.exports.getImages = function getImages(maxImagesOnPage) {
    return db.query(
        `SELECT * FROM images
        ORDER BY id DESC
        LIMIT $1;`,
        [maxImagesOnPage]
    );
};

module.exports.getImageInfo = function getImageInfo(imageId) {
    return db.query(
        `SELECT *,
        (SELECT MAX(id) from images WHERE id < $1) AS prevImageId,
        (SELECT MIN(id) from images WHERE id > $1) AS nextImageId
        FROM images
        WHERE id= $1;
        `,
        [imageId]
    );
};

module.exports.getCommentInfo = function getCommentInfo(imageId) {
    return db.query(
        `SELECT name,comment,created_at FROM comments
        WHERE image_id=$1;`,
        [imageId]
    );
};

module.exports.addCommentInfo = function addCommentInfo(
    name,
    comment,
    imageId
) {
    return db.query(
        `INSERT INTO comments (name, comment, image_id)
        VALUES ($1,$2,$3)
        RETURNING name, comment, created_at;`,
        [name, comment, imageId]
    );
};

module.exports.getProfileImages = function getProfileImages(userId) {
    return db.query(
        `SELECT id, url, title FROM images
        WHERE user_id=$1;`,
        [userId]
    );
};

module.exports.insertImg = function insertImg(
    url,
    name,
    title,
    description,
    userId
) {
    return db.query(
        `INSERT INTO images (url, name, title, description,user_id)
        VALUES ($1,$2,$3,$4,$5);`,
        [url, name, title, description, userId]
    );
};

module.exports.deleteImg = function deleteImg(url) {
    return db.query(
        `DELETE FROM images
        WHERE url=$1;`,
        [url]
    );
};

module.exports.addUser = function addUser(name, email, password) {
    return db.query(
        `INSERT INTO users (name, email, password)
        VALUES ($1,$2,$3)
        RETURNING id, name, email;
        `,
        [name, email, password]
    );
};

module.exports.findUser = function findUser(email) {
    return db.query(
        `SELECT id, name, email, password
        FROM users
        WHERE email=$1;
        `,
        [email]
    );
};

module.exports.getMoreImages = function getMoreImages(minId) {
    return db.query(
        `SELECT * FROM images
        WHERE id<$1
        ORDER BY id DESC
        LIMIT 6;
        `,
        [minId]
    );
};
