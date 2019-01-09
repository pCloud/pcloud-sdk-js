## pCloudSdk.createClient

### createClient()

```
createClient(
  token: string,
  type: 'oauth' | 'pcloud',
  useProxy: boolean
): client
```

Creates a [`client`](#client) object that represents a user session. `type` is the type of the token (default: `oauth`). If `useProxy` is set to true the client will poll for the nearest proxy server and will save it for the session. If during the session there is an network error, the client will fallback to the default api server: `api.pcloud.com` automatically.


### client
Client object that encapsulates the user's token and implements several api methods with as minimal api surface as possible. Additionally uses the pCloud's proxy servers under the hood.

#### Methods

##### api()

This is wrapper over the [`method`](api.md#method) with saved and reused authentication information and proxy usage.

``` js
client.api(
  method: string,
  options: ApiMethodOptions
): Promise<ApiResult>
```

Generic function for sending requests to the [pCloud Api](https://docs.pcloud.com/). You can use this to call any of the API methods (some are subject to restrictions, if you use `oauth`). This method does not require authentication. The token from `createClient` is used.

##### setupProxy()

``` js
client.setupProxy(): Promise<boolean>
```

The proxy server will set internally. You can wait for the promise to resolve, if you insist on using the proxy server for your next request.

#### Higher order methods

These are higher order wrappers over `client.api`. All are `then`-able allowing for easy composition.

**appshare** methods allows your OAuth application to create shares with its users. These shares reside in the app's folder an can be created programatically without the users's additional approval. This method can only be called with client created with type **pcloud** and should be called only server side.
```js
appshare(
  folderid: number,
  userid: number,
  clientid: string,
  access: "view" | "edit"
): Promise<boolean>
```

```js
createfolder(name: string, parentfolderid: number = 0): Promise<metadata>
```

```js
deletefile(fileid: number): Promise<boolean>
```

``` js
deletefolder(folderid: number): Promise<boolean>

```

**nodejs** only
``` js
downloadfile(
  fileid: number,
  filename: string,
  options: DownloadOptions
): Promise<FileLocal>

type DownloadOptions = {
  onBegin?: () => void,
  onProgress?: (T: ProgressEvent) => void,
  onFinish?: () => void
}

type FileLocal = { name: string, path: string, size: number }
type ProgressEvent = { loaded: number, total: number };
```

``` js
getfilelink(fileid: number): Promise<string> // url to download the file
```

**getthumbs** is a method useful for getting a list of thumbs in a single HTTP request. Thumbs are received in base64 and ready to be shown. On the server side the process is optimized so the thumbs that are gotten first will be sent without waiting for the others. The **receiveThumb** callback is invoked with each thumb when it is received without waiting for the whole result. This is effective for getting lists of thumbs for showing entire folders.

```js
getthumbs(
  fileids: Array<number>,
  function receiveThumb(thumb: { url: string, fileid: number }) {
    // function that receives thumbs one by one, when they arrive.
    // some thumbs may arrive much earlier than others.
  },
  'jpg' | 'png' | 'auto',
  '32x32' | '120x120'
): Promise<Array<thumbB64>>

type thumbB64 = {
  url: string,
  fileid: number,
}
```

``` js
listfolder(folderid: number): Promise<metadata>
```

``` js
remoteupload(url: string, folderid: number, options: UploadOptions): Promise<metadata>

type UploadOptions = {
  onBegin?: () => void,
  onProgress?: (T: RemoteUploadProgress) => void,
  onFinish?: () => void
};

type RemoteUploadProgress = {
  all: { size: number, downloaded: number },
  files: Array<RemoteUploadProgressFile>
};

type RemoteUploadProgressFile = {
  url: string,
  status: string,
  downloaded: number,
  size: number
};
```


``` js
renamefolder(name: string, parentfolderid: number)
```

``` js
upload(file: string | File, folderid: number, options: UploadOptions): Promise<metadata>

type UploadOptions = {
  onBegin?: () => void,
  onProgress?: (T: ProgressEvent) => void,
  onFinish?: () => void
}

type ProgressEvent = { loaded: number, total: number };
```

``` js
userinfo(): Promise<userinfo>
```
