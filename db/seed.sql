DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS bars;
DROP TABLE IF EXISTS events_users;

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  image VARCHAR(255) NOT NULL,
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
  barId VARCHAR(255),
  eventId INTEGER,
  lat DOUBLE PRECISION,
  long DOUBLE PRECISION,
  name VARCHAR(255)
);

CREATE TABLE events_users (
  eventId INTEGER,
  userId INTEGER
);


INSERT INTO events (ownerId, name, description, time) VALUES
(1, 'Bar Time!', 'Wow! Time to go to some bars!', '2017-12-10 20:00:00'),
(1, 'maybe bar time', 'ok maybe not', '2017-12-10 20:00:00');

INSERT INTO bars (barId, eventId, lat, long, name) VALUES
('5078c4f1e4b0dad821e1f6bd', 1, 40.77151499215726, -73.98191213607788, 'The Smith'),
('4a7dff4df964a52091f01fe3', 1, 40.7405579801227, -74.00777996246534, 'The Biergarten at The Standard'),
('40a16900f964a520f9f21ee3', 2, 40.74056311435524, -74.00590181350708, 'Soho House');
