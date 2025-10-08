import type { MeasureType, ValueType } from './global.js';

// Interfaces

interface MeasureProps {
  type?: MeasureType;
}

interface CountObject {
  [key: string]: number;
}

// Main class

class Measure {
  type: MeasureType;
  recordings: Array<number>;

  constructor(props: MeasureProps = {}) {
    this.type = props.type || 'sample';
    this.recordings = []; // This is good for in-memory storage, and when data sizes are small. Perhaps in future a database option would be good, like sqlite as a starter.
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
    if (this.recordings.length === 0) return null;
    const count: number = this.recordings.length;
    const sumFunction = (total: number, recording: number) => total + recording;
    const sum: number = this.recordings.reduce(sumFunction, 0);
    return sum / count;
  }

  /*
    Calculates the median value of the recordings,
    or returns null if there are no recordings
  */
  median(): null | number {
    const length: number = this.recordings.length;
    if (length === 0) return null;
    const sortFunction = (a: number, b: number) => a - b;
    // Sort the recording in numerical order
    const orderedRecordings: Array<number> = this.recordings.sort(sortFunction);
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
    if (this.recordings.length === 0) return null;
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
      return Number.parseInt(countAsString);
    };
    return sortedCounts.filter(findMostCounted).map(convertToNumber);
  }

  /*
    Returns an object with keys of how many times each value has occurred
  */
  counts(): object {
    const counts: CountObject = {};

    // Loop through the recordings to count occurrences
    for (const recording of this.recordings) {
      if (!Object.prototype.hasOwnProperty.call(counts, recording)) {
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
    const deviations = this.recordings.map((recording: number) => {
      const deviation = recording - mean;
      return deviation * deviation;
    });
    const sumFunction = (total: number, recording: number) => total + recording;
    const sumOfDeviations = deviations.reduce(sumFunction, 0);
    const divisor =
      this.type === 'population'
        ? this.recordings.length
        : this.recordings.length - 1;
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
    if (this.recordings.length === 0) return null;
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
    if (this.recordings.length === 0) return [];
    const result: number[] = [];
    const n = this.recordings.length;
    const w = windowSize && windowSize > 0 ? windowSize : n;
    for (let i = 0; i < n; i++) {
      const start = Math.max(0, i - w + 1);
      const window = this.recordings.slice(start, i + 1);
      const sum = window.reduce((acc, val) => acc + val, 0);
      result.push(sum / window.length);
    }
    return result;
  }
}

export default Measure;
