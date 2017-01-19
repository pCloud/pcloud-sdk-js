/* @flow */

import invariant from 'invariant';
import type { MethodApi } from '../types';

export default ({ client }: MethodApi) =>
  (folderid: number, tofolderid: number): Promise<boolean> => {
    invariant(typeof folderid === 'number', '`folderid` must be number.');
    invariant(folderid !== 0, '`folderid` cannot be 0.');
    invariant(tofolderid, '`tofolderid` is required.');

    return client.api('renamefolder', {
        params: {
          folderid: folderid,
          tofolderid: tofolderid
        }
      }).then(response => response.metadata);
  };
