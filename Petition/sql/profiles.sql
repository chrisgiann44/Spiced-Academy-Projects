DROP TABLE IF EXISTS profiles;

CREATE TABLE profiles(
    id SERIAL PRIMARY KEY,
    age INTEGER,
    city VARCHAR(255),
    homepage VARCHAR(255),
    userid INTEGER NOT NULL REFERENCES users (id) UNIQUE
);
