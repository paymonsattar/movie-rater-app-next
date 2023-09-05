type ResponseData = Record<string, any> | Array<any> | null;

// 👇️ Used for successful GET requests to return requested data.
export const okResponse = (data: ResponseData) => {
  return {
    status: 'success',
    code: 200,
    data,
  };
};

// 👇️ Used for successful POST requests that create a new resource.
// The newly created resource can be returned in the data field.
export const createdResponse = (data: ResponseData) => {
  return {
    status: 'success',
    code: 201,
    data,
  };
};

// 👇️ Used for successful DELETE requests or any other request that has been processed but doesn't return data.
export const noContentResponse = () => {
  return {
    status: 'success',
    code: 204,
  };
};

// 👇️ Used when the client sends a request with invalid fields.
export const badRequestResponse = (message: string) => {
  return {
    status: 'error',
    code: 400,
    message,
  };
};

// 👇️ Used when authentication is required and the request lacks valid credentials.
export const unauthorizedResponse = (message: string) => {
  return {
    status: 'error',
    code: 401,
    message,
  };
};

// 👇️ Used when the authenticated user doesn't have permissions to access a resource.
export const forbiddenResponse = (message: string) => {
  return {
    status: 'error',
    code: 403,
    message,
  };
};

// 👇️ Used when the requested resource could not be found.
export const notFoundResponse = (message: string) => {
  return {
    status: 'error',
    code: 404,
    message,
  };
};

// 👇️ Used for unexpected server errors.
export const internalServerErrorResponse = (message: string) => {
  return {
    status: 'error',
    code: 500,
    message,
  };
};

// 👇️ Used for service unavailable errors, often useful for maintenance windows or rate limiting.
export const serviceUnavailableResponse = (message: string) => {
  return {
    status: 'error',
    code: 503,
    message,
  };
};
