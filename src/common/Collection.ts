/**
 * Collection
 */
export default class Collection extends Array {
  /**
   * Helper method that proxy call of methods
   */
  each = new Proxy(this, {
    get: (target, name) => {
      return function wrapper() {
        var args = Array.prototype.slice.call(arguments);
        target.forEach(item => {
          item[name].apply(item, args);
        });
      };
    },
  });
}
