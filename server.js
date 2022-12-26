// import express
const express = require("express");

// import app object
const app = express();

// create routing rule
app.get("/server", (request, response) => {
  // set response header 设置允许跨域
  response.setHeader("Access-Control-Allow-Origin", "*");

  // set response body
  response.send("Hello Ajax");
});

app.all("/json-server", (request, response) => {
  // set response header 设置允许跨域
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "*");

  const data = {
    name: "atguigu",
  };

  let str = JSON.stringify(data);
  // set response body
  response.send(str);
});

app.get("/delay", (request, response) => {
  // set response header 设置允许跨域
  response.setHeader("Access-Control-Allow-Origin", "*");

  setTimeout(() => {
    response.send("delay time");
  }, 3000);
});

app.all("/jquery-server", (request, response) => {
  // set response header 设置允许跨域
  response.setHeader("Access-Control-Allow-Origin", "*");

  const data = { name: "atguigu" };
  response.send(JSON.stringify(data));
});

app.all("/axios-server", (request, response) => {
  // set response header 设置允许跨域
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "*");

  const data = { name: "axios test" };
  response.send(JSON.stringify(data));
});
app.get("/jsonp-server", (request, response) => {
  let data = JSON.stringify({ name: "axios test" });
  response.end(`handle(${data})`);
});

app.all("/check-username", (request, response) => {
  const data = {
    exist: 1,
    msg: "用户名已经存在",
  };

  let str = JSON.stringify(data);

  response.end(`handle(${str})`);
});

// listen port
app.listen(8000, () => {
  console.log("Service has been initialized, 8000 is listening.");
});
