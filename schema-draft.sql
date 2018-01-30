CREATE TABLE beer_entry (
  "id" serial PRIMARY KEY,
  "barId" int NOT NULL,
  "userId" bigint NOT NULL,
  "typeId" int NOT NULL,
  "time" timestamp NOT NULL,
  "abv" decimal NOT NULL,
  "volume" decimal NOT NULL,
  "description" text
);

CREATE TABLE beer_type (
	"id" serial PRIMARY KEY,
  "name" text NOT NULL,
  "color" text NOT NULL
);

CREATE TABLE user (
	"id" bigint,
  "name" text NOT NULL
);

CREATE TABLE bar (
	"id" serial PRIMARY KEY,
  "name" text NOT NULL
);