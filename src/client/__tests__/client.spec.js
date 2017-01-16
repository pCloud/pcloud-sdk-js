jest.mock('../../api/ApiMethod');
import apiMethod, { on, one, success, error } from '../../api/ApiMethod';

var gotProxyServer = jest.fn();
var receivedNetworkError = jest.fn();
var retried = jest.fn();

one((method) => method === 'getapiserver', success({"api": ["broken-api.pcloud.com"]}), gotProxyServer);
on((method, options) => options.apiServer === 'broken-api.pcloud.com', error(500, "Network Error."), receivedNetworkError);
on((method, options) => method === 'listfolder' && options.apiServer === 'api.pcloud.com', success({ metadata: { name: "/", folderid: 0 }}), retried);

import createClient from "../createClient";
const { listfolder, setupProxy } = createClient('testauth', 'oauth', false);

beforeAll((done) => setupProxy().then(done));

describe('client, proxy', () => {
  it('sets proxy, recovers on http error and retries the call', async () => {
    const response = await listfolder(0);

    expect(gotProxyServer).toHaveBeenCalledTimes(1);
    expect(receivedNetworkError).toHaveBeenCalledTimes(1);
    expect(retried).toHaveBeenCalledTimes(1);

    expect(response.folderid).toBe(0);
    expect(response.name).toBe("/");

    expect(apiMethod.mock.calls.length).toBe(3);

    expect(apiMethod.mock.calls[0][0]).toBe('getapiserver');
    expect(apiMethod.mock.calls[0][1].apiServer).toBe('api.pcloud.com');
    expect(apiMethod.mock.calls[0][1].params).toEqual({});

    expect(apiMethod.mock.calls[1][0]).toBe('listfolder');
    expect(apiMethod.mock.calls[1][1].apiServer).toBe('broken-api.pcloud.com');
    expect(apiMethod.mock.calls[1][1].params).toEqual({"access_token": "testauth", "folderid": 0});

    expect(apiMethod.mock.calls[2][0]).toBe('listfolder');
    expect(apiMethod.mock.calls[2][1].apiServer).toBe('api.pcloud.com');
    expect(apiMethod.mock.calls[2][1].params).toEqual({"access_token": "testauth", "folderid": 0});
  });
});
