import ApiMethod from "../ApiMethod";
import http from "http";
import { receiveMultipart } from '../../../test/utils';
import path from "path";

describe("upload trough api", () => {
  it("correcty uploads the file", async () => {
    const server = http.createServer((req, res) => {
      receiveMultipart(req, res);
      server.close();
    }).listen(4545, async function() {
      const result = await ApiMethod("uploadfile", {
        params: { auth: "4ko1eVZkZF8R9TmKL0U4ff96S0Gyan4lzr7qk", folderid: 0 },
        httpMethod: "post",
        apiServer: "127.0.0.1:4545",
        apiProtocol: "http",
        method: "post",
        files: [{
          name: "image",
          file: path.resolve(__dirname, "../../../examples/node/files/image.jpg")
        }]
      });

      expect(result.files.length).toBe(1);
      expect(result.files[0].size).toBe(3129022);
      expect(result.files[0].originalFilename).toBe("image.jpg");
    });
  });
});
