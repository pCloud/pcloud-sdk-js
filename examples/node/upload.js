const pcloud = require('../../lib');
const invariant = require('invariant');
const app = require('./app.json');

invariant(app, 'Missing `app.json`.');
invariant(app.access_token, 'Missing `access_token` in `app.json`. Run `node token.js`');

const client = pcloud.createClient(app.access_token);
const { upload, setupProxy } = client;

uploadExample()
  .then(() => console.log('proxy upload'))
  .then(proxyUploadExample)
  .catch((err) => {
    console.log(err);
  });

//proxyUploadExample();
//uploadExample();

function uploadExample() {
  return upload('./files/small.mp4', 0, {
    onBegin: () => console.log('begin'),
    onProgress: ({ loaded, total}) => console.log((loaded / total * 100).toFixed(2) + '%'),
    onFinish: () => console.log('finish'),
  });
}

function withProxy(func) {
  return setupProxy()
    .then(func);
}

function proxyUploadExample() {
  return withProxy(uploadExample);
}
