import { Response } from 'express';

type ResponseData = Record<string, any> | Array<any> | null;

// Define the interface for the response object
export interface IResponse {
  status: string;
  code: number;
  body?: any;
  message?: string;
}

export const sendHttpResponse = (res: Response, httpResponse: IResponse) => {
  return res.status(httpResponse.code).json(httpResponse);
};

// 👇️ Used for successful GET requests to return requested data.
export const OK_RESPONSE = (data: ResponseData): IResponse => {
  return {
    status: 'success',
    code: 200,
    body: data,
  };
};

// 👇️ Used for successful POST requests that create a new resource.
export const CREATED_RESPONSE = (data: ResponseData): IResponse => {
  return {
    status: 'success',
    code: 201,
    body: data,
  };
};

// 👇️ Used for successful DELETE requests or any other request that has been processed but doesn't return data.
export const NO_CONTENT_RESPONSE = (): IResponse => {
  return {
    status: 'success',
    code: 204,
  };
};

// 👇️ Used when the client sends a request with invalid fields.
export const BAD_REQUEST_RESPONSE = (message: string): IResponse => {
  return {
    status: 'error',
    code: 400,
    message,
  };
};

// 👇️ Used when authentication is required and the request lacks valid credentials.
export const UNAUTHORIZED_RESPONSE = (message: string): IResponse => {
  return {
    status: 'error',
    code: 401,
    message,
  };
};

// 👇️ Used when the authenticated user doesn't have permissions to access a resource.
export const FORBIDDEN_RESPONSE = (message: string): IResponse => {
  return {
    status: 'error',
    code: 403,
    message,
  };
};

// 👇️ Used when the requested resource could not be found.
export const NOT_FOUND_RESPONSE = (message: string): IResponse => {
  return {
    status: 'error',
    code: 404,
    message,
  };
};

// 👇️ Used for unexpected server errors.
export const INTERNAL_SERVER_ERROR_RESPONSE = (message: string): IResponse => {
  return {
    status: 'error',
    code: 500,
    message,
  };
};

// 👇️ Used for service unavailable errors, often useful for maintenance windows or rate limiting.
export const SERVICE_UNAVAILABLE_RESPONSE = (message: string): IResponse => {
  return {
    status: 'error',
    code: 503,
    message,
  };
};
