import { CONFIG } from "../../../config";
import { CellInstruction, CellInterface } from "../../../models/Cell";
import { HttpClient } from "../../../shared/httpClient";
import { CellType, Result } from "../../../shared/types";

import { HttpRequestHandler } from "./handler";

export class DrawMapHandler extends HttpRequestHandler {
  constructor(protected readonly httpClient: HttpClient) {
    super(httpClient);
  }

  public async drawMap(instuctions: Array<CellInterface>): Promise<Result<Array<CellInstruction>>> {
    // const promises: { [key: string]: Promise<any> } = {};
    const instructionMap: { [key: string]: CellInterface } = {};
    const failedInstructions: Array<CellInstruction> = [];

    for (const cell of instuctions) {
      const path = this.getPath(cell.getType());
      const url = `${this.baseURL}/${path}`;
      const payload = cell.toPayload();
      const key = cell.toKey();
      instructionMap[key] = cell;

      const result = await this.makeRequest(url, 'POST', payload);

      if (!result.success) {
        const { candidateId: _, ...payloadWithoutCandidateId } = payload;
        failedInstructions.push(payloadWithoutCandidateId);
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