type ResponseData = Record<string, any> | Array<any> | null;
export declare const okResponse: (data: ResponseData) => {
    status: string;
    code: number;
    data: ResponseData;
};
export declare const createdResponse: (data: ResponseData) => {
    status: string;
    code: number;
    data: ResponseData;
};
export declare const noContentResponse: () => {
    status: string;
    code: number;
};
export declare const badRequestResponse: (message: string) => {
    status: string;
    code: number;
    message: string;
};
export declare const unauthorizedResponse: (message: string) => {
    status: string;
    code: number;
    message: string;
};
export declare const forbiddenResponse: (message: string) => {
    status: string;
    code: number;
    message: string;
};
export declare const notFoundResponse: (message: string) => {
    status: string;
    code: number;
    message: string;
};
export declare const internalServerErrorResponse: (message: string) => {
    status: string;
    code: number;
    message: string;
};
export declare const serviceUnavailableResponse: (message: string) => {
    status: string;
    code: number;
    message: string;
};
export {};
