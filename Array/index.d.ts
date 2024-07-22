interface Array<T> {
  myforEach: (fn: (item?: T, index?: number, arr?: T[]) => void) => void;

  mypush: (...item:T[]) => number
}