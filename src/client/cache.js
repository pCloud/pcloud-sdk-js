/* @flow */

type CacheObject = {
  expiry: number,
  data: mixed
};

type CacheStore = {
  [id: string]: CacheObject
}

type Cache = {
  cacheid: (string) => string,
  get: (string) => mixed,
  has: (string) => boolean,
  getOrSet: (string, mixed, number) => mixed,
  set: (string, mixed, number) => mixed,
  expire: (string) => void,
  expireMatch: (string) => void,
  clean: () => void,
  cleanAll: () => void
}

const defaultExpiry: number = 30;

export default function createCache(): Cache {
  let cacheObj: CacheStore = {};

  function cacheid(name: string): string {
    var cacheid = name;
    var n = 0;
    if (arguments.length > 1 && typeof arguments[1] === 'object') {
      for (n in arguments[1]) {
        if (arguments[1].hasOwnProperty(n)) {
          cacheid += '-' + n + ':' + arguments[1][n];
        }
      }
    } else {
      for (n = 1; n < arguments.length; ++n) {
        if (arguments.hasOwnProperty(n)) {
          cacheid += "-" + arguments[n];
        }
      }
    }
    return cacheid;
  }

  function get(key: string): mixed | false {
    if (has(key)) {
      return cacheObj[key].data;
    }

    clean();
    return false;
  }

  function has(key: string): boolean {
    return (key in cacheObj) && cacheObj[key].expiry > Date.now();
  }

  function getOrSet(key: string, val: mixed, expiry: number = defaultExpiry) {
    if (!has(key)) {
      set(key, val, expiry);
    }

    return get(key);
  }

  function set(key: string, val: mixed, expiry?: number = defaultExpiry): void {
    cacheObj[key] = {
      expiry: Date.now() + expiry * 1000,
      data: val
    };
  }

  function expire(key: string): void {
    if (key in cacheObj) {
      delete cacheObj[key];
    }
  }

  function expireMatch(q: string) {
    let key;

    for (key in cacheObj) {
      if (key.match(q)) {
        expire(key);
      }
    }
  }

  function clean(): void {
    for (var n in cacheObj) {
      if (cacheObj[n].expiry < Date.now()) {
        delete cacheObj[n];
      }
    }
  }

  function cleanAll(): void {
    cacheObj = {};
  }

  return {
    cacheid, has, get, set, getOrSet, expire,
    expireMatch, clean, cleanAll
  };
}


/*
function debug(): CacheStore {
  return cacheObj;
}
*/
