import { ISize } from "./Rect";
export interface ICellOffset {
    x: number;
    y: number;
}
export declare enum Gravity {
    Center = 0,
    North = 1,
    South = 2,
    East = 4,
    West = 8,
    NorthEast = 5,
    NorthWest = 9,
    SouthEast = 6,
    SouthWest = 10,
}
export declare function northOrSouth(gravity: Gravity): Gravity;
export declare function eastOrWest(gravity: Gravity): Gravity;
export declare function cellOffset(cellSize: ISize, gravity: Gravity): ICellOffset;
