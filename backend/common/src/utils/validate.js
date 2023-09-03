"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidEmail = void 0;
const isValidEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
};
exports.isValidEmail = isValidEmail;
//# sourceMappingURL=validate.js.map