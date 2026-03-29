import { describe, expect, it } from 'vitest';
import Measure from '../src';

describe('Measure', () => {
  describe('#record', () => {
    it('should add the entry to the recordings array', () => {
      const measure = new Measure();
      measure.record(4);
      expect(measure.recordings).toEqual([4]);
    });

    describe('when the value is an array', () => {
      it('should add all of the items in the array to the recordings', () => {
        const measure = new Measure();
        measure.record([4, 5, 6]);
        expect(measure.recordings).toEqual([4, 5, 6]);
      });
    });
  });

  describe('#mean', () => {
    describe('when the type is date', () => {
      it('should throw an error', () => {
        const measure = new Measure({ type: 'date' });
        expect(() => measure.mean()).toThrow(
          'This method cannot be called on a date Measure instance'
        );
      });
    });

    describe('when there are no recordings yet', () => {
      it('should return null', () => {
        const measure = new Measure();
        expect(measure.mean()).toBeNull();
      });
    });

    describe('when there are recordings', () => {
      it('should return the average value of the recordings', () => {
        const measure = new Measure();
        const values = [1, 2, 3, 4];
        for (const v of values) {
          measure.record(v);
        }
        expect(measure.mean()).toBe(2.5);
      });
    });
  });

  describe('#median', () => {
    describe('when the type is date', () => {
      it('should throw an error', () => {
        const measure = new Measure({ type: 'date' });
        expect(() => measure.median()).toThrow(
          'This method cannot be called on a date Measure instance'
        );
      });
    });

    describe('when there are no recordings yet', () => {
      it('should return null', () => {
        const measure = new Measure();
        expect(measure.median()).toBeNull();
      });
    });

    describe('when there are an even number of recordings', () => {
      it('should return the average value of the 2 middle recordings', () => {
        const measure = new Measure();
        const values = [1, 2, 3, 4, 5, 6];
        for (const v of values) {
          measure.record(v);
        }
        expect(measure.median()).toBe(3.5);
      });
    });

    describe('when there are an odd number of recordings', () => {
      it('should return the median value of the recordings', () => {
        const measure = new Measure();
        const values = [1, 2, 3, 4, 5, 6, 7];
        for (const v of values) {
          measure.record(v);
        }
        expect(measure.median()).toBe(4);
      });
    });
  });

  describe('#mode', () => {
    describe('when the type is date', () => {
      it('should throw an error', () => {
        const measure = new Measure({ type: 'date' });
        expect(() => measure.mode()).toThrow(
          'This method cannot be called on a date Measure instance'
        );
      });
    });

    describe('when there are no recordings yet', () => {
      it('should return null', () => {
        const measure = new Measure();
        expect(measure.mode()).toBeNull();
      });
    });

    describe('when there are an equal occurrence of 2 or more recordings', () => {
      it('should return an array of those 2 recordings', () => {
        const measure = new Measure();
        const values = [1, 2, 2, 3, 3, 4, 5];
        for (const v of values) {
          measure.record(v);
        }
        expect(measure.mode()).toEqual([2, 3]);
      });
    });

    describe('when there is only one recording that occurs the most', () => {
      it('should return an array with just that one recording', () => {
        const measure = new Measure();
        const values = [1, 2, 2, 3, 3, 3, 4, 5];
        for (const v of values) {
          measure.record(v);
        }
        expect(measure.mode()).toEqual([3]);
      });
    });
  });

  describe('#counts', () => {
    describe('when the type is date', () => {
      it('should throw an error', () => {
        const measure = new Measure({ type: 'date' });
        expect(() => measure.counts()).toThrow(
          'This method cannot be called on a date Measure instance'
        );
      });
    });

    it('should return an object with occurrences counts for the values', () => {
      const measure = new Measure();
      const values = [1, 2, 2, 3, 3, 3, 4, 5];
      for (const v of values) {
        measure.record(v);
      }
      expect(measure.counts()).toEqual({
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 1,
        '5': 1,
      });
    });
  });

  describe('#variance', () => {
    describe('when the type is date', () => {
      it('should throw an error', () => {
        const measure = new Measure({ type: 'date' });
        expect(() => measure.variance()).toThrow(
          'This method cannot be called on a date Measure instance'
        );
      });
    });

    describe('when there are no recordings yet', () => {
      it('should return null', () => {
        const measure = new Measure();
        expect(measure.variance()).toBeNull();
      });
    });

    describe('when there are recordings', () => {
      it('should return the sample variance of the recordings', () => {
        const measure = new Measure();
        const values = [1, 2, 2, 3, 3, 3, 4, 5];
        for (const v of values) {
          measure.record(v);
        }
        expect(measure.variance()).toBe(1.5535714285714286);
      });
    });

    describe('when the recordings are the population instead of a sample of measures', () => {
      it('should return the population variance', () => {
        const measure = new Measure({ type: 'population' });
        const values = [1, 2, 2, 3, 3, 3, 4, 5];
        for (const v of values) {
          measure.record(v);
        }
        expect(measure.variance()).toBe(1.359375);
      });
    });
  });

  describe('#stdev', () => {
    describe('when the type is date', () => {
      it('should throw an error', () => {
        const measure = new Measure({ type: 'date' });
        expect(() => measure.stdev()).toThrow(
          'This method cannot be called on a date Measure instance'
        );
      });
    });

    describe('when there are no recordings yet', () => {
      it('should return null', () => {
        const measure = new Measure();
        expect(measure.stdev()).toBeNull();
      });
    });

    describe('when there are recordings', () => {
      it('should return the sample standard deviation of the recordings', () => {
        const measure = new Measure();
        const values = [1, 2, 2, 3, 3, 3, 4, 5];
        for (const v of values) {
          measure.record(v);
        }
        expect(measure.stdev()).toBe(1.246423454758225);
      });
    });

    describe('when the recordings are a population instead of the population of measures', () => {
      it('should return the population standard deviation', () => {
        const measure = new Measure({ type: 'population' });
        const values = [1, 2, 2, 3, 3, 3, 4, 5];
        for (const v of values) {
          measure.record(v);
        }
        expect(measure.stdev()).toBe(1.165922381636102);
      });
    });
  });

  describe('#zscore', () => {
    describe('when the type is date', () => {
      it('should throw an error', () => {
        const measure = new Measure({ type: 'date' });
        expect(() => measure.zscore(5)).toThrow(
          'This method cannot be called on a date Measure instance'
        );
      });
    });

    describe('when there are no recordings yet', () => {
      it('should return null', () => {
        const measure = new Measure();
        expect(measure.zscore(5)).toBeNull();
      });
    });

    describe('when there are recordings', () => {
      it('should return the z-score for a value', () => {
        const measure = new Measure();
        const values = [1, 2, 2, 3, 3, 3, 4, 5];
        for (const v of values) {
          measure.record(v);
        }
        expect(measure.zscore(4)).toBe(0.9025825017214731);
        expect(measure.zscore(1)).toBe(-1.5043041695357886);
      });
    });
  });

  describe('#simpleMovingAverage', () => {
    describe('when the type is date', () => {
      it('should throw an error', () => {
        const measure = new Measure({ type: 'date' });
        expect(() => measure.simpleMovingAverage()).toThrow(
          'This method cannot be called on a date Measure instance'
        );
      });
    });

    it('should return an empty array when there are no recordings', () => {
      const measure = new Measure();
      expect(measure.simpleMovingAverage()).toEqual([]);
    });

    it('should return the cumulative moving average by default', () => {
      const measure = new Measure();
      for (const v of [2, 4, 6, 8]) {
        measure.record(v);
      }
      // Cumulative averages: [2, 3, 4, 5]
      expect(measure.simpleMovingAverage()).toEqual([2, 3, 4, 5]);
    });

    it('should return the simple moving average for a given window size', () => {
      const measure = new Measure();
      for (const v of [1, 2, 3, 4, 5]) {
        measure.record(v);
      }
      // Window size 3: [1, 1.5, 2, 3, 4]
      expect(measure.simpleMovingAverage(3)).toEqual([1, 1.5, 2, 3, 4]);
    });

    it('should handle window size larger than the number of recordings', () => {
      const measure = new Measure();
      for (const v of [10, 20]) {
        measure.record(v);
      }
      expect(measure.simpleMovingAverage(5)).toEqual([10, 15]);
    });
  });

  describe('#countBy', () => {
    // Three dates used across all unit tests:
    // d1: 2024-01-15 10:30:45.123  (month=0, date=15, dayOfWeek=1/Mon, hour=10, min=30, sec=45, ms=123)
    // d2: 2024-03-20 14:00:00.000  (month=2, date=20, dayOfWeek=3/Wed, hour=14, min=0,  sec=0,  ms=0)
    // d3: 2025-01-15 10:45:45.123  (month=0, date=15, dayOfWeek=3/Wed, hour=10, min=45, sec=45, ms=123)
    const d1 = new Date(2024, 0, 15, 10, 30, 45, 123);
    const d2 = new Date(2024, 2, 20, 14, 0, 0, 0);
    const d3 = new Date(2025, 0, 15, 10, 45, 45, 123);

    describe('when there are no recordings', () => {
      it('should return null', () => {
        const measure = new Measure({ type: 'date' });
        expect(measure.countBy('year')).toBeNull();
      });
    });

    describe('when recordings contain no Date objects', () => {
      it('should return null', () => {
        const measure = new Measure({ type: 'date' });
        measure.record(42);
        expect(measure.countBy('year')).toBeNull();
      });
    });

    describe('when there are Date recordings', () => {
      it('should count by year', () => {
        const measure = new Measure({ type: 'date' });
        measure.record([d1, d2, d3]);
        expect(measure.countBy('year')).toEqual({ '2024': 2, '2025': 1 });
      });

      it('should count by month', () => {
        const measure = new Measure({ type: 'date' });
        measure.record([d1, d2, d3]);
        expect(measure.countBy('month')).toEqual({ '0': 2, '2': 1 });
      });

      it('should count by date', () => {
        const measure = new Measure({ type: 'date' });
        measure.record([d1, d2, d3]);
        expect(measure.countBy('date')).toEqual({ '15': 2, '20': 1 });
      });

      it('should count by day of week', () => {
        const measure = new Measure({ type: 'date' });
        measure.record([d1, d2, d3]);
        // d1 = Monday (1), d2 = Wednesday (3), d3 = Wednesday (3)
        expect(measure.countBy('dayOfWeek')).toEqual({ '1': 1, '3': 2 });
      });

      it('should count by hour', () => {
        const measure = new Measure({ type: 'date' });
        measure.record([d1, d2, d3]);
        expect(measure.countBy('hour')).toEqual({ '10': 2, '14': 1 });
      });

      it('should count by minute', () => {
        const measure = new Measure({ type: 'date' });
        measure.record([d1, d2, d3]);
        expect(measure.countBy('minute')).toEqual({ '30': 1, '0': 1, '45': 1 });
      });

      it('should count by second', () => {
        const measure = new Measure({ type: 'date' });
        measure.record([d1, d2, d3]);
        expect(measure.countBy('second')).toEqual({ '45': 2, '0': 1 });
      });

      it('should count by millisecond', () => {
        const measure = new Measure({ type: 'date' });
        measure.record([d1, d2, d3]);
        expect(measure.countBy('millisecond')).toEqual({ '123': 2, '0': 1 });
      });
    });
  });
});
