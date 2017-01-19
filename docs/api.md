## pCloudSdk Api Methods

### ApiRequest(url, options)

Generic method for accessing the pCloud's API. Can be used to access the REST API and for upload/download. **Isomorphic**.

- Promise is rejected on network error.

``` js
request(
  url,
  options: ApiRequestOptions
): Promise<text | {}>

type ApiRequestOptions = {
  method?: 'get' | 'post',
  responseType?: 'text' | 'json' | 'blob',

  // Progress Callback that can be used for upload/download/text process
  onProgress?: (T: ProgressEvent) => void,

  // browser only, passes the XHR object to you in case you want to work with it
  xhr?: (xhr: XMLHttpRequest) => void,

  // nodejs only, pipe the result to a WriteStream (ie: download file)
  pipe?: WriteStream,

  // get params
  params?: {},

  // files to upload
  files?: Array<UploadFile>,

  // post data
  data?: Object

  apiServer?: string,
  apiProtocol?: string
}

type UploadFile = {
  name: string,
  file: string | File
};

type ProgressEvent = {
  direction: 'upload' | 'download'
  loaded: number,
  total: number
};

```

### ApiMethod(method, options)

Wrapper over the request method. Has knowledge of the **API Method** called and whether the operation is successful or not.

- `method` must be an existing [pCloud method](https://docs.pcloud.com).
    - The promise will be rejected if:
        - the method does not exist.
        - the method requires authentication, but none is provided.
        - the `responseType` is `json` and the REST api returns error response. ([Api Documentation](https://docs.pcloud.com/http_json_protocol/index.html))

``` js
method(
  method: string,
  options: ApiMethodOptions
): Promise<ApiResult>

type ApiMethodOptions = ApiRequestOptions & {
  apiServer?: string,
  apiProtocol?: string
};


```
