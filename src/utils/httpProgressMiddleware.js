/* @flow */

export default function httpProgressMiddleware(req: any) {
	let loaded = 0;
	let total = 0;
	req.on("response", res => {
		if (total === 0) {
			total = res.headers["content-length"];
		}

		res.on("data", function(data) {
			loaded += data.length;

			req.emit("progress", { direction: "download", loaded: loaded, total: total });
		});
	});
}
