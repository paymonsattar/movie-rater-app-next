import {
  OK_RESPONSE,
  CREATED_RESPONSE,
  NO_CONTENT_RESPONSE,
  BAD_REQUEST_RESPONSE,
  UNAUTHORIZED_RESPONSE,
  FORBIDDEN_RESPONSE,
  NOT_FOUND_RESPONSE,
  INTERNAL_SERVER_ERROR_RESPONSE,
  SERVICE_UNAVAILABLE_RESPONSE,
} from '../../src/index';

describe('API Response Utilities', () => {
  it('should return 200 OK response with correct data', () => {
    const response = OK_RESPONSE({ message: 'OK' });
    expect(response).toEqual({
      status: 'success',
      code: 200,
      body: { message: 'OK' },
    });
  });

  it('should return 201 Created response with correct data', () => {
    const response = CREATED_RESPONSE({ id: 1 });
    expect(response).toEqual({ status: 'success', code: 201, body: { id: 1 } });
  });

  it('should return 204 No Content response with no data', () => {
    const response = NO_CONTENT_RESPONSE();
    expect(response).toEqual({ status: 'success', code: 204 });
  });

  it('should return 400 Bad Request response with correct message', () => {
    const response = BAD_REQUEST_RESPONSE('Invalid input');
    expect(response).toEqual({
      status: 'error',
      code: 400,
      message: 'Invalid input',
    });
  });

  it('should return 401 Unauthorized response with correct message', () => {
    const response = UNAUTHORIZED_RESPONSE('Unauthorized');
    expect(response).toEqual({
      status: 'error',
      code: 401,
      message: 'Unauthorized',
    });
  });

  it('should return 403 Forbidden response with correct message', () => {
    const response = FORBIDDEN_RESPONSE('Forbidden');
    expect(response).toEqual({
      status: 'error',
      code: 403,
      message: 'Forbidden',
    });
  });

  it('should return 404 Not Found response with correct message', () => {
    const response = NOT_FOUND_RESPONSE('Not Found');
    expect(response).toEqual({
      status: 'error',
      code: 404,
      message: 'Not Found',
    });
  });

  it('should return 500 Internal Server Error response with correct message', () => {
    const response = INTERNAL_SERVER_ERROR_RESPONSE('Internal Server Error');
    expect(response).toEqual({
      status: 'error',
      code: 500,
      message: 'Internal Server Error',
    });
  });

  it('should return 503 Service Unavailable response with correct message', () => {
    const response = SERVICE_UNAVAILABLE_RESPONSE('Service Unavailable');
    expect(response).toEqual({
      status: 'error',
      code: 503,
      message: 'Service Unavailable',
    });
  });
});
