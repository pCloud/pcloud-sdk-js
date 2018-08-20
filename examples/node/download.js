const pcloud = require('pcloud-sdk-js');
const invariant = require('invariant');
const path = require('path');

if (!appExists()) {
  console.log("Missing `app.json`. Run `node token.js` to setup.");
  return;
}

const app = require('./app.json');
invariant(app.access_token, 'Missing `access_token` in `app.json`. Run `node token.js`');

var fileid = app.fileid || 0;
var filename = app.filename || "";

if (!fileid || !filename.length) {
  console.error(
    "Before use, setup this example by running `node upload.js` first or "+
    "open `app.json` and add `fileid` and `filename` manually.");
  return;
}

const client = pcloud.createClient(app.access_token);
const { downloadfile } = client;

downloadfile(fileid, path.resolve(__dirname + '/files/' + filename), {
  onBegin: () => console.log('begin'),
  onProgress: ({ loaded, total }) => console.log((loaded / total * 100).toFixed(2) + '%'),
  onFinish: () => console.log('finish'),
}).then(() => {
  console.log("File saved at: ", path.resolve(__dirname + '/files/' + filename));
})
.catch((e) => {
  console.log(e);
});

function appExists() {
  return require("fs").existsSync("./app.json");
}
