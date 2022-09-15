import type { IRequest, IResponse, IState } from "./types"

// const NOREMAL_KEY_EVENT = [
//     'filterKeyDown',
//     'filterKeyUp',
//     'onKeyDown',
//     'onKeyUp'
// ];

// const SPECIAL_KEY_EVENT = [
//     'onPreservedKey',
//     'onCommand',
//     'onCompartmentChanged',
//     'onKeyboardStatusChanged',
//     'onCompositionTerminated'
// ]

export class TextService {
    textReducer = (request: IRequest, preState: IState = {}) => {
        return preState
    }

    response = (request: IRequest, state: IState) => {
        return {
            success: true,
            seqNum: request["seqNum"]
        } as IResponse
    }
}
