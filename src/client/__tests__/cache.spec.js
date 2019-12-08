import createCache from "../cache";

let cache;

jest.spyOn(Date, "now");

describe("cache", () => {
  beforeEach(() => {
    cache = createCache();
  });

  it("should be able to set and retrieve data", () => {
    cache.set("key", "value");

    expect(cache.get("key")).toEqual("value");
  });

  it("should set item when getOrSet is called with no key", () => {
    cache.getOrSet("keys", "data");

    expect(cache.get("keys")).toEqual("data");
  });

  it("should expire value when expire is called", () => {
    cache.set("key", "data");
    cache.expire("key");
    expect(cache.get("key")).toBeFalsy();
  });

  it("should expire items based on a pattern", () => {
    cache.set("key-1", "data");
    cache.set("key-2", "data");
    cache.set("key-3", "data");
    cache.set("key-4", "data");

    cache.expireMatch(/^key-\d$/);

    expect(cache.get("key-1")).toBeFalsy();
    expect(cache.get("key-2")).toBeFalsy();
    expect(cache.get("key-3")).toBeFalsy();
    expect(cache.get("key-4")).toBeFalsy();
  });

  it("should expire items when time passes", () => {
    const timeSeconds = 10;
    cache.set("key", "value", 10);

    Date.now.mockImplementation(() => new Date().getTime() + timeSeconds * 1000);

    expect(cache.get("key")).toBeFalsy();
  });
});
