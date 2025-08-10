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
        // 模拟promise两次then的调用
        value.then(res => res, err => err).then(
          (res: any) => {
            this.promiseResult = res;
            this.promiseState = "fulfilled";
            setTimeout(() => {
              if (this.#thenCallback) {
                this.#thenCallback(res);
              }
            })
          },
          (res: any) => {
            this.promiseResult = res;
            this.promiseState = "rejected";
            // 最外部直接调用.catch时给的是catchCallback，调用.then时给的是 enCallback
            setTimeout(() => {
              if (this.#catchCallback) {
                this.#catchCallback(res);
              }
              if (this.#thenCallback) {
                this.#thenCallback(res);
              } 
            })
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
          setTimeout(() => {
            console.error("Uncaught (in MyPromise)", error);
          });
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

  // 返回成功状态的promise
  static resolve(value: any) {
    if (value instanceof CompPromise) {
      return value;
    }
    return new CompPromise((resolve, reject) => {
      resolve(value);
    });
  }
  // 返回失败状态的promise
  static reject(value: any) {
    return new CompPromise((resolve, reject) => {
      reject(value);
    });
  }
  // 返回promise数组中全部成功时的promise，如果有一个失败的，则返回第一个失败的promise
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
  // 返回promise数组中第一个完成的promise，无论成功还是失败
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
  // 返回promise数组中全部失败时的promise，如果有一个成功的，则返回第一个成功的promise
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
  // 返回promise数组中全部完成的promise，无论成功还是失败
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
  // 创建并返回一个promise，可以在外部控制promise的状态和结果
  static withResolvers() {
    let resolve,
        reject,
        promise = new CompPromise((res, rej) => {
        resolve = res;
        reject = rej;
      });
    return { promise, resolve, reject };
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
            // 不管回调函数中返回的是成功还是失败的promise还是普通值都交给resolve处理
            resolve(res);
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
        finaCallback?.()
        // 返回一个promise对象，无论前一个promise对象是成功还是失败，都会执行finally中的回调
        return CompPromise.resolve(value);
      },
      (err) => {
        finaCallback?.()
        return CompPromise.reject(err)
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
// CompPromise.resolve().then(()=> {
//   console.log(0)
//   return CompPromise.resolve(4)
// }).finally(()=> {
//   console.log('finally')
// }).then((res)=> {
//   console.log(res)
// })
// CompPromise.prototype.myfinally= function (finaCallback?: () => void | any) {
//   return this.then(
//     (value) => {
//       finaCallback?.()
//       // 返回一个promise对象，无论前一个promise对象是成功还是失败，都会执行finally中的回调
//       // return CompPromise.resolve(null).then().then(() => value);  //4
//       // return CompPromise.resolve(null).then(() => value); //3
//       return CompPromise.resolve(value);  //3
//       // 实际是3
//       // return value;  //1 
//     },
//     (err) => {
//       finaCallback?.()
//       return CompPromise.reject(err)
//     }
//   );
// }

// CompPromise.resolve(CompPromise.resolve('a').then((res) => {
//   console.log(res)
//   return CompPromise.resolve('b')})).then((e)=> {
//   console.log(e)
//   return CompPromise.resolve('c')
//   // return 'c'
// })
// .myfinally(()=> {
//   console.log('finally')
// })
// .then((res)=> {
//   console.log(res)
// })



// CompPromise.resolve().then(()=> {
//   console.log(1)
// }).then(() => {
//   console.log(2)
// }).then(() => {
//   console.log(3)
// }).then(() => {
//   console.log(4)
// }).then(() => {
//   console.log(5)
// }).then(() => {
//   console.log(6)
// }).then(() => {
//   console.log(7)
// }).then(() => {
//   console.log(8)
// }).then(() => {
//   console.log(9)
// }).then(() => {
//   console.log(10)
// }).then(() => {
//   console.log(11)
// })




// // .then 
// /** 5次异步*/Promise.resolve('then 3').then((res) => { return Promise.resolve(res).then((res) => res).then((res) => res) }).then((res) => { console.log(res) })
// /** 4次异步*/Promise.resolve('then 2').then((res) => { return Promise.resolve(res).then((res) => res) }).then((res) => { console.log(res) })
// /** 4次异步*/Promise.resolve('then 1').then((res) => { return Promise.resolve(res) }).then((res) => { console.log(res) })

// // new Promise resolve
// /** 4次异步*/new Promise((resolve,reject) => {
//   resolve(Promise.resolve('new 3').then((res) => res).then((res) => res))
// }).then((res) => { console.log(res) })
// /** 3次异步*/new Promise((resolve,reject) => {
//   resolve(Promise.resolve('new 2').then((res) => res))
// }).then((res) => { console.log(res) })
// /** 3次异步*/new Promise((resolve,reject) => {
//   resolve(Promise.resolve('new 1'))
// }).then((res) => { console.log(res) })

// // promise.resolve
// /** 3次异步*/Promise.resolve(Promise.resolve('resolve 3').then((res) => res).then((res) => res)).then((res) => { console.log(res) })
// /** 2次异步*/Promise.resolve(Promise.resolve('resolve 2').then((res) => res)).then((res) => { console.log(res) })
// /** 1次异步*/Promise.resolve(Promise.resolve('resolve 1')).then((res) => { console.log(res) })

const timer =  (timer,num) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(num);
      resolve(num);
    }, timer);
  });
}

let a = () => timer(1000, 1);
let b = () => timer(3000, 2);
let c = () => timer(2000, 3);

// Promise.all([a, b, c]).then((res) => {
//   console.log(res,'done');
// })

// Array.prototype.MyforEach =function (callback) {
//   for (let i = 0; i < this.length; i++) {
//     callback(this[i], i, this)
//   }
// }
const  merge = async (array) => {
  const data = []
  // let promise = Promise.resolve()
  // array.forEach((item) => {
  //   promise = promise.then(item).then(res => {
  //     data.push(res)
  //     return data
  //   })
  // })
  // return promise

  // forEach 循环
  // await array.MyforEach(async item => {
  //   let res = await item()
  //   data.push(res)
  // })

  // for..of  循环
  // for (let item of array) {
  //   let res = await item()
  //   data.push(res)
  // }

  // for 循环
  // for (let i = 0; i < array.length; i++) {
  //   let res = await array[i]()
  //   data.push(res)
  // }
  return Promise.resolve(data)
}

merge([a, b, c]).then((res) => {
  console.log(res,'done');
})

// let a = CompPromise.resolve(1)
// .then(res => {console.log(res)
//   CompPromise.reject(1)
//   return 3
// })
// // .catch(err => {console.log('error')})
// // .then(
// //   res => {console.log(res)
// //   return 5
// // })
// .then(res => {console.log(res)})


// let b = Promise.resolve(2)
// .then(res => {console.log(res)
//   return 4
// })
// .then(res => {console.log(res)
//   return 6
// })
// .then(res => {console.log(res)})
