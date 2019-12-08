/* @flow */

import type { ApiMethodOptions, DownloadOptions } from "../api/types";

export type Item = { name: string, isfolder: boolean, id: string };

export type FileLocal = { name: string, path: string, size: number };

export type ClientType = "oauth" | "pcloud";

export type ClientApiMethodOptions = ApiMethodOptions & { cache?: boolean, cacheTime?: number };

export type ApiClient = {
  api(method: string, options?: ApiMethodOptions): Promise<any>,
  getfilelink(number): Promise<string>,
  download(string): void,
  download: (string, DownloadOptions) => string => Promise<FileLocal>,
};

export type MethodApi = {
  client: ApiClient,
  setToken(token: string): void,
  type: string,
};

export type ClientMethod = (T: MethodApi) => () => Promise<*>;

export type thumbTypes = "jpg" | "png" | "auto";
export type thumbSizes = "32x32" | "120x120";
export type thumbB64 = {
  url: string,
  fileid: number,
};
