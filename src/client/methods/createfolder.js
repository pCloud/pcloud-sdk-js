/* @flow */

import invariant from "invariant";
import type { MethodApi } from "../types";

export default ({ client }: MethodApi) => (name: string = "", parentfolderid: number = 0): Promise<{}> => {
  invariant(name.length, "`name` for is required");
  invariant(typeof name === "string", "`name` is required and be a string.");
  invariant(typeof parentfolderid === "number", "`parentfolderid` is required.");

  return client
    .api("createfolder", {
      params: {
        name: name,
        folderid: parentfolderid
      }
    })
    .then(response => response.metadata);
};
