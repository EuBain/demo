
// new 的过程
// 1. 创建一个新对象
// 2. 将构造函数的作用域赋给新对象（因此this指向这个新对象）
// 3. 执行构造函数中的代码（为这个新对象添加属性）
// 4. 返回构造函数中返回的函数或者对象，没有则返回这个新的对象
//

export function _new(fn: Function) {
  return function (...arg: any[]){
    let obj = Object.create(fn.prototype);
    let res = fn.apply(obj, arg);
    return res instanceof Object ? res : obj;
  }
}
  
