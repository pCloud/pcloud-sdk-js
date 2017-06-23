/* @flow */

import url from "url";
import invariant from "invariant";
import ApiMethod from "../api/ApiMethod";

const protocol = "https";
const host = "my.pcloud.com";
const path = "/oauth2/authorize";

type oAuthOptions = {
  client_id: string,
  redirect_uri: string,
  receiveToken(): void
};

function initOauthToken(options: oAuthOptions) {
  const {
    client_id = false,
    redirect_uri = false,
    receiveToken = false
  } = options;

  invariant(client_id, "`client_id` is required.");
  invariant(redirect_uri, "`redirect_uri` is required.");
  invariant(receiveToken, "`receiveToken` is required.");

  const oauthUrl = url.format({
    protocol: protocol,
    hostname: host,
    pathname: path,
    query: {
      redirect_uri: redirect_uri,
      client_id: client_id,
      response_type: options.response_type || "token"
    }
  });

  window.open(oauthUrl, "oauth", "width=680,height=535");
  window.__setPcloudToken = function(token) {
    receiveToken(token);
    delete window.__setPcloudToken;
  };
}

function popup() {
  const token = (location: any).hash.match(/access_token=([^&]+)/)[1];
  window.opener.__setPcloudToken(token);
  window.close();
}

function getTokenFromCode(
  code: string,
  client_id: string,
  app_secret: string
) {
  return ApiMethod("oauth2_token", {
    params: { client_id: client_id, client_secret: app_secret, code: code }
  });
};

export default { initOauthToken, popup, getTokenFromCode };
