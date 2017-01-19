/* @flow */

import type { WriteStream } from "fs";

export type dataType = "text" | "json" | "blob";
export type httpMethod = "get" | "post";
export type httpData = {} | FormData | Blob;

export type ApiResult = { result: number };
export type ApiError = { result: number, error: string };
export type ProgressEvent = {
  direction: "upload" | "download",
  loaded: number,
  total: number
};

type UploadFile = { name: string, file: string | File };

export type ApiRequestOptions = {
  // common
  method?: httpMethod,
  responseType?: dataType,
  onProgress?: (T: ProgressEvent) => void,
  xhr?: (xhr: XMLHttpRequest) => void,
  pipe?: WriteStream,
  params?: {},
  files?: Array<UploadFile>
};

export type ApiMethodOptions =
  & ApiRequestOptions
  & { apiServer?: string, apiProtocol?: string };

export type RemoteUploadProgressFile = {
  url: string,
  status: string,
  downloaded: number,
  size: number
};

export type RemoteUploadProgress = {
  all: { size: number, downloaded: number },
  files: Array<RemoteUploadProgressFile>
};

export type UploadOptions = {
  onBegin?: () => void,
  onProgress?: (T: ProgressEvent | RemoteUploadProgress) => void,
  onFinish?: () => void
};

export type DownloadOptions = {
  onBegin?: () => void,
  onProgress?: (T: ProgressEvent) => void,
  onFinish?: () => void
};

export type DownloadData = { path: string, expires: string, hosts: [string] };
export type ApiCall = { method: string, options: ApiMethodOptions };
export type ApiRequest = { url: string, options: ApiRequestOptions };
