

arr = [1,3,4,32,54,3,2]

// 冒泡
function a (arr) {
    for (var i = 0; i< arr.length-1; i++) {
        for(var j = 0 ; j < arr.length - i - 1; j++) {
            if(arr[j] > arr[j+1]) {
                var temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
        if(arr[j] === arr[j-1]) i++
    }
}



// a(arr)

// 选择
function b (arr) {
    for(var i = 0; i < arr.length; i++) {
        var min = i;
        for(var j = i+1; j < arr.length; j++) {
            // 找出最小的
            if(arr[j] < arr[min]) min=j
        }
        if(min !== i) {
            // 交换
            var temp = arr[i];
            arr[i] = arr[min];
            arr[min] = temp;
        }
        // 与下一个相等就跳过
        if(arr[i] === arr[i+1])i++
    }
}


// 快速
function c (arr) {
if(arr.length <= 1) return arr;
// 两次按位非，取整
var centerIndex = ~~(arr.length/2)
var left = [];
var right = [];
for(var i = 0; i < arr.length; i++) {
    if(i === centerIndex) continue;
    if(arr[i] < arr[centerIndex]) left.push(arr[i]);
    else right.push(arr[i]);
}
return c(left).concat(arr[centerIndex],c(right))
}

console.log(arr)