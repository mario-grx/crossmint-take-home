export type BaseMap<T> = Array<Array<T>>;

export type InputMap = BaseMap<String>;

export type Cell = {
  type: CellType;
  direction?: string;
  color?: string;
}

export enum CellType {
  SPACE = "SPACE",
  POLYANET = "POLYANET",
  COMETH = "COMETH",
  SOLOON = "SOLOON"
}


export type Result<T> = {
  success: boolean;
  data: T | null;
  error?: Error;
}

export type SoloonColor = string;

export type ComethDirection = string;