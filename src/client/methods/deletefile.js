/* @flow */

import invariant from "invariant";
import type { MethodApi } from "../types";

export default ({ client }: MethodApi) => (fileid: number): Promise<boolean> => {
	invariant(typeof fileid === "number", "`fileid` must be a number.");
	invariant(fileid, "`fileid` is required.");

	return client.api("deletefile", { params: { fileid: fileid } }).then(() => true);
};
