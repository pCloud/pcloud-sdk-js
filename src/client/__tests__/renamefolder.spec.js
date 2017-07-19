import createClient from "../createClient";
import { mockResponse, superMockery } from "../../../test/utils";
const { renamefolder } = createClient("testauth");

const mockReturnRenamefolder = { result: 0, metadata: { name: "new name", isfolder: true, folderid: 380986338 } };

describe("renamefolder", () => {
  it("works correctly", async () => {
    var query;
    superMockery(/renamefolder/, mockResponse(mockReturnRenamefolder), q => {
      query = q;
    });

    const response = await renamefolder(380986338, "new name");
    expect(response.name).toBe("new name");
    expect(response.folderid).toBe(380986338);
    expect(response.isfolder).toBe(true);

    const { access_token, folderid, toname } = query;
    expect(access_token).toBe("testauth");
    expect(folderid).toBe("380986338");
    expect(toname).toBe("new name");
  });

  it("throws on missing name", async () => {
    let error;
    try {
      await renamefolder(232232323);
    } catch (e) {
      error = e;
    }
    expect(error.toString()).toBe("Invariant Violation: `toname` is required.");
  });

  it("throws on missing id", async () => {
    let error;
    try {
      await renamefolder();
    } catch (e) {
      error = e;
    }
    expect(error.toString()).toBe("Invariant Violation: `folderid` must be number.");
  });
});
