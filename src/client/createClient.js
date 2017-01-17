/* @flow */

import invariant from "invariant";
import deepAssign from "deep-assign";
import ApiMethod from "../api/ApiMethod";
import type { ClientApiMethodOptions, ClientMethod, ClientType } from "./types";
import type { ApiResult } from "../api/types";
import * as methods from "./methods";
import { isAuthMethod } from "../utils";

const defaultApiServer = "api.pcloud.com";

export default function createClient(
  token: string,
  type: ClientType = "oauth",
  useProxy: boolean = false
) {
  invariant(
    [ "oauth", "pcloud" ].indexOf(type) !== -1,
    "`type` must be either `oauth` or `pcloud`."
  );

  if (type === "oauth") {
    invariant(typeof token === "string", "`token` is required.");
    invariant(token.length, "`token` is required.");
  }

  // Local Params
  // apiServer, token, type
  let apiServer = defaultApiServer;

  function initialOptions(method: string) {
    let options = { apiServer: apiServer, params: {} };

    if (isAuthMethod(method) && token) {
      options.params["oauth" === type ? "access_token" : "auth"] = token;
    }

    return options;
  }

  function api(
    method: string,
    options: ClientApiMethodOptions = {}
  ): Promise<ApiResult> {
    let mergeOptions = deepAssign({}, initialOptions(method), options);

    return ApiMethod(method, mergeOptions)
      .catch((error) => {
        if (error.result === 500 && apiServer !== defaultApiServer) {
          // reset API server
          apiServer = defaultApiServer;

          // retry
          return api(method, options);
        } else {
          return Promise.reject(error);
        }
      });
  }

  function setupProxy() {
    return api("getapiserver", {})
      .then((response: any) => {
        return apiServer = response.api[0];
      });
  }

  function setToken(newToken: string) {
    token = newToken;
  }

  // client api for end users
  let client: any = { api, setupProxy };

  let pcloudMethod;

  for (let method in methods) {
    if (methods.hasOwnProperty(method)) {
      let baseMethod: ClientMethod = methods[method];

      pcloudMethod = baseMethod({ client, setToken, type }, type);

      if (typeof pcloudMethod === "function") {
        client[method] = pcloudMethod;
      }
    }
  }

  if (useProxy) {
    setupProxy();
  }

  return client;
}
