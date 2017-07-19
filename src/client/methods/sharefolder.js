/* @flow */

import invariant from "invariant";
import type { MethodApi } from "../types";
import { isEmail } from "../../utils";

const permissionsMap = { view: 0, edit: 7 };

export default ({ client }: MethodApi) => (
  folderid: number,
  mail: string,
  access: "view" | "edit" = "view",
  message: ?string = null
): Promise<boolean> => {
  invariant(typeof folderid === "number", "`folderid` must be number.");
  invariant(folderid !== 0, "`folderid` cannot be 0.");
  invariant(["view", "edit"].indexOf(access) != -1, "`permissions` can be either `view` or `edit`.");

  invariant(mail, "`mail` is required.");
  invariant(typeof mail === "string", "`mail` is required.");
  invariant(isEmail(mail), "`mail` must be either number or a valid mail address.");

  let params = {};
  params.folderid = folderid;
  params.permissions = permissionsMap[access];
  params.mail = mail;

  if (message) {
    params.message = message;
  }

  return client
    .api("sharefolder", {
      params: params
    })
    .then(() => true);
};
