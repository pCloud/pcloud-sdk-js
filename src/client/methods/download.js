/* @flow */

import ApiRequest from "../../api/ApiRequest";
import type { DownloadOptions } from "../../api/types";
import type { FileLocal } from "../types";
import fs from "fs";
import path from "path";

export default () => (filename: string, options: DownloadOptions = {}) => (url: string): Promise<FileLocal> => {
  if (options.onBegin) {
    options.onBegin();
  }

  return ApiRequest(url, {
    type: "arraybuffer",
    pipe: fs.createWriteStream(filename),
    onProgress: progress => {
      if (progress.direction === "download") {
        if (options.onProgress) {
          options.onProgress(progress);
        }
      }
    },
  }).then(() => {
    const file: FileLocal = {
      path: filename,
      name: path.basename(filename),
      size: fs.statSync(filename).size,
    };

    if (options.onFinish) {
      options.onFinish(file);
    }

    return file;
  });
};
