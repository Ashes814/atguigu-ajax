# 尚硅谷-AJAX 课程

# 1.原生 AJAX

## 1.1. AJAX 简介

- Asynchronous JavaScript And XML
- 可以在浏览器中向服务器发送异步请求，最大的优势 - **无刷新获取数据**
- 不是编程语言，而是一种将现有的标准组合在一起使用的新方式

## 1.2 XML 简介

![Untitled](%E5%B0%9A%E7%A1%85%E8%B0%B7-AJAX%E8%AF%BE%E7%A8%8B%2031d6b515578f415b808791ac94df01a3/Untitled.png)

## 1.3. 特点

- 优点
  - 无需刷新页面而与服务器端进行通信
  - 允许你根据用户事件（鼠标，键盘，文档事件）来更新部分页面内容
- 缺点
  - 没有浏览历史，不能回退
  - 存在跨域问题（同源）
    - 不能在服务 a 向服务 b 发送 ajax 请求（默认不可以，可以解决）
  - SEO 不友好

## HTTP

### 请求

- 请求报文
  - `请求行`
    - GET /URL/? HTTP/1.1
  - `请求头`
    - HOST: guitu.com
    - Cookie: name=guigu
    - Content-type: application/x-www-form-urlencoded
    - User-Agent: chrome 83
    - **name: value**
  - `空行`
  - `请求体`
    - GET 为空
    - POST 可以不为空
      - username=admin&password=admin

### 响应

- 响应报文
  - `响应行`
    - HTTP/1.1 200 OK
  - `响应头`
    - Content-type: text/html:charset=utf-8
    - Content-length: 2048
    - Content-encoding: gzip
  - `空行`
  - `响应体`
    ```html
    <html>
      <head> </head>

      <body>
        <h1>XXX</h1>
      </body>
    </html>
    ```

### express 框架的基本使用

```jsx
// import express
const express = require("express");

// import app object
const app = express();

// create routing rule
app.get("/", (request, response) => {
  response.send("Hello Express");
});

// listen port
app.listen(8000, () => {
  console.log("Service has been initialized, 8000 is listening.");
});
```

# 2.AJAX 基本请求

## 发送 GET 请求

```jsx
const btn = document.getElementsByTagName("button")[0];
const result = document.getElementById("result");

btn.onclick = function () {
  // 1 create object
  const xhr = new XMLHttpRequest();
  // 2 初始化，设置请求方法和url
  xhr.open("GET", "http://127.0.0.1:8000/server/a=100&b=200");
  // 3 发送
  xhr.send();
  // 4 事件绑定，处理服务端返回的结果
  // on when 当……时候
  // readystate 是 xhr对象中的属性，表示状态0 1 2 3 4
  // change 改变
  xhr.onreadystatechange = function () {
    // 判断（放服务器返回所有结果，即状态4后开始执行）
    if (xhr.readyState == 4) {
      /* 判断响应状态码 200 404 403 401 500
      // 2xx状态码都表示成功
      */
      if (xhr.status >= 200 && xhr.status < 300) {
        //处理结果
        console.log(xhr.status); // 状态码
        console.log(xhr.statusText); //状态字符串

        console.log(xhr.getAllResponseHeaders()); //所有响应头
        console.log(xhr.response); // 响应体

        result.innerHTML = xhr.response;
      }
    }
  };
};
```

## 发送 POST 请求

- 服务端增加 post

```jsx
app.post("/server", (request, response) => {
  // set response header 设置允许跨域
  response.setHeader("Access-Control-Allow-Origin", "*");

  // set response body
  response.send("Hello Ajax --- Post");
});
```

- 发送 post 请求

```jsx
<body>
    <div id="result"></div>

    <script>
      // 获取元素对象
      const result = document.getElementById("result");

      // 绑定事件
      result.addEventListener("mouseover", function () {
        const xhr = new XMLHttpRequest();

        xhr.open("POST", "http://127.0.0.1:8000/server");

        xhr.send("a=100&b=200&c=300"); // 可以任意格式

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
              result.innerHTML = xhr.response;
            }
          }
        };
      });
    </script>
  </body>
```

- 接受任意类型请求
  ```jsx
  app.all("/server", (request, response) => {
    // set response header 设置允许跨域
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Headers", "*");

    // set response body
    response.send("Hello Ajax --- Post");
  });
  ```

## 获取 JSON 数据

- server.js

```jsx
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
```

- 手动转化

```jsx
window.onkeydown = function () {
  const xhr = new XMLHttpRequest();

  xhr.open("GET", "http://127.0.0.1:8000/json-server");

  xhr.send();

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        // json 数据转化
        let data = JSON.parse(xhr.response);
        result.innerHTML = data.name;
      }
    }
  };
};
```

- 自动转换

```jsx
window.onkeydown = function () {
  const xhr = new XMLHttpRequest();

  //设置响应体数据类型-自动转化
  xhr.responseType = "json";

  xhr.open("GET", "http://127.0.0.1:8000/json-server");

  xhr.send();

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        // json 数据被自动转化
        let data = xhr.response;
        result.innerHTML = data.name;
      }
    }
  };
};
```

## 针对 IE 缓存

```jsx
app.get("/ie", (request, response) => {
  // set response header 设置允许跨域
  response.setHeader("Access-Control-Allow-Origin", "*");

  response.send("hello-ie");
});
```

- 重点-利用新时间戳避免 ie 缓存问题

```jsx
xhr.open("GET", "http://127.0.0.1:8000/ie?t=" + Date.now());
```

## 超时与网络异常

- server

```jsx
app.get("/delay", (request, response) => {
  // set response header 设置允许跨域
  response.setHeader("Access-Control-Allow-Origin", "*");

  setTimeout(() => {
    response.send("delay time");
  }, 3000);
});
```

- ajax

```jsx
// 获取元素对象
const result = document.getElementById("result");

window.onkeydown = function () {
  const xhr = new XMLHttpRequest();

  // 超时设置
  xhr.timeout = 2000;

  // 超时回调
  xhr.ontimeout = function () {
    alert("time out baby");
  };

  // 网络异常回调
  xhr.onerror = function () {
    alert("network error baby");
  };

  xhr.open("GET", "http://127.0.0.1:8000/delay");

  xhr.send();

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        result.innerHTML = xhr.response;
      }
    }
  };
};
```

## ajax 取消请求

```jsx
const btn1 = document.getElementById("bt1");
const btn2 = document.getElementById("bt2");
const result = document.getElementById("result");
let xhr = null;

btn1.onclick = function () {
  xhr = new XMLHttpRequest();
  xhr.open("GET", "http://127.0.0.1:8000/delay");
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4)
      if (xhr.status >= 200 && xhr.status < 300) {
        result.innerHTML = xhr.response;
      }
  };
};

btn2.onclick = function () {
  xhr.abort();
};
```

## ajax 重复发送请求（取消重复的，发送新的）

```jsx
let isSending = false; // if web is sending ajax request

btn1.onclick = function () {
  if (isSending) {
    xhr.abort();
  }
  xhr = new XMLHttpRequest();
  isSending = true;
  xhr.open("GET", "http://127.0.0.1:8000/delay");
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) isSending = false;
    if (xhr.status >= 200 && xhr.status < 300) {
      result.innerHTML = xhr.response;
    }
  };
};
```

![Untitled](%E5%B0%9A%E7%A1%85%E8%B0%B7-AJAX%E8%AF%BE%E7%A8%8B%2031d6b515578f415b808791ac94df01a3/Untitled%201.png)

# 3.JQuery 发送 ajax

- server

```jsx
app.all("/jquery-server", (request, response) => {
  // set response header 设置允许跨域
  response.setHeader("Access-Control-Allow-Origin", "*");

  const data = { name: "atguigu" };
  response.send(JSON.stringify(data));
});
```

- get

```jsx

<div class="contaner">
      <h2 class="page-header">jquery-sending ajax</h2>
      <button class="btn btn-primary">GET</button>
      <button class="btn btn-danger">POST</button>
      <button class="btn btn-info">通用型AJAX</button>
app.all("/jquery-server", (request, response) => {
  // set response header 设置允许跨域
  response.setHeader("Access-Control-Allow-Origin", "*");

  const data = { name: "atguigu" };
  response.send(JSON.stringify(data));
});</div>

("button")
        .eq(0)
        .click(function () {
          $.get(
            "http://127.0.0.1:8000/jquery-server",
            { a: 100, b: 200 },
            function (responseBody) {
              console.log(responseBody);
            }, 'json'
          );
        });
```

- post

```jsx
$("button")
  .eq(1)
  .click(function () {
    $.post(
      "http://127.0.0.1:8000/jquery-server",
      { a: 100, b: 200 },
      function (responseBody) {
        console.log(responseBody);
      }
    );
  });
```

![Untitled](%E5%B0%9A%E7%A1%85%E8%B0%B7-AJAX%E8%AF%BE%E7%A8%8B%2031d6b515578f415b808791ac94df01a3/Untitled%202.png)

- 通用型方法 ajax

```jsx
$("button")
  .eq(2)
  .click(function () {
    $.ajax({
      // URL
      url: "http://127.0.0.1:8000/jquery-server",

      // PARAMETER
      data: { a: 100, b: 200 },

      // TYPE
      type: "GET",

      // RESPONSEBODY DATA TYPE
      dataType: "json",

      // CALLBACK
      success: function (responseBody) {
        console.log(responseBody);
      },

      // Fail
      error: function () {
        alert("err");
      },

      // Time out
      timeout: 2000,

      // Headers
      hearders: {
        c: 300,
        d: 400,
      },
    });
  });
```

# 4.axios 发送 ajax 请求

- server
  ```jsx
  app.all("/axios-server", (request, response) => {
    // set response header 设置允许跨域
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Headers", "*");

    const data = { name: "axios test" };
    response.send(JSON.stringify(data));
  });
  ```
- axios
  ```jsx
  <div class="contaner">
        <h2 class="page-header">axios-sending ajax</h2>
        <button class="btn btn-primary">GET</button>
        <button class="btn btn-danger">POST</button>
        <button class="btn btn-info">AJAX</button>
      </div>

      <script>
        const btns = document.querySelectorAll(".btn");

        // config base url
        axios.defaults.baseURL = "http://127.0.0.1:8000";
        btns[0].onclick = function () {
          //GET
          axios
            .get("/axios-server", {
              // url
              params: {
                id: 100,
                vip: 8,
              },

              headers: {
                name: "atguie",
                age: 20,
              },
            })
            .then((value) => {
              console.log(value);
            });
        };

        btns[1].onclick = function () {
          axios
            .post(
              "/axios-server",
              {
                username: "admin",
                password: "admin",
              },
              {
                // url
                params: {
                  id: 100,
                  vip: 8,
                },

                // head parameter
                headers: {
                  name: "atguie",
                  age: 20,
                },
              }
            )
            .then((value) => {
              console.log(value);
            });
        };

        btns[2].onclick = function () {
          axios({
            method: "POST",

            url: "/axios-server",

            params: {
              vip: 10,
              level: 100,
            },

            headers: {
              a: 100,
              b: 100,
            },

            data: {
              username: "admin",
              password: "admin",
            },
          }).then((response) => console.log(response));
        };
  </script>
  ```

# 5. Fetch sending ajax

![Untitled](%E5%B0%9A%E7%A1%85%E8%B0%B7-AJAX%E8%AF%BE%E7%A8%8B%2031d6b515578f415b808791ac94df01a3/Untitled%203.png)

# 6. 跨域

## 6.1. 同源策略（Same-Origin Policy）

![Untitled](%E5%B0%9A%E7%A1%85%E8%B0%B7-AJAX%E8%AF%BE%E7%A8%8B%2031d6b515578f415b808791ac94df01a3/Untitled%204.png)

**定义：协议，域名，端口号必须完全相同**

违背同源策略就是`跨域`

![Untitled](%E5%B0%9A%E7%A1%85%E8%B0%B7-AJAX%E8%AF%BE%E7%A8%8B%2031d6b515578f415b808791ac94df01a3/Untitled%205.png)

## 6.2. 如何解决跨域

### JSONP (JSON with Padding)

- 只支持`get`
- 利用`script`实现跨域

```jsx
<body>
    <div id="result"></div>
    <script>
      function handle(data) {
        const result = document.querySelector("#result");
        result.innerHTML = data.name;
      }
    </script>

    <script src="http://127.0.0.1:8000/jsonp-server"></script>
  </body>
```

- server

```jsx
app.get("/jsonp-server", (request, response) => {
  let data = JSON.stringify({ name: "axios test" });
  response.end(`handle(${data})`);
});
```

- sample

```jsx
<body>
    USERNAME: <input type="text" id="username" />
    <p></p>
    <script>
      const input = document.querySelector("input");
      const p = document.querySelector("p");

      function handle(data) {
        input.style.border = "solid 1px #f00";
        p.innerHTML = data.msg;
      }

      input.onblur = function () {
        let username = this.value;
        // 向服务端发送请求，检测用户名是否存在
        const script = document.createElement("script");
        script.src = "http://127.0.0.1:8000/check-username";
        document.body.appendChild(script);
      };
    </script>
```

```jsx
app.all("/check-username", (request, response) => {
  const data = {
    exist: 1,
    msg: "用户名已经存在",
  };

  let str = JSON.stringify(data);

  response.end(`handle(${str})`);
});
```

### JQuery

![Untitled](%E5%B0%9A%E7%A1%85%E8%B0%B7-AJAX%E8%AF%BE%E7%A8%8B%2031d6b515578f415b808791ac94df01a3/Untitled%206.png)

![Untitled](%E5%B0%9A%E7%A1%85%E8%B0%B7-AJAX%E8%AF%BE%E7%A8%8B%2031d6b515578f415b808791ac94df01a3/Untitled%207.png)

### CORS

![Untitled](%E5%B0%9A%E7%A1%85%E8%B0%B7-AJAX%E8%AF%BE%E7%A8%8B%2031d6b515578f415b808791ac94df01a3/Untitled%208.png)

![Untitled](%E5%B0%9A%E7%A1%85%E8%B0%B7-AJAX%E8%AF%BE%E7%A8%8B%2031d6b515578f415b808791ac94df01a3/Untitled%209.png)

# 尚硅谷-Promise

# 1. Promise

- Promise 是一门新的技术（ES6 规范）
- Promise 是 js 中进行异步编程的新解决方案（旧方案采用回调函数）
  - ajax
  - fs 文件操作
  ```jsx
  require("fs").readFile("./index.html", (err, data) => {}); // callback function
  ```
  - 数据库操作
  - 定时器
- 从语法上来说：Promise 是一个`构造函数`
- 从功能上来说：Promise 对象用来封装一个异步操作并可以获取其成功/失败的结果值

## 为什么要用 Promise？

- 支持链式调用，解决**回调地狱**
  ![Untitled](%E5%B0%9A%E7%A1%85%E8%B0%B7-Promise%208d67cbf36969410ea4fdfb745827e06e/Untitled.png)
- Promise 指定回调函数的方式更加灵活
  - 旧的：必须在异步任务前指定
  - promise：启动异步任务 ⇒ 返回 promise 对象 ⇒ 给 promise 对象绑定回调函数（甚至可以在异步任务结束后指定多个)

## 抽奖器案例

```jsx
<body>
    <div class="container">
      <h2 class="page-header">First Promise</h2>
      <button class="btn btn-primary" id="btn">click to start</button>
    </div>

    <script>
      function rand(m, n) {
        return Math.ceil(Math.random() * (n - m + 1)) + m - 1;
      }

      const btn = document.querySelector("#btn");

      btn.addEventListener("click", function () {
        setTimeout(() => {
          let n = rand(1, 100);
          if (n <= 30) {
            console.log("!!!!!666");
          } else {
            console.log("XXXX no");
          }
        }, 1000);
      });
    </script>
  </body>
```

- Promise

```jsx
// Promise
// resolve -- [func]
// reject -- [func]
btn.addEventListener("click", function () {
  const p = new Promise((resolve, reject) => {
    setTimeout(() => {
      let n = rand(1, 100);
      if (n <= 30) {
        resolve();
      } else {
        reject();
      }
    }, 1000);
  });

  p.then(
    () => {
      alert("!!!!!666");
    },
    () => {
      alert("XXXX no");
    }
  );
});
```

- 通过 resolve 和 reject 获取值

```jsx
btn.addEventListener("click", function () {
  const p = new Promise((resolve, reject) => {
    setTimeout(() => {
      let n = rand(1, 100);
      if (n <= 30) {
        resolve(n);
      } else {
        reject(n);
      }
    }, 1000);
  });

  p.then(
    (value) => {
      alert("!!!!!666" + value);
    },
    (reason) => {
      alert("XXXX no" + reason);
    }
  );
});
```

## 读文件案例

- 原始

```jsx
const fs = require("fs");

fs.readFile("./promise-sgg/content.txt", (err, data) => {
  if (err) throw err;

  console.log(data.toString());
});
```

![Untitled](%E5%B0%9A%E7%A1%85%E8%B0%B7-Promise%208d67cbf36969410ea4fdfb745827e06e/Untitled%201.png)

- Promise

```jsx
const fs = require("fs");

let p = new Promise((resolve, rejcet) => {
  fs.readFile("./promise-sgg/content.txt", (err, data) => {
    if (err) rejcet(err);

    resolve(data);
  });
});

p.then(
  (value) => {
    console.log(value.toString());
  },
  (reason) => {
    throw reason;
  }
);
```

## AJAX 封装

- 原始

```jsx
<script>
      const API = "http://127.0.0.1:8000/server";

      const btn = document.querySelector(".btn");

      btn.addEventListener("click", function () {
        const xhr = new XMLHttpRequest();

        xhr.open("GET", API);
        xhr.send();
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
              console.log(xhr.response);
            } else {
              console.log(xhr.status);
            }
          }
        };
      });
    </script>
```

- promise

```jsx
const btn = document.querySelector(".btn");

btn.addEventListener("click", function () {
  const API = "http://127.0.0.1:8000/server";
  const p = new Promise((resolve, response) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", API);
    xhr.send();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(xhr.status);
        }
      }
    };
  });

  p.then(
    (value) => {
      console.log(value);
    },
    (reason) => {
      console.warn(reason);
    }
  );
});
```

## mineReadFile

- param: path
- return [promise object]

```jsx
function mineReadFile(path) {
  return new Promise((resolve, reject) => {
    require("fs").readFile(path, (err, data) => {
      if (err) reject(err);

      resolve(data);
    });
  });
}

mineReadFile("./promise-sgg/content.txt").then(
  (value) => {
    console.log(value.toString());
  },
  (reason) => {
    console.log(reason);
  }
);
```

![Untitled](%E5%B0%9A%E7%A1%85%E8%B0%B7-Promise%208d67cbf36969410ea4fdfb745827e06e/Untitled%202.png)

## util.promisify 方法

![Untitled](%E5%B0%9A%E7%A1%85%E8%B0%B7-Promise%208d67cbf36969410ea4fdfb745827e06e/Untitled%203.png)

```jsx
const util = require("util");
const fs = require("fs");

// 返回一个新的函数，这个函数返回的结果是一个promise，可以直接使用then
let mineReadFile = util.promisify(fs.readFile);
mineReadFile("./promise-sgg/content.txt").then((value) => {
  console.log(value.toString());
});
```

## AJAX 封装 2

![Untitled](%E5%B0%9A%E7%A1%85%E8%B0%B7-Promise%208d67cbf36969410ea4fdfb745827e06e/Untitled%204.png)

```jsx
<script>
      function sendAJAX(path) {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("GET", path);
          xhr.send();
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
              }
              reject(xhr.status);
            }
          };
        });
      }

      sendAJAX("https://restcountries.com/v3.1/all").then(
        (value) => console.log(value),
        (reason) => console.warn(reason)
      );
 </script>
```

# 2.Promise 的状态

- 状态改变
  - pending - resolved
  - pending - rejected
  只有这两种，且一个`promise`对象智能改变一次
  - 无论成功还是失败，都会有一个结果数据
  - 成功的结果数据一般称为`value`，失败的结果数据一般称为`reason`
  ![Untitled](%E5%B0%9A%E7%A1%85%E8%B0%B7-Promise%208d67cbf36969410ea4fdfb745827e06e/Untitled%205.png)

![Untitled](%E5%B0%9A%E7%A1%85%E8%B0%B7-Promise%208d67cbf36969410ea4fdfb745827e06e/Untitled%206.png)

![Untitled](%E5%B0%9A%E7%A1%85%E8%B0%B7-Promise%208d67cbf36969410ea4fdfb745827e06e/Untitled%207.png)

## Promise 的基本流程

![Untitled](%E5%B0%9A%E7%A1%85%E8%B0%B7-Promise%208d67cbf36969410ea4fdfb745827e06e/Untitled%208.png)

## Promise 的 API

![Untitled](%E5%B0%9A%E7%A1%85%E8%B0%B7-Promise%208d67cbf36969410ea4fdfb745827e06e/Untitled%209.png)

### Promise.resolve

- 如果传入的参数非 promise 类型的对象，则返回结果为成功 promise 对象
- 如果传入的参数为 promise 类型的对象，则参数结果决定了 resolve 返回的结果

![Untitled](%E5%B0%9A%E7%A1%85%E8%B0%B7-Promise%208d67cbf36969410ea4fdfb745827e06e/Untitled%2010.png)

# 3.promise 关键问题

- 如何改变 promise 状态
  ```jsx
  let p = new Promise((resolve, reject) => {
    // 1. resolve函数
    resolve("ok"); //pending => fulfilled (resolved)

    // 2. reject函数
    reject("not ok"); //pending => rejected

    // 3. throw error
    throw err;
  });
  ```
- promise 指定多个成功/失败的回调函数，都会调用嘛
  - 当 promise 改变状态时都会调用
  ```jsx
  p.then((value) => {
    console.log(value);
  });

  p.then((value) => {
    alert(value);
  });
  ```

![Untitled](%E5%B0%9A%E7%A1%85%E8%B0%B7-Promise%208d67cbf36969410ea4fdfb745827e06e/Untitled%2011.png)

![Untitled](%E5%B0%9A%E7%A1%85%E8%B0%B7-Promise%208d67cbf36969410ea4fdfb745827e06e/Untitled%2012.png)

```jsx
let p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("ok");
  }, 1000);
});

p.then((value) => {
  return new Promise((resolve, reject) => {
    resolve("success");
  });
})
  .then((value) => {
    console.log(value);
  })
  .then((value) => {
    console.log(value);
  }); // undefined

let p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("ok");
  }, 1000);
});

p.then((value) => {
  return new Promise((resolve, reject) => {
    resolve("success");
  });
})
  .then((value) => {
    console.log(value);
  })
  .then((value) => {
    return value;
  }); // success
```

![Untitled](%E5%B0%9A%E7%A1%85%E8%B0%B7-Promise%208d67cbf36969410ea4fdfb745827e06e/Untitled%2013.png)

![Untitled](%E5%B0%9A%E7%A1%85%E8%B0%B7-Promise%208d67cbf36969410ea4fdfb745827e06e/Untitled%2014.png)

![Untitled](%E5%B0%9A%E7%A1%85%E8%B0%B7-Promise%208d67cbf36969410ea4fdfb745827e06e/Untitled%2015.png)

# 4. 自定义 Promise

## 定义整体结构

```jsx
function Promise(executor) {}

// 添加 then 方法
Promise.prototype.then = function (onResolved, onRejected) {};
```

## 定义 resolve 与 reject 的结构

```jsx
function Promise(executor) {
  // resolve function
  function resolve(data) {}

  // reject function
  function reject(data) {}
  // 同步调用【执行期函数】
  executor(resolve, reject);
}

// 添加 then 方法
Promise.prototype.then = function (onResolved, onRejected) {};
```

## resolve 与 reject

```jsx
function Promise(executor) {
  // 添加属性
  this.PromiseState = "pending";
  this.PromiseResult = null;
  // resolve function
  // Notice !!!this!!
  resolve = (data) => {
    // 1.修改对象状态 （promiseState）
    this.PromiseState = "fulfilled";
    // 2. 设置对象结果值（promiseResule）
    this.PromiseResult = data;
  };

  // reject function
  reject = (data) => {
    // 1.修改对象状态 （promiseState）
    this.PromiseState = "rejected";
    // 2. 设置对象结果值（promiseResule）
    this.PromiseResult = data;
  };
  // 同步调用【执行期函数】
  executor(resolve, reject);
}

// 添加 then 方法
Promise.prototype.then = function (onResolved, onRejected) {};
```

## throw 抛出异常改变 promise 状态

```jsx
function Promise(executor) {
  // 添加属性
  this.PromiseState = "pending";
  this.PromiseResult = null;
  // resolve function
  // Notice !!!this!!
  resolve = (data) => {
    // 1.修改对象状态 （promiseState）
    this.PromiseState = "fulfilled";
    // 2. 设置对象结果值（promiseResule）
    this.PromiseResult = data;
  };

  // reject function
  reject = (data) => {
    // 1.修改对象状态 （promiseState）
    this.PromiseState = "rejected";
    // 2. 设置对象结果值（promiseResule）
    this.PromiseResult = data;
  };
  // 同步调用【执行期函数】
  try {
    executor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

// 添加 then 方法
Promise.prototype.then = function (onResolved, onRejected) {};
```

## promise 状态只能改变一次

```jsx
resolve = (data) => {
  // 判断状态
  if (this.PromiseState !== "pending") return;
  // 1.修改对象状态 （promiseState）
  this.PromiseState = "fulfilled";
  // 2. 设置对象结果值（promiseResule）
  this.PromiseResult = data;
};

// reject function
reject = (data) => {
  // 判断状态
  if (this.PromiseState !== "pending") return;
  // 1.修改对象状态 （promiseState）
  this.PromiseState = "rejected";
  // 2. 设置对象结果值（promiseResule）
  this.PromiseResult = data;
};
```

## then 方法执行回调

```jsx
// 添加 then 方法
Promise.prototype.then = function (onResolved, onRejected) {
  // 调用回调函数 PromiseState
  if (this.PromiseState === "fulfilled") {
    onResolved(this.PromiseResult);
  }
  if (this.PromiseState === "rejected") {
    onRejected(this.PromiseResult);
  }
};
```

## 异步任务回调的执行

```jsx
function Promise(executor) {
  // 添加属性
  this.PromiseState = "pending";
  this.PromiseResult = null;
  // 保存then中的回调
  this.callback = {};
  // resolve function
  // Notice !!!this!!
  resolve = (data) => {
    // 判断状态
    if (this.PromiseState !== "pending") return;
    // 1.修改对象状态 （promiseState）
    this.PromiseState = "fulfilled";
    // 2. 设置对象结果值（promiseResule）
    this.PromiseResult = data;
    // 执行成功的回调函数
    if (this.callback.onResolved) {
      this.callback.onResolved(data);
    }
  };

  // reject function
  reject = (data) => {
    // 判断状态
    if (this.PromiseState !== "pending") return;
    // 1.修改对象状态 （promiseState）
    this.PromiseState = "rejected";
    // 2. 设置对象结果值（promiseResule）
    this.PromiseResult = data;

    // 执行失败的回调函数
    if (this.callback.onRejected) {
      this.callback.onRejected(data);
    }
  };
  // 同步调用【执行期函数】
  try {
    executor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

// 添加 then 方法
Promise.prototype.then = function (onResolved, onRejected) {
  // 调用回调函数 PromiseState
  if (this.PromiseState === "fulfilled") {
    onResolved(this.PromiseResult);
  }
  if (this.PromiseState === "rejected") {
    onRejected(this.PromiseResult);
  }
  // 判断pending状态
  if (this.PromiseState === "pending") {
    // 保存回调函数⚠️
    this.callback = {
      onResolved: onResolved,
      onRejected: onRejected,
    };
  }
};
```

## 指定多个回调 - 用数组保存 callback（s）

```jsx
function Promise(executor) {
  // 添加属性
  this.PromiseState = "pending";
  this.PromiseResult = null;
  // 保存then中的回调
  this.callbacks = [];
  // resolve function
  // Notice !!!this!!
  resolve = (data) => {
    // 判断状态
    if (this.PromiseState !== "pending") return;
    // 1.修改对象状态 （promiseState）
    this.PromiseState = "fulfilled";
    // 2. 设置对象结果值（promiseResule）
    this.PromiseResult = data;
    // 执行成功的回调函数
    this.callbacks.forEach((callback) => {
      callback.onResolved(data);
    });
  };

  // reject function
  reject = (data) => {
    // 判断状态
    if (this.PromiseState !== "pending") return;
    // 1.修改对象状态 （promiseState）
    this.PromiseState = "rejected";
    // 2. 设置对象结果值（promiseResule）
    this.PromiseResult = data;

    // 执行失败的回调函数
    this.callbacks.forEach((callback) => {
      callback.onRejected(data);
    });
  };
  // 同步调用【执行期函数】
  try {
    executor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

// 添加 then 方法
Promise.prototype.then = function (onResolved, onRejected) {
  // 调用回调函数 PromiseState
  if (this.PromiseState === "fulfilled") {
    onResolved(this.PromiseResult);
  }
  if (this.PromiseState === "rejected") {
    onRejected(this.PromiseResult);
  }
  // 判断pending状态
  if (this.PromiseState === "pending") {
    // 保存回调函数⚠️
    this.callbacks.push({
      onResolved: onResolved,
      onRejected: onRejected,
    });
  }
};
```

## 同步修改状态，then 方法返回

```jsx
// 添加 then 方法
Promise.prototype.then = function (onResolved, onRejected) {
  return new Promise((resolve, reject) => {
    // 调用回调函数 PromiseState
    if (this.PromiseState === "fulfilled") {
      try {
        // 获取回调函数的执行结果
        let result = onResolved(this.PromiseResult);

        // 判断
        if (result instanceof Promise) {
          result.then(
            (v) => {
              resolve(v);
            },
            (r) => {
              reject(r);
            }
          );
        } else {
          // 结果对象不是promise对象，返回成功
          resolve(result);
        }
      } catch (e) {
        reject(e);
      }
    }
    if (this.PromiseState === "rejected") {
      onRejected(this.PromiseResult);
    }
    // 判断pending状态
    if (this.PromiseState === "pending") {
      // 保存回调函数⚠️
      this.callbacks.push({
        onResolved: onResolved,
        onRejected: onRejected,
      });
    }
  });
};
```

## 异步修改状态，then 方法返回

```jsx
function Promise(executor) {
  // 添加属性
  this.PromiseState = "pending";
  this.PromiseResult = null;
  // 保存then中的回调
  this.callbacks = [];
  // resolve function
  // Notice !!!this!!
  resolve = (data) => {
    // 判断状态
    if (this.PromiseState !== "pending") return;
    // 1.修改对象状态 （promiseState）
    this.PromiseState = "fulfilled";
    // 2. 设置对象结果值（promiseResule）
    this.PromiseResult = data;
    // 执行成功的回调函数
    this.callbacks.forEach((callback) => {
      callback.onResolved(data);
    });
  };

  // reject function
  reject = (data) => {
    // 判断状态
    if (this.PromiseState !== "pending") return;
    // 1.修改对象状态 （promiseState）
    this.PromiseState = "rejected";
    // 2. 设置对象结果值（promiseResule）
    this.PromiseResult = data;

    // 执行失败的回调函数
    this.callbacks.forEach((callback) => {
      callback.onRejected(data);
    });
  };
  // 同步调用【执行期函数】
  try {
    executor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

// 添加 then 方法
Promise.prototype.then = function (onResolved, onRejected) {
  return new Promise((resolve, reject) => {
    // 调用回调函数 PromiseState
    if (this.PromiseState === "fulfilled") {
      try {
        // 获取回调函数的执行结果
        let result = onResolved(this.PromiseResult);

        // 判断
        if (result instanceof Promise) {
          result.then(
            (v) => {
              resolve(v);
            },
            (r) => {
              reject(r);
            }
          );
        } else {
          // 结果对象不是promise对象，返回成功
          resolve(result);
        }
      } catch (e) {
        reject(e);
      }
    }
    if (this.PromiseState === "rejected") {
      onRejected(this.PromiseResult);
    }
    // 判断pending状态
    if (this.PromiseState === "pending") {
      // 保存回调函数⚠️
      this.callbacks.push({
        onResolved: () => {
          // 执行成功回调函数
          try {
            let result = onResolved(this.PromiseResult);

            if (result instanceof Promise) {
              result.then(
                (v) => {
                  resolve(v);
                },
                (r) => {
                  reject(r);
                }
              );
            } else {
              resolve(result);
            }
          } catch (e) {
            reject(e);
          }
        },
        onRejected: () => {
          // 执行失败回调函数
          try {
            let result = onRejected(this.PromiseResult);

            if (result instanceof Promise) {
              result.then(
                (v) => {
                  resolve(v);
                },
                (r) => {
                  reject(r);
                }
              );
            } else {
              resolve(result);
            }
          } catch (e) {
            reject(e);
          }
        },
      });
    }
  });
};
```

## then 方法完善和优化

```jsx
function Promise(executor) {
  // 添加属性
  this.PromiseState = "pending";
  this.PromiseResult = null;
  // 保存then中的回调
  this.callbacks = [];
  // resolve function
  // Notice !!!this!!
  resolve = (data) => {
    // 判断状态
    if (this.PromiseState !== "pending") return;
    // 1.修改对象状态 （promiseState）
    this.PromiseState = "fulfilled";
    // 2. 设置对象结果值（promiseResule）
    this.PromiseResult = data;
    // 执行成功的回调函数
    this.callbacks.forEach((callback) => {
      callback.onResolved(data);
    });
  };

  // reject function
  reject = (data) => {
    // 判断状态
    if (this.PromiseState !== "pending") return;
    // 1.修改对象状态 （promiseState）
    this.PromiseState = "rejected";
    // 2. 设置对象结果值（promiseResule）
    this.PromiseResult = data;

    // 执行失败的回调函数
    this.callbacks.forEach((callback) => {
      callback.onRejected(data);
    });
  };
  // 同步调用【执行期函数】
  try {
    executor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

// 添加 then 方法
Promise.prototype.then = function (onResolved, onRejected) {
  return new Promise((resolve, reject) => {
    // 封装函数
    function callback(type) {
      try {
        // 获取回调函数的执行结果
        let result = type(this.PromiseResult);

        // 判断
        if (result instanceof Promise) {
          result.then(
            (v) => {
              resolve(v);
            },
            (r) => {
              reject(r);
            }
          );
        } else {
          // 结果对象不是promise对象，返回成功
          resolve(result);
        }
      } catch (e) {
        reject(e);
      }
    }
    // 调用回调函数 PromiseState
    if (this.PromiseState === "fulfilled") {
      callback(onResolved);
    }
    if (this.PromiseState === "rejected") {
      callback(onRejected);
    }
    // 判断pending状态
    if (this.PromiseState === "pending") {
      // 保存回调函数⚠️
      this.callbacks.push({
        onResolved: () => {
          // 执行成功回调函数
          callback(onResolved);
        },
        onRejected: () => {
          // 执行失败回调函数
          callback(onRejected);
        },
      });
    }
  });
};
```

## catch 方法与异常穿透

```jsx
// 添加 then 方法
Promise.prototype.then = function (onResolved, onRejected) {
  // 判断回调函数参数
  if (typeof onRejected !== "function") {
    onRejected = (reason) => {
      throw reason;
    };
  }
  if (typeof onResolved !== "function") {
    onResolved = (value) => value;
  }
  return new Promise((resolve, reject) => {
    // 封装函数
    callback = (type) => {
      try {
        // 获取回调函数的执行结果
        let result = type(this.PromiseResult);

        // 判断
        if (result instanceof Promise) {
          result.then(
            (v) => {
              resolve(v);
            },
            (r) => {
              reject(r);
            }
          );
        } else {
          // 结果对象不是promise对象，返回成功
          resolve(result);
        }
      } catch (e) {
        reject(e);
      }
    };
    // 调用回调函数 PromiseState
    if (this.PromiseState === "fulfilled") {
      callback(onResolved);
    }
    if (this.PromiseState === "rejected") {
      callback(onRejected);
    }
    // 判断pending状态
    if (this.PromiseState === "pending") {
      // 保存回调函数⚠️
      this.callbacks.push({
        onResolved: () => {
          // 执行成功回调函数
          callback(onResolved);
        },
        onRejected: () => {
          // 执行失败回调函数
          callback(onRejected);
        },
      });
    }
  });
};

// 添加 catch 方法
Promise.prototype.catch = function (onRejected) {
  return this.then(undefined, onRejected);
};
```

## 其他 API

```jsx
// 添加 resolve 方法
Promise.resolve = function (value) {
  return new Promise((resolve, reject) => {
    if (value instanceof Promise) {
      velue.then(
        (v) => {
          resolve(v);
        },
        (r) => {
          reject(r);
        }
      );
    } else {
      resolve(value);
    }
  });
};

// Promise.reject
Promise.reject = function (reason) {
  return new Promise((resolve, reject) => {
    reject(reason);
  });
};

// Promise.all

Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    let count = 0;
    let arr = [];
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(
        (v) => {
          // know state is success
          count++;

          arr[i] = v;
          if (count === promises.length) {
            resolve(arr);
          }
        },
        (r) => {
          reject(r);
        }
      );
    }
  });
};

// Promise.race
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(
        (v) => {
          resolve(v);
        },
        (r) => {
          reject(r);
        }
      );
    }
  });
};
```

## 整合成 clas

```jsx
class Promise {
  constructor(executor) {
    // 添加属性
    this.PromiseState = "pending";
    this.PromiseResult = null;
    // 保存then中的回调
    this.callbacks = [];
    // resolve function
    // Notice !!!this!!
    const resolve = (data) => {
      // 判断状态
      if (this.PromiseState !== "pending") return;
      // 1.修改对象状态 （promiseState）
      this.PromiseState = "fulfilled";
      // 2. 设置对象结果值（promiseResule）
      this.PromiseResult = data;
      // 执行成功的回调函数

      setTimeout(() => {
        this.callbacks.forEach((callback) => {
          callback.onResolved(data);
        });
      });
    };

    // reject function
    const reject = (data) => {
      // 判断状态
      if (this.PromiseState !== "pending") return;
      // 1.修改对象状态 （promiseState）
      this.PromiseState = "rejected";
      // 2. 设置对象结果值（promiseResule）
      this.PromiseResult = data;

      // 执行失败的回调函数
      setTimeout(() => {
        this.callbacks.forEach((callback) => {
          callback.onRejected(data);
        });
      });
    };
    // 同步调用【执行期函数】
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  // 添加 then 方法
  then(onResolved, onRejected) {
    // 判断回调函数参数
    if (typeof onRejected !== "function") {
      onRejected = (reason) => {
        throw reason;
      };
    }
    if (typeof onResolved !== "function") {
      onResolved = (value) => value;
    }
    return new Promise((resolve, reject) => {
      // 封装函数
      callback = (type) => {
        try {
          // 获取回调函数的执行结果
          let result = type(this.PromiseResult);

          // 判断
          if (result instanceof Promise) {
            result.then(
              (v) => {
                resolve(v);
              },
              (r) => {
                reject(r);
              }
            );
          } else {
            // 结果对象不是promise对象，返回成功
            resolve(result);
          }
        } catch (e) {
          reject(e);
        }
      };
      // 调用回调函数 PromiseState
      if (this.PromiseState === "fulfilled") {
        setTimeout(() => {
          callback(onResolved);
        });
      }
      if (this.PromiseState === "rejected") {
        setTimeout(() => {
          callback(onRejected);
        });
      }
      // 判断pending状态
      if (this.PromiseState === "pending") {
        // 保存回调函数⚠️
        this.callbacks.push({
          onResolved: () => {
            // 执行成功回调函数
            callback(onResolved);
          },
          onRejected: () => {
            // 执行失败回调函数
            callback(onRejected);
          },
        });
      }
    });
  }

  // 添加 catch 方法
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  // 添加 resolve 方法
  static resolve(value) {
    return new Promise((resolve, reject) => {
      if (value instanceof Promise) {
        velue.then(
          (v) => {
            resolve(v);
          },
          (r) => {
            reject(r);
          }
        );
      } else {
        resolve(value);
      }
    });
  }

  // Promise.reject
  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason);
    });
  }

  // Promise.all

  static all(promises) {
    return new Promise((resolve, reject) => {
      let count = 0;
      let arr = [];
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(
          (v) => {
            // know state is success
            count++;

            arr[i] = v;
            if (count === promises.length) {
              resolve(arr);
            }
          },
          (r) => {
            reject(r);
          }
        );
      }
    });
  }

  // Promise.race
  static race(promises) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(
          (v) => {
            resolve(v);
          },
          (r) => {
            reject(r);
          }
        );
      }
    });
  }
}
```

# 5. async 与 await

- async 函数
  - 函数的返回值为 promise 对象
  - promise 对象的结果由 async 函数执行的返回值决定
  ```jsx
  async function main() {
    // 1.如果返回值非promise对象，则返回成功，数据为返回的数据
    // return 222
    // 2.如果返回值为promise对象，则返回根据promise来
    // 3.throw err； err就是你的结果，是失败的promise
    return new Promise((resolve, reject) => {
      resolve("ok");
      // reject('error')
    });
  }
  ```
- await 表达式
  - await 右侧的表达式一般为 promise 对象，但也可以是其它的值
  - 如果表达式是 promise 对象，await 返回的是 promise 成功的值
  - 如果表达式是其他值，直接将此值作为 await 的返回值
  - 如果 await 的 promise 失败了，就抛出异常，可以用 try catch 处理
  ```jsx
  async function main() {
    let p = new Promise((resolve, reject) => {
      reject("ok");
    });
    // 1. 右侧为promise的情况
    // let res = await p;
    // 2. 右侧为其他类型
    // let res2 = await 20;
    // 3. if promise is rejected
    try {
      let res3 = await p;
    } catch (e) {
      console.warn(e);
    }
  }

  main();
  ```
- 纯回调与 async，await 对比

![Untitled](%E5%B0%9A%E7%A1%85%E8%B0%B7-Promise%208d67cbf36969410ea4fdfb745827e06e/Untitled%2016.png)

```jsx
const util = require("util");
const fs = require("fs");
const mineReadFile = util.promisify(fs.readFile);

async function main() {
  try {
    let data1 = await mineReadFile("./promise-sgg/content1.txt");
    let data2 = await mineReadFile("./promise-sgg/content2.txt");
    let data3 = await mineReadFile("./promise-sgg/content3.txt");
    console.log(data1 + data2 + data3);
  } catch (e) {
    console.warn(e);
  }
}
main();
```

- async 与 await 结合发送 ajax 请求

![Untitled](%E5%B0%9A%E7%A1%85%E8%B0%B7-Promise%208d67cbf36969410ea4fdfb745827e06e/Untitled%2017.png)
