import ApiRequest from "../ApiRequest";
import { mockResponse, superMockery } from "../../../test/utils";

const mockReturnListfolder = { result: 0, metadata: { name: "/", folderid: 0, isfolder: true } };

describe("request", () => {
  it("sends two calls to the request, but network is called once", () => {
    var networkOp = jest.fn();
    superMockery(/url/, mockResponse(mockReturnListfolder), networkOp);

    var req1 = ApiRequest("https://hostname/url?param1=val1");
    var req2 = ApiRequest("https://hostname/url?param1=val1");

    Promise.all([req1, req2]).then(async () => {
      expect(await req1).toEqual(mockReturnListfolder);
      expect(await req2).toEqual(mockReturnListfolder);

      expect(networkOp).toHaveBeenCalledTimes(1);
      expect(networkOp).toHaveBeenCalledWith({ param1: "val1" }, "https://hostname/url?param1=val1");
    });
  });
});
