import { type } from "./type";

export default class CompPromise {
  promiseState: string;
  promiseResult: unknown;
  #thenCallback: ((value: any) => void) | undefined;
  #catchCallback: ((value: any) => void) | undefined;

  constructor(fn: (resolve: any, reject: any) => void) {
    //promise的状态
    this.promiseState = "pending";
    //promise的值
    this.promiseResult = undefined;

    const resolve = (value: any) => {
      // 先要保证promise是pending状态
      if (this.promiseState !== "pending") return;
      // 判断resolve的值是不是Promise
      if (value instanceof CompPromise) {
        // 传入值是 fulfill Promise时，直接调用.then，是rejected Promise时，就是需要再调用一次catch
        value.then(
          (res: any) => {
            this.promiseResult = res;
            this.promiseState = "fulfilled";
            if (this.#thenCallback) {
              this.#thenCallback(res);
            }
          },
          (res: any) => {
            this.promiseResult = res;
            this.promiseState = "rejected";
            // 最外部直接调用.catch时给的是catchCallback，调用.then时给的是 enCallback
            if (this.#catchCallback) {
              this.#catchCallback(res);
            }
            if (this.#thenCallback) {
              this.#thenCallback(res);
            }
          }
        );
      } else {
        // value 是值时，调用时改变promise状态
        this.promiseState = "fulfilled";
        this.promiseResult = value;

        // 宏任务模拟异步调用
        setTimeout(() => {
          if (this.#thenCallback) {
            this.#thenCallback(value);
          }
        });
      }
    };
    const reject = (error: unknown) => {
      // 判断状态，为pending时才执行，改变状态
      if (this.promiseState !== "pending") return;
      this.promiseState = "rejected";
      this.promiseResult = error;
      // 宏任务模拟异步调用
      setTimeout(() => {
        if (this.#catchCallback) {
          this.#catchCallback(error);
        } else if (this.#thenCallback) {
          this.#thenCallback(error);
        } else {
          //如果没有定义catch,抛出异常
          console.error("Uncaught (in MyPromise)", error);
        }
      });
    };

    if (fn && typeof fn === "function") {
      try {
        fn(resolve, reject);
      } catch (err) {
        reject(err);
      }
    } else {
      // 抛出错误
      throw new TypeError(`CompPromise resolver ${type(fn)} is not a function`);
    }
  }

  static resolve(value: any) {
    if (value instanceof CompPromise) {
      return value;
    }
    return new CompPromise((resolve, reject) => {
      resolve(value);
    });
  }
  static reject(value: any) {
    return new CompPromise((resolve, reject) => {
      reject(value);
    });
  }
  static all(arr: any[]) {
    return new CompPromise((resolve, reject) => {
      let valueArr = [];
      let count = 0;
      arr.forEach((item, index) => {
        CompPromise.resolve(item).then(
          (res) => {
            valueArr[index] = res;
            count++;
            if (count === arr.length) {
              resolve(valueArr);
            }
          },
          (err) => {
            reject(err);
          }
        );
      });
    });
  }
  static race(arr: any[]) {
    return new CompPromise((resolve, reject) => {
      arr.forEach((item, index) => {
        CompPromise.resolve(item).then(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
      });
    });
  }
  static any(arr: any[]) {
    return new CompPromise((resolve, reject) => {
      let errorArr = [];
      let count = 0;
      arr.forEach((item, index) => {
        CompPromise.resolve(item).then(
          (res) => {
            resolve(res);
          },
          (err) => {
            errorArr[index] = err;
            count++;
            if (count === arr.length) {
              reject(errorArr);
            }
          }
        );
      });
    });
  }
  static allSettled(arr: any[]) {
    return new CompPromise((resolve, reject) => {
      let valueArr = [];
      let count = 0;
      arr.forEach((item, index) => {
        CompPromise.resolve(item).then(
          (res) => {
            valueArr[index] = res;
            count++;
            if (count === arr.length) {
              resolve(valueArr);
            }
          },
          (err) => {
            valueArr[index] = err;
            count++;
            if (count === arr.length) {
              resolve(valueArr);
            }
          }
        );
      });
    });
  }
  static withResolvers() {
    let res,
      rej,
      promise = new CompPromise((resolve, reject) => {
        res = resolve;
        rej = reject;
      });
    return { promise, resolve: res, reject: rej };
  }

  then(
    sucCallback?: ((val: any) => any) | null,
    errCallback?: (val: any) => any | undefined
  ) {
    // console.log(this);
    // @ts-ignore
    if (this instanceof CompPromise === false) {
      throw new TypeError(
        `Method Promise.prototype.then called on incompatible receiver ${type(this)}`
      );
    }
    //返回一个Promise对象后续才能继续链式调用
    return new CompPromise((resolve, reject) => {
      this.#thenCallback = (value) => {
        // 当reject时，处理.then调用的情况,触发异步时将reject的值抛给下一个promise的reject
        if (this.promiseState === "rejected") {
          reject(value);
        } else {
          // 先捕获回调函数代码执行时的异常
          try {
            // then内部是回调函数时执行函数返回值，不是函数时将上一个promise的值传给下一个promise
            let res =
              typeof sucCallback === "function" ? sucCallback(value) : value;
            // 当触发当前promise对象的resolve时
            // 调用then中的回调并且将回调的返回值交给下一个then作为参数
            if (res instanceof CompPromise) {
              res.then(resolve, reject);
            } else {
              resolve(res);
            }
          } catch (err) {
            reject(err);
          }
        }
      };

      // 当then被调用时，才有异步执行相应的代码，且只有上一个promise对象调用后，后续返回的promise才能resolve
      if (errCallback != undefined) {
        this.#catchCallback = (value) => {
          try {
            if (typeof errCallback === "function") {
              resolve(errCallback(value));
            } else {
              reject(value);
            }
          } catch (err) {
            reject(err);
          }
        };
      }
    });
  }

  catch(errCallback?: (res: any) => void | any) {
    return this.then(null, errCallback);
  }
  finally(finaCallback?: () => void | any) {
    return this.then(
      (value) => {
        // 返回一个promise对象，无论前一个promise对象是成功还是失败，都会执行finally中的回调
        return CompPromise.resolve(finaCallback?.()).then(() => value);
      },
      (err) => {
        return CompPromise.resolve(finaCallback?.()).then(() => {
          throw err;
        });
      }
    );
  }
}

// @ts-ignore
CompPromise.prototype[Symbol.toStringTag] = "CompPromise";

//all
// let arr1 = [
//   new CompPromise((resolve, reject) => {
//     setTimeout(() => {
//       console.log("1");
//       reject(1);
//     }, 3000);
//   }),
//   new CompPromise((resolve, reject) => {
//     setTimeout(() => {
//       console.log("2");
//       reject(2);
//     }, 2000);
//   }),
//   new CompPromise((resolve, reject) => {
//     setTimeout(() => {
//       console.log("3");
//       reject(3);
//     }, 6000);
//   }),
// ];

// CompPromise.allSelected(arr1).then(console.log).catch(console.log);
// let arr1 = [
//   new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log("1");
//       reject(1);
//     }, 3000);
//   }),
//   new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log("2");
//       reject(2);
//     }, 2000);
//   }),
//   new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log("3");
//       reject(3);
//     }, 6000);
//   }),
// ];

// Promise.allSettled(arr1).then(console.log).catch(console.log);
