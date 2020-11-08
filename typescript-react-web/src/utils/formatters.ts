import { number2kanji } from '@geolonia/japanese-numeral';
import { format } from 'date-fns';

export function formatMonth(month: Date) {
  return format(month, 'y年M月');
}

export function formatDate(date: Date) {
  return format(date, 'y年M月d日');
}

export function formatAmount(n: number) {
  return number2kanji(n);
}

export function formatJoin(strs: string[]) {
  let r = '';
  for (let i = 0; i < strs.length; i++) {
    if (i !== 0) {
      r += '、';
      if (i === strs.length - 1) {
        r += '及び';
      }
    }
    r += strs[i];
  }
  return r;
}
