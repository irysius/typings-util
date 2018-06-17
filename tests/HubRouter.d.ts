import { ILogger } from '@irysius/utils';
import { IHub, IMap } from './helpers';
import * as io from 'socket.io';
export interface IHubRouterOptions {
    io: io.Server;
    logger?: ILogger;
}
export declare function HubRouter(options: IHubRouterOptions): {
    setup: (rootFolder: string) => IMap<IHub>;
};
export default HubRouter;
