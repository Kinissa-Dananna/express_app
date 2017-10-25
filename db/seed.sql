DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS bars;
DROP TABLE IF EXISTS events_users;

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  password_digest VARCHAR NOT NULL,
  token VARCHAR NOT NULL
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  ownerId INTEGER,
  name VARCHAR(255),
  description VARCHAR(255),
  time TIMESTAMP NOT NULL
);

CREATE TABLE bars (
  id SERIAL PRIMARY KEY,
  eventId INTEGER,
  lat DOUBLE PRECISION,
  long DOUBLE PRECISION,
  name VARCHAR(255)
);

CREATE TABLE events_users (
  eventId INTEGER,
  userId INTEGER
);
