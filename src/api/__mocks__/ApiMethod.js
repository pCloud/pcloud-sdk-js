/* @flow */

/**
 * Mock for api/method
 *
 * Exports the actual mock (apiMethod) as default and:
 *  on(match: (method, options) => boolean, respond: (method, params) => data, onFire?: () => void)
 *  one: same as on, but handler is removed upon first usage
 *
 * helpers that enhance response for use in the respond function
 * success(data: mixed) => success api payload
 * error(result: number, error: string) => error api payload
 * httpError(code: number, error: string) => network error payload
 *
 */

type obj = { [mixed]: mixed };
type matchFunc = (method: string, options: obj) => boolean;
type respondFunc = (method: string, options: obj) => any;
type onFire = (method: string, options: obj) => void | null;

import type { ApiError } from "../types";

let handlers: Array<[matchFunc, respondFunc, onFire]> = [];

// $FlowExpectError
export default jest.fn((method: string, options: {}) => {
  let promised = null;

  for (let [match, respond, onFire] of handlers) {
    if (match(method, options)) {
      promised = respond(method, options);

      if (onFire) {
        onFire(method, options);
      }

      break;
    }
  }

  if (promised === null) {
    throw new Error(`No route found for: ${method}. Handlers: ${handlers.length} `);
  }

  return promised;
});

export function on(match: matchFunc, respond: respondFunc, onFire: onFire) {
  handlers.push([match, respond, onFire]);
}

export function one(match: matchFunc, respond: respondFunc, onFire: onFire) {
  var me = [
    function() {
      const isMatch = match.apply(null, arguments);

      if (isMatch) {
        handlers.splice(handlers.indexOf(me), 1);
      }

      return isMatch;
    },
    respond,
    onFire,
  ];

  handlers.push(me);
}

export function text(data: string) {
  return () => Promise.resolve(data);
}

export function success(data: any) {
  return () => {
    data.result = 0;

    return Promise.resolve(data);
  };
}

export function error(result: number, error: string) {
  return (method: string, options: { onError?: ApiError => void }) => {
    const errorObj: ApiError = { result: result, error: error };

    if (options.onError) {
      options.onError(errorObj);
    }

    return Promise.reject(errorObj);
  };
}
