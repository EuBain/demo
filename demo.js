
// setTimeout(() => {
//   setImmediate(() => {
//    console.log('setImmediate 2 ')
//   })
//   setTimeout(() => {
//     console.log('setTimeout 2 ')
//   },0)
//   console.log('setTimeout 1 ')
// }, 0);
// // setTimeout(() => {
// //   console.log('setTimeout 1 ')
// // }, 0)
// setImmediate(() => {
//   console.log('setImmediate  1')
//  })

// const fs = require('node:fs');
// function someAsyncOperation(callback) {
//   // Assume this takes 95ms to complete
//   fs.readFile('/path/to/file', callback);
// }
// setImmediate(()=> {
//   const timeoutScheduled = Date.now();
// setTimeout(() => {
//   const delay = Date.now() - timeoutScheduled;
//   console.log(`${delay}ms have passed since I was scheduled`);
// }, 0);
// setImmediate(() => {
//   console.log(`Immediate callback`);
// });
// })
// do someAsyncOperation which takes 95 ms to complete
// someAsyncOperation(() => {
//   console.log('read file ')
//   const startCallback = Date.now();
//   // do something that will take 10ms...
//   while (Date.now() - startCallback < 10) {
//     // do nothing
//   }
// });


// nextTick
// Promise
// setImmediate
// setTimeout

// setTimeout(() => {
//   console.log('setTimeout')
// }, 0)
// setImmediate(() => {
//   console.log('setImmediate')
// })
// process.nextTick(() => {
//   console.log('process.nextTick')
// })
// Promise.resolve().then(() => {
//   console.log('Promise')
// })


// const baz = () => console.log('baz');
// const foo = () => console.log('foo');
// const zoo = () => console.log('zoo');
// const start = () => {
//   console.log('start');
//   setImmediate(baz);
//   new Promise((resolve, reject) => {
//     resolve('bar');
//   }).then(resolve => {
//     console.log(resolve);
//     process.nextTick(zoo);
//   });
//   process.nextTick(foo);
// };
// start();

const path = require('node:path')

const demoPath = path.resolve('common/__tests__/./Prmise')

console.log(demoPath)