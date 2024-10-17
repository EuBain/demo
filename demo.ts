


// let a: any[] = []

// a[3]=1



// const b = Object.create(a)


// const obj = {a:function d () {
//     console.log(this)
// }}
// const c = JSON.stringify(obj) === '{}'

// function isObjectEmpty(obj){ 
//   for(var key in obj){ 
//   return false 
//   }
//    return true 
//   }
//    console.log(isObjectEmpty(obj)) 

// const c = new Map([['a',1],['a',3]])
// // console.log(c)
// let a = {
//   aa:function() {
//     console.log('函数执行')
//   },
//   b:2
// }

// let a = function() {
//     console.log('函数执行')
//   }




// const c = new Proxy(a,{
//   get (target, prop) {
//      Reflect.get(target, prop)
//   },
// })

// class Example {
//   get hello() {
//     return "world";
//   }
//   set hello(value) {
//     console.log(value);
//   }
// }

// const obj = new Example();
// console.log(obj.hello);

// const obj1 = Object.create({
//   get a (){
//     return 'world'
//   }
// })


// Object.defineProperty(obj1, 'hello', {
// get: function () {
//   return 'world'
// }
// })


// const q = {
//   a:1
// }

// function qq (q, c) {
// with (q) {
//   console.log(a)
// }
// }
// qq(q,c)

// console.log(obj1);
// console.log(Object.getOwnPropertyDescriptor(obj1, 'a'))

// const proto ={
//   aa:function () {
//     console.log('函数执行')

//   },
//   bb:1,
//   // c:'unknown'
// };

// Object.defineProperty(proto,'cc',{
// enumerable:true,
// value:'unknown'
// })

// const sym = Symbol('a')
// const obj = { __proto__: proto, a: 2 ,b:3, [sym]:1 };
// Object.defineProperty(obj,'c',{
//   enumerable:false,
//   configurable:true,
//   value:'un'
//   })


// let b = new Proxy(obj,{
//   get (target, prop) {
//     console.log('get代理拦截')
//     console.log(prop)
//     if(Reflect.ownKeys(target).includes(prop) && typeof Reflect.get(target, prop) === "function" ){
//         return new Proxy ( Reflect.get(target, prop), {
//           apply (targets, thisArg, argumentsList) {
//             console.log('函数代理方法')
//             return Reflect.apply(targets, thisArg, argumentsList)
//           }
//         }
//       )
//     }
//     return Reflect.get(target, prop)
//   },
//   has (target, prop) {
//     console.log('has代理拦截')
//     return true
//   },
//   ownKeys (target) {
//     console.log(Reflect.ownKeys(target))
//     console.log('ownKeys代理拦截')
//     return ['c','e', sym ]
//   },
//   // apply (targets, thisArg, argumentsList) {
//   //   console.log('函数代理')
//   //   return Reflect.apply(targets, thisArg, argumentsList)
//   // }
// })

// // for (const prop in obj) {
// //   console.log(prop);
// // }
// // for (const prop in b) {
// //   console.log(prop);
// // }


// // console.log(Object.getOwnPropertyNames(b))
// // console.log(Object.getOwnPropertySymbols(b))
// // console.log(Reflect.ownKeys(b))

// console.log(Object.keys(b))

function fun1(arr) {
  while (arr.some(item => Array.isArray(item))) {
  arr = [].concat(...arr);
}
return arr;
}

const num = 1;
num.toFixed();
const a = [1,2,3].map(parseInt)
debugger