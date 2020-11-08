import { IUtils } from '@date-io/core/IUtils';
import DateFndUtils from '@date-io/date-fns';
import { format } from 'date-fns';

export class LocalizeUtils extends DateFndUtils implements IUtils<Date> {
  //getMeridiemText(ampm: "am" | "pm"): string;
  getCalendarHeaderText(date: Date) {
    return format(date, 'yyyy年M月');
  }
  getDatePickerHeaderText(date: Date) {
    return format(date, 'M月d日');
  }
  //getDateTimePickerHeaderText(date: Date): string;
  // getMonthText(date: Date) {
  //   return format(date, 'M月');
  // }
  // getDayText(date: Date) {
  //   return format(date, 'd日');
  // }
  //getHourText(date: Date, ampm: boolean): string;
  //getMinuteText(date: Date): string;
  //getSecondText(date: Date): string;
  // getYearText(date: Date) {
  //   return format(date, 'yyyy年');
  // }
}
