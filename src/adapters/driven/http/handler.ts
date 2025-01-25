import { CONFIG } from '../../../config';
import { sleepAsync } from '../../../shared/helper';
import { HttpClient } from '../../../shared/httpClient';
import { Result } from '../../../shared/types';

export class HttpRequestHandler {
  private readonly MAX_RETRIES = 3;
  private readonly BASE_DELAY = 1000; // 1 second
  private readonly MAX_DELAY = 5000; // 5 seconds
  private currentBaseDelay = this.BASE_DELAY;
  protected readonly baseURL: string;

  constructor(protected readonly httpClient: HttpClient) {
    this.baseURL = CONFIG.BASE_URL;
  }
  
  public async makeRequest(url: string, method: string = 'GET', payload: any = {}): Promise<Result<any>> {
    let lastError: Error | undefined;
    let delay = this.currentBaseDelay;

    for (let attempt = 0; attempt < this.MAX_RETRIES; attempt++) {
      const response: Result<any> = await this.httpClient.makeRequest(url, method, payload);

      if (response.success) {
        return { 
          success: true,
          data: response.data,
          error: undefined
        };
      }

      lastError = response.error;
      
      // Check if the error is a 429 (Too Many Requests)
      if (lastError instanceof Error && 'status' in lastError && lastError.status === 429) {
        this.currentBaseDelay = Math.min(this.currentBaseDelay * 2, this.MAX_DELAY);
      }

      if (attempt < this.MAX_RETRIES - 1) {
        delay *= Math.pow(2, attempt);
        console.log(`Waiting for ${delay}ms before retrying... ${attempt + 1} for ${method} ${url} with payload ${payload}`);
        await sleepAsync(delay);
      }
    }
    
    return {
      success: false,
      data: null,
      error: lastError || new Error('Unknown error occurred')
    }
  }
}