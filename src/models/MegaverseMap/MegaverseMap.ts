import { CellType, Coordinate, InputMap, BaseMap     } from "../../shared/types";
import { GetMapHandler, GetMapHandlerInterface } from "../../adapters/driven/http/getMap";
export class MegaverseMap {
  private map: BaseMap<CellType>;

  constructor(private readonly getMapHandler: GetMapHandlerInterface) {
    this.map = [];
  }

  public async initMap() {
    const response = await this.getMapHandler.getMap() as { goal: InputMap };
    this.map = this.parseInputMap(response.goal);
  }

  public initMapFromInputMap(inputMap: InputMap) {
    this.map = this.parseInputMap(inputMap);
  }

  private parseInputMap(inputMap: InputMap): Array<Array<CellType>> {
    const map: Array<Array<CellType>> = [];
    for (const [rowIndex, row] of inputMap.entries()) {
      const rowMap: Array<CellType> = [];
      for (const [columnIndex, cell] of row.entries()) {
        let type: CellType | undefined;

        switch (cell) {
        case "SPACE":
          type = CellType.SPACE;
          break;
        case "POLYANET":
          type = CellType.POLYANET;
          break;
        case "COMETH":
          type = CellType.COMETH;
          break;
        case "SOLOON":
          type = CellType.SOLOON;
          break;
        default:
          throw new Error(`Invalid cell type: ${cell}`);
        }
        rowMap.push(type);
      }
      map.push(rowMap);
    }

    return map;
  }

  public print() {
    console.log(JSON.stringify(this.map, null, 2));
  }

  public getCellAt(row: number, column: number): CellType {
    return this.map[row][column];
  }
  public getMap(): BaseMap<CellType> {
    return this.map.map(row => [...row]);
  }

  public getNumberOfRows(): number {
    return this.map.length;
  }

  public getNumberOfColumns(): number {
    return this.map[0].length;
  }

  public getPolyanets(): Array<Coordinate> {
    const polyanets: Array<Coordinate> = [];
    for (const [rowIndex, row] of this.map.entries()) {
      for (const [columnIndex, cell] of row.entries()) {
        if (cell === CellType.POLYANET) {
          polyanets.push([rowIndex, columnIndex]);
        }
      }
    }
    return polyanets;
  }
}