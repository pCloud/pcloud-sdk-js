jest.mock("../../api/ApiMethod");
import apiMethod, { one, success, error } from "../../api/ApiMethod";

import createClient from "../createClient";
const { createfolder } = createClient("testauth");

const mockReturnCreatefolder = {
  metadata: {
    path: "/folder name",
    name: "folder name",
    created: "Fri, 13 Jan 2017 19:07:11 +0000",
    ismine: true,
    thumb: false,
    modified: "Fri, 13 Jan 2017 19:07:11 +0000",
    id: "d111155556666",
    isshared: false,
    icon: "folder",
    isfolder: true,
    parentfolderid: 0,
    folderid: 111155556666,
  },
};

var createdMock = jest.fn();
var alreadyExistsMock = jest.fn();

one(
  (method, { params: { folderid } }) => method === "createfolder" && folderid === 1,
  success(mockReturnCreatefolder),
  createdMock
);
one(
  (method, { params: { folderid } }) => method === "createfolder" && folderid === 1337,
  error(2004, "File or folder already exists."),
  alreadyExistsMock
);

describe("createfolder", () => {
  it("returns `metadata` when successful and has correct params", async () => {
    const response = await createfolder("folder name", 1);

    expect(response.name).toBe("folder name");
    expect(response.thumb).toBe(false);
    expect(response.isfolder).toBe(true);
    expect(response.folderid).toBe(111155556666);

    expect(createdMock).toHaveBeenCalledTimes(1);
    expect(apiMethod.mock.calls[0][1].params).toEqual({ access_token: "testauth", name: "folder name", folderid: 1 });
  });
});

describe("throws error false when unsuccessful", () => {
  it("handles the error correctly", async () => {
    const response = await createfolder("folder name", 1337).catch(error => error);

    expect(response.error).toBe("File or folder already exists.");
    expect(response.result).toBe(2004);

    expect(alreadyExistsMock).toHaveBeenCalledTimes(1);
    expect(apiMethod.mock.calls[1][1].params).toEqual({
      access_token: "testauth",
      name: "folder name",
      folderid: 1337,
    });
  });
});
