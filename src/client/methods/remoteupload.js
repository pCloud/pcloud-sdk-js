/* @flow */

import invariant from "invariant";
import type { UploadOptions, RemoteUploadProgress, RemoteUploadProgressFile } from "../../api/types";
import type { MethodApi } from "../types";
import { uniqueNumber, randomNumber } from "../../utils";

export default ({ client }: MethodApi) => (urls: string, folderid: number = 0, options: UploadOptions = {}) => {
  invariant(urls, "`file` is required.");
  invariant(typeof urls === "string", "`file` must be supplied");

  const { onBegin = () => { }, onProgress = () => { }, onFinish = () => { } } = options;
  const progressId = "pcloud-sdk-remote-" + uniqueNumber() + "-" + randomNumber();
  let progressTimeout;

  const progress = apiServer => {
    pollProgress(apiServer);
    progressTimeout = setTimeout(() => progress(apiServer), 200);
  }

  const stopProgress = () => {
    if (progressTimeout) {
      clearTimeout(progressTimeout);
    }
  }

  const pollProgress = apiServer => {
    client
      .api("uploadprogress", { params: { progresshash: progressId, apiServer } })
      .then(({ files }) => onProgress(calculateProgress(files)))
      .catch(({ result, error }) => {
        if (result === 1900) {
          onProgress(calculateProgress());
        }
        console.log(error);
      });
  }

  onBegin();

  return client.api("currentserver")
    .then(({ hostname }) => {

      const promise = client
        .api("downloadfile", {
          method: "post",
          params: {
            folderid: folderid,
            progresshash: progressId,
            nopartial: 1,
            url: urls,
            apiServer: hostname
          }
        })

      progress(hostname);
      return promise
    })
    .then(({ metadata }) => {
      stopProgress();

      onFinish({ metadata: metadata[0] });
      return { metadata: metadata[0] };
    })
    .catch(err => console.log("err", err));
};

const calculateProgress = (files: Array<RemoteUploadProgressFile> = []): RemoteUploadProgress => {
  return {
    all: {
      downloaded: files.reduce((n, { downloaded = 0 }) => n + downloaded, 0),
      size: files.reduce((n, { size = 0 }) => n + size, 0)
    },
    files: files
  };
}
