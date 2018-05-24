import { IVector2 } from "./Vector2";
export declare const TYPE: 'cell';
export interface ICellCoord extends IVector2 {
    type: 'cell';
}
export declare function create(x: number, y: number): ICellCoord;
