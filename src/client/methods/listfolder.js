/* @flow */

import invariant from 'invariant';
import type { MethodApi } from '../types';

export default ({ client }: MethodApi) =>
  (folderid: number = 0): Promise<Object> => {
    invariant(typeof folderid === 'number', '`folderid` must be a number.');

    return client.api('listfolder', {
      params: {
        folderid: folderid
      }
    }).then((response) => {
      return response.metadata;
    });
  };
