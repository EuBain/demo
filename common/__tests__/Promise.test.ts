import CompPromise from "../Promise";

describe("resolve", () => {
  it("should return a new CompPromise resolved with the given value", () => {
    const value = "resolved value";
    const promise = CompPromise.resolve(value);
    expect(promise).toBeInstanceOf(CompPromise);
    return promise.then((result) => {
      expect(result).toBe(value);
    });
  });

  it("should return the same CompPromise instance if the given value is already a CompPromise", () => {
    const value = new CompPromise((resolve) => {
      resolve("inner value");
    });
    const promise = CompPromise.resolve(value);
    expect(promise).toBe(value);
  });
});