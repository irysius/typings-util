import { IVector2 } from "./Vector2";
export declare const TYPE: 'world';
export interface IWorldPosition extends IVector2 {
    type: 'world';
}
export declare function create(x: number, y: number): IWorldPosition;
