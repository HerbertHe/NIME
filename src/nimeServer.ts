import process from "process"
import type { ConnectionsType, IRequest, ServicesType } from "./types"

import { initService, handleRequest } from "./requestHandler"

// 创建服务
export const createServer = (services: ServicesType = []) => {
    const connections: ConnectionsType = {}

    const handleClientRequest = (clientId: string, request: IRequest) => {
        // TODO debug

        if (!connections.hasOwnProperty(clientId)) {
            // TODO debug
            return null
        }

        // 处理request
        if (request["method"] === "init") {
            let { service, state, response } = initService(request, services)
            connections[clientId] = { service, state }
            // debug
            return response
        } else {
            let { state, response } = handleRequest({ request, connection: connections[clientId] })
            connections[clientId].state = state
            // debug
            return response
        }
    }

    const removeClient = (clientId: string) => {
        // debug

        if (!clientId) {
            // Exit IME server
            process.exit()
        }

        if (!connections.hasOwnProperty(clientId)) {
            // 没发现退出
            return
        }

        delete connections[clientId]
    }

    const listen = () => {

    }
}
