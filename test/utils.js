import url from 'url';
import request from 'superagent';
import superagentMocker from 'superagent-mocker';
import multipart from 'multiparty';

export function mockResponse(response) {
  return { body: response };
}

export const mock = superagentMocker(request);

export function superMockery(match, response, queryCallback, type = 'get') {
  mock[type](match, (req) => {
    if (queryCallback) {
      queryCallback(url.parse(req.url, true).query, req.url);
    }

    if (typeof response === 'string') {
      return { text: response };
    } else {
      return response;
    }
  });
}

export function superUnmockery(match, type = 'get') {
  mock.clearRoute(type, match);
}

export function receiveMultipart(req, res) {
  var form = new multipart.Form();

  form.parse(req, function(err, fields, files) {
    var retFiles = [];

    Object.keys(files).forEach(function(name) {
      const { fieldName, originalFilename, path, size } = files[name][0];
      retFiles.push({ fieldName, originalFilename, path, size });
    });

    res.writeHead(200, {'content-type': 'application/json'});
    res.end(JSON.stringify({ result: 0, files: retFiles }));
  });
}
