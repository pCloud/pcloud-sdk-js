/* @flow */

import invariant from "invariant";
import type { UploadOptions } from "../../../api/types";
import type { MethodApi } from "../../types";

export default ({ client }: MethodApi) => (file: File, folderid: number = 0, options: UploadOptions = {}) => {
  invariant(file, "`file` is required.");
  invariant(typeof file === "object", "`file` of type File must be supplied.");

  const { onBegin, onProgress, onFinish } = options;

  onBegin && onBegin();
  return client
    .api("uploadfile", {
      method: "post",
      params: { folderid: folderid, nopartial: 1 },
      files: [{ file: file }],
      onProgress: progress => {
        if (progress.direction === "upload") {
          onProgress && onProgress(progress);
        }
      },
    })
    .then(({ metadata, checksums }) => {
      const response = { metadata: metadata[0], checksums: checksums[0] };

      onFinish && onFinish(response);
      return response;
    });
};
