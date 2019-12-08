/* @flow */

import apiRequest from "../../../api/ApiRequest";
import type { DownloadOptions } from "../../../api/types";

export default () => (filename: string, options: DownloadOptions = {}) => (url: string) => {
  const { onBegin, onProgress, onFinish } = options;

  onBegin && onBegin();
  return apiRequest(url, {
    type: "arraybuffer",
    onProgress: progress => {
      if (progress.direction === "download") {
        if (options.onProgress) {
          onProgress && onProgress(progress);
        }
      }
    },
  }).then(data => {
    if (options.onFinish) {
      onFinish && onFinish(data);
    }

    return data;
  });
};
