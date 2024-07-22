const typeString = ["[object Array]", "[object Date]", "[object RegExp]"];

export const type = (value: unknown) => {
  // null
  if (value === null) return value;

  // 基本数据类型及function
  if (typeof value !== "object"){
    if(typeof value === "number" && isNaN(value)) return NaN;
    if(typeof value === 'symbol') return value.toString();
    return value;
}

  // Array、Date、RegExp
  let res = Object.prototype.toString.call(value);

  if (typeString.includes(res)) return res;

  res = res.replace(/^\[object (\S+)\]$/, (match, $1) => {
    console.log(match);
    return `#<${$1}>`;
  });
  return res;
};