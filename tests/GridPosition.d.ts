import { IVector2 } from "./Vector2";
export interface IGridPosition extends IVector2 {
    type: 'grid';
}
export declare function create(x: number, y: number): IGridPosition;
