import { TextService } from "./textService"
import type { ConnectionType, IInitServiceCallback, IRequest, IResponse, IState, ServicesType } from "./types"

export const initService = (request: IRequest, services: ServicesType) => {
    let response: IResponse = {
        success: false,
        seqNum: request["seqNum"]
    }

    let service: TextService | null = null
    let state: IState = {}

    if (typeof services === "function") {
        service = services(request)
    } else {
        services.forEach((tmp) => {
            if (tmp["guid"].toLowerCase() === request["id"].toLowerCase()) {
                service = tmp["textService"]
            }
        })
    }

    const { id, isWindows8Above, isMetroApp, isUiLess, isConsole } = request
    state.env = {
        id,
        isWindows8Above,
        isMetroApp,
        isUiLess,
        isConsole
    }

    if (service !== null) {
        state = service.textReducer(request, state)
        response = service.response(request, state)
    } else {
        state = {}
        response = {
            success: false,
            seqNum: request["seqNum"]
        }
    }

    return { service, state, response } as IInitServiceCallback
}

interface IHandleRequestArgs {
    request: IRequest
    connection: ConnectionType
}

export const handleRequest = ({ request, connection }: IHandleRequestArgs) => {
    let { state, service } = connection
    let response: IResponse = {
        success: false,
        seqNum: request["seqNum"]
    }

    if (request["method"] === "onActivate" && !!state?.env) {
        state.env.isKeyBoardOpen = request.isKeyBoardOpen
    }

    if (!!state && !!service) {
        state = service.textReducer(request, state)
        response = service.response(request, state)
    }

    return {
        state,
        response
    }
}
