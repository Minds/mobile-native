class SqliteServiceMock {

  init = jest.fn();
  runMigrations = jest.fn();
  rebuildDB = jest.fn();
  executeSql = jest.fn();
  transaction = jest.fn();

}

export default SqliteServiceMock