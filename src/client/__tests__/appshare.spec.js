import apiMethod, { on, one, success, error } from "../../api/ApiMethod";

jest.mock("../../api/ApiMethod");

var shareSpy = jest.fn();
var cannotShareSpy = jest.fn();

on((method, { params: { userid } }) => method === "sharefolder" && userid === 1, success({}), shareSpy);
one(
  (method, { params: { userid } }) => method === "sharefolder" && userid === 2,
  error(2009, "File not found."),
  cannotShareSpy
);

import createClient from "../createClient";

describe("appshare", () => {
  it("sends correct data for appshare with edit", async () => {
    const { appshare } = createClient("testauth", "pcloud", false);
    const response = await appshare(100, 1, "clientid", "edit");

    expect(shareSpy).toHaveBeenCalledTimes(1);
    expect(response).toBe(true);

    expect(apiMethod.mock.calls.length).toBe(1);
    expect(apiMethod.mock.calls[0][1].params).toEqual({
      auth: "testauth",
      client_id: "clientid",
      folderid: 100,
      permissions: 7,
      userid: 1,
    });

    expect(apiMethod.mock.calls[0][1].params).toMatchSnapshot();
  });

  it("sends correct data for appshare with view", async () => {
    const { appshare } = createClient("testauth", "pcloud", false);
    const response = await appshare(100, 1, "clientid", "view");

    expect(apiMethod.mock.calls[0][1].params).toMatchSnapshot();
    expect(response).toMatchSnapshot();
  });

  it("throws for wrong token type", () => {
    const { appshare } = createClient("testauth", "oauth", false);

    expect(() => {
      appshare(100, 1, "clientid");
    }).toThrowError("type `pcloud`");
  });

  it("throws for wrong token type", () => {
    const { appshare } = createClient("testauth", "pcloud", false);

    expect(() => {
      appshare(100, 1);
    }).toThrowError("clientid");
  });

  it("throws for wrong token type", () => {
    const { appshare } = createClient("testauth", "pcloud", false);

    expect(() => {
      appshare(100);
    }).toThrowError("userid");
  });
});
