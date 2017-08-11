import ApiMethod from "../ApiMethod";
import http from "http";
import { receiveMultipart } from "../../../test/utils";
import path from "path";

describe("upload trough api", () => {
  it("correcty uploads the file", async () => {
    const server = http
      .createServer((req, res) => {
        receiveMultipart(req, res);
        server.close();
      })
      .listen(4545, async function() {
        const result = await ApiMethod("uploadfile", {
          params: { auth: "auth_token", folderid: 0 },
          httpMethod: "post",
          apiServer: "127.0.0.1:4545",
          apiProtocol: "http",
          method: "post",
          files: [
            {
              name: "other-image.jpg",
              file: path.resolve(__dirname, "../../../examples/node/files/image.jpg")
            }
          ]
        });

        expect(result.files.length).toBe(1);
        expect(result.files[0].size).toBe(3129022);
        expect(result.files[0].originalFilename).toBe("other-image.jpg");
      });
  });
});
