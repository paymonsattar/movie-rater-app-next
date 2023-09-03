"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../src/index");
describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
        expect((0, index_1.isValidEmail)('test@example.com')).toBe(true);
        expect((0, index_1.isValidEmail)('test.user+regex@example.com')).toBe(true);
        expect((0, index_1.isValidEmail)('user.name@example.co.uk')).toBe(true);
    });
    it('should return false for invalid email addresses', () => {
        expect((0, index_1.isValidEmail)('test')).toBe(false);
        expect((0, index_1.isValidEmail)('test@')).toBe(false);
        expect((0, index_1.isValidEmail)('test@example')).toBe(false);
        expect((0, index_1.isValidEmail)('test.example.com')).toBe(false);
    });
});
//# sourceMappingURL=validate.test.js.map