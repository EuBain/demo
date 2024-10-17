import { randomNum } from "../common/random";


// 冒泡排序
// 把最大的数排到最后，再找第二大的数，依次类推，直到排序完成，时间复杂度O(n^2)
export function bubble(arr: any[]) {
  for (let i = 0; i < arr.length - 1; i++) {
    let j = 0;
    for (j; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
    if (arr[j] === arr[j - 1]) i++;
  }
}

// 时间复杂度O(n^2)
// 选择
function selection(arr: any[]) {
  for (let i = 0; i < arr.length; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[min]) min = j;
    }
    if (min !== i) {
      let temp = arr[i];
      arr[i] = arr[min];
      arr[min] = temp;
    }
    if (arr[i] === arr[i + 1]) i++;
  }
}

// 时间复杂度O(nlogn)
// 快速
function quick(arr: any[]): any[] {
  if (arr.length <= 1) return arr;
  let centerIndex = ~~(arr.length / 2);
  let left = [];
  let right = [];
  for (let i = 0; i < arr.length; i++) {
    if (i === centerIndex) continue;
    if (arr[i] < arr[centerIndex]) left.push(arr[i]);
    else right.push(arr[i]);
  }
  return quick(left).concat(arr[centerIndex], quick(right));
}


// 测试
let a = [];
// let b = [];
for (let i = 0; i < 1000; i++) {
  a[i] = randomNum(0, 1000);
}
// b = [...a];

// console.time('quick')
// quick(a);
// console.timeEnd('quick')

console.time("bubble");
bubble(a);
console.timeEnd("bubble");

// console.time('selection')
// selection(b)
// console.timeEnd('selection')
// console.log(a);
// console.log(b);
