"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../src/index");
const winston = __importStar(require("winston"));
const winstonLogger = winston.createLogger();
const mockInfo = winstonLogger.info;
const mockError = winstonLogger.error;
const mockAdd = winstonLogger.add;
jest.mock("winston", () => {
    const winston = jest.requireActual("winston");
    return Object.assign(Object.assign({}, winston), { createLogger: jest.fn().mockReturnValue({
            info: jest.fn(),
            error: jest.fn(),
            add: jest.fn(),
        }) });
});
describe('Logger Middleware', () => {
    let mockRequest;
    let mockResponse;
    let nextFunction = jest.fn();
    beforeEach(() => {
        mockRequest = {
            method: 'GET',
            path: '/test-path',
            headers: {},
            body: {},
            query: {},
        };
        mockResponse = {
            locals: {},
            status: jest.fn().mockReturnValue({}),
            json: jest.fn().mockReturnValue({}),
            on: jest.fn(),
            get: jest.fn(),
        };
    });
    it('should correctly log incoming requests', () => {
        (0, index_1.requestLogger)(mockRequest, mockResponse, nextFunction);
        expect(mockInfo).toHaveBeenCalledWith(expect.stringContaining('Request: GET /test-path'));
        expect(nextFunction).toHaveBeenCalled();
    });
    it('should correctly log outgoing responses', () => {
        (0, index_1.requestLogger)(mockRequest, mockResponse, nextFunction);
        mockResponse.on.mock.calls[0][1]();
        expect(mockInfo).toHaveBeenCalledWith(expect.stringContaining('Response:'));
        expect(nextFunction).toHaveBeenCalled();
    });
    it('should correctly log errors', () => {
        const errorMessage = 'Some error';
        mockResponse.locals.errorMessage = errorMessage;
        (0, index_1.requestLogger)(mockRequest, mockResponse, nextFunction);
        expect(mockError).toHaveBeenCalledWith(expect.stringContaining(errorMessage));
        expect(nextFunction).toHaveBeenCalled();
    });
});
//# sourceMappingURL=logger.test.js.map