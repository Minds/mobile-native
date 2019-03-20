import SQLite from 'react-native-sqlite-storage';
SQLite.enablePromise(true);

/**
 * Sqlite service
 */
export default class SqliteService {

  /**
   * @param {string} dbname
   */
  constructor(dbname) {
    this.dbname = dbname;
  }

  /**
   * Init db
   */
  async init() {
    if (!this.db) {
      this.db = await SQLite.openDatabase({name: this.dbname, location: 'default'});
    }
  }

  /**
   * @param {string} sql
   * @param {array} params
   */
  async executeSql(sql, params) {
    return await this.db.executeSql(sql, params);
  }

  /**
   * @param {function} tx
   */
  async transaction(tx) {
    return await this.db.transaction(tx);
  }
}