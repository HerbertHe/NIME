import { keyCodes } from "../../src/lib/keyCodes"
import type { IRequest, IResponse, IState } from "../../src/types"

const candidateList = ['喵', '描', '秒', '妙']

const respOnFilterKeyDown = (request: IRequest, state: IState) => {
    let { keyCode, seqNum } = request

    let response: IResponse = {
        success: true,
        return: true,
        seqNum
    }

    const { VK_RETURN, VK_BACK, VK_LEFT, VK_UP, VK_DOWN, VK_RIGHT } = keyCodes

    if (state.compositionString === "" &&
        [VK_RETURN, VK_BACK, VK_LEFT, VK_UP, VK_DOWN, VK_RIGHT].includes(keyCode)
    ) {
        response.return = false
    }

    return response
}

const respOnKeyDown = (request: IRequest, state: IState) => {
    let { keyCode, seqNum } = request

    let response: IResponse = {
        success: true,
        return: true,
        seqNum
    }

    if (state.action === "SHOW_CANDIDATES") {
        if (state.showCandidates) {
            response.candidateList = candidateList
        }
        response.showCandidates = state.showCandidates
        return response
    }

    if (state.action === "UPDATE_CANDIDATE") {
        response.candidateCursor = state.candidateCursor
        return response
    }

    if (state.action === "SELECT_CANDIDATE") {
        response.compositionString = state.compositionString
        response.showCandidates = state.showCandidates
        return response
    }

    if (state.action === "UPDATE_STRING") {
        response.compositionString = state.compositionString
        response.compositionCursor = state.compositionCursor
        return response
    }

    if (state.action === "COMMIT_STRING") {
        response.commitString = state.commitString
        response.compositionString = state.compositionString
        return response
    }

    return response
}

const reduceOnKeyDown = (request: IRequest, preState: IState) => {
    let { action = "",
        compositionString = "",
        compositionCursor = 0,
        showCandidates = false,
        candidateCursor = 0
    } = preState

    let { keyCode } = request
    if (showCandidates) {
        if (keyCode === keyCodes.VK_ESCAPE) {
            return Object.assign({}, preState, {
                action: 'SHOW_CANDIDATES',
                showCandidates: false
            });
        }

        if (keyCode === keyCodes.VK_DOWN) {
            candidateCursor = (candidateCursor + 3) % 4;
            return Object.assign({}, preState, {
                action: 'UPDATE_CANDIDATE',
                candidateCursor
            });
        }

        if (keyCode === keyCodes.VK_UP) {
            candidateCursor = candidateCursor < 3 ? 0 : candidateCursor - 3;
            return Object.assign({}, preState, {
                action: 'UPDATE_CANDIDATE',
                candidateCursor
            });
        }

        if (keyCode === keyCodes.VK_RIGHT) {
            candidateCursor = (candidateCursor + 1) % 4;
            return Object.assign({}, preState, {
                action: 'UPDATE_CANDIDATE',
                candidateCursor
            });
        }

        if (keyCode === keyCodes.VK_LEFT) {
            candidateCursor = candidateCursor == 0 ? 0 : candidateCursor - 1;
            return Object.assign({}, preState, {
                action: 'UPDATE_CANDIDATE',
                candidateCursor
            });
        }

        if (keyCode >= '1'.charCodeAt(0) && keyCode <= '4'.charCodeAt(0)) {

            let selectCandidate = candidateList[keyCode - '1'.charCodeAt(0)];
            let cursor = compositionCursor - 1;

            if (cursor < 0) {
                cursor = 0;
            }

            compositionString = compositionString.substring(0, cursor) + selectCandidate + compositionString.substring(cursor + 1);

            return Object.assign({}, preState, {
                action: 'SELECT_CANDIDATE',
                showCandidates: false,
                compositionString
            });
        }

        if (keyCode === keyCodes.VK_RETURN) {

            let selectCandidate = candidateList[candidateCursor];
            let cursor = compositionCursor - 1;

            if (cursor < 0) {
                cursor = 0;
            }

            compositionString = compositionString.substring(0, cursor) + selectCandidate + compositionString.substring(cursor + 1);

            return Object.assign({}, preState, {
                action: 'SELECT_CANDIDATE',
                showCandidates: false,
                compositionString
            });
        }

        return Object.assign({}, preState, { action: '' });

    } else {

        if (keyCode === keyCodes.VK_DOWN) { // Show Candidate List
            return Object.assign({}, preState, {
                action: 'SHOW_CANDIDATES',
                showCandidates: true,
                candidateCursor: 0
            });
        }

        if (keyCode === keyCodes.VK_RETURN) { // Comfirm String
            return Object.assign({}, preState, {
                action: 'COMMIT_STRING',
                commitString: compositionString,
                compositionString: '',
                compositionCursor: 0
            });
        }

        if (keyCode === keyCodes.VK_BACK) { // Delete compositionString
            if (compositionString === '') {
                return Object.assign({}, preState, { action: '' });
            }
            let cursor = compositionCursor;
            compositionCursor -= 1;
            compositionString = compositionString.substring(0, compositionCursor) + compositionString.substring(cursor);

            return Object.assign({}, preState, {
                action: 'UPDATE_STRING',
                compositionString,
                compositionCursor
            });
        }

        if (keyCode === keyCodes.VK_LEFT) { // Move cursor left
            if (compositionCursor > 0) {
                return Object.assign({}, preState, {
                    action: 'UPDATE_STRING',
                    compositionCursor: compositionCursor - 1
                });
            }
            return Object.assign({}, preState, { action: '' });
        }

        if (keyCode === keyCodes.VK_RIGHT) { // Move cursor right
            if (compositionCursor < compositionString.length) {
                return Object.assign({}, preState, {
                    action: 'UPDATE_STRING',
                    compositionCursor: compositionCursor + 1
                });
            }
            return Object.assign({}, preState, { action: '' });
        }

        compositionString = compositionString.substring(0, compositionCursor) + '喵' + compositionString.substring(compositionCursor);

        return Object.assign({}, preState, {
            action: 'UPDATE_STRING',
            compositionCursor: compositionCursor + 1,
            compositionString
        })
    }
}

function reduceOnCompositionTerminated(request, preState) {
    return Object.assign({}, preState, {
        compositionString: '',
        compositionCursor: 0
    });
}

export const textService = {
    textReducer(request: IRequest, preState: IState) {

        if (request['method'] === 'init') {
            return Object.assign({}, preState, {
                action: '',
                compositionString: '',
                compositionCursor: 0,
                showCandidates: false,
                candidateCursor: 0
            });
        }

        if (request['method'] === 'onKeyDown') {
            return reduceOnKeyDown(request, preState);
        }

        if (request['method'] === 'onCompositionTerminated') {
            return reduceOnCompositionTerminated(request, preState);
        }
        return preState;
    },

    response(request: IRequest, state: IState) {
        if (request['method'] === 'filterKeyDown') {
            return respOnFilterKeyDown(request, state);

        } else if (request['method'] === 'onKeyDown') {
            return respOnKeyDown(request, state);
        }
        return { success: true, seqNum: request['seqNum'] };
    }
}
