import type { TextService } from "./textService"

interface ICommonStates {
    showCandidates?: boolean
    candidateCursor?: number
    compositionCursor?: number
    compositionString?: string
    commitString?: string
}

export interface IResponse extends ICommonStates {
    success: boolean
    seqNum: number
    return?: boolean
    candidateList?: string[]
}

export interface IStateEnv extends IRequest { }

export type StateActionType = "SHOW_CANDIDATES" | "UPDATE_CANDIDATE" | "SELECT_CANDIDATE" | "UPDATE_STRING" | "COMMIT_STRING"

export interface IState extends ICommonStates {
    env?: IStateEnv
    action?: StateActionType
}

export type RequestMethodType = "init" | "close" | "onActivate" | "onKeyDown" | "onCompositionTerminated" | "filterKeyDown"

export interface IRequest {
    id: string
    keyCode?: number
    seqNum?: number
    // TODO 修正 method
    method?: RequestMethodType
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
    service: TextService | null
    state: IState | null
    response: IResponse
}

export type ConnectionType = Pick<IInitServiceCallback, "service" | "state">

export type ConnectionsType = Record<string, ConnectionType>
