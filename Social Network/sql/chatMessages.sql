CREATE TABLE messages(
id SERIAL PRIMARY KEY,
sender_id INTEGER REFERENCES users(id) NOT NULL,
message VARCHAR(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
