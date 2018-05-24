import { IVector2 } from "./Vector2";
import { IScreenPosition } from "./ScreenPosition";
import { IWorldPosition } from "./WorldPosition";
import { ICellCoord } from "./CellCoord";
import { ISize } from "./Rect";
import { IScreenRect } from "./ScreenRect";
import { ICellOffset } from "./Cell";
export interface IState {
    cellSize: ISize;
    /**
     *
     */
    cellOffset: ICellOffset;
    gridBounds: IScreenRect;
    position: IWorldPosition;
}
export interface IOptions {
    state: IState;
}
export interface ICoordManager {
    updateWithState(newState: Partial<IState>): void;
    toWorldPosition(v: IVector2): IWorldPosition;
    toScreenPosition(v: IVector2): IScreenPosition;
    toCellCoord(v: IVector2): ICellCoord;
    getWorldTopLeft(): IWorldPosition;
}
export declare function CoordManager(options: IOptions): ICoordManager;
