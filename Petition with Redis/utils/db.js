const spicedPg = require("spiced-pg");

// Setting up the query //

const dbUrl =
    process.env.DATABASE_URL ||
    "postgres:postgres:postgres@localhost:5432/salt-petition";
const db = spicedPg(dbUrl);

// adding queries //

module.exports.addUser = function addUser(first, last, email, password) {
    return db.query(
        `INSERT INTO users (name, surname, email, password)
        VALUES ($1,$2,$3,$4)
        RETURNING id, name, surname, email;
        `,
        [first, last, email, password]
    );
};

module.exports.updateUser = function updateUser(
    userid,
    first,
    last,
    email,
    password
) {
    return db.query(
        `UPDATE users
        SET name = $2, surname = $3, email = $4, password = $5
        WHERE id=$1;
        `,
        [userid, first, last, email, password]
    );
};

module.exports.findUser = function findUser(email) {
    return db.query(
        `SELECT users.id, name, surname, email, password, age, city, homepage
        FROM users
        LEFT JOIN profiles
        ON users.id = profiles.userid
        WHERE email=$1;
        `,
        [email]
    );
};

module.exports.addProf = function addProf(age, city, homepage, userid) {
    return db.query(
        `INSERT INTO profiles (age ,city, homepage, userid)
        VALUES ($1,$2,$3,$4);
        `,
        [age, city, homepage, userid]
    );
};

module.exports.updateProf = function updateProf(age, city, homepage, userid) {
    return db.query(
        `INSERT INTO profiles (age, city, homepage, userid)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (userid)
        DO UPDATE SET age = $1, city = $2, homepage = $3;
        `,
        [age, city, homepage, userid]
    );
};

module.exports.addSig = function addSig(userid, signature) {
    return db.query(
        `INSERT INTO signatures (userid, signature)
        VALUES ($1, $2)
        RETURNING id;
        `,
        [userid, signature]
    );
};

module.exports.findSig = function findSig(id) {
    return db.query(
        `SELECT id, signature FROM signatures
        WHERE userid=$1;`,
        [id]
    );
};

module.exports.findNames = function findNames() {
    return db.query(`SELECT users.name AS name, users.surname AS surname, profiles.age AS age, profiles.city AS city,  profiles.homepage AS homepage
        FROM users
        JOIN signatures
        ON users.id = signatures.userid
        LEFT JOIN profiles
        ON users.id = profiles.userid;`);
};

module.exports.deleteSig = function deleteSig(id) {
    return db.query(
        `DELETE FROM signatures
        WHERE userid=$1;`,
        [id]
    );
};

module.exports.deleteProf = function deleteProf(id) {
    return db.query(
        `DELETE FROM profiles
        WHERE userid=$1;`,
        [id]
    );
};

module.exports.deleteUser = function deleteUser(id) {
    return db.query(
        `DELETE FROM users
        WHERE id=$1;`,
        [id]
    );
};
