import axios, { AxiosResponse } from 'axios';
import { Result } from './types';

export class HttpClient {
  public async makeRequest(url: string, method: string = 'GET', payload: any = {}): Promise<Result<any>> {
    const lowerMethod = method.toLowerCase();
    let response: AxiosResponse;
    
    try {
      switch (lowerMethod) {
      case 'get':
        response = await axios.get(url);
        break;
      case 'post': 
        console.error(`Inside HttpClient::makeRequest url ${url} and payload ${JSON.stringify(payload)}`);
        response = await axios.post(url, payload);
        break;
      case 'put':
        response = await axios.put(url, payload);
        break;
      case 'delete':
        response = await axios.delete(url);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
      }

      if (response.status !== 200) {
        return {
          success: false,
          data: null,
          error: new Error(`Failed to make request: ${response.status}, ${response.data}`)
        }
      }

      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        return {
          success: false,
          data: null,
          error: Object.assign(new Error('Too Many Requests'), { status: 429 })
        };
      }
      return {
        success: false,
        data: null,
        error: error as Error
      };
    }
  }
} 