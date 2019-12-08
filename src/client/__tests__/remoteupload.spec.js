jest.mock("../../api/ApiMethod");
import { one, success } from "../../api/ApiMethod";

import createClient from "../createClient";
const { remoteupload } = createClient("access_token");

const mockCurrentServer = { result: 0, hostname: "hostname" };
const mockDownloadfileResponse = { metadata: [{ name: "file.ext", size: 200 }] };
const mockUploadprogress = {
  finished: false,
  urlready: 0,
  result: 0,
  urlworking: 1,
  urlcount: 1,
  files: [{ downloaded: 150, size: 200, url: "http://host/file.ext", status: "downloading" }],
};

var downloadfileCalled = jest.fn();
var progressCalled = jest.fn();

one(method => method === "currentserver", success(mockCurrentServer));
one(method => method === "downloadfile", success(mockDownloadfileResponse), downloadfileCalled);
one(method => method === "uploadprogress", success(mockUploadprogress), progressCalled);

describe("remoteupload", () => {
  it("downloads file", async () => {
    const response = await remoteupload("http://host/file.ext", 0, {
      onProgress: progress => {
        expect(progress).toEqual({
          all: { downloaded: 150, size: 200 },
          files: [
            {
              downloaded: 150,
              size: 200,
              url: "http://host/file.ext",
              status: "downloading",
            },
          ],
        });
      },
    }).catch(e => e);

    expect(response).toEqual({ metadata: { name: "file.ext", size: 200 } });
  });
});
