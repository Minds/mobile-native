/**
 * Base model
 */
export default class AbstractModel {
  /**
   * Child models classes
   */
  childModels() {
    return {};
  }

  /**
   * Create an instance
   * @param {object} data
   */
  static create<T extends typeof AbstractModel>(
    this: T,
    data: object,
  ): InstanceType<T> {
    const obj: InstanceType<T> = new this() as InstanceType<T>;
    obj.assign(data);
    return obj;
  }

  /**
   * Create an array of instances
   * @param {array} arrayData
   */
  static createMany<T extends typeof AbstractModel>(
    this: T,
    arrayData: Array<object>,
  ): Array<InstanceType<T>> {
    const collection: Array<InstanceType<T>> = [];
    if (!arrayData) {
      return collection;
    }

    arrayData.forEach((data) => {
      const obj: InstanceType<T> = new this() as InstanceType<T>;
      obj.assign(data);
      collection.push(obj);
    });

    return collection;
  }

  /**
   * Check if data is an instance of the model and if it is not
   * returns a new instance
   * @param {object} data
   */
  static checkOrCreate<T extends typeof AbstractModel>(
    this: T,
    data,
  ): InstanceType<T> {
    if (data instanceof this) {
      return data as InstanceType<T>;
    }
    return this.create(data);
  }

  /**
   * Assign values to obj
   * @param data any
   */
  assign(data: any) {
    // Some users have a number as username and engine return them as a number
    if (data.username) {
      data.username = String(data.username);
    }

    // some blogs has numeric name
    if (data.name) {
      data.name = String(data.name);
    }
    Object.assign(this, data);

    // create childs instances
    const childs = this.childModels();
    for (var prop in childs) {
      if (this[prop]) {
        this[prop] = childs[prop].create(this[prop]);
      }
    }
  }
}
