export type MeasureType = 'sample' | 'population' | 'date';
export type ValueType = number | Date | Array<number | Date>;
export type DateUnit =
  | 'year'
  | 'month'
  | 'date'
  | 'dayOfWeek'
  | 'hour'
  | 'minute'
  | 'second'
  | 'millisecond';
