/* @flow */

import invariant from "invariant";
import type { MethodApi } from "../types";
import { isEmail } from "../../utils";

export default ({ client, setToken }: MethodApi) => (email: string, password: string): Promise<string> => {
  invariant(typeof email === "string" && isEmail(email), "`email` must be provided.");
  invariant(password, "`password` is required.");
  invariant(password.length, "`password` is required.");

  return client
    .api("userinfo", {
      params: { username: email, password: password, getauth: 1, logout: 1 },
    })
    .then(({ auth }) => {
      setToken(auth);
      return auth;
    });
};
