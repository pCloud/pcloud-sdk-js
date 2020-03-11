declare module "pcloud-sdk-js" {
  import { WriteStream } from "fs";

  export function createClient(token?: string | null, type?: ClientType, useProxy?: boolean): Client

  export const oauth: OAuthModule;

  export function ApiMethod(method: string, options?: ApiMethodOptions): Promise<ApiResult>;

  export function ApiRequest(method: string, options?: ApiMethodOptions): Promise<ApiResult>;

  interface OAuthModule {
    initOauthToken(options: oAuthOptions): void
    initOauthPollToken(options: oAuthPollOptions): void
    popup(): void
    getTokenFromCode(code: string, client_id: string, app_secret: string): Promise<ApiResult>
  }

  type oAuthOptions = {
    client_id: string,
    redirect_uri: string,
    response_type: "token" | "code",
    receiveToken: (x: any) => void,
  };

  type oAuthPollOptions = {
    client_id: string,
    response_type: "poll_token",
    receiveToken: (x: string) => void,
    onError: (err: Error) => void,
  };


  type ApiResponse = ApiResult | ApiError;
  type ApiError = { result: number, error: string };
  type httpData = object | FormData | Blob;
  type dataType = "text" | "json" | "blob";
  type httpMethod = "get" | "post";
  type ApiResult = any;
  type ProgressEvent = {
    direction: "upload" | "download",
    loaded: number,
    total: number,
  };

  type UploadFile = { name?: string, file: string | File };

  type ApiRequestOptions = {
    // common
    method?: httpMethod,
    responseType?: dataType,
    onProgress?: (T: ProgressEvent) => void,
    xhr?: (xhr: XMLHttpRequest) => void,
    pipe?: WriteStream,
    params?: {},
    files?: Array<UploadFile>,
  };

  type ApiMethodOptions = ApiRequestOptions & { apiServer?: string, apiProtocol?: string };

  type RemoteUploadProgressFile = {
    url: string,
    status: string,
    downloaded: number,
    size: number,
  };

  type RemoteUploadProgress = {
    all: { size: number, downloaded: number },
    files: Array<RemoteUploadProgressFile>,
  };

  type UploadOptions = {
    onBegin?: () => void,
    onProgress?: (T: ProgressEvent | RemoteUploadProgress) => void,
    onFinish?: (x: any) => void,
  };

  type DownloadOptions = {
    onBegin?: (x: any) => void,
    onProgress?: (x: ProgressEvent) => void,
    onFinish?: (x: any) => void,
  };

  type DownloadData = { path: string, expires: string, hosts: [string] };
  type ApiCall = { method: string, options: ApiMethodOptions };
  type ApiRequest = { url: string, options: ApiRequestOptions };

  type registrationOptions = { invite?: string, ref?: number };

  type ApiParams = { auth?: string, access_token?: string };
  type InitialOptions = { params: ApiParams, apiServer: string };

  type Item = { name: string, isfolder: boolean, id: string };

  type FileLocal = { name: string, path: string, size: number };

  type ClientType = "oauth" | "pcloud";

  type ClientApiMethodOptions = ApiMethodOptions & { cache?: boolean, cacheTime?: number };

  interface ApiClient {
    api(method: string, options?: ApiMethodOptions): Promise<any>
    getfilelink(fileid: number): Promise<string>
    download(url: string): void
    download(url: string, downloadOptions: DownloadOptions): Promise<FileLocal>
  }

  type MethodApi = {
    client: ApiClient,
    setToken(token: string): void,
    type: string,
  };

  type ClientMethod = (T: MethodApi) => () => Promise<any>;

  type thumbTypes = "jpg" | "png" | "auto";
  type thumbSizes = "32x32" | "120x120";
  type thumbB64 = {
    url: string,
    fileid: number,
  };

  interface Client {
    setToken(token: string): void;
    api(method: string, options?: ClientApiMethodOptions): Promise<ApiResult>;
    setupProxy(): Promise<string>;
    initialOptions(method: string): InitialOptions;
    appshare(
      folderid: number,
      userid: number,
      clientid: string,
      access: "view" | "edit"
    ): Promise<boolean>;

    createfolder(name: string, parentfolderid?: number): Promise<any>;
    deletefile(fileid: number): Promise<boolean>;
    deletefolder(folderid: number): Promise<boolean>;

    download(url: string): Promise<FileLocal>
    downloadfile(fileid: number, filename: string, options?: DownloadOptions): Promise<FileLocal>;

    getfilelink(fileid: number): Promise<string>;
    getthumbsfileids(fileids: number[],
                     receiveThumb: (x: thumbB64) => void,
                     thumbType?: thumbTypes,
                     size?: thumbSizes): Promise<Array<thumbB64>>;
    listfolder(folderid: number, optionalParams?: Object): Promise<Object>;
    login(email: string, password: string): Promise<string>;
    movefile(fileid: number, tofolderid: number): Promise<boolean>;
    movefolder(folderid: number, tofolderid: number): Promise<boolean>;
    register(
      email: string,
      password: string,
      options?: registrationOptions
    ): Promise<number>;
    remoteupload(urls: string, folderid: number, options?: UploadOptions): Promise<any>;
    renamefile(fileid: number, toname: string): Promise<boolean>;
    renamefolder(folderid: number, toname: string): Promise<boolean>;
    sharefolder(
      folderid: number,
      mail: string,
      access: "view" | "edit",
      message?: string
    ): Promise<boolean>;
    upload(file: string, folderid: number, options?: UploadOptions): Promise<any>;
    userinfo(): Promise<Object>;
  }


}
