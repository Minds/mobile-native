import SQLite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-community/async-storage';
import logService from './log.service';
SQLite.enablePromise(true);

/**
 * Sqlite service
 */
export default class SqliteService {
  /**
   * @var {string}
   */
  dbname;

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
      await this.runMigrations();
    }
  }

  /**
   * Run schema migrations
   */
  async runMigrations() {
    const migrations = require('./sql/migrations').default;

    let count = await AsyncStorage.getItem('minds:sqlmigrations');
    if (!count) count = 0;

    const torun = (count > 0) ? migrations.slice(count) : migrations;

    await this.db.transaction(tx => {
      torun.forEach(m => {
        logService.info('sql running migration' + m);
        tx.executeSql(m, []);
      });
    });

    AsyncStorage.setItem('minds:sqlmigrations', migrations.length.toString());
  }

  async rebuildDB() {
    await SQLite.deleteDatabase({name: this.dbname, location: 'default'});
    this.db = await SQLite.openDatabase({name: this.dbname, location: 'default'});

    AsyncStorage.setItem(
      'minds:sqlmigrations', '0',
      () => this.runMigrations()
    );
  }
  /**
   * @param {string} sql
   * @param {array} params
   */
  async executeSql(sql, params) {
    if (!this.db) await this.init();
    return await this.db.executeSql(sql, params);
  }

  /**
   * @param {function} tx
   */
  async transaction(tx) {
    if (!this.db) await this.init();
    return await this.db.transaction(tx);
  }
}