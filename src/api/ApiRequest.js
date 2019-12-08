/* @flow */

import request from "superagent";
import invariant from "invariant";
import { httpProgressMiddleware } from "../utils";
import type { ApiRequestOptions, ApiResult } from "./types";

let inProgress: { [id: string]: number } = {};
let waitCallbacks: {
  [id: string]: Array<[(T: ApiResult) => void, ApiRequestOptions]>,
} = {};

export default function ApiRequest(url: string, options: ApiRequestOptions = {}): Promise<ApiResult> {
  invariant(url.length, "`url` is required.");

  let { method = "get", responseType = "json", onProgress = () => {}, xhr, pipe = false, files = [] } = options;

  if (method === "get" && url in inProgress) {
    if (waitCallbacks[url] === undefined) {
      waitCallbacks[url] = [];
    }

    return new Promise(resolve => {
      waitCallbacks[url].push([
        (response: ApiResult) => {
          resolve(response);
        },
        options,
      ]);
    });
  } else {
    inProgress[url] = 1;
  }

  // call
  let req = request[method](url);

  // progress upload/download
  req.on("progress", onProgress);

  // attaching files
  // works for both node/web
  // in one case its path to file, in the other is File object
  if (files.length) {
    invariant(["put", "post"].indexOf(method) !== -1, "When uploading, `method` must be either `post` or `put`.");

    files.forEach(({ name = undefined, file }) => {
      invariant(file, "`file` is a required property of `files`.");

      req.attach(filenameKey(), file, name);
    });
  }

  if ("responseType" in req && responseType !== "json") {
    req.responseType(responseType);
  }

  if (ENV === "node") {
    // node only progress based on the stream events
    req.use(httpProgressMiddleware);

    /**
     * `superagent` cannot be used as then-able object when piping and since
     * when piping the "end" is called anyway, we need to create and
     * manage different promise for this case only.
     */
    if (pipe) {
      return new Promise((resolve, reject) => {
        req
          .pipe(pipe)
          .on("finish", resolve)
          .on("error", reject);
      });
    }
  }

  // pass xhr object before calling the request
  // important for custom checking the progress of the call
  // in case of intentionally blocking operations and so on...
  if (xhr) {
    xhr(req.xhr);
  }

  /*
  return new Promise((resolve, reject) => {
    req.end((error, response) => {
      if (error) {
        clearInProgressCallbacks();
        reject({ result: error.status || 500, error: "Network Error" });
      } else {
        if (responseType === "json") {
          const { body } = response;

          callbacksReceiveBody(body);
          resolve(body);
        } else if (responseType === "text") {
          resolve(response.text);
        }
      }
    });
  });
  */

  return req
    .then(response => {
      if (responseType === "json") {
        const { body } = response;

        callbacksReceiveBody(body);
        return body;
      } else if (responseType === "text") {
        return response.text;
      }
    })
    .catch(error => {
      const errorObj = { result: error.status || 500, error: "Network Error" };

      clearInProgressCallbacks();

      return Promise.reject(errorObj);
    });

  // clear currently running urls
  function clearInProgressCallbacks() {
    if (url in inProgress) {
      delete inProgress[url];
    }
  }

  // send all currently waiting tasks their data
  function callbacksReceiveBody(body) {
    clearInProgressCallbacks();

    if (url in waitCallbacks) {
      while (waitCallbacks[url].length) {
        const [callback] = waitCallbacks[url].shift();

        callback(body);
      }
    }
  }
}

let n = 1;
function filenameKey(): string {
  return "file-upload-" + ++n;
}
