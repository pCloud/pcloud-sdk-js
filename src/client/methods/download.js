/* @flow */

import ApiRequest from "../../api/ApiRequest";
import type { DownloadOptions } from "../../api/types";
import type { FileLocal } from "../types";
import fs from "fs";
import path from "path";

export default () =>
  (filename: string, options: DownloadOptions = {}) =>
    (url: string): Promise<FileLocal> => {
      const {
        onBegin = () => {},
        onProgress = () => {},
        onFinish = () => {}
      } = options;

      onBegin();
      return ApiRequest(url, {
        type: "arraybuffer",
        pipe: fs.createWriteStream(filename),
        onProgress: (progress) => {
          if (progress.direction === "download") {
            onProgress(progress);
          }
        }
      }).then(() => {
        const file: FileLocal = {
          path: filename,
          name: path.basename(filename),
          size: fs.statSync(filename).size
        };

        onFinish(file);
        return file;
      });
    };
