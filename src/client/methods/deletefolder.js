/* @flow */

import invariant from "invariant";
import type { MethodApi } from "../types";

export default ({ client }: MethodApi) =>
  (folderid: number): Promise<boolean> => {
    invariant(typeof folderid === "number", "`folderid must be a number.`");
    invariant(folderid, "`folderid` is required and can't be `0`.");

    return client
      .api("deletefolderrecursive", { params: { folderid: folderid } })
      .then(response => true);
  };
