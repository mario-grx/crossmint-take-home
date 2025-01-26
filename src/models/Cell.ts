import { CONFIG } from "../config";
import { CellType, ComethDirection, SoloonColor } from "../shared/types";

export interface CellInterface {
  toPayload: () => CellPayload;
  toKey: () => string;
  getType: () => CellType;
  toCellInstruction: () => CellInstruction;
}

export type CellPayload = {
  candidateId: string;
  type: CellType;
  row: number;
  column: number;
  color?: SoloonColor;
  direction?: ComethDirection;
}

export type CellInstruction = Omit<CellPayload, 'candidateId'>

export abstract class BaseCell implements CellInterface {
  protected type: CellType;
  protected row: number;
  protected column: number;
  constructor(type: CellType, row: number, column: number) {
    this.type = type;
    this.row = row;
    this.column = column;
  }

  public getType() {
    return this.type;
  }

  public toPayload(): CellPayload {
    return {
      type: this.type,
      candidateId: CONFIG.CANDIDATE_ID,
      row: this.row,
      column: this.column,
      ...this.getSpecificPayload()
    };
  }

  public toKey() {
    return `${this.row},${this.column},${this.type}`;
  }

  public toCellInstruction() {
    return {
      type: this.type,
      row: this.row,
      column: this.column,
      ...this.getSpecificPayload()
    };
  }

  protected abstract getSpecificPayload(): Partial<CellPayload>;
}

export class CellSpace extends BaseCell {
  type: CellType = CellType.SPACE;
  constructor(row: number, column: number) {
    super(CellType.SPACE, row, column);
  }

  protected getSpecificPayload(): Partial<CellPayload> {
    return {};
  }
}

export class CellPolyanet extends BaseCell {
  type: CellType = CellType.POLYANET;
  constructor(row: number, column: number) {
    super(CellType.POLYANET, row, column);
  }

  protected getSpecificPayload(): Partial<CellPayload> {
    return {};
  }
}

export class CellSoloon extends BaseCell {
  type: CellType = CellType.SOLOON;
  color: SoloonColor;
  constructor(row: number, column: number, color: SoloonColor) {
    super(CellType.SOLOON, row, column);
    this.color = color;
  }

  protected getSpecificPayload(): Partial<CellPayload> {
    return {
      color: this.color
    };
  }
}

export class CellCometh extends BaseCell {
  type: CellType = CellType.COMETH;
  direction: ComethDirection;
  constructor(row: number, column: number, direction: ComethDirection) {
    super(CellType.COMETH, row, column);
    this.direction = direction;
  }

  protected getSpecificPayload(): Partial<CellPayload> {
    return {
      direction: this.direction
    };
  }
}