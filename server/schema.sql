CREATE TABLE beerTypes (
  id INTEGER PRIMARY KEY,
  name TEXT
);

CREATE TABLE bars (
  id INTEGER PRIMARY KEY,
  name TEXT,
  startTime DATETIME,
  endTime DATETIME,
  lon FLOAT,
  lat FLOAT
);

CREATE TABLE beers (
  id INTEGER PRIMARY KEY,
  barId ROWID,
  typeId ROWID,
  personId BIGINT,
  personName TEXT,
  loggedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

  volume FLOAT,
  abv FLOAT,
  price FLOAT,

  starRating INT,
  review TEXT
);
