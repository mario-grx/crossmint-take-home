import { CONFIG } from "../../../config";
import { HttpClient } from "../../../shared/httpClient";
import { CellType, InputMap, Instruction, Result } from "../../../shared/types";
import { HttpRequestHandler } from "./handler";

export class DrawMapHandler extends HttpRequestHandler {
  constructor(protected readonly httpClient: HttpClient) {
    super(httpClient);
  }

  public async drawMap(instuctions: Array<Instruction>): Promise<Result<Array<Instruction>>> {
    // const promises: { [key: string]: Promise<any> } = {};
    const instructionMap: { [key: string]: Instruction } = {};
    const results: {      [key: string]: any } = [];
    const failedInstructions: Array<Instruction> = [];
    
    for (const instruction of instuctions) {
      const { type, row, column } = instruction;
      const path = this.getPath(type);
      const url = `${this.baseURL}/${path}`;
      const payload = {
        candidateId: CONFIG.CANDIDATE_ID,
        row,
        column
      };
      const key = `${row},${column},${type}`;
      instructionMap[key] = instruction;
      
      const result = await this.makeRequest(url, 'POST', payload);

      if (!result.success) {
        failedInstructions.push(instruction);
        console.error(`Inside DrawMapHandler::drawMap error for key ${key} and error ${result.error?.message}`);
      }
    }

    // const results = await Promise.allSettled(Object.values(promises));

    // const failedInstructions = results
    //   .map((result, index) => ({
    //     result,
    //     key: Object.keys(promises)[index]
    //   }))
    //   .filter(({result, key}) => {
    //     if(result.status === 'rejected') {
    //       console.error(`Inside DrawMapHandler::drawMap result ${result.status} for key ${key} and error ${result.reason}`);
    //       return true;
    //     }
    //     return false;
    //   })
    //   .map(({key}) => instructionMap[key]);

    return {
      success: failedInstructions.length === 0,
      data: failedInstructions.length > 0 ? failedInstructions : null
    };
  }

  private getPath(type: CellType): string {
    const path = type === CellType.POLYANET ? CONFIG.DRAW_POLYANET_PATH :
      type === CellType.COMETH ? CONFIG.DRAW_COMETH_PATH :
        CONFIG.DRAW_SOLOON_PATH;

    return path;
  }
}