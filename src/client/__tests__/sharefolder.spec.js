jest.mock("../../api/ApiMethod");
import apiMethod, { on, one, success, error } from "../../api/ApiMethod";

var shareSpy = jest.fn();
var cannotShareSpy = jest.fn();

on((method, { params: { mail } }) => method === "sharefolder" && mail === "test@fakemail.com", success({}), shareSpy);
one(
  (method, { params: { mail } }) => method === "sharefolder" && mail === 2,
  error(2009, "File not found."),
  cannotShareSpy
);

import createClient from "../createClient";
const { sharefolder } = createClient("testauth", "pcloud", false);

describe("sharefolder", () => {
  it("sends correct data for sharefolder", async () => {
    const response = await sharefolder(100, "test@fakemail.com");

    expect(shareSpy).toHaveBeenCalledTimes(1);
    expect(response).toBe(true);

    expect(apiMethod.mock.calls.length).toBe(1);
    expect(apiMethod.mock.calls[0][1].params).toEqual({
      auth: "testauth",
      folderid: 100,
      permissions: 0,
      mail: "test@fakemail.com"
    });
  });

  it("correctly sends params for edit", async () => {
    const response = await sharefolder(100, "test@fakemail.com", "edit");

    expect(response).toMatchSnapshot();
    expect(apiMethod.mock.calls[0][1].params).toMatchSnapshot();
  });

  it("throws for wrong permissions", () => {
    expect(() => {
      sharefolder(100, "test@fakemail.com", 5);
    }).toThrowError("permissions");
  });

  it("throws for wrong token type", () => {
    expect(() => {
      sharefolder(100);
    }).toThrowError("mail");
  });
});
