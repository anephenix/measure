import type {
  DateUnit,
  MeasureType,
  Target,
  TargetOperator,
  TargetStatus,
  ValueType,
} from './global.js';

// Interfaces

interface MeasureProps {
  type?: MeasureType;
  target?: Target;
}

interface CountObject {
  [key: string]: number;
}

// Main class

class Measure {
  type: MeasureType;
  recordings: Array<number | Date>;
  target: Target | undefined;

  constructor(props: MeasureProps = {}) {
    this.type = props.type || 'sample';
    this.recordings = []; // This is good for in-memory storage, and when data sizes are small. Perhaps in future a database option would be good, like sqlite as a starter.
    this.target = props.target;
  }

  // Throws if this instance is configured for date recordings
  private get numericRecordings(): number[] {
    if (this.type === 'date') {
      throw new Error(
        'This method cannot be called on a date Measure instance'
      );
    }
    return this.recordings as number[];
  }

  // Adds the recording to the list of recordings
  record(valueOrValues: ValueType): void {
    if (Array.isArray(valueOrValues)) {
      this.recordings.push(...valueOrValues);
    } else {
      this.recordings.push(valueOrValues);
    }
  }

  /*
    Calculates the mean average of the recordings,
    or returns null if there are no recordings
  */
  mean(): null | number {
    if (this.numericRecordings.length === 0) return null;
    const count: number = this.numericRecordings.length;
    const sumFunction = (total: number, recording: number) => total + recording;
    const sum: number = this.numericRecordings.reduce(sumFunction, 0);
    return sum / count;
  }

  /*
    Calculates the median value of the recordings,
    or returns null if there are no recordings
  */
  median(): null | number {
    const length: number = this.numericRecordings.length;
    if (length === 0) return null;
    const sortFunction = (a: number, b: number) => a - b;
    // Sort the recording in numerical order
    const orderedRecordings: Array<number> =
      this.numericRecordings.sort(sortFunction);
    // If an even number, calculate the average of the 2 middle numbers
    if (length % 2 === 0) {
      const firstNumber: number = orderedRecordings[length / 2 - 1];
      const secondNumber: number = orderedRecordings[length / 2];
      return (firstNumber + secondNumber) / 2;
    }
    // or return the middle number of the sorted recordings
    return orderedRecordings[Math.floor(length / 2)];
  }

  /*
    Calculates the modal value of the recordings (there could be one or more),
    or returns null if there are no recordings
  */
  mode(): null | Array<number> {
    if (this.numericRecordings.length === 0) return null;
    // Used to count how many times each number occurs.
    const counts = this.counts();

    // Sort the counts by their occurrence
    const sortFunction = (a: [string, number], b: [string, number]) => {
      return a[1] - b[1];
    };
    const sortedCounts = Object.entries(counts).sort(sortFunction);
    const numberOfKeys = Object.keys(sortedCounts).length - 1;
    const occurrence = sortedCounts[numberOfKeys][1];
    const findMostCounted = (a: [string, number]) => a[1] === occurrence;
    const convertToNumber = (a: [string, number]) => {
      const countAsString: string = a[0];
      return Number.parseInt(countAsString, 10);
    };
    return sortedCounts.filter(findMostCounted).map(convertToNumber);
  }

  /*
    Returns an object with keys of how many times each value has occurred
  */
  counts(): object {
    const counts: CountObject = {};

    // Loop through the recordings to count occurrences
    for (const recording of this.numericRecordings) {
      if (!Object.hasOwn(counts, recording)) {
        // Note the first occurrence
        counts[recording] = 1;
      } else {
        // Note the next occurrence
        counts[recording]++;
      }
    }
    return counts;
  }

  variance(): null | number {
    const mean: null | number = this.mean();
    if (mean === null) return null;
    const deviations = this.numericRecordings.map((recording: number) => {
      const deviation = recording - mean;
      return deviation * deviation;
    });
    const sumFunction = (total: number, recording: number) => total + recording;
    const sumOfDeviations = deviations.reduce(sumFunction, 0);
    const divisor =
      this.type === 'population'
        ? this.numericRecordings.length
        : this.numericRecordings.length - 1;
    return sumOfDeviations / divisor;
  }

  /*
    Returns the standard deviation of the recordings
  */
  stdev(): null | number {
    const variance: null | number = this.variance();
    if (variance === null) return null;
    return Math.sqrt(variance);
  }

  /*
    Returns the standard score of a value
  */
  zscore(value: number): null | number {
    if (this.numericRecordings.length === 0) return null;
    const mean = this.mean();
    const stdev = this.stdev();
    if (!mean || !stdev) return null;
    return (value - mean) / stdev;
  }

  /*
    Returns an array of simple moving averages for the recordings.
    The window size defaults to the full length of the recordings (cumulative average).
    If there are no recordings, returns an empty array.
    If windowSize is provided, calculates the moving average for that window.
  */
  simpleMovingAverage(windowSize?: number): number[] {
    if (this.numericRecordings.length === 0) return [];
    const result: number[] = [];
    const n = this.numericRecordings.length;
    const w = windowSize && windowSize > 0 ? windowSize : n;
    for (let i = 0; i < n; i++) {
      const start = Math.max(0, i - w + 1);
      const window = this.numericRecordings.slice(start, i + 1);
      const sum = window.reduce((acc, val) => acc + val, 0);
      result.push(sum / window.length);
    }
    return result;
  }

  /*
    Returns an object counting how many recordings fall into each value
    of the given date unit (year, month, date, dayOfWeek, hour, minute,
    second, or millisecond). Only Date recordings are counted.
    Returns null if there are no Date recordings.
  */
  countBy(unit: DateUnit): null | CountObject {
    const dateRecordings = this.recordings.filter(
      (r): r is Date => r instanceof Date
    );
    if (dateRecordings.length === 0) return null;
    const counts: CountObject = {};
    for (const date of dateRecordings) {
      let key: number;
      switch (unit) {
        case 'year':
          key = date.getFullYear();
          break;
        case 'month':
          key = date.getMonth();
          break;
        case 'date':
          key = date.getDate();
          break;
        case 'dayOfWeek':
          key = date.getDay();
          break;
        case 'hour':
          key = date.getHours();
          break;
        case 'minute':
          key = date.getMinutes();
          break;
        case 'second':
          key = date.getSeconds();
          break;
        case 'millisecond':
          key = date.getMilliseconds();
          break;
      }
      const k = String(key);
      counts[k] = (counts[k] ?? 0) + 1;
    }
    return counts;
  }

  private compareValue(
    actual: number,
    operator: TargetOperator,
    value: number
  ): boolean {
    switch (operator) {
      case '>':
        return actual > value;
      case '<':
        return actual < value;
      case '>=':
        return actual >= value;
      case '<=':
        return actual <= value;
      case '=':
        return actual === value;
    }
  }

  private getActual(): number | number[] | null {
    if (!this.target) throw new Error('No target defined');
    const { stat, input } = this.target;
    switch (stat) {
      case 'mean':
        return this.mean();
      case 'median':
        return this.median();
      case 'mode':
        return this.mode();
      case 'variance':
        return this.variance();
      case 'stdev':
        return this.stdev();
      case 'zscore': {
        if (input === undefined)
          throw new Error('Target with stat "zscore" requires an input value');
        return this.zscore(input);
      }
    }
  }

  targetAchieved(): boolean | null {
    if (!this.target) throw new Error('No target defined');
    const { operator, value } = this.target;
    const actual = this.getActual();
    if (actual === null) return null;
    if (Array.isArray(actual)) {
      if (operator === '=') return actual.includes(value);
      return actual.every((v) => this.compareValue(v, operator, value));
    }
    return this.compareValue(actual, operator, value);
  }

  targetStatus(): TargetStatus {
    if (!this.target) throw new Error('No target defined');
    const actual = this.getActual();
    const achieved = actual === null ? null : this.targetAchieved();
    return { target: this.target, actual, achieved };
  }
}

export default Measure;
