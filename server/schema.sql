CREATE TABLE beerTypes (
  name TEXT
);

CREATE TABLE bars (
  name TEXT,
  startTime DATETIME,
  endTime DATETIME,
  lon FLOAT,
  lat FLOAT
);

CREATE TABLE beers (
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
