import { IHub } from './helpers';
import * as io from 'socket.io';
export declare function Hub(rawHub: IHub, name: string, io: io.Server): {
    io: io.Namespace;
    options: {
        name: string;
    };
    connect: (socket: any) => void;
    send: {};
};
