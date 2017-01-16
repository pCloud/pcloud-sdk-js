/* @flow */

import invariant from 'invariant';
import type { MethodApi } from '../types';

export default ({ client }: MethodApi) =>
  (folderid: number, toname: string): Promise<boolean> => {
    invariant(typeof folderid === 'number', '`folderid` must be number.');
    invariant(folderid !== 0, '`folderid` cannot be 0.');
    invariant(toname, '`toname` is required.');
    invariant(toname.length, '`toname` is required.');

    return client.api('renamefolder', {
        params: {
          folderid: folderid,
          toname: toname
        }
      }).then(response => response.metadata);
  };
