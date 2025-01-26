import { sleepAsync } from '../../../../shared/helper';
import { HttpClient } from '../../../../shared/httpClient';
import { Result } from '../../../../shared/types';
import { HttpRequestHandler } from '../handler';

jest.mock('../../../../shared/httpClient');
jest.mock('../../../../shared/helper', () => ({
  sleepAsync: jest.fn().mockResolvedValue(undefined),
}));

class TestHttpRequestHandler extends HttpRequestHandler {
  public async testMakeRequest(url: string): Promise<Result<any>> {
    return this.makeRequest(url, 'GET', {});
  }
}

describe('HttpRequestHandler', () => {
  let httpClientMock: jest.Mocked<HttpClient>;
  let handler: TestHttpRequestHandler;

  beforeEach(() => {
    httpClientMock = new HttpClient() as jest.Mocked<HttpClient>;
    handler = new TestHttpRequestHandler(httpClientMock);
  });

  it('should make a GET request and return the response with proper type', async () => {
    const mockResponse: Result<any> = { 
      success: true,
      data: 'test',
      error: undefined
    };
    httpClientMock.makeRequest.mockResolvedValue(mockResponse);

    const url = 'https://api.example.com/data';
    const response = await handler.testMakeRequest(url);

    expect(httpClientMock.makeRequest).toHaveBeenCalledWith(url, 'GET', {});
    expect(httpClientMock.makeRequest).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ "data": "test", "error": undefined, "success": true });
  });

  it('should retry failed requests up to maximum attempts', async () => {
    const mockError: Result<any> = {
      success: false,
      data: null,
      error: new Error('Network error')
    };
    const mockSuccess: Result<any> = {
      success: true,
      data: 'success',
      error: undefined
    };
    httpClientMock.makeRequest
      .mockResolvedValueOnce(mockError)
      .mockResolvedValueOnce(mockError)
      .mockResolvedValueOnce(mockSuccess);

    const url = 'https://api.example.com/data';
    const response = await handler.testMakeRequest(url);

    expect(httpClientMock.makeRequest).toHaveBeenCalledWith(url, 'GET', {});
    expect(httpClientMock.makeRequest).toHaveBeenCalledTimes(3);
    expect(response).toEqual(mockSuccess);
  });

  it('should fail after maximum retry attempts', async () => {
    const mockError: Result<any> = {
      success: false,
      data: null,
      error: new Error('Network error')
    };
    httpClientMock.makeRequest.mockResolvedValue(mockError);

    const url = 'https://api.example.com/data';

    const response = await handler.testMakeRequest(url);
    expect(response).toEqual({success: false, data: null, error: mockError.error});
    expect(httpClientMock.makeRequest).toHaveBeenCalledTimes(3); // Assuming 3 retries
  });

  it('should not retry on successful response', async () => {
    const mockResponse: Result<any> = {
      success: true,
      data: 'test',
      error: undefined
    };
    httpClientMock.makeRequest.mockResolvedValue(mockResponse);

    const url = 'https://api.example.com/data';
    const response = await handler.testMakeRequest(url);

    expect(httpClientMock.makeRequest).toHaveBeenCalledTimes(1);
    expect(response).toEqual(mockResponse);
  });

  it('should slow down and retry on 429 response', async () => {
    const mock429Error: Result<any> = {
      success: false,
      data: null,
      error: Object.assign(new Error('Too Many Requests'), { status: 429 })
    };
    const mockSuccess: Result<any> = {
      success: true,
      data: 'success',
      error: undefined
    };

    httpClientMock.makeRequest
      .mockResolvedValueOnce(mock429Error)
      .mockResolvedValueOnce(mockSuccess);

    const url = 'https://api.example.com/data';
    const response = await handler.testMakeRequest(url);

    expect(httpClientMock.makeRequest).toHaveBeenCalledWith(url, 'GET', {});
    expect(httpClientMock.makeRequest).toHaveBeenCalledTimes(2);
    expect(sleepAsync).toHaveBeenCalled(); // Ensure sleepAsync was called to slow down
    expect(response).toEqual(mockSuccess);
  });
}); 