const express = require("express");
const resErrorHandler = require("./");

const app = express();
const port = process.env.PORT || 3000;

app.use(resErrorHandler());

app.get("/", (req, res) => {
	res.error();

	res.send("Hello!");
});

app.listen(port, err => {
	if (err) throw err;
	console.log(`Listening on port ${port}`);
});
