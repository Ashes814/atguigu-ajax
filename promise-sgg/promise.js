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
