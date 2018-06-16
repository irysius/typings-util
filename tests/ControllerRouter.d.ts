import { ILogger } from '@irysius/utils/Logger';
import * as express from 'express';
export interface IControllerRouterOptions {
    express: typeof express;
    logger?: ILogger;
}
export declare function ControllerRouter(options: IControllerRouterOptions): {
    setup: (app: express.Application, rootFolder: string) => {};
};
