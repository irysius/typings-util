import { IVector2 } from "./Vector2";
export declare const TYPE: 'screen';
export interface IScreenPosition extends IVector2 {
    type: 'screen';
}
export declare function create(x: number, y: number): IScreenPosition;
