## Install

You can install the SDK using npm.

``` bash
npm install --save pcloud-sdk-js
```

Then in your code:

```js
import pCloudSdk from 'pcloud-sdk-js';

const client = pcloudSdk.createClient('OAuth Token');

client.listfolder(0)
  .then((metadata) => {
    console.log(metadata.contents);
  });
```

Alternatively you can use the prebuilt distributed version of the lib using a script tag:

```
<script type="text/javascript" src="https://unpkg.com/pcloud-sdk-js@latest/dist/pcloudsdk.js"></script>
```
