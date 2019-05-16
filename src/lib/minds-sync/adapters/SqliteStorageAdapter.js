import logService from "../../../common/services/log.service";

export default class SqliteStorageAdapter {
  /**
   * @param {SqliteService} db sqlite db filename
   */
  constructor(db) {
    this.db = db;
    this.isReady = false;
    this.schemas = {};
  }

  /**
   * @param {Number} versionNumber
   * @param {Object} schema
   */
  schema(versionNumber, schema) {
    this.schemaDefinition = schema;
    this.versionNumber = versionNumber;
  }

  async buildSchema() {
    for (const tableName of Object.keys(this.schemaDefinition)) {
      const table = this.schemaDefinition[tableName];
      const primaryKey = table.primaryKey || '';
      const indexes = table.indexes || [];
      const nonIndexFields = table.fields || [];
      await this.createTable(tableName, primaryKey, indexes, nonIndexFields, this.versionNumber);
    }
  }

  /**
   * @param {string} tableName
   * @param {string} primaryKey
   * @param {array} indexes
   * @param {array} nonIndexFields
   * @param {number} versionNumber
   */
  async createTable(tableName, primaryKey, indexes, nonIndexFields, versionNumber) {

    const fields = [...indexes, ...nonIndexFields];

    if (primaryKey) fields.push(primaryKey);

    this.schemas[tableName] = {};
    this.schemas[tableName].primaryKey = primaryKey;
    this.schemas[tableName].fields = fields;
    this.schemas[tableName].insertSql = `REPLACE INTO \`${tableName}\` (\`${fields.join('\`,\`')}\`,\`jsonData\`) values(${'?,'.repeat(fields.length)}?)`;
    this.schemas[tableName].deleteSql = `DELETE FROM \`${tableName}\` WHERE `;
    this.schemas[tableName].selectSql = `SELECT * FROM \`${tableName}\` `;

    const mappedFields = fields.map(field => `\`${field}\` VARCHAR(128) NOT NULL`);

    mappedFields.push('\`jsonData\` TEXT');

    if (primaryKey) mappedFields.push(`PRIMARY KEY(\`${primaryKey}\`)`);

    let sql = `CREATE TABLE IF NOT EXISTS \`${tableName}\` (${mappedFields.join(',')});`;

    // create indexes
    sql += indexes.map(field => `\nCREATE INDEX IF NOT EXISTS \`${tableName}_${field}\` ON \`${tableName}\` (\`${field}\`);`);

    return await this.db.executeSql(sql);
  }

  /**
   * @returns {Promise<boolean>}
   */
  async ready() {
    if (!this.isReady) {
      await this.db.init();
      await this.buildSchema();

      logService.log('Database is ready');

      this.isReady = true;
    }

    return true;
  }

  /**
   * @param {string} table
   * @param {Object} data
   * @returns {Promise<any>}
   */
  async insert(table, data) {
    const params = this.schemas[table].fields.map(f => data[f]);
    params.push(JSON.stringify(data));
    return await this.db.executeSql(this.schemas[table].insertSql, params)
  }

  /**
   * @param {string} table
   * @param {string} id
   * @param {Object} changes
   * @returns {Promise<number>}
   */
  async update(table, id, changes) {
    return this.upsert(table, id, changes, {});
  }

  /**
   * @param {string} table
   * @param {string} id
   * @param {Object} data
   * @param {Object} initialData
   * @returns {Promise<boolean>}
   */
  async upsert(table, id, data, initialData = {}) {
    return this.insert(
      table,
      Object.assign(
        (await this.get(table, id)) || {},
        initialData,
        data,
      )
    );
  }

  /**
   * @param {string} table
   * @param {string} key
   * @returns {Promise<void>}
   */
  async delete(table, key) {
    return await this.db.executeSql(this.schemas[table].deleteSql + `\`${table}\`.\`${this.schemas[table].primaryKey}\`=?`, [key]);
  }

  /**
   * @param {string} table
   * @returns {Promise<void>}
   */
  async truncate(table) {
    return await this.db.executeSql(this.schemas[table].deleteSql + ' 1=1');
  }

  /**
   * @param {String} table
   * @param {*[]} rows
   * @returns {Promise<*>}
   */
  async bulkInsert(table, rows) {
    return await this.db.transaction((tx) => {
      rows.forEach(data => {
        const params = this.schemas[table].fields.map(f => data[f]);
        params.push(JSON.stringify(data));
        tx.executeSql(this.schemas[table].insertSql, params)
      });
    });

    // const insertOperations = [];

    // for (const data of rows) {
    //   const params = this.schemas[table].fields.map(f => data[f]);
    //   params.push(JSON.stringify(data));
    //   insertOperations.push(this.db.executeSql(this.schemas[table].insertSql, params));
    // }

    // await Promise.all(insertOperations);
    // return true;

    // return rows.forEach(async data => {
    //   const params = this.schemas[table].fields.map(f => data[f]);
    //   params.push(JSON.stringify(data));
    //   await this.db.executeSql(this.schemas[table].insertSql, params)
    // });
  }

  /**
   * @param {String} table
   * @param {String} field
   * @param {number} value
   * @returns {Promise<number>}
   */
  async deleteLessThan(table, field, value) {
    return await this.db.executeSql(this.schemas[table].deleteSql + `\`${table}\`.\`${field}\`<?`, [value]);
  }

  /**
   * @param {String} table
   * @param {String} field
   * @param {String|Number} value
   * @returns {Dexie.Promise<number>}
   */
  async deleteEquals(table, field, value) {
    return await this.db.executeSql(this.schemas[table].deleteSql + `\`${table}\`.\`${field}\`=?`, [value]);
  }

  /**
   * @param {String} table
   * @param {String} index
   * @param {*[]} values
   * @returns {Promise<number>}
   */
  async deleteAnyOf(table, index, values) {
    const wildcards = values.map(() => '?').join(', ');
    return await this.db.executeSql(this.schemas[table].deleteSql + `\`${table}\`.\`${index}\` IN (${wildcards})`, [...values]);
  }

  /**
   * @param {String} table
   * @param {String} key
   * @returns {Promise<Object>}
   */
  async get(table, key) {
    const sql = this.schemas[table].selectSql + `WHERE \`${table}\`.\`${this.schemas[table].primaryKey}\`=?`;
    const [result] = await this.db.executeSql(sql, [key]);
    const raw = result.rows.raw();
    if (raw.length == 1) {
      return JSON.parse(raw[0].jsonData);
    };
  }

  /**
   * @param {String} table
   * @param {String} field
   * @param {String|Number} value
   * @param {Object} opts
   * @returns {Promise<Array<*>>}
   */
  async getAllSliced(table, field, value, opts) {
    let sql = this.schemas[table].selectSql + `WHERE \`${table}\`.\`${field}\`=?`;

    if (opts.limit) {
      sql += ` LIMIT ${opts.limit}`;
    }
    if (opts.offset) {
      sql += ` OFFSET ${opts.offset}`;
    }
    const [result] = await this.db.executeSql(sql, [value]);

    const raw = result.rows.raw();
    if (raw.length > 0) {
      return raw.map(v => JSON.parse(v.jsonData));
    }

    return [];
  }

  /**
   * @param {String} table
   * @param {String} field
   * @param {String|Number} value
   * @param {{ sortBy }} opts
   * @returns {Promise<Array<*>>}
   */
  async getAllLessThan(table, field, value, opts = {}) {
    let sql = this.schemas[table].selectSql + `WHERE \`${table}\`.\`${field}\`<?`;
    const params = [value];

    if (opts.sortBy) {
      sql += ` ORDER BY \`${table}\`.\`${opts.sortBy}\` ASC`;
    }

    const [result] = await this.db.executeSql(sql, params);

    const raw = result.rows.raw();
    if (raw.length > 0) {
      return raw.map(v => JSON.parse(v.jsonData));
    }

    return [];
  }

  /**
   * @param {string} table
   * @param {{ sortBy }} opts
   * @returns {Promise<*[]>}
   */
  async all(table, opts = {}) {
    let sql = this.schemas[table].selectSql;
    const values = [];

    if (opts.sortBy) {
      sql += ` ORDER BY \`${table}\`.\`${opts.sortBy}\` ASC`;
    }

    const [result] = await this.db.executeSql(sql, values);

    const raw = result.rows.raw();
    if (raw.length > 0) {
      return raw.map(v => JSON.parse(v.jsonData));
    }
    return [];
  }

  /**
   * @param {String} table
   * @param {String} index
   * @param {*[]} values
   * @returns {Promise<*[]>}
   */
  async anyOf(table, index, values) {
    const wildcards = values.map(() => '?').join(', ');
    let sql = this.schemas[table].selectSql + `WHERE \`${table}\`.\`${index}\` IN (${wildcards})`;

    const [result] = await this.db.executeSql(sql, [...values]);

    const raw = result.rows.raw();
    if (raw.length > 0) {
      return raw.map(v => JSON.parse(v.jsonData));
    }
    return [];
  }
}
