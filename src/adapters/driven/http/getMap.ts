import { CONFIG } from "../../../config";
import { HttpClient } from "../../../shared/httpClient";
import { InputMap } from "../../../shared/types";

import { HttpRequestHandler } from "./handler";

export interface GetMapHandlerInterface {
  getMap(): Promise<{ goal: InputMap }>;
}

export class GetMapHandler extends HttpRequestHandler implements GetMapHandlerInterface {
  private readonly path: string;
  constructor(protected readonly httpClient: HttpClient) {
    super(httpClient);
    this.path = CONFIG.GET_MAP_PATH;
  }
  
  public async getMap(): Promise<{ goal: InputMap }> {
    const url = `${this.baseURL}/${this.path}/${CONFIG.CANDIDATE_ID}/goal`;

    try {
      console.error(`Inside GetMapHandler::getMap url ${url}`);
      const response = await this.makeRequest(url);
      if (response.success) {
        return response.data as unknown as { goal: InputMap };
      }
      throw new Error(`Failed to get map: ${response.error}`);
    } catch (error) {
      console.error(`Error getting map: ${error}`);
      throw error;
    }
  }
}