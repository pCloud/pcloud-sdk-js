jest.mock('../../api/ApiMethod');
import apiMethod, { one, success } from '../../api/ApiMethod';

import createClient from "../createClient";
const { userinfo } = createClient('access_token');

const mockReturnUserinfo = {
	"emailverified": true,
	"userid": 100,
  "usedquota": 10041806938,
	"quota": 11811160064,
	"result": 0,
	"premium": false,
	"publiclinkquota": 53687091200,
	"language": "en",
	"email": "user@mail.com",
	"registered": "Tue, 01 Oct 2013 17:50:23 +0000"
};

var userinfoCalled = jest.fn();

one((method) => method === 'userinfo' , success(mockReturnUserinfo), userinfoCalled);

describe('userinfo', () => {
  it('handles correct result', async () => {
    const response = await userinfo().catch(e => e);

    expect(response.userid).toBe(100);
    expect(response.usedquota).toBe(10041806938);
    expect(response.quota).toBe(11811160064);

    expect(apiMethod).toHaveBeenCalledTimes(1);
    expect(apiMethod).toHaveBeenCalledWith("userinfo", {
      "apiServer": "api.pcloud.com",
      "params": { "access_token": "access_token" }
    });
  });
});
