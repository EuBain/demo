

// 柯里化分为两种情况，

// 一种是参数个数不确定的情况
// 迭代
const createCurry1 = (fn) => {
  let argsAll = [];
 const curryed = (...rest) => {
  argsAll.push(...rest);
  if (rest.length === 0) {
    let res = [...argsAll]
    argsAll = [];
    return fn( ...res);
  }
  return curryed;
 }
 return curryed;
};


// 这种情况需要只会产生一个单例，共享存储的参数
// 只适合简单的连续调用，容易在交替调用或并行调用时出现参数混淆问题
// 节约内存
// 例如：

// const logFn = (...rest) =>{
//   console.log(rest)
// }
// const curryLog = createCurry1(logFn)

// e.g1
// const a = curryLog(1)(2,3,4)
// const b = curryLog(5,4,3)
// a()  //期望结果 [1,2,3,4]  实际结果[1,2,3,4,5,4,3]
// b()  //期望结果 [5,4,3]  实际结果[]

// e.g2
// curryLog(1)
// curryLog(2,3)
// curryLog(4,5)
// curryLog(6)() //  实际结果[1,2,3,4,5,6]



// 递归
const createCurry2 = (fn, ...args) => {
  return  (...rest)=> {
    if (rest.length === 0) {
      return fn( ...args,...rest);
    }
    return createCurry2( fn, ...args,...rest);
  }
}
// 这种情况每次都会产生新的函数，参数状态独立，每一步传入的参数都单独记录
// 每次调用都生成新的柯里化函数实例，参数不共享。可以并行进行不同的函数调用，不会互相干扰。
// 每次递归生成一个新的函数实例，因此在调用链较长的情况下会增加内存开销。
// 例如：
// const logFn = (...rest) =>{
//   console.log(rest)
// }
// let curryLog = createCurry2(logFn)

// // e.g1
// const a = curryLog(1)(2,3,4)
// const b = curryLog(5,4,3)
// a()  //实际结果 [1,2,3,4] 
// b()  //实际结果 [5,4,3]  

// // e.g2
// curryLog = curryLog(1)
// curryLog(6)() //  实际结果[1,6]

// // e.g3
// curryLog(1)
// curryLog(6)() //  实际结果[6]



// 另一种是参数个数确定的情况

// ...

// 反柯里化
// 就是把柯里化函数还原成普通函数

debugger