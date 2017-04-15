/* @flow */

import invariant from "invariant";
import type { MethodApi, thumbTypes, thumbSizes, thumbB64 } from "../types";
import createParser from "../../utils/thumbs";

export default ({ client }: MethodApi) => (
  fileids: Array<number>,
  receiveThumb: (thumbB64) => void,
  thumbType: thumbTypes = "auto",
  size: thumbSizes = "32x32"
): Promise<Array<thumbB64>> => {
  invariant(
    typeof fileids === "object" && "length" in fileids && fileids.length,
    '`fileids` is required, must be array of numbers.'
  );
  invariant(['auto', 'png', 'jpg'].indexOf(thumbType) !== 1, 'thumbType must be one of: "auto", "png", "jpg".');
  invariant(['32x32', '120x120'].indexOf(size) !== 1, 'size must be one of: "32x32", "120x120".');
  invariant(receiveThumb, "`receiveThumb` is required.");
  invariant(typeof receiveThumb === 'function', "`receiveThumb` must be a function.");

  let thumbs = [];
  const parser = createParser();

  return client
    .api("getthumbs", {
      responseType: "text",
      params: {
        fileids: fileids.join(","),
        type: thumbType,
        size: size,
        crop: 1
      },
      onProgress: (progress: any) => {
        const progressThumbs = parser(progress.currentTarget.responseText);
        thumbs = thumbs.concat(progressThumbs);
        progressThumbs.forEach(receiveThumb);
      }
    })
    .then(response => {
      const responseThumbs = parser(response);
      responseThumbs.forEach(receiveThumb);
      return thumbs.concat(responseThumbs);
    });
};
