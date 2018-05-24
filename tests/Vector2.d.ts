export interface IVector2 {
    x: number;
    y: number;
    type?: string;
}
export declare function zero(type?: string): IVector2;
export declare function unit(type?: string): IVector2;
export declare function isVector(v: IVector2): boolean;
export declare function add<T extends IVector2>(a: T, b: T): T;
export declare function subtract<T extends IVector2>(a: T, b: T): T;
export declare function multiply<T extends IVector2>(v: T, k: number): T;
export declare function negate<T extends IVector2>(v: T): T;
export declare function areEqual(a: IVector2, b: IVector2, ignoreType?: boolean): boolean;
export declare function closeEnough(e: number): (a: IVector2, b: IVector2, ignoreType?: boolean) => boolean;
export declare function clone<T extends IVector2>(v: T): T;
