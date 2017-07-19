/* @flow */

import type { thumbB64 } from "../client/types";

export const THUMB_FILEID = 0;
export const THUMB_RESULT = 1;
export const THUMB_SIZE = 2;
export const THUMB_LINEID = 2;
export const THUMB_URL = 3;

export default function createParser() {
  let lastLinePos = 0;
  let thumbs = [];
  let nextLinePos;
  //let currentLine;

  return (text: string): Array<thumbB64> => {
    let setThumbs = [];

    while (1) {
      nextLinePos = text.indexOf("\n", lastLinePos + 1);

      if (nextLinePos === -1) {
        break;
      }

      let { result, size, url, fileid } = _thumbObj(text.substr(lastLinePos, nextLinePos - lastLinePos));
      lastLinePos = nextLinePos;

      if (result === 6001) {
        url = thumbs[parseInt(size, 10)].url;
        result = 0;
      }

      if (result === 0) {
        const thumb = { url, fileid };

        thumbs.push(thumb);
        setThumbs.push(thumb);
      }
    }

    return setThumbs;
  };
}

function _thumbObj(line: string) {
  const obj = line.split("|");

  return {
    result: parseInt(obj[THUMB_RESULT], 10),
    url: THUMB_URL in obj ? obj[THUMB_URL].trim() : "",
    fileid: parseInt(obj[THUMB_FILEID], 10),
    size: obj[THUMB_SIZE]
  };
}
