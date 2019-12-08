/* @flow */

import invariant from "invariant";
import type { MethodApi } from "../types";

export default ({ client }: MethodApi) => (folderid: number = 0, optionalParams?: Object): Promise<Object> => {
  invariant(typeof folderid === "number", "`folderid` must be a number.");

  return client
    .api("listfolder", {
      params: {
        folderid: folderid,
        ...optionalParams,
      },
    })
    .then(response => {
      return response.metadata;
    });
};
