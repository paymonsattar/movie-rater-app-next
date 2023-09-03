"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const index_1 = require("../../src/index");
describe('formatDate', () => {
    it('should correctly format a Date object into a string', () => {
        const date = new Date('2021-09-03T00:00:00Z');
        expect((0, index_1.formatDate)(date)).toBe('2021-09-03');
    });
});
describe('parseDate', () => {
    it('should correctly parse a date string into a Date object', () => {
        const dateString = '2021-09-03';
        const date = (0, index_1.parseDate)(dateString);
        expect(date.toISOString()).toBe('2021-09-03T00:00:00.000Z');
    });
});
describe('diffInDays', () => {
    it('should correctly calculate the difference between two dates', () => {
        const date1 = new Date('2021-09-03T00:00:00Z');
        const date2 = new Date('2021-09-01T00:00:00Z');
        expect((0, index_1.diffInDays)(date1, date2)).toBe(2);
    });
});
describe('addDays', () => {
    it('should correctly add days to a given date', () => {
        const date = new Date('2021-09-03T00:00:00Z');
        const newDate = (0, index_1.addDays)(date, 2);
        expect(newDate.toISOString()).toBe('2021-09-05T00:00:00.000Z');
    });
});
describe('isValidDate', () => {
    it('should correctly validate a date string', () => {
        expect((0, index_1.isValidDate)('2021-09-03')).toBe(true);
        expect((0, index_1.isValidDate)('invalid-date')).toBe(false);
    });
});
describe('toUnixTimestamp', () => {
    it('should correctly convert a Date object to a Unix timestamp', () => {
        const date = new Date('2021-09-03T00:00:00Z');
        const timestamp = (0, moment_1.default)(date).unix();
        expect((0, index_1.toUnixTimestamp)(date)).toBe(timestamp);
    });
});
//# sourceMappingURL=date.test.js.map