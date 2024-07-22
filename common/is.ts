type TypeChecker = (value: unknown) => boolean;

type Type = 
| "String" 
| "Number" 
| "Boolean" 
| "Undefined" 
| "Null" 
| "BigInt" 
| "Symbol" 
| "Array" 
| "Object" 
| "Date"
| "RegExp"
| "Map"
| "Set"
| "Function" 
| "Browser"

type OmitBrowser = Exclude<Type, 'Browser'>

type isType = {
  [key in OmitBrowser]: TypeChecker;
} & {
  Browser: () => boolean;
  (value: unknown, type?: OmitBrowser ): boolean | string;
};


const baseTypeObject = ['[object String]', '[object Number]', '[object Boolean]'];

/**  
 *  用于判断数据类型
 *  @param {unknown} value - 传入的值 
 *  @param {Type} [type] - 传入的类型,不传入则返回值的类型,传入时返回值是否为传入的类型
 *  @returns {(boolean|string)} 返回值的类型或者是否为传入的类型 
 */
const is = ((value: unknown, type?: OmitBrowser) => {
  // 如果未传入type 返回值的类型
  if(!type) {
    let valueType = Object.prototype.toString.call(value)
    if(value !== null && typeof value === 'object' && baseTypeObject.includes(valueType)) {
        return valueType
    }
    return valueType.replace(/^\[object (\S+)\]$/, '$1').toLowerCase();
  }
  return is[type](value);
  
}) as isType;

  // 判断基本数据类型  string, number, boolean, undefined, null, bigint, symbol

  /** 判断字符串
   * @param value
   * @returns boolean
   */
  is.String = (value: unknown) => typeof value === "string";

  /** 判断数字
   *
   * @param value
   * @returns boolean
   */
  is.Number = (value: unknown) => typeof value === "number";

  /** 判断布尔值
   * @static
   * @param value
   * @returns boolean
   */
  is.Boolean= (value: unknown): value is boolean => typeof value === "boolean",

  /** 判断undefined
   *
   * @param value
   * @returns boolean
   */
  is.Undefined= (value: unknown): value is undefined =>
    typeof value === "undefined",

  /** 判断null
   *
   * @param value
   * @returns boolean
   */
  is.Null= (value: unknown): value is null => value === null,

  /** 判断Symbol
   *
   * @param value
   * @returns boolean
   */
  is.Symbol= (value: unknown): value is symbol => typeof value === "symbol",

  /** 判断BigInt
   *
   * @param value
   * @returns boolean
   */
  is.BigInt= (value: unknown): value is bigint => typeof value === "bigint",

  // 判断引用数据类型  object, array, function, date, regexp
  /** 判断对象，且不为null
   *
   * @param value
   * @returns boolean
   */
  is.Object= (value: unknown): value is Record<any, any> =>
    value !== null && typeof value === "object",

  /** 判断数组
   *
   * @param value
   * @returns boolean
   */
  is.Array= Array.isArray,

  /** 判断函数
   *
   * @param value
   * @returns boolean
   */
  is.Function= (value: unknown): value is (...arg: any) => any =>
    typeof value === "function",

  /** 判断Date
   *
   * @param value
   * @returns boolean
   */
  is.Date= (value: unknown) => value instanceof Date,

  /** 判断RegExp
   *
   * @param value
   * @returns boolean
   */
  is.RegExp= (value: unknown) => value instanceof RegExp,

  // 判断Map  Set数据结构
  /** 判断Map
   *
   * @param value
   * @returns boolean
   */
  is.Map= (value: unknown) => value instanceof Map,

  /** 判断Set
   *
   * @param value
   * @returns boolean
   */
  is.Set= (value: unknown) => value instanceof Set,

  /*** 判断是否是浏览器window*/
  is.Browser = () => !!(
    typeof window !== "undefined" &&
    window?.document &&
    window?.document.createElement
  )

export default is;
