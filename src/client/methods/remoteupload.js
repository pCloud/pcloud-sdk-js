/* @flow */

import invariant from "invariant";
import type {
  UploadOptions,
  RemoteUploadProgress,
  RemoteUploadProgressFile
} from "../../api/types";
import type { MethodApi } from "../types";
import { uniqueNumber, randomNumber } from "../../utils";

export default ({ client }: MethodApi) =>
  (urls: string, folderid: number = 0, options: UploadOptions = {}) => {
    invariant(urls, "`file` is required.");
    invariant(typeof urls === "string", "`file` must be supplied");

    const {
      onBegin = () => {},
      onProgress = () => {},
      onFinish = () => {}
    } = options;
    const progressId = "pcloud-sdk-remote-" + uniqueNumber() + "-" +
      randomNumber();
    var progressTimeout;

    function progress() {
      pollProgress();
      progressTimeout = setTimeout(progress, 200);
    }

    function stopProgress() {
      if (progressTimeout) {
        clearTimeout(progressTimeout);
      }
    }

    function pollProgress() {
      client
        .api("uploadprogress", { params: { progresshash: progressId } })
        .then(({ files }) => onProgress(calculateProgress(files)));
    }

    onBegin();
    progress();
    return client
      .api("downloadfile", {
        method: "post",
        params: {
          folderid: folderid,
          progresshash: progressId,
          nopartial: 1,
          url: urls
        }
      })
      .then(({ metadata}) => {
        stopProgress();

        onFinish({ metadata: metadata[0] });
        return { metadata: metadata[0] };
      });
  };

function calculateProgress(
  files: Array<RemoteUploadProgressFile>
): RemoteUploadProgress {
  return {
    all: {
      downloaded: files.reduce((n, file) => n + file.downloaded, 0),
      size: files.reduce((n, file) => n + file.size, 0)
    },
    files: files
  };
}
