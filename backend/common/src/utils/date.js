"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUnixTimestamp = exports.isValidDate = exports.addDays = exports.diffInDays = exports.parseDate = exports.formatDate = void 0;
const moment_1 = __importDefault(require("moment"));
const formatDate = (date, format = 'YYYY-MM-DD') => {
    return (0, moment_1.default)(date).format(format);
};
exports.formatDate = formatDate;
const parseDate = (dateString, format = 'YYYY-MM-DD') => {
    return moment_1.default.utc(dateString, format).toDate();
};
exports.parseDate = parseDate;
const diffInDays = (date1, date2) => {
    return (0, moment_1.default)(date1).diff((0, moment_1.default)(date2), 'days');
};
exports.diffInDays = diffInDays;
const addDays = (date, days) => {
    return (0, moment_1.default)(date).add(days, 'days').toDate();
};
exports.addDays = addDays;
const isValidDate = (dateString, format = 'YYYY-MM-DD') => {
    return (0, moment_1.default)(dateString, format, true).isValid();
};
exports.isValidDate = isValidDate;
const toUnixTimestamp = (date) => {
    return (0, moment_1.default)(date).unix();
};
exports.toUnixTimestamp = toUnixTimestamp;
//# sourceMappingURL=date.js.map