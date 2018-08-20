const pcloud = require('pcloud-sdk-js');
const invariant = require('invariant');
const app = require('./app.json');

invariant(app, 'Missing `app.json`.');
invariant(app.access_token, 'Missing `access_token` in `app.json`. Run `node token.js`');

const client = pcloud.createClient(app.access_token);
const { upload, setupProxy } = client;

uploadExample()
  .then(() => console.log('proxy upload'))
  .then(proxyUploadExample)
  .then(({ metadata, checksums }) => {
    app.fileid = metadata.fileid;
    app.filename = metadata.name;

    saveAppJson(app);

    console.log(`Saved fileid: ${app.fileid} to app.json. You can now run 'node download.js'`);
  })
  .catch((err) => {
    console.log(err);
  });

//proxyUploadExample();
//uploadExample();

function uploadExample() {
  return upload('./files/small.mp4', 0, {
    onBegin: () => console.log('begin'),
    onProgress: ({ loaded, total }) => console.log(loaded, total, (loaded / total * 100).toFixed(2) + '%')
  }).then((result) => {
    console.log("Done");
    return result;
  });
}

function withProxy(func) {
  return setupProxy()
    .then(func);
}

function proxyUploadExample() {
  return withProxy(uploadExample);
}

function saveAppJson(app) {
  require("fs").writeFileSync('./app.json', JSON.stringify(app));
}
