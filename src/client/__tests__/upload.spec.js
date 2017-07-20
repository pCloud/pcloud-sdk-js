import createClient from "../createClient";
import path from "path";
import { mockResponse, superMockery } from "../../../test/utils";

const mockReturnUploadFile = {
  result: 0,
  metadata: [
    {
      name: "image.jpg",
      thumb: true,
      isfolder: false,
      fileid: 1993980510,
      hash: 10257795101980746380,
      category: 4,
      id: "f1993980510",
      isshared: false,
      ismine: true,
      size: 2384712,
      parentfolderid: 378855472,
      icon: "image"
    }
  ],
  checksums: [
    {
      sha1: "b13677bfd33856de6a6e0d9d9d15223d3016f254",
      md5: "ea7965e4a1b362faad53deda49a5d1f6"
    }
  ],
  fileids: [1993980510]
};

describe("upload trough api", () => {
  it("correcty uploads the file", async () => {
    const { upload } = createClient("token");
    var query;
    superMockery(
      /uploadfile/,
      mockResponse(mockReturnUploadFile),
      q => {
        query = q;
      },
      "post"
    );

    const result = await upload(path.resolve(__dirname, "../../../examples/node/files/image.jpg"), 1337);

    expect(result.metadata.name).toBe("image.jpg");
    expect(result.metadata.size).toBe(2384712);
    expect(result.checksums.sha1).toBe("b13677bfd33856de6a6e0d9d9d15223d3016f254");

    expect(query.access_token).toBe("token");
    expect(parseInt(query.folderid, 10)).toEqual(1337);
    expect(parseInt(query.nopartial, 10)).toBe(1);
  });
});
