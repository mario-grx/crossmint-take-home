export type BaseMap < T > = Array < Array < T >> ;

export type InputMap = BaseMap < String > ;


export enum CellType {
  SPACE = "SPACE",
  POLYANET = "POLYANET",
  COMETH = "COMETH",
  SOLOON = "SOLOON"
}

export type Coordinate = [number, number];

export type Instruction = {
  row: number;
  column: number;
  type: CellType;
}

export type Result < T > = {
  success: boolean;
  data: T | null;
  error ? : Error;
}