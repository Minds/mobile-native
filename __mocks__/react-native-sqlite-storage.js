const mockSQLite = {
  enablePromise(){},
  openDatabase: (...args) => {
    return {
      transaction: (...args) => {
        executeSql: (query) => { return []; }
      }
    };
  }
}

export default mockSQLite;