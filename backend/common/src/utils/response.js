"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceUnavailableResponse = exports.internalServerErrorResponse = exports.notFoundResponse = exports.forbiddenResponse = exports.unauthorizedResponse = exports.badRequestResponse = exports.noContentResponse = exports.createdResponse = exports.okResponse = void 0;
const okResponse = (data) => {
    return {
        status: 'success',
        code: 200,
        data,
    };
};
exports.okResponse = okResponse;
const createdResponse = (data) => {
    return {
        status: 'success',
        code: 201,
        data,
    };
};
exports.createdResponse = createdResponse;
const noContentResponse = () => {
    return {
        status: 'success',
        code: 204,
    };
};
exports.noContentResponse = noContentResponse;
const badRequestResponse = (message) => {
    return {
        status: 'error',
        code: 400,
        message,
    };
};
exports.badRequestResponse = badRequestResponse;
const unauthorizedResponse = (message) => {
    return {
        status: 'error',
        code: 401,
        message,
    };
};
exports.unauthorizedResponse = unauthorizedResponse;
const forbiddenResponse = (message) => {
    return {
        status: 'error',
        code: 403,
        message,
    };
};
exports.forbiddenResponse = forbiddenResponse;
const notFoundResponse = (message) => {
    return {
        status: 'error',
        code: 404,
        message,
    };
};
exports.notFoundResponse = notFoundResponse;
const internalServerErrorResponse = (message) => {
    return {
        status: 'error',
        code: 500,
        message,
    };
};
exports.internalServerErrorResponse = internalServerErrorResponse;
const serviceUnavailableResponse = (message) => {
    return {
        status: 'error',
        code: 503,
        message,
    };
};
exports.serviceUnavailableResponse = serviceUnavailableResponse;
//# sourceMappingURL=response.js.map