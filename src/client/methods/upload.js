/* @flow */

import invariant from "invariant";
import type { UploadOptions } from "../../api/types";
import type { MethodApi } from "../types";

export default ({ client }: MethodApi) => (file: string, folderid: number = 0, options: UploadOptions = {}) => {
  invariant(file, "`file` is required.");
  invariant(typeof file === "string", "`file` must be supplied");
  invariant(require("fs").existsSync(file), `File: ${file} is not accessible.`);

  const { onBegin = () => {}, onProgress = () => {}, onFinish = () => {} } = options;

  onBegin();
  return client
    .api("uploadfile", {
      method: "post",
      params: { folderid: folderid, nopartial: 1 },
      files: [{ file: file }],
      onProgress: progress => {
        if (progress.direction === "upload") {
          onProgress(progress);
        }
      }
    })
    .then(response => {
      const ret = apiResponseToReturn(response);

      onFinish(ret);
      return ret;
    });
};

function apiResponseToReturn({ metadata, checksums }) {
  return { metadata: metadata[0], checksums: checksums[0] };
}
