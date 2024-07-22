Array.prototype.myforEach = function (fn) {
  let arr = this as any[];
  for (let i = 0; i < arr.length; i++) {
    fn(arr[i], i, arr);
  }
};


