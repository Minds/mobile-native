const migrations = [
  "DROP TABLE IF EXISTS users;",
  "DROP TABLE IF EXISTS entities;",
  "DROP TABLE IF EXISTS feeds;",
  "DROP TABLE IF EXISTS syncAt;",
  "DROP TABLE IF EXISTS boosts;",
  "CREATE TABLE IF NOT EXISTS entities ( urn VARCHAR(255) NOT NULL PRIMARY KEY, data TEXT, updated INTEGER )",
  "CREATE TABLE IF NOT EXISTS feeds ( key VARCHAR(255) NOT NULL, offset INTEGER NOT NULL, data TEXT, updated INTEGER, PRIMARY KEY(key, offset))"
];

export default migrations;