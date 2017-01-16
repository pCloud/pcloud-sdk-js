## pCloudSdk.api

#### request(url, options)

Generic highly configurable method for accessing the pCloud api. Can be used to access the REST API and for upload/download. **Isomorphic**.

- Promise is rejected on network error.

``` js
request(
  url,
  options: ApiRequestOptions
): Promise<text | {}>

type ApiRequestOptions = {
  method?: 'get' | 'post',
  responseType?: 'text' | 'json' | 'blob',
  onProgress?: (T: ProgressEvent) => void,

  // browser only
  xhr?: (xhr: XMLHttpRequest) => void,

  // nodejs only
  pipe?: WriteStream,
  pipeFrom?: ReadStream,

  // get params
  params?: {},
  files?: Array<UploadFile>,

  // post data
  data?: Object

  apiServer?: string,
  apiProtocol?: string
}
```

#### method(method, options)

Wrapper over the request method. Has knowledge of the **API Method** called and whether the operation is successful or not.

- `method` must be an existing [pCloud method](https://docs.pcloud.com).
    - The promise will be rejected if:
        - the method does not exist.
        - the method requires auth, but one is not provied.
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
