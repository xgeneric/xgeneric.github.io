const express = require('express');
const app = express();
const path = require("path");
const request = require("request-promise");

app.use(express.json());

request.get("https://goldquest.blooket.com/gold/play/landing", function(a, resp, c) {
  global.cookiew = resp.headers["set-cookie"][0].split(";")[0];
  console.log("Blooket Cookie Ready!");
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "/rojolet.html"));
});

app.get('/script.js', (req, res) => {
  res.sendFile(path.join(__dirname, "/script.js"));
});

app.get('/join', (req, res) => {
  try {
    const { id, name } = req.query;
    if (!id || !name) {
      return res.status(400).send(JSON.stringify({ success: false, msg: "Missing game id or name" }));
    }

    request.put({
      body: { id, name },
      json: true,
      uri: "https://fb.blooket.com/c/firebase/join",
      headers: { Cookie: global.cookiew }
    }).pipe(res);
    
    console.log("Joining game " + id + " with name " + name + "!");
  } catch (e) {
    res.send(JSON.stringify({ success: false, errType: "", msg: e }));
  }
});

app.listen(process.env.PORT, function() {
  console.log('Webserver started on port ' + process.env.PORT + '!');
});
