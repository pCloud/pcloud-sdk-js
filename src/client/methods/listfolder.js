/* @flow */

import invariant from 'invariant';
import type { Folder } from '../types';
import type { MethodApi } from '../types';
//import deepAssign from 'deep-assign';

export default ({ client }: MethodApi) =>
  (folderid: number = 0): Promise<Folder> => {
    invariant(typeof folderid === 'number', '`folderid must be a number.`');

    return client.api('listfolder', {
      params: {
        folderid: folderid
      }
    }).then((response) => {
      return response.metadata;
    });
  };
