## OAuth

In order to use pCloud api calls, you first need to acquire a token from the user using OAuth protocol.

* Setup your pCloud [OAuth application](https://docs.pcloud.com/oauth/index.html) and take note of the app key in the main page of the application once you create it.
* (**Client side only**) Setup a redirect url to which you have access to and can place a static html page.

## Client side flow

Use the following snippet in some user initiated action (click):

```js
pCloudSdk.oauth.initOauthToken({
  client_id: "YOUR_CLIENT_ID",
  redirect_uri: "YOUR_REDIRECT_URL",
  response_type: "token" | "code",
  receiveToken: function(access_token, locationid) {
    // do something with the token.
  }
});
```

This will open a popup window where the user can authorize the usage of your app. After this he will be redirected to the `redirect_uri` page which needs to be a simple html that loads the SDK and runs the following:

```js
pCloudSdk.oauth.popup();
```

This will ensure that the snippet above will work and the `access_token` will be received. Checkout the [oauth examples](../examples/) for more info.

## Server side flow

For server side applications you would be using a token received from the user via the client side flow and then saved in some kind persistent storage (database or else).

For easing you in using the SDK, you can use the tool provided in the `examples/node` folder of this repo. Enter your application's `client_id` and `app_secret` in `app.json` using the following format:

```json
{
  "client_id": "",
  "app_secret": ""
}
```

Then run `node examples/node/token.js` and follow the prompts. The process will save the generated `access_token` and the `userid` of the user in the `app.json`. All examples will work afterwards.

* (**Client side only with poll request**)
  Use the following snippet in some user initiated action (click):

```js
pCloudSdk.oauth.initOauthPollToken({
  client_id: "YOUR_CLIENT_ID",
  receiveToken: function(access_token) {
    // do something with the token.
  },
  onError: function(err) {}
});
```
