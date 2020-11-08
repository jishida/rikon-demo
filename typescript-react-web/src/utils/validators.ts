export function nonEmpty(v: any) {
  if (!v) {
    throw new Error('必須項目です。');
  }
  return true;
}
