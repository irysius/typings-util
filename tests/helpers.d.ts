import * as express from 'express';
export interface IMap<T = any> {
    [key: string]: T;
}
export interface IRequestHandler {
    (req: express.Request, res: express.Response, next?: express.NextFunction): void;
}
export interface IExtendedRequest extends express.Request {
    [key: string]: any;
}
export interface IController {
    options: {
        name: string;
    };
    [route: string]: IRequestHandler | any;
}
export interface IHub {
    options: {
        name: string;
    };
    connect(socket: any): void;
    send: IMap<Function>;
    receive: IMap<Function>;
    disconnect(socket: any): void;
}
