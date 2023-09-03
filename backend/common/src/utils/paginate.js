"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = void 0;
const paginate = (page, limit) => {
    page = Math.max(1, page);
    limit = Math.max(0, limit);
    const offset = (page - 1) * limit;
    return {
        offset,
        limit,
    };
};
exports.paginate = paginate;
//# sourceMappingURL=paginate.js.map