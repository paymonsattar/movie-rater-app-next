import {
  okResponse,
  createdResponse,
  noContentResponse,
  badRequestResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  internalServerErrorResponse,
  serviceUnavailableResponse,
} from '../../src/index';

describe('API Response Utilities', () => {
  it('should return 200 OK response with correct data', () => {
    const response = okResponse({ message: 'OK' });
    expect(response).toEqual({ status: 'success', code: 200, data: { message: 'OK' } });
  });

  it('should return 201 Created response with correct data', () => {
    const response = createdResponse({ id: 1 });
    expect(response).toEqual({ status: 'success', code: 201, data: { id: 1 } });
  });

  it('should return 204 No Content response with no data', () => {
    const response = noContentResponse();
    expect(response).toEqual({ status: 'success', code: 204 });
  });

  it('should return 400 Bad Request response with correct message', () => {
    const response = badRequestResponse('Invalid input');
    expect(response).toEqual({ status: 'error', code: 400, message: 'Invalid input' });
  });

  it('should return 401 Unauthorized response with correct message', () => {
    const response = unauthorizedResponse('Unauthorized');
    expect(response).toEqual({ status: 'error', code: 401, message: 'Unauthorized' });
  });

  it('should return 403 Forbidden response with correct message', () => {
    const response = forbiddenResponse('Forbidden');
    expect(response).toEqual({ status: 'error', code: 403, message: 'Forbidden' });
  });

  it('should return 404 Not Found response with correct message', () => {
    const response = notFoundResponse('Not Found');
    expect(response).toEqual({ status: 'error', code: 404, message: 'Not Found' });
  });

  it('should return 500 Internal Server Error response with correct message', () => {
    const response = internalServerErrorResponse('Internal Server Error');
    expect(response).toEqual({ status: 'error', code: 500, message: 'Internal Server Error' });
  });

  it('should return 503 Service Unavailable response with correct message', () => {
    const response = serviceUnavailableResponse('Service Unavailable');
    expect(response).toEqual({ status: 'error', code: 503, message: 'Service Unavailable' });
  });
});
