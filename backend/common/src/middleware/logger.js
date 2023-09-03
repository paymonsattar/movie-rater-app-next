"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
console.log('winston', winston_1.default);
exports.logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston_1.default.transports.File({ filename: 'error.log', level: 'error' }),
        new winston_1.default.transports.File({ filename: 'combined.log' }),
    ],
});
if (process.env.NODE_ENV !== 'production') {
    exports.logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.simple(),
    }));
}
const requestLogger = (req, res, next) => {
    exports.logger.info(`Request: ${req.method} ${req.path}, Headers: ${JSON.stringify(req.headers)}, Body: ${JSON.stringify(req.body)}, Query: ${JSON.stringify(req.query)}`);
    if (res.locals && res.locals.errorMessage) {
        exports.logger.error(`Error: ${res.locals.errorMessage}`);
    }
    res.on('finish', () => {
        exports.logger.info(`Response: ${res.statusCode} ${res.statusMessage}; ${res.get('Content-Length') || 0}b sent`);
    });
    next();
};
exports.requestLogger = requestLogger;
//# sourceMappingURL=logger.js.map