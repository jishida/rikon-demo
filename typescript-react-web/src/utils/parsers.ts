export function int(v: string) {
  if (!/^(0|-?[1-9][0-9, ]*)$/.test(v)) {
    throw new Error('整数を入力してください。');
  }
  v = v.replace(/[, ]/g, '');
  return parseInt(v, 10);
}

export function uint(v: string) {
  if (!/^(0|[1-9][0-9, ]*)$/.test(v)) {
    throw new Error('整数を入力してください。');
  }
  v = v.replace(/[, ]/g, '');
  return parseInt(v, 10);
}

export function nullableInt(v: string) {
  if (v === '') {
    return null;
  }
  return int(v);
}

export function nullableUint(v: string) {
  if (v === '') {
    return null;
  }
  return uint(v);
}

function createUintParser(checker: (n: number) => void) {
  return function (v: string) {
    const n = uint(v);
    checker(n);
    return n;
  };
}

function createNullableUintParser(checker: (n: number) => void) {
  return function (v: string) {
    const n = nullableUint(v);
    if (n != null) {
      checker(n);
    }
    return n;
  };
}

function createRangeChecker(start: number, end?: number) {
  if (end == null) {
    return function (n: number) {
      if (n < start) {
        throw new Error(`${start}以上でなければいけません。`);
      }
    };
  } else {
    return function (n: number) {
      if (n < start || n > end) {
        throw new Error(`${start}以上${end}以下でなければいけません。`);
      }
    };
  }
}

export function uintRange(start: number, end?: number) {
  const checker = createRangeChecker(start, end);
  return createUintParser(checker);
}

export function nullableUintRange(start: number, end?: number) {
  const checker = createRangeChecker(start, end);
  return createNullableUintParser(checker);
}
