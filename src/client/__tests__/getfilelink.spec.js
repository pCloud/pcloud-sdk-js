import createClient from "../createClient";
import { mockResponse, superMockery } from "../../../test/utils";

const mockReturnDownloadFile = {
	result: 0,
	hash: 555544443333,
	size: 1234566,
	expires: "Fri, 13 Jan 2017 20:59:00 +0000",
	path: "/path-to/file.jpg",
	hosts: ["p-sf1.pcloud.com", "p-ams2.pcloud.com"]
};

describe("getfilelink api", () => {
	it("correctly get the url", async () => {
		const { getfilelink } = createClient("token");
		var query;
		superMockery(/getfilelink/, mockResponse(mockReturnDownloadFile), q => {
			query = q;
		});

		const result = await getfilelink(1337).catch(e => e);

		expect(result).toBe("https://p-sf1.pcloud.com/path-to/file.jpg");

		expect(query.access_token).toBe("token");
		expect(parseInt(query.fileid, 10)).toEqual(1337);
		expect(parseInt(query.forcedownload, 10)).toBe(1);
	});
});
