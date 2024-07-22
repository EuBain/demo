const intRandom = {
  // [a, b) 整数
  greaterEqual: (a: number, b: number) => {
    let num = Math.floor(Math.random() * (b - a) + a);
    return num;
  },
  // [a, b] 整数
  Equal: (a: number, b: number) => {
    let num = Math.floor(Math.random() * (b - a + 1) + a);
    return num;
  },
  // (a, b] 整数
  lessEqual: (a: number, b: number) => {
    let num = Math.floor(Math.random() * (b - a) + a) + 1;
    return num;
  },
};

type Type = keyof typeof intRandom

export function randomNum(a: number, b: number, option?: { type?: Type }) {
  const type = option?.type || "greaterEqual";
  return intRandom[type](a, b);
}
