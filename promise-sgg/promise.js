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

    setTimeout(() => {
      this.callbacks.forEach((callback) => {
        callback.onResolved(data);
      });
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
};

// 添加 catch 方法
Promise.prototype.catch = function (onRejected) {
  return this.then(undefined, onRejected);
};

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
