const express = require("express");
const app = express();
app.get("/server", (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

  response.send(JSON.stringify({ test: "ok" }));
});

app.listen(8000, () => {
  console.log("Service has been initialized, 8000 is listening.");
});
