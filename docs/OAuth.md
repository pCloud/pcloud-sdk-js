## OAuth

In order to use the SDK methods, you need to first acquire a token from the user using the OAuth protocol. To start using OAuth, do the following:

* Setup your pCloud [OAuth application](https://docs.pcloud.com/oauth/index.html) and take note of the app key in the main page of the application once you create it.
* (**Client side only**) Setup a redirect url to which you have access to and can place static html page.

## Client side flow
Use the following snippet in some user initiated action (click):

``` js
pCloudSdk.oauth.initOauthToken({
  client_id: 'YOUR_CLIENT_ID',
  redirect_uri: 'YOUR_REDIRECT_URL',
  receiveToken: function(access_token) {
    // do something with the token.
  }
});
```

This will open a popup window where the user can authorize the usage of your app. After this he will be redirected to the `redirect_uri` page which needs to be a simple html that loads the SDK and runs the following:

``` js
pCloudSdk.oauth.popup();
```

This will ensure that the snippet above will work. Checkout the [oauth examples](/pcloud-sdk-js/examples/) for more info.

## Server side flow
For server side applications you would be using a token received from the user via the client side steps and then saved in some kind persistent storage (database or else).

For easing you in using the SDK, you can use the tool provided in the `examples/node` folder. Enter your applications's id and secret in `app.json` and then run `node examples/node/token.js`. Follow the prompts and the process will save the generated `access_token` in the `app.json` and all examples will work.
