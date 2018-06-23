import { HubTemplate } from "./Hub";
interface ISend {
    timestamp: number;
}
interface IReceive {
    message: string;
}
export declare let TestHub: HubTemplate<IReceive, ISend>;
export default TestHub;
