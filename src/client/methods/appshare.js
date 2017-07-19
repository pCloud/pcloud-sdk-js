/* @flow */

import invariant from "invariant";
import type { MethodApi } from "../types";
import { isEmail } from "../../utils";

const permissionsMap = { view: 0, edit: 7 };

export default ({ client, type }: MethodApi) => (
  folderid: number,
  userid: number,
  clientid: string,
  access: "view" | "edit" = "view"
): Promise<boolean> => {
  invariant(type === "pcloud", "This method supports only clients of type `pcloud`.");
  invariant(typeof folderid === "number", "`folderid` must be number.");
  invariant(folderid !== 0, "`folderid` cannot be 0.");
  invariant(["view", "edit"].indexOf(access) != -1, "`permissions` can be either `view` or `edit`.");

  invariant(userid, "`userid` is required.");
  invariant(typeof userid === "number", "`userid` is required.");
  invariant(parseInt(userid), "`userid` must be either number or a valid mail address.");
  invariant(clientid, "`clientid` is required");
  invariant(typeof clientid === "string", "`clientid` is required");

  return client
    .api("sharefolder", {
      params: {
        folderid: folderid,
        permissions: permissionsMap[access],
        userid: userid,
        client_id: clientid
      }
    })
    .then(() => true);
};
