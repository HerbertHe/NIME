import process from "process"
import { read } from "stdio"
import debug from "debug"
import type { ConnectionsType, ConnectionType, IRequest, ServicesType } from "./types"

import { initService, handleRequest } from "./requestHandler"

const de = debug("nime:server")

export class Server {
    private _connections: ConnectionsType = {}
    private _services: ServicesType = []

    constructor(serives: ServicesType) {
        this._services = serives
    }

    handleClientRequest = (clientId: string, request: IRequest) => {
        de(clientId)
        de(request)

        if (!this._connections.hasOwnProperty(clientId)) {
            de(`Connection not found ${clientId}`)
            return null
        }

        if (request["method"] === "init") {
            let { service, state, response } = initService(request, this._services)
            this._connections[clientId] = { service, state }
            de(response)
            return response
        } else {
            let { state, response } = handleRequest({ request, connection: this._connections[clientId] })
            this._connections[clientId].state = state
            de(response)
            return response
        }
    }

    removeClient = (clientId: string) => {
        de(clientId)

        if (!clientId) {
            // Exit IME server
            process.exit()
        }

        if (!this._connections.hasOwnProperty(clientId)) {
            de(`Connection not found ${clientId}`)
            return
        }

        delete this._connections[clientId]
    }

    listen = () => {
        read((line) => {
            line = line.trim()
            const parts = line.split('split', 2)

            if (parts.length === 2) {
                const [clientId, msgText] = parts
                const msg = JSON.parse(msgText) as IRequest
                let client: ConnectionType

                if (!this._connections.hasOwnProperty(clientId)) {
                    client = { service: null, state: null }
                    this._connections[clientId] = client
                    de(`New Client`, clientId)
                }

                if (msg['method'] === "close") { // special handling for closing a client
                    this.removeClient(clientId);
                    de("client disconnected:", clientId + "\n");
                } else {
                    const ret = this.handleClientRequest(clientId, msg)
                    // Send the response to the client via stdout
                    // one response per line in the format "PIME_MSG|<client_id>|<json reply>"
                    const reply_line = "PIME_MSG|" + clientId + "|" + JSON.stringify(ret) + "\n";
                    process.stdout.write(reply_line);
                }
            }
            return Promise.resolve()
        }).then(() => {
            console.log(`Finished!`)
        })
    }
}
