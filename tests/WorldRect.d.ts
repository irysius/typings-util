import { IRect } from "./Rect";
export declare const TYPE: 'world';
export interface IWorldRect extends IRect {
    type: 'world';
}
export declare function create(x: number, y: number, width: number, height: number): IWorldRect;
