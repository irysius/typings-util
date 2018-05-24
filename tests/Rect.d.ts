export interface IRect extends ISize {
    x: number;
    y: number;
    type?: string;
}
export interface ISize {
    width: number;
    height: number;
}
export declare function empty(type?: string): IRect;
export declare function fromClientBounds(v: any): IRect;
export declare function isRect(v: IRect): boolean;
export declare function areEqual(a: IRect, b: IRect, ignoreType?: boolean): boolean;
export declare function closeEnough(e: number): (a: IRect, b: IRect, ignoreType?: boolean) => boolean;
export declare function clone<T extends IRect>(v: T): T;
