import moment from 'moment';

// 👇️ Used to format dates into a standardized string representation.
// Useful for ensuring date consistency across various parts of the application.
export const formatDate = (date: Date, format: 'YYYY-MM-DD'): string => {
  return moment(date).format(format);
};

// 👇️ Used to parse a date string into a Date object.
// Useful for converting client-provided date strings into Date objects that can be used in the application.
export const parseDate = (dateString: string, format: 'YYYY-MM-DD'): Date => {
  return moment.utc(dateString, format).toDate();
};

// 👇️ Used to calculate the difference between two dates in days.
// Useful for features that require age calculations, such as analytics or reporting.
export const diffInDays = (date1: Date, date2: Date): number => {
  return moment(date1).diff(moment(date2), 'days');
};

// 👇️ Used to add or subtract days from a given date.
// Useful for features that require date manipulation, such as scheduling or reminders.
export const addDays = (date: Date, days: number): Date => {
  return moment(date).add(days, 'days').toDate();
};

// 👇️ Used to validate if a given date string is valid according to a specific format.
// Useful for validating client-provided date strings before further processing.
export const isValidDate = (dateString: string, format: 'YYYY-MM-DD'): boolean => {
  return moment(dateString, format, true).isValid();
};

// 👇️ Used to convert a Date object to a Unix timestamp.
// Useful for systems that require time-based sorting or filtering.
export const toUnixTimestamp = (date: Date): number => {
  return moment(date).unix();
};
