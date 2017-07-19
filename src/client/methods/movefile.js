/* @flow */

import invariant from "invariant";
import type { MethodApi } from "../types";

export default ({ client }: MethodApi) => (fileid: number, tofolderid: number): Promise<boolean> => {
  invariant(typeof fileid === "number", "`fileid` must be number.");
  invariant(fileid !== 0, "`fileid` cannot be 0.");
  invariant(tofolderid, "`tofolderid` is required.");

  return client
    .api("renamefile", {
      params: {
        fileid: fileid,
        tofolderid: tofolderid
      }
    })
    .then(response => response.metadata);
};
