import { IRect } from "./Rect";
export declare const TYPE: 'screen';
export interface IScreenRect extends IRect {
    type: 'screen';
}
export declare function create(x: number, y: number, width: number, height: number): IScreenRect;
