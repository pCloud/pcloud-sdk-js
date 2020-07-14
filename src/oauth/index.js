/* @flow */

import url from "url";
import invariant from "invariant";
import ApiMethod from "../api/ApiMethod";
import { generateRandomString } from "../utils/functions";

const protocol = "https";
const host = "my.pcloud.com";
const path = "/oauth2/authorize";

type oAuthOptions = {
  client_id: string,
  redirect_uri: string,
  response_type: "token" | "code",
  receiveToken: any => void,
};

type oAuthPollOptions = {
  client_id: string,
  response_type: "poll_token",
  receiveToken: string => void,
  onError: Error => void,
};

function buildOauthUrl(query) {
  return url.format({
    protocol: protocol,
    hostname: host,
    pathname: path,
    query: query,
  });
}

function initOauthToken(options: oAuthOptions) {
  const { client_id = null, redirect_uri = null, receiveToken = null, response_type = "token" } = options;

  invariant(client_id, "`client_id` is required.");
  invariant(redirect_uri, "`redirect_uri` is required.");
  invariant(receiveToken, "`receiveToken` is required.");

  const oauthUrl = buildOauthUrl({
    redirect_uri: redirect_uri,
    client_id: client_id,
    response_type: response_type,
  });

  window.open(oauthUrl, "oauth", "width=680,height=700");
  window.__setPcloudToken = function(token, locationid) {
    receiveToken(token, locationid);
    delete window.__setPcloudToken;
  };
}

function initOauthPollToken(options: oAuthPollOptions) {
  const request_id: string = generateRandomString(40);
  const { client_id = null, receiveToken = null, onError = null } = options;

  invariant(client_id, "`client_id` is required.");
  invariant(receiveToken, "`receiveToken` is required.");
  invariant(onError, "`onError` is required.");

  const oauthUrl = buildOauthUrl({
    request_id: request_id,
    client_id: client_id,
    response_type: "poll_token",
  });
  window.open(oauthUrl, "", "width=680,height=700");

  ApiMethod("oauth2_token", {
    apiServer: "eapi.pcloud.com",
    params: { client_id: client_id, request_id: request_id },
  })
    .then(res => {
      receiveToken(res.access_token, res.locationid);
    })
    .catch(err => {
      onError(err);
    });

    ApiMethod("oauth2_token", {
      apiServer: "api.pcloud.com",
      params: { client_id: client_id, request_id: request_id },
    })
      .then(res => {
        receiveToken(res.access_token, res.locationid);
      })
      .catch(err => {
        onError(err);
      });
}

function popup() {
  const matchToken = location.hash.match(/access_token=([^&]+)/);
  const matchCode = location.search.match(/code=([^&]+)/);
  const locationIdMatch = location.hash.match(/locationid=([^&]+)/);
  const locationid = locationIdMatch ? locationIdMatch[1] : null;
  const token = matchToken ? matchToken[1] : matchCode ? matchCode[1] : null;

  if (token) {
    window.opener.__setPcloudToken(token, locationid);
    window.close();
  }
}

function getTokenFromCode(code: string, client_id: string, app_secret: string) {
  return ApiMethod("oauth2_token", {
    params: { client_id: client_id, client_secret: app_secret, code: code },
  });
}

export default {
  initOauthToken,
  initOauthPollToken,
  popup,
  getTokenFromCode,
};
