import { _new } from "../new";

describe("_new", () => {
  function Person(this: any,  name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  it("should create a new object with the correct prototype", () => {
    const obj = _new(Person)("John", 25);
    expect(Object.getPrototypeOf(obj)).toBe(Person.prototype);
  });

  it("should set the constructor's properties on the new object", () => {
    const obj = _new(Person)("John", 25);
    expect(obj.name).toBe("John");
    expect(obj.age).toBe(25);
  });

  it("should return the new object if the constructor does not return an object", () => {
    const obj = _new(Person)("John", 25);
    expect(obj instanceof Person).toBe(true);
  });

  it("should return the object returned by the constructor if it is an object", () => {
    function CustomObject() {
      return { custom: true };
    }
    const obj = _new(CustomObject)();
    expect(obj.custom).toBe(true);
  });
});