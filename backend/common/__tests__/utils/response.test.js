"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../src/index");
describe('API Response Utilities', () => {
    it('should return 200 OK response with correct data', () => {
        const response = (0, index_1.okResponse)({ message: 'OK' });
        expect(response).toEqual({ status: 'success', code: 200, data: { message: 'OK' } });
    });
    it('should return 201 Created response with correct data', () => {
        const response = (0, index_1.createdResponse)({ id: 1 });
        expect(response).toEqual({ status: 'success', code: 201, data: { id: 1 } });
    });
    it('should return 204 No Content response with no data', () => {
        const response = (0, index_1.noContentResponse)();
        expect(response).toEqual({ status: 'success', code: 204 });
    });
    it('should return 400 Bad Request response with correct message', () => {
        const response = (0, index_1.badRequestResponse)('Invalid input');
        expect(response).toEqual({ status: 'error', code: 400, message: 'Invalid input' });
    });
    it('should return 401 Unauthorized response with correct message', () => {
        const response = (0, index_1.unauthorizedResponse)('Unauthorized');
        expect(response).toEqual({ status: 'error', code: 401, message: 'Unauthorized' });
    });
    it('should return 403 Forbidden response with correct message', () => {
        const response = (0, index_1.forbiddenResponse)('Forbidden');
        expect(response).toEqual({ status: 'error', code: 403, message: 'Forbidden' });
    });
    it('should return 404 Not Found response with correct message', () => {
        const response = (0, index_1.notFoundResponse)('Not Found');
        expect(response).toEqual({ status: 'error', code: 404, message: 'Not Found' });
    });
    it('should return 500 Internal Server Error response with correct message', () => {
        const response = (0, index_1.internalServerErrorResponse)('Internal Server Error');
        expect(response).toEqual({ status: 'error', code: 500, message: 'Internal Server Error' });
    });
    it('should return 503 Service Unavailable response with correct message', () => {
        const response = (0, index_1.serviceUnavailableResponse)('Service Unavailable');
        expect(response).toEqual({ status: 'error', code: 503, message: 'Service Unavailable' });
    });
});
//# sourceMappingURL=response.test.js.map