/* @flow */

import { pCloudUrl } from '../../utils';
import type { MethodApi } from '../types';

export default ({ client }: MethodApi) =>
  (fileid: number) => {
    return client.api('getfilelink', {
        params: {
          fileid: fileid,
          forcedownload: 1
        }
      }).then(ret => pCloudUrl(ret));
  };
