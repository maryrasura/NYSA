const express = require("express");
const request = require("request");

const port = 8080;

const app = express();
app.use(express.static("NYSA Website"));

app.get("/danger", (req, response) => {
	const baseURL = "https://api.scriptrapps.io/nysa/danger";
	const auth_token = "TDBFNDUxNzg1MzpzY3JpcHRyOkFGNEMwRjJEODE3OTUyRUFBQzZCNDA2M0YzMzM2MkZD";
	const { latitude, longitude } = req.query;
	const uri = `${baseURL}?auth_token=${auth_token}&latitude=${latitude}&longitude=${longitude}`;
	console.log(uri);
	request(uri, (error, code, body) => {
		if (error) {
			response.send(400);
			return;
		}

		console.log(body);
		response.json({
			danger: JSON.parse(body).response.result
		});
	})
})

app.listen(port, () => console.log("Listening to port", port));
