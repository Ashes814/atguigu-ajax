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
