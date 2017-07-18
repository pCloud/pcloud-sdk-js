import createClient from "../createClient";
import { mockResponse, superMockery } from "../../../test/utils";
const { renamefile } = createClient("testauth");

const mockReturnRenamefolder = { result: 0, metadata: { name: "new name", isfolder: false, fileid: 100 } };

describe("renamefolder", () => {
	it("works correctly", async () => {
		var query;
		superMockery(/renamefile/, mockResponse(mockReturnRenamefolder), q => {
			query = q;
		});

		const response = await renamefile(100, "new filename");
		expect(response.name).toBe("new name");
		expect(response.fileid).toBe(100);
		expect(response.isfolder).toBe(false);

		const { access_token, fileid, toname } = query;
		expect(access_token).toBe("testauth");
		expect(fileid).toBe("100");
		expect(toname).toBe("new filename");
	});

	it("throws on missing name", async () => {
		let error;
		try {
			await renamefile(232232323);
		} catch (e) {
			error = e;
		}
		expect(error.toString()).toBe("Invariant Violation: `toname` is required.");
	});

	it("throws on missing id", async () => {
		let error;
		try {
			await renamefile();
		} catch (e) {
			error = e;
		}
		expect(error.toString()).toBe("Invariant Violation: `fileid` must be number.");
	});
});
