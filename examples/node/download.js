const pcloud = require('../../lib');
const app = require('./app.json');
const invariant = require('invariant');
const path = require('path');

invariant(app, 'Missing `app.json`.');
invariant(app.access_token, 'Missing `access_token` in `app.json`. Run `node token.js`');

// ===============================
// Prepare setup vars
// ===============================
var fileid = 0;
var filename = ''; // file.ext
// ===============================

if (!fileid || !filename.length) {
  console.error("Before use, setup this example by opening it and filling `fileid` and `filename` variables.");
  return;
}

const client = pcloud.createClient(app.access_token);
const { downloadfile } = client;

console.log(path.resolve(__dirname + '/files/' + filename));

downloadfile(fileid, path.resolve(__dirname + '/files/' + filename), {
  onBegin: () => console.log('begin'),
  onProgress: ({ loaded, total }) => console.log((loaded / total * 100).toFixed(2) + '%'),
  onFinish: () => console.log('finish'),
}).catch((e) => {
  console.log(e);
});
