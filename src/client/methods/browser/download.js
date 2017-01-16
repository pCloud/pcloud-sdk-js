/* @flow */

import apiRequest from '../../../api/ApiRequest';
import type { DownloadOptions } from '../../../api/types';

export default () =>
  (filename: string, options: DownloadOptions = {}) =>
    (url: string) => {
      const {
        onBegin = () => {},
        onProgress = () => {},
        onFinish = () => {}
      } = options;

      onBegin();
      return apiRequest(url, {
        type: 'arraybuffer',
        onProgress: onProgress
      }).then((data) => {
        onFinish(data);
        return data;
      });
    };
