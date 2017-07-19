/* @flow */

import type { MethodApi, FileLocal } from "../types";
import type { DownloadOptions } from "../../api/types";

export default ({ client }: MethodApi) => (
  fileid: number,
  filename: string,
  options: DownloadOptions = {}
): Promise<FileLocal> => {
  const { getfilelink, download } = client;

  return getfilelink(fileid).then(download(filename, options));
};
