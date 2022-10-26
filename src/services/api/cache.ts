abstract class BaseCache {
  private cache: Record<string, CacheValue> = {};
  get = (key: string) => this.cache[key];
  set = (key: string, value: CacheValue) => (this.cache[key] = value);
  flushAll = () => (this.cache = {});
}

class DefaultCache extends BaseCache {}

interface CacheValue {
  etag: string;
  value: any;
}

export class Cache {
  static instance: Cache;
  cache: BaseCache;

  static getInstance = () => {
    if (!this.instance) {
      this.instance = new Cache(new DefaultCache());
    }
    return this.instance;
  };

  static get = (uuid: string) => this.getInstance().cache.get(uuid);

  static set = (uuid: string, etag: string, value: any) =>
    this.getInstance().cache.set(uuid, { etag, value });

  static reset = () => this.getInstance().cache.flushAll();

  constructor(cache: BaseCache) {
    this.cache = cache;
  }
}

const byLowerCase = (toFind: string) => (value: string) =>
  value.toLowerCase() === toFind;

export const getHeaderCaseInsensitive = (
  headerName: string,
  headers: Record<string, string> = {},
) => {
  const key = Object.keys(headers).find(byLowerCase(headerName));
  return key ? headers[key] : undefined;
};
