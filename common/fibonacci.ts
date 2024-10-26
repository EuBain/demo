// 斐波那契数列
// 0，1，1，2，3，5，8，13，21，...

// 根据参数第几项，返回斐波那契数列第几项
function fibonacci(n) {
  if(n === 1 ) return 0
  if(n === 2) return 1 
  return fibonacci(n - 1) + fibonacci(n - 2)
}

// 尾调用优化
function fibonacci2(n) {
 return  fibImp (n, 0, 1)
}
function fibImp (n, a, b) {
  if(n === 0) return a
  return fibImp (n - 1, b, a + b)
}

// 迭代循环
function fibonacci3 (n) {
  let a = 0,
      b = 1,
      temp: number 
      while(n > 1) {
        n--
        temp = a + b
        a = b
        b = temp
      }
      return a
}


