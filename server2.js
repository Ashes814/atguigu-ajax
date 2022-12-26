// import express
const express = require("express");

// import app object
const app = express();

// create routing rule

app.get("/home", (request, response) => {
  response.sendFile(__dirname + "/index.html");
});

app.get("/data", (request, response) => {
  response.send("user data");
});

// listen port
app.listen(9000, () => {
  console.log("Service has been initialized, 9000 is listening.");
});
