// new 的过程
// 创建了一个空对象
// 空对象的原型指向构造函数的原型对象
// 执行构造函数，this指向新对象
// 构造函数如果有返回值就返回，没有就返回新创建的对象

// async function test() {
//     let arr = [3, 2, 1]
//     for (var i=0;i<arr.length;i++) {
//     const res = await fetch(arr[i])
//     console.log(res)
//     }
//     console.log('end')
//     }
//     function fetch(x) {
//     return new Promise((resolve, reject) => {
//     setTimeout(() => {
//     resolve(x)
//     }, 500 * x)
//     })
//     }
//     test()
var arr=[5,2,10,8,0,4,7,11,9,1];
function array2(){
var temp,min;
for(var i=0;i<arr.length-1;i++){
min=i;
for(var j=i+1;j<arr.length;j++){
if(arr[j]>arr[i]){
temp= arr[i];
arr[i] = arr[j];
arr[j] = temp;
}
}
}
console.log(arr[1]);
}
array2();