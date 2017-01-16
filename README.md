# [pCloud](https://www.pcloud.com/) JavaScript SDK

`pcloud-sdk-js` is a JavaScript library that let's you use the **pCloud**'s **API** in your projects.

*   **Universal**/Isomorphic.
*   **Promise** based API.
*   Easy to use and packed with examples for both **browser** and **node** to let you start using the API in minutes.

## Examples

Create reusable `client` object using and **oAuth 2** token:
```js
const client = pcloudSdk.createClient('access_token');
```

List folder's contents:
```js
client.listfolder(0).then((fileMetadata) => {
  console.log(fileMetadata);
});
```

Upload file:
```js
document.getElementById('inputfile').addEventListener('change', function() {
  client.upload(this.files[0], folderid, {
    onBegin: () => {
      console.log('started');
    },
    onProgress: function(progress) {
      // ..
    },
    onFinish: function(fileMetadata) {
      console.log('finished', fileMetadata);
    }
  }).catch(function(error) {
    console.error(error);
  }
});
```

## Getting started
Install with npm:
```
npm install pcloud-sdk-js
```
Or load the prebuilt file.
```
<script type="text/javascript" src="https://www.jsdelivr.com/pcloudsdk.js"></script>
```

## Documentation
Full documentation, guides and examples are available at our [SDK site](https://www.pcloud.com)
