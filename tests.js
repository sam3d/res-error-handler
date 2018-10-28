const express = require("express");
const responseCatcher = require("./");

const app = express();
const port = process.env.PORT || 3000;

app.use(responseCatcher());

app.get("/", (req, res) => {
	startTests()
		.catch(res.error());

	async function startTests() {
		throw "test";
	}
});

app.listen(port, err => {
	if (err) throw err;
	console.log(`Listening on port ${port}`);
});
