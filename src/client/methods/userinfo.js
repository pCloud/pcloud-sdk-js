/* @flow */

import type { MethodApi } from "../types";

export default ({ client }: MethodApi) => (): Promise<Object> => {
	return client.api("userinfo");
};
