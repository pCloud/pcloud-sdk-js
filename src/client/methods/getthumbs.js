/* @flow */

import invariant from "invariant";
import type { MethodApi, thumbTypes, thumbSizes, thumbB64 } from "../types";
import createParser from '../../utils/thumbs';

export default ({ client }: MethodApi) => (
  fileids: Array<number>,
  thumbType: thumbTypes = "auto",
  size: thumbSizes = "32x32",
  receiveThumb: (thumbB64) => void = () => {}
): Promise<Array<thumbB64>> => {
  invariant(typeof fileids.length, "`fileids` is required.");

  let thumbs = [];
  const parser = createParser();

  return client
    .api("getthumbs", {
      responseType: "text",
      params: {
        fileids: fileids,
        type: thumbType,
        size: size,
        crop: 1
      },
      onProgress: (progress: any) => {
        const progressThumbs = parser(progress.currentTarget.responseText);
        thumbs = thumbs.concat(progressThumbs);
        progressThumbs.map(receiveThumb);
      }
    })
    .then(response => {
      return thumbs.concat(parser(response));
    });
};
