/* @flow */

import invariant from "invariant";
import type { MethodApi } from "../types";

export default ({ client }: MethodApi) => (fileid: number, toname: string): Promise<boolean> => {
  invariant(typeof fileid === "number", "`fileid` must be number.");
  invariant(fileid !== 0, "`fileid` cannot be 0.");
  invariant(toname, "`toname` is required.");
  invariant(toname.length, "`toname` is required.");

  return client
    .api("renamefile", {
      params: {
        fileid: fileid,
        toname: toname
      }
    })
    .then(response => response.metadata);
};
