/* @flow */

import invariant from "invariant";
import type { MethodApi } from "../types";
import { isEmail } from "../../utils";

export default ({ client }: MethodApi) => (
	folderid: number,
	mail: string,
	permissions: 0 | 7 = 0,
	message: ?string = null
): Promise<boolean> => {
	invariant(typeof folderid === "number", "`folderid` must be number.");
	invariant(folderid !== 0, "`folderid` cannot be 0.");
	invariant(permissions === 0 || permissions === 7, "`permissions` can be either 0 (can read) or 7 (can edit).");
	invariant(message === null || typeof message === "string", "`message` can be only string.");

	invariant(mail, "`mail` is required.");
	invariant(typeof mail === "string", "`mail` is required.");
	invariant(isEmail(mail), "`mail` must be either number or a valid mail address.");

	let params = {};
	params.folderid = folderid;
	params.permissions = permissions;
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
