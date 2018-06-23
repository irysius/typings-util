import * as io from 'socket.io';
declare type HubSendFilter = string;
/**
 * Interface for a Hub template. To "activate" this template, run it through augmentHub.
 * Do not run the template through augmentHub more than once.
 */
export interface HubTemplate<R = any, S = any> {
    options?: {
        name?: string;
    };
    /**
     * On connect, the socket that connected will be passed, perform any initialization code here.
     */
    connect(this: HubSend<S>, socket: io.Socket): void;
    /**
     * send should be a hash of types, keyed by the expected method name.
     */
    sendTypes: S;
    /**
     * receive should be a hash of functions that will be called when the server gets a message from the client.
     */
    receive: HubReceive<R, S>;
    /**
     * On disconnect, the socket that disconnected will be passed, perform any cleanup code here.
     */
    disconnect(this: HubSend<S>, socket: io.Socket, reason: string): void;
}
export interface Hub<R = any, S = any> extends HubTemplate<R, S> {
    send: HubSend<S>;
}
export declare type HubSend<S = any> = {
    [P in keyof S]: (payload: S[P], roomOrId?: HubSendFilter) => void;
};
export declare type HubReceive<R = any, S = any> = {
    [P in keyof R]: (this: HubSend<S>, data: R[P], socket: io.Socket) => void;
};
/**
 * Method used to activate a Hub template and make the template "live".
 * @param template The base Hub template to turn "active". Expect the `connect`, `disconnect`, and `receive` functions to be "live" after augment.
 * @param io A socket.io server that's used to create the hub.
 * @returns A HubSend object, tagged with the methods you can use to send data to the client.
 */
export declare function augmentHub<R, S>(template: HubTemplate<R, S>, io: io.Server, name?: string): HubSend<S>;
export {};
