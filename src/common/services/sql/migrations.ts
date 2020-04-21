//@ts-nocheck
const migrations = [
  'DROP TABLE IF EXISTS users;',
  'DROP TABLE IF EXISTS entities;',
  'DROP TABLE IF EXISTS feeds;',
  'DROP TABLE IF EXISTS syncAt;',
  'DROP TABLE IF EXISTS boosts;',
  'CREATE TABLE IF NOT EXISTS entities ( urn VARCHAR(255) NOT NULL PRIMARY KEY, data TEXT, updated INTEGER )',
  'CREATE TABLE IF NOT EXISTS feeds ( key VARCHAR(255) NOT NULL, offset INTEGER NOT NULL, data TEXT, updated INTEGER, PRIMARY KEY(key, offset))',
  'CREATE INDEX feeds_updated ON feeds(updated);',
  'CREATE INDEX entities_updated ON entities(updated);',
  'CREATE TABLE IF NOT EXISTS comments_feeds ( parent VARCHAR(128) NOT NULL, parent_path VARCHAR(128) NOT NULL, descending BOOLEAN, offset VARCHAR(64) NOT NULL, focused_urn VARCHAR(255) NOT NULL, data TEXT, updated INTEGER, PRIMARY KEY(parent, parent_path, descending, offset, focused_urn))',
  'CREATE INDEX comments_feeds_updated ON comments_feeds(updated);',
];
export default migrations;
