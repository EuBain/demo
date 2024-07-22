import is from "../is";

describe("is", () => {
  it("当前值是指定的类型返回true", () => {
    expect(is("hello", "String")).toBe(true);
    expect(is(42, "Number")).toBe(true);
    expect(is(true, "Boolean")).toBe(true);
    expect(is(undefined, "Undefined")).toBe(true);
    expect(is(null, "Null")).toBe(true);
    expect(is(BigInt("10"), "BigInt")).toBe(true);
    expect(is(Symbol("foo"), "Symbol")).toBe(true);
    expect(is([], "Array")).toBe(true);
    expect(is([], "Object")).toBe(true);
    expect(is({}, "Object")).toBe(true);
    expect(is(new Number(1), "Object")).toBe(true);
    expect(is(new Date(), "Date")).toBe(true);
    expect(is(/regex/, "RegExp")).toBe(true);
    expect(is(new Map(), "Map")).toBe(true);
    expect(is(new Set(), "Set")).toBe(true);
    expect(is(() => {}, "Function")).toBe(true);
  });

  it("当前值不是指定的类型返回false", () => {
    expect(is("hello", "Number")).toBe(false);
    expect(is(42, "String")).toBe(false);
    expect(is(new Number(1), "Number")).toBe(false);
    expect(is(Number(1), "Object")).toBe(false);
    expect(is(true, "Object")).toBe(false);
    expect(is(undefined, "Null")).toBe(false);
    expect(is(null, "Undefined")).toBe(false);
    expect(is(BigInt(10), "Symbol")).toBe(false);
    expect(is(Symbol("foo"), "BigInt")).toBe(false);
    expect(is([], "Function")).toBe(false);
    expect(is({}, "Array")).toBe(false);
    expect(is(new Date(), "RegExp")).toBe(false);
    expect(is(/regex/, "Date")).toBe(false);
    expect(is(new Map(), "Set")).toBe(false);
    expect(is(new Set(), "Map")).toBe(false);
  });

  it("如果没有提供类型参数，应该返回正确的类型", () => {
    expect(is("hello")).toBe("string");
    expect(is(42)).toBe("number");
    expect(is(true)).toBe("boolean");
    expect(is(undefined)).toBe("undefined");
    expect(is(null)).toBe("null");
    expect(is(BigInt(10))).toBe("bigint");
    expect(is(Symbol("foo"))).toBe("symbol");
    expect(is([])).toBe("array");
    expect(is({})).toBe("object");
    expect(is(new Date())).toBe("date");
    expect(is(new Number(1))).toBe("[object Number]");
    expect(is(new String('222'))).toBe("[object String]");
    expect(is(/regex/)).toBe("regexp");
    expect(is(new Map())).toBe("map");
    expect(is(new Set())).toBe("set");
    expect(is(() => {})).toBe("function");
  });

  it("使用is内对应的方法判断返回true", () => {
    expect(is.String("hello")).toBe(true);
    expect(is.Number(42)).toBe(true);
    expect(is.Boolean(true)).toBe(true);
    expect(is.Null(null)).toBe(true);
    expect(is.Undefined(undefined)).toBe(true);
    expect(is.BigInt(10n)).toBe(true);
    expect(is.Symbol(Symbol("foo"))).toBe(true);
    expect(is.Array([])).toBe(true);
    expect(is.Object({})).toBe(true);
    expect(is.Date(new Date())).toBe(true);
    expect(is.Object(new Number(1))).toBe(true);
    expect(is.Object(new String('222'))).toBe(true);
    expect(is.RegExp(/regex/)).toBe(true);
    expect(is.Map(new Map())).toBe(true);
    expect(is.Set(new Set())).toBe(true);
    expect(is.Function(() => {})).toBe(true);
  });
  it("使用is内错误的方法判断返回false", () => {
    expect(is.String("hello")).toBe(true);
    expect(is.Number(42)).toBe(true);
    expect(is.Boolean(true)).toBe(true);
    expect(is.Null(undefined)).toBe(true);
    expect(is.Undefined(null)).toBe(true);
    expect(is.BigInt(10n)).toBe(true);
    expect(is.Symbol(Symbol("foo"))).toBe(true);
    expect(is.Array([])).toBe(true);
    expect(is.Object({})).toBe(true);
    expect(is.Date(new Date())).toBe(true);
    expect(is.Object(new Number(1))).toBe(true);
    expect(is.Object(new String('222'))).toBe(true);
    expect(is.RegExp(/regex/)).toBe(true);
    expect(is.Map(new Map())).toBe(true);
    expect(is.Set(new Set())).toBe(true);
    expect(is.Function(() => {})).toBe(true);
  });
});