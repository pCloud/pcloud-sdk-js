jest.mock('../../api/ApiMethod');
import apiMethod, { one, success, error } from '../../api/ApiMethod';

var deleteSpy = jest.fn();
var fileNotFoundSpy = jest.fn();

one((method, { params: { folderid } }) => method === 'deletefolderrecursive' && folderid === 1, success({}), deleteSpy);
one((method, { params: { folderid } }) => method === 'deletefolderrecursive' && folderid === 2, error(2005, "Directory does not exist."), fileNotFoundSpy);

import createClient from "../createClient";
const { deletefolder } = createClient('testauth', 'oauth', false);

describe('deletefolder', () => {
  it('sends correct data for delete', async () => {
    const response = await deletefolder(1);

    expect(deleteSpy).toHaveBeenCalledTimes(1);
    expect(response).toBe(true);

    expect(apiMethod.mock.calls.length).toBe(1);
    expect(apiMethod.mock.calls[0][1].params).toEqual({ folderid: 1, access_token: "testauth" });
  });

  it('handles error correctly', async () => {
    const response = await deletefolder(2)
      .catch(e => e);

    expect(fileNotFoundSpy).toHaveBeenCalledTimes(1);
    expect(response).toEqual({"error": "Directory does not exist.", "result": 2005});

    expect(apiMethod.mock.calls[1][1].params).toEqual({ access_token: 'testauth', folderid: 2 });
  });
});
