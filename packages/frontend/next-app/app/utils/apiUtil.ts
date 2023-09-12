import axios, { AxiosResponse } from 'axios';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export const httpRequest = async <T>(
  method: Method,
  url: string,
  data?: object
): Promise<T> => {
  try {
    let response: AxiosResponse<T>;

    if (method === 'GET') {
      response = await axios.get<T>(url);
    } else if (method === 'POST') {
      response = await axios.post<T>(url, data);
    } else {
      // We can support more as and when needed
      throw new Error('Method not supported');
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || `An error occurred while making the API call to ${url}`);
  }
};
