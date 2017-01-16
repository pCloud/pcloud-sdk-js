var prompt = require('prompt');
//var request = require('superagent');
var app = require('./app.json');
var fs = require('fs');
var url = require('url');
var oauth = require('../../lib').oauth;

const oauthUrl = url.format({
  protocol: 'https',
  hostname: 'my.pcloud.com',
  pathname: '/oauth2/authorize',
  query: { client_id: app.client_id, response_type: 'code' }
});

console.log('1. Open this url, you may have to login.');
console.log('============');
console.log(oauthUrl);
console.log('============');
console.log('2. Go trough the process, you will see a code.');
console.log('3. Enter the code');
console.log("\r\n");

//require("openurl").open(oauthUrl);

go();

function go() {
  prompt.start();
  prompt.get(['code'], function (error, result) {
    if (result && result.code) {
      oauth.getTokenFromCode(result.code, app.client_id, app.app_secret)
        .then((res) => {
          console.log('Received token: ', res.access_token);

          app.access_token = res.access_token;
          app.userid = res.userid;
          fs.writeFileSync('./app.json', JSON.stringify(app));
          console.log("Info saved to `app.json`");
      }).catch((res) => {
        console.error(res.error);
        console.log("\r\n");
        go();
      });

    } else if (result) {
      go();
    }
  });
}
