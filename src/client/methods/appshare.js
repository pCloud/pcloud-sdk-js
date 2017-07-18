/* @flow */

import invariant from "invariant";
import type { MethodApi } from "../types";
import { isEmail } from "../../utils";

export default ({ client, type }: MethodApi) => (
	folderid: number,
	userid: number,
	clientid: string,
	permissions: 0 | 7 = 0,
	message: ?string = null
): Promise<boolean> => {
	invariant(type === "pcloud", "This method supports only clients of type `pcloud`.");
	invariant(typeof folderid === "number", "`folderid` must be number.");
	invariant(folderid !== 0, "`folderid` cannot be 0.");
	invariant(permissions === 0 || permissions === 7, "`permissions` can be either 0 (can read) or 7 (can edit).");
	invariant(message === null || typeof message === "string", "`message` can be only string.");

	invariant(userid, "`userid` is required.");
	invariant(typeof userid === "number", "`userid` is required.");
	invariant(parseInt(userid), "`userid` must be either number or a valid mail address.");
	invariant(clientid, "`clientid` is required");
	invariant(typeof clientid === "string", "`clientid` is required");

	let params = {};
	params.folderid = folderid;
	params.permissions = permissions;
	params.userid = userid;
	params.client_id = clientid;

	if (message) {
		params.message = message;
	}

	return client
		.api("sharefolder", {
			params: params
		})
		.then(() => true);
};
