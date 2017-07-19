jest.mock("../../api/ApiMethod");
import apiMethod, { one, success, error } from "../../api/ApiMethod";

var deleteSpy = jest.fn();
var fileNotFoundSpy = jest.fn();

one((method, { params: { fileid } }) => method === "deletefile" && fileid === 1, success({}), deleteSpy);
one(
  (method, { params: { fileid } }) => method === "deletefile" && fileid === 2,
  error(2009, "File not found."),
  fileNotFoundSpy
);

import createClient from "../createClient";
const { deletefile } = createClient("testauth", "oauth", false);

describe("deletefile", () => {
  it("sends correct data for delete", async () => {
    const response = await deletefile(1);

    expect(deleteSpy).toHaveBeenCalledTimes(1);
    expect(response).toBe(true);

    expect(apiMethod.mock.calls.length).toBe(1);
    expect(apiMethod.mock.calls[0][1].params).toEqual({ fileid: 1, access_token: "testauth" });
  });

  it("handles error correctly", async () => {
    const response = await deletefile(2).catch(e => e);

    expect(fileNotFoundSpy).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ error: "File not found.", result: 2009 });

    expect(apiMethod.mock.calls[1][1].params).toEqual({ access_token: "testauth", fileid: 2 });
  });
});
