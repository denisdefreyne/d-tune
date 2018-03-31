export function uniq<T>(arr: Array<T>): Array<T> {
  return arr.filter((elem, index) => arr.indexOf(elem) === index)
}

export function isNotUndefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

interface HasName {
  name: string;
}

export function byName(a: HasName, b: HasName) {
  return a.name.localeCompare(b.name)
}
