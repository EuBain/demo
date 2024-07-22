import is from "./is";

export function deepClone(originValue: any, map = new WeakMap()) {

  // function
  if (is.Function(originValue)) {
    if (/^function/.test(originValue.toString()) || /^\(\)/.test(originValue.toString()) || /=>/.test(originValue.toString()) ) {
      return new Function(`return ${originValue.toString()}`)();
    }
    return new Function(`return function ${originValue.toString()}`)();
  }

  // Date
  if (is.Date(originValue)) {
    return new Date(originValue.getTime());
  }

  // Symbol
  if (is.Symbol(originValue)) {
    return Symbol(originValue.description);
  }

  // Set
  if (is.Set(originValue)) {
    const newSet = new Set()
    for(const value of originValue){
      newSet.add(deepClone(value))
    }
    return newSet
  }

  // Map
  if(is.Map(originValue)){
    const newMap = new Map()
    for(const [key, value] of originValue){
      newMap.set(deepClone(key), deepClone(value))
    }
    return newMap
  }

  // 非Object
  if (!is.Object(originValue)) return originValue;
  // Object
  // 使用weakmap处理循环引用的情况，当存在循环引用时直接返回 
  if (map.has(originValue)) {    
    return map.get(originValue);
  }

  // Array  
  if(is.Array(originValue)){
    const newArray:any[] = []
    map.set(originValue, newArray)
    for(const value of originValue){
      newArray.push(deepClone(value, map))
    }
    return newArray
  }

  const newObject: {[key: string | symbol]: any}  = {}
  // 处理循环引用
  map.set(originValue, newObject)

  for(const key in originValue){
    newObject[key] = deepClone(originValue[key], map)
  }

  // 处理symbol属性
  const symbolKeys = Object.getOwnPropertySymbols(originValue)

  for(const key of symbolKeys){
    newObject[key] = deepClone(originValue[key], map)
  }
  return newObject
}

export default deepClone;
