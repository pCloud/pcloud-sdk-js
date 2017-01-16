jest.mock('../../api/ApiMethod');
import apiMethod, { one, success } from '../../api/ApiMethod';

import createClient from "../createClient";
const { login, listfolder } = createClient(false, 'pcloud');

const mockReturnUserinfo = { auth: 'acccess_token_string' };
const mockListfolder = { metadata: { name: "/", folderid: 0, isfolder: true, contents: [] }};

var loginCalled = jest.fn();
var listfolderCalled = jest.fn();

one((method, { params }) => method === 'userinfo' && params.getauth === 1, success(mockReturnUserinfo), loginCalled);
one((method) => method === 'listfolder', success(mockListfolder), listfolderCalled);

describe('login', () => {
  it('gets auth from api and saves it for future calls', async () => {
    const response = await login('mail@mail.com', 'password').catch(e => e);

    expect(response).toBe("acccess_token_string");

    expect(apiMethod).toHaveBeenCalledTimes(1);
    expect(apiMethod).toHaveBeenCalledWith("userinfo", {
      apiServer: "api.pcloud.com",
      params: {
        getauth: 1,
        logout: 1,
        password: "password",
        username: "mail@mail.com"
      }
    });

    const folder = await listfolder(0);

    expect(folder.name).toBe("/");
    expect(folder.folderid).toBe(0);

    expect(listfolderCalled).toHaveBeenCalledTimes(1);
    expect(listfolderCalled).toHaveBeenCalledWith("listfolder", {
      "apiServer": "api.pcloud.com",
      "params": {
        "auth": "acccess_token_string",
        "folderid": 0
      }
    });
  });
});
