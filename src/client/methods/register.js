/* @flow */

import invariant from "invariant";
import type { MethodApi } from "../types";
import { isEmail } from "../../utils";

type registrationOptions = { invite?: string, ref?: number };

export default ({ client }: MethodApi) => (
  email: string,
  password: string,
  options: registrationOptions = {}
): Promise<number> => {
  invariant(typeof email === "string" && isEmail(email), "`email` must be provided.");
  invariant(password, "`password` is required.");
  invariant(password.length, "`password` is required.");

  let params: any = {
    mail: email,
    password: password,
    getauth: 1,
    logout: 1,
    termsaccepted: "yes",
  };

  if (options.invite) {
    params.invite = options.invite;
  }

  if (options.ref) {
    params.ref = options.ref;
  }

  if (ENV === "web") {
    params.os = 4;
    params.device = navigator.userAgent;
  }

  return client.api("register", { params: params }).then(response => response.userid);
};
