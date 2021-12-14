import Measure from '../src';

describe('Measure', () => {

  describe('#record', () => {

    it('should add the entry to the recordings array', () => {
      const measure = new Measure();
      measure.record(4);
      expect(measure.recordings).toStrictEqual([4]);
    });

  });

  describe('#mean', () => {

    describe('when there are no recordings yet', () => {
      it('should return null', () => {
        const measure = new Measure();
        expect(measure.mean()).toEqual(null);
      });
    });

    describe('when there are recordings', () => {

      it('should return the average value of the recordings', () => {
        const measure = new Measure();
        const values = [1,2,3,4];
        values.forEach(v => measure.record(v))
        expect(measure.mean()).toEqual(2.5);
      });

    });

  });

  describe('#median', () => {

    describe('when there are no recordings yet', () => {

      it('should return null', () => {
        const measure = new Measure();
        expect(measure.median()).toEqual(null);
      });

    });

    describe('when there are an even number of recordings', () => {

      it('should return the average value of the 2 middle recordings', () => {
        const measure = new Measure();
        const values = [1,2,3,4,5,6];
        values.forEach(v => measure.record(v))
        expect(measure.median()).toEqual(3.5);
      });

    });

    describe('when there are an odd number of recordings', () => {

      it('should return the median value of the recordings', () => {
        const measure = new Measure();
        const values = [1,2,3,4,5,6,7];
        values.forEach(v => measure.record(v))
        expect(measure.median()).toEqual(4);
      });

    });

  });

  describe('#mode', () => {

    describe('when there are no recordings yet', () => {

      it('should return null', () => {
        const measure = new Measure();
        expect(measure.mode()).toEqual(null);
      });

    });

    describe('when there are an equal occurrence of 2 or more recordings', () => {

      it('should return an array of those 2 recordings', () => {
        const measure = new Measure();
        const values = [1,2,2,3,3,4,5];
        values.forEach(v => measure.record(v))
        expect(measure.mode()).toEqual([2,3]);
      });

    });

    describe('when there is only one recording that occurs the most', () => {

      it('should return an array with just that one recording', () => {
        const measure = new Measure();
        const values = [1,2,2,3,3,3,4,5];
        values.forEach(v => measure.record(v))
        expect(measure.mode()).toEqual([3]);        
      });

    });

    describe('#counts', () => {

        it('should return an object with occurrences counts for the values', () => {
          const measure = new Measure();
          const values = [1,2,2,3,3,3,4,5];
          values.forEach(v => measure.record(v))
          expect(measure.counts()).toEqual({
            '1': 1,
            '2': 2,
            '3': 3,
            '4': 1,
            '5': 1
          });
      });
  
    });

    describe('#variance', () => {

      describe('when there are no recordings yet', () => {

        it('should return null', () => {
          const measure = new Measure();
          expect(measure.variance()).toEqual(null);
        });
  
      });

      describe('when there are recordings', () => {

        it('should return the standard deviation of the recordings', () => {
          const measure = new Measure();
          const values = [1,2,2,3,3,3,4,5];
          values.forEach(v => measure.record(v))
          expect(measure.variance()).toEqual(1.359375);
        });

      });

      describe('when the recordings are a sample instead of the population of measures', () => {
        it('should return the sample variance', () => {
          const measure = new Measure();
          const values = [1,2,2,3,3,3,4,5]; // 6, 7, 8
          values.forEach(v => measure.record(v))
          expect(measure.variance('sample')).toEqual(1.5535714285714286);
        });
      });

    })

    describe('#stdev', () => {

      describe('when there are no recordings yet', () => {

        it('should return null', () => {
          const measure = new Measure();
          expect(measure.stdev()).toEqual(null);
        });
  
      });

      describe('when there are recordings', () => {

        it('should return the standard deviation of the recordings', () => {
          const measure = new Measure();
          const values = [1,2,2,3,3,3,4,5];
          values.forEach(v => measure.record(v))
          expect(measure.stdev()).toEqual(1.165922381636102);
        });

      });

      describe('when the recordings are a sample instead of the population of measures', () => {
        it('should return the sample standard deviation', () => {
          const measure = new Measure();
          const values = [1,2,2,3,3,3,4,5];
          values.forEach(v => measure.record(v))
          expect(measure.stdev('sample')).toEqual(1.246423454758225);         
        });
      });

    });

  });

});
