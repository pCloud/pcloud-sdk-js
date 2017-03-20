jest.mock('../../api/ApiMethod');
import apiMethod, { one, text } from '../../api/ApiMethod';

var getThumbsSpy = jest.fn();

const image = 'data:image/jpeg;base64,/9j/4AAQSkZ';

const exampleResult = [
  "2412453536|0|32x32|" + image,
  "3|6001|0"
];

one((method, { params }) => method === 'getthumbs', text(exampleResult.join("\n") + "\n"), getThumbsSpy);

import createClient from "../createClient";
const { getthumbs } = createClient('testauth', 'oauth', false);

describe('getthumbs', () => {
  it('works correctly', async () => {
    const response = await getthumbs([1, 2], () => {});

    expect(getThumbsSpy).toHaveBeenCalledTimes(1);

    expect(response[0].fileid).toBe(2412453536);
    expect(response[0].url).toBe(image);

    expect(response[1].fileid).toBe(3);
    expect(response[1].url).toBe(image);

    expect(apiMethod.mock.calls.length).toBe(1);
    expect(apiMethod.mock.calls[0][1].params).toEqual({
      access_token: "testauth",
      crop: 1,
      fileids: "1,2",
      size: "32x32",
      type: "auto"
    });
  });
});
