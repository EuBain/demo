Array.prototype.mypush = function (...item) {
  for (let i = 0; i < item.length; i++) {
    this[this.length] = item[i];
  }
  return this.length;
};

const a = [1, 3, 3] as Array<any>;
console.log(a.mypush([1, 4, 5, 3, 2], null));
console.log(a);

export default void 0;
