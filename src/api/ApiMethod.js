/* @flow */

import url from "url";
import invariant from "invariant";
import { isApiMethod, isAuthMethod, isValidServer } from "../utils";
import ApiRequest from "./ApiRequest";
import type { ApiResult, ApiMethodOptions } from "./types";

const locations = {
  1: "api.pcloud.com",
  2: "eapi.pcloud.com",
};
const defaultApiServer = "eapi.pcloud.com";

export default function ApiMethod(method: string, options: ApiMethodOptions = {}): Promise<ApiResult> {

  
  const { apiServer = defaultApiServer, apiProtocol = "https", params = {}, ...requestParams } = options;

  // eslint-disable-next-line no-implicit-coercion
  invariant(isValidServer(locations, apiServer), "apiServer `" + apiServer + "` is not a valid pCloud server")

  invariant(isApiMethod(method), "Method `" + method + "` is not pCloud API method.");

  invariant(
    !isAuthMethod(method) || "auth" in params || "access_token" in params || "username" in params,
    "`auth` must be present for methods that require authentication."
  );

  const requestUrl: string = url.format({
    protocol: apiProtocol,
    host: apiServer,
    pathname: method,
    query: params,
  });

  if (requestParams.responseType === undefined) {
    requestParams.responseType = "json";
  }

  return ApiRequest(requestUrl, requestParams).then((response: ApiResult) => {
    if (requestParams.responseType === "json") {
      if (response.result !== 0) {
        return Promise.reject(response);
      }
    }

    return response;
  });
}
