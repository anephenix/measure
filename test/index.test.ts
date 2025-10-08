import Measure from "../src";
import { describe, it, expect } from "vitest";

describe("Measure", () => {
	describe("#record", () => {
		it("should add the entry to the recordings array", () => {
			const measure = new Measure();
			measure.record(4);
			expect(measure.recordings).toEqual([4]);
		});

		describe("when the value is an array", () => {
			it("should add all of the items in the array to the recordings", () => {
				const measure = new Measure();
				measure.record([4, 5, 6]);
				expect(measure.recordings).toEqual([4, 5, 6]);
			});
		});
	});

	describe("#mean", () => {
		describe("when there are no recordings yet", () => {
			it("should return null", () => {
				const measure = new Measure();
				expect(measure.mean()).toBeNull();
			});
		});

		describe("when there are recordings", () => {
			it("should return the average value of the recordings", () => {
				const measure = new Measure();
				const values = [1, 2, 3, 4];
				for (const v of values) {
					measure.record(v);
				}
				expect(measure.mean()).toBe(2.5);
			});
		});
	});

	describe("#median", () => {
		describe("when there are no recordings yet", () => {
			it("should return null", () => {
				const measure = new Measure();
				expect(measure.median()).toBeNull();
			});
		});

		describe("when there are an even number of recordings", () => {
			it("should return the average value of the 2 middle recordings", () => {
				const measure = new Measure();
				const values = [1, 2, 3, 4, 5, 6];
				for (const v of values) {
					measure.record(v);
				}
				expect(measure.median()).toBe(3.5);
			});
		});

		describe("when there are an odd number of recordings", () => {
			it("should return the median value of the recordings", () => {
				const measure = new Measure();
				const values = [1, 2, 3, 4, 5, 6, 7];
				for (const v of values) {
					measure.record(v);
				}
				expect(measure.median()).toBe(4);
			});
		});
	});

	describe("#mode", () => {
		describe("when there are no recordings yet", () => {
			it("should return null", () => {
				const measure = new Measure();
				expect(measure.mode()).toBeNull();
			});
		});

		describe("when there are an equal occurrence of 2 or more recordings", () => {
			it("should return an array of those 2 recordings", () => {
				const measure = new Measure();
				const values = [1, 2, 2, 3, 3, 4, 5];
				for (const v of values) {
					measure.record(v);
				}
				expect(measure.mode()).toEqual([2, 3]);
			});
		});

		describe("when there is only one recording that occurs the most", () => {
			it("should return an array with just that one recording", () => {
				const measure = new Measure();
				const values = [1, 2, 2, 3, 3, 3, 4, 5];
				for (const v of values) {
					measure.record(v);
				}
				expect(measure.mode()).toEqual([3]);
			});
		});
	});

	describe("#counts", () => {
		it("should return an object with occurrences counts for the values", () => {
			const measure = new Measure();
			const values = [1, 2, 2, 3, 3, 3, 4, 5];
			for (const v of values) {
				measure.record(v);
			}
			expect(measure.counts()).toEqual({
				"1": 1,
				"2": 2,
				"3": 3,
				"4": 1,
				"5": 1,
			});
		});
	});

	describe("#variance", () => {
		describe("when there are no recordings yet", () => {
			it("should return null", () => {
				const measure = new Measure();
				expect(measure.variance()).toBeNull();
			});
		});

		describe("when there are recordings", () => {
			it("should return the sample variance of the recordings", () => {
				const measure = new Measure();
				const values = [1, 2, 2, 3, 3, 3, 4, 5];
				for (const v of values) {
					measure.record(v);
				}
				expect(measure.variance()).toBe(1.5535714285714286);
			});
		});

		describe("when the recordings are the population instead of a sample of measures", () => {
			it("should return the population variance", () => {
				const measure = new Measure({ type: "population" });
				const values = [1, 2, 2, 3, 3, 3, 4, 5];
				for (const v of values) {
					measure.record(v);
				}
				expect(measure.variance()).toBe(1.359375);
			});
		});
	});

	describe("#stdev", () => {
		describe("when there are no recordings yet", () => {
			it("should return null", () => {
				const measure = new Measure();
				expect(measure.stdev()).toBeNull();
			});
		});

		describe("when there are recordings", () => {
			it("should return the sample standard deviation of the recordings", () => {
				const measure = new Measure();
				const values = [1, 2, 2, 3, 3, 3, 4, 5];
				for (const v of values) {
					measure.record(v);
				}
				expect(measure.stdev()).toBe(1.246423454758225);
			});
		});

		describe("when the recordings are a population instead of the population of measures", () => {
			it("should return the population standard deviation", () => {
				const measure = new Measure({ type: "population" });
				const values = [1, 2, 2, 3, 3, 3, 4, 5];
				for (const v of values) {
					measure.record(v);
				}
				expect(measure.stdev()).toBe(1.165922381636102);
			});
		});
	});

	describe("#zscore", () => {
		describe("when there are no recordings yet", () => {
			it("should return null", () => {
				const measure = new Measure();
				expect(measure.zscore(5)).toBeNull();
			});
		});

		describe("when there are recordings", () => {
			it("should return the z-score for a value", () => {
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

	describe("#simpleMovingAverage", () => {
		it("should return an empty array when there are no recordings", () => {
			const measure = new Measure();
			expect(measure.simpleMovingAverage()).toEqual([]);
		});

		it("should return the cumulative moving average by default", () => {
			const measure = new Measure();
			for (const v of [2, 4, 6, 8]) {
				measure.record(v);
			}
			// Cumulative averages: [2, 3, 4, 5]
			expect(measure.simpleMovingAverage()).toEqual([2, 3, 4, 5]);
		});

		it("should return the simple moving average for a given window size", () => {
			const measure = new Measure();
			for (const v of [1, 2, 3, 4, 5]) {
				measure.record(v);
			}
			// Window size 3: [1, 1.5, 2, 3, 4]
			expect(measure.simpleMovingAverage(3)).toEqual([1, 1.5, 2, 3, 4]);
		});

		it("should handle window size larger than the number of recordings", () => {
			const measure = new Measure();
			for (const v of [10, 20]) {
				measure.record(v);
			}
			expect(measure.simpleMovingAverage(5)).toEqual([10, 15]);
		});
	});
});
