import createClient from "../createClient";
import { mockResponse, superMockery } from "../../../test/utils";
const { listfolder } = createClient("testauth");

const mockReturnListfolder = {
	result: 0,
	metadata: {
		name: "/",
		folderid: 0,
		isfolder: true
	}
};

const mockReturnFolderNotFound = {
	result: 2005,
	error: "Directory does not exist."
};

describe("listfolder", () => {
	it("list the folder", async () => {
		var query;
		superMockery(/listfolder/, mockResponse(mockReturnListfolder), q => {
			query = q;
		});

		const response = await listfolder(0);
		expect(response.name).toBe("/");
		expect(response.folderid).toBe(0);
		expect(response.isfolder).toBe(true);

		const { access_token, folderid } = query;
		expect(access_token).toBe("testauth");
		expect(folderid).toBe("0");
	});

	it("on wrong folderid returns error 2005", async () => {
		var query;
		superMockery(/listfolder/, mockResponse(mockReturnFolderNotFound), q => {
			query = q;
		});

		const response = await listfolder(1337).catch(e => e);

		expect(response.error).toBe("Directory does not exist.");
		expect(response.result).toBe(2005);

		const { access_token, folderid } = query;
		expect(access_token).toBe("testauth");
		expect(folderid).toBe("1337");
	});
});
