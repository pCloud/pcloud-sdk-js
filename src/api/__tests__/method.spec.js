import ApiMethod from "../ApiMethod";
import { mockResponse, superMockery } from "../../../test/utils";

const mockReturnListfolder = { result: 0, metadata: { name: "/", folderid: 0, isfolder: true } };
const mockReturnListfolderError = { result: 2005, error: "Directory does not exist." };

describe("ApiMethod", () => {
	it("correctly passes the params and calls the success callback", async () => {
		var query;
		superMockery(/listfolder/, mockResponse(mockReturnListfolder), q => {
			query = q;
		});

		const response = await ApiMethod("listfolder", {
			params: { auth: "testauth", folderid: 0 }
		});

		expect(response.metadata.name).toBe("/");
		expect(response.metadata.folderid).toEqual(0);
		expect(response.metadata.isfolder).toBe(true);

		expect(query.auth).toBe("testauth");
		expect(query.folderid).toBe("0");
	});

	it("returns error when folder is dummy", async () => {
		var query;
		superMockery(/listfolder/, mockResponse(mockReturnListfolderError), q => {
			query = q;
		});

		const response = await ApiMethod("listfolder", {
			params: { access_token: "testauth", folderid: 1337 }
		}).catch(data => data);

		expect(response.result).toBe(2005);
		expect(response.error).toBe("Directory does not exist.");

		expect(query.access_token).toBe("testauth");
		expect(parseInt(query.folderid, 10)).toBe(1337);
	});

	it("responseType == text", async () => {
		var query;
		superMockery(/getthumbs/, "text result", q => {
			query = q;
		});

		const result = await ApiMethod("getthumbs", {
			params: { fileid: 100, access_token: "token" },
			responseType: "text"
		});

		expect(result).toBe("text result");
		expect(query).toEqual({ fileid: "100", access_token: "token" });
	});
});
