import moment from 'moment';
import {
  formatDate,
  parseDate,
  diffInDays,
  addDays,
  isValidDate,
  toUnixTimestamp
} from '../../src/index'; // Replace the import path with the actual path to your data.ts file

describe('formatDate', () => {
  it('should correctly format a Date object into a string', () => {
    const date = new Date('2021-09-03T00:00:00Z');
    expect(formatDate(date)).toBe('2021-09-03');
  });
});

describe('parseDate', () => {
  it('should correctly parse a date string into a Date object', () => {
    const dateString = '2021-09-03';
    const date = parseDate(dateString);
    expect(date.toISOString()).toBe('2021-09-03T00:00:00.000Z');
  });
});

describe('diffInDays', () => {
  it('should correctly calculate the difference between two dates', () => {
    const date1 = new Date('2021-09-03T00:00:00Z');
    const date2 = new Date('2021-09-01T00:00:00Z');
    expect(diffInDays(date1, date2)).toBe(2);
  });
});

describe('addDays', () => {
  it('should correctly add days to a given date', () => {
    const date = new Date('2021-09-03T00:00:00Z');
    const newDate = addDays(date, 2);
    expect(newDate.toISOString()).toBe('2021-09-05T00:00:00.000Z');
  });
});

describe('isValidDate', () => {
  it('should correctly validate a date string', () => {
    expect(isValidDate('2021-09-03')).toBe(true);
    expect(isValidDate('invalid-date')).toBe(false);
  });
});

describe('toUnixTimestamp', () => {
  it('should correctly convert a Date object to a Unix timestamp', () => {
    const date = new Date('2021-09-03T00:00:00Z');
    const timestamp = moment(date).unix();
    expect(toUnixTimestamp(date)).toBe(timestamp);
  });
});
