DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures(
    id SERIAL PRIMARY KEY,
    signature TEXT not null,
    userid INT NOT NULL UNIQUE REFERENCES users (id)
);
