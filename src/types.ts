import type { TextService } from "./textService"

export interface IResponse {
    success: boolean
    seqNum: number
}

export interface IStateEnv extends IRequest { }

export interface IState {
    env?: IStateEnv
}

export interface IRequest {
    id: string
    // TODO 修正 method
    method?: "init" | "onActivate"
    isWindows8Above?: boolean
    isMetroApp?: boolean
    isUiLess?: boolean
    isConsole?: boolean
    isKeyBoardOpen?: boolean
}

export type ServiceFuncType = (request: IRequest) => TextService

export interface IService {
    guid: string
    textService: TextService
}

export type ServicesType = ServiceFuncType | IService[]

export interface IInitServiceCallback {
    service: TextService
    state: IState
    response: IResponse
}

export type ConnectionType = Pick<IInitServiceCallback, "service" | "state">

export type ConnectionsType = Record<string, ConnectionType>
