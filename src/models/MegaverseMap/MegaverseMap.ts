import { GetMapHandlerInterface } from "../../adapters/driven/http/getMap";
import { BaseMap, CellType, ComethDirection, InputMap, SoloonColor } from "../../shared/types";
import { CellCometh, CellInterface, CellPolyanet, CellSoloon, CellSpace } from "../Cell";

export class MegaverseMap {
  private map: BaseMap<CellInterface>;

  constructor(private readonly getMapHandler: GetMapHandlerInterface) {
    this.map = [];
  }

  public async initMap() {
    const response = await this.getMapHandler.getMap() as { goal: InputMap };
    this.map = this.parseInputMap(response.goal);
  }
  public initMapFromInputMap(inputMap: InputMap) {
    this.map = this.parseInputMap(inputMap) as BaseMap<CellInterface>;
  }

  private parseInputMap(inputMap: InputMap): Array<Array<CellInterface>> {
    const map: Array<Array<CellInterface>> = [];
    for (const [rowIndex, row] of inputMap.entries()) {
      const rowMap: Array<CellInterface> = [];
      for (const [columnIndex, inputCell] of row.entries()) {
        let cell: CellInterface | undefined;

        switch (inputCell) {
          case "SPACE":
            cell = new CellSpace(rowIndex, columnIndex);
            break;
          case "POLYANET":
            cell = new CellPolyanet(rowIndex, columnIndex);
            break;
          default:
            if (inputCell.includes("COMETH")) {
              cell = new CellCometh(rowIndex, columnIndex, inputCell.split("_")[0].toLowerCase() as ComethDirection);
              break;
            }
            if (inputCell.includes("SOLOON")) {
              cell = new CellSoloon(rowIndex, columnIndex, inputCell.split("_")[0].toLowerCase() as SoloonColor);
              break;
            }
            throw new Error(`Invalid cell type: ${inputCell}`);
        }
        rowMap.push(cell);
      }
      map.push(rowMap);
    }

    return map;
  }

  public print() {
    console.log(JSON.stringify(this.map, null, 2));
  }

  public getCellAt(row: number, column: number): CellInterface {
    return this.map[row][column];
  }
  public getMap(): BaseMap<CellInterface> {
    return this.map.map(row => [...row]);
  }

  public getNumberOfRows(): number {
    return this.map.length;
  }

  public getNumberOfColumns(): number {
    return this.map[0].length;
  }

  private getCellOfType(type: CellType): Array<CellInterface> {
    const cells = [];

    for (let row = 0; row < this.getNumberOfRows(); row++) {
      for (let col = 0; col < this.getNumberOfColumns(); col++) {
        if (this.map[row][col].getType() === type) {
          cells.push(this.map[row][col]);
        }
      }
    }

    return cells;
  }

  public getPolyanets(): Array<CellInterface> {
    return this.getCellOfType(CellType.POLYANET);
  }

  public getSoloons(): Array<CellInterface> {
    return this.getCellOfType(CellType.SOLOON);
  }

  public getComeths(): Array<CellInterface> {
    return this.getCellOfType(CellType.COMETH);
  }
}