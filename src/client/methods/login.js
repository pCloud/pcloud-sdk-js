/* @flow */

import type { MethodApi } from "../types";

export default ({ client }: MethodApi) => (optionalParams?: Object): Promise<string> => {
  return client
    .api("userinfo", {
      params: {
        ...optionalParams,
      },
    })
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log("Error", error);
    });
};
