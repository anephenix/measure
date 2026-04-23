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

export type TargetStat =
  | 'mean'
  | 'median'
  | 'mode'
  | 'variance'
  | 'stdev'
  | 'zscore';
export type TargetOperator = '>' | '<' | '>=' | '<=' | '=';

export interface Target {
  stat: TargetStat;
  operator: TargetOperator;
  value: number;
  input?: number; // required when stat is 'zscore'
}

export interface TargetStatus {
  target: Target;
  actual: number | number[] | null;
  achieved: boolean | null;
}
