## pCloudSdk.oauth

- This is the API Reference for the `oauth` export. For details how to use them see [Oauth](Oauth.md).
- If you want to built yourself a custom Oauth flow see the [pCloud's API Docs](https://docs.pcloud.com/methods/oauth_2.0/index.html).

#### initOauthToken

``` js
initOauthToken({
  client_id: string,
  redirect_uri: string,
  response_type: "token" | "code",
  receiveToken: (token) => void
});
```

#### popup()

``` html
// inside redirect_uri window
<script>
  pCloudSdk.oauth.popup();
</script>
```

#### getTokenFromCode

``` js
getTokenFromCode(
  code: string,
  client_id: string,
  app_secret: string
): Promise<{ userid, access_token }>
```

- `code` can be received either manually by the user via copy & paste (see [oauth example](examples/node/token.js)) or by specifying `response_type: "code"` to `initOauthToken`.
