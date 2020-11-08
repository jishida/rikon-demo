export type Couple = 'hasband' | 'wife';
export const hasband = 'hasband' as Couple;
export const wife = 'wife' as Couple;
export const opponents = {
  hasband: wife,
  wife: hasband,
};
export const coupleTitles = new Map<Couple, string>()
  .set(hasband, '夫')
  .set(wife, '妻');
export const abbrevs = [
  '甲',
  '乙',
  '丙',
  '丁',
  '戌',
  '己',
  '庚',
  '辛',
  '壬',
  '癸',
];
export const UINT_MAX_VALUE = 999999999999;
export const ACTIVE_COLOR = 'primary.main';
export const INACTIVE_COLOR = 'grey.700';
export const LABEL_WIDTH = 80;

export const DEFAULT_SUBMISSION_DESTINATION = '〇〇市役所';
export const DEFAULT_MEETING_LIMIT = '月に1回、2時間以内';
export const DEFAULT_NEGOTIATION_LIMIT = '3ヶ月に一回、宿泊を伴う';
