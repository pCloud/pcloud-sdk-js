## pCloud JavaScript SDK

JavaScript library that lets you use **pCloud** functionality in your apps. Includes the full range of the [pCloud's API](https://docs.pcloud.com/) with some utility on top.

  * **Universal**/Isomorphic.
  * **Promise** based API.
  * Simplified [OAuth](/docs/oauth.md) process. Get started in minutes.

### Usage

```js

import pcloudSdk from 'pcloud-sdk-js';

// Create `client` using an oAuth token:
const client = pcloudSdk.createClient('access_token');

// then list root folder's contents:
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
      console.log(progress.loaded, progress.total);
    },
    onFinish: function(fileMetadata) {
      console.log('finished', fileMetadata);
    }
  }).catch(function(error) {
    console.error(error);
  }
});
```

### Getting started
Install with npm:

```
npm install --save pcloud-sdk-js
```
Or load the prebuilt file. The SDK is exported as a `pCloudSDK` global.

```
<script type="text/javascript" src="https://unpkg.com/pcloud-sdk-js@latest/dist/pcloudsdk.js"></script>
```

### Read more
- For more information you can view [the documentation](/docs), [the examples](/examples) and the [API Reference](/docs/api.md).
- To learn more about the pCloud's API go to https://docs.pcloud.com.
- SDKs for other platforms you can find at our [SDK site](https://pcloud.github.io).
