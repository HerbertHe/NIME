import fs from "fs"
import path from "path"
import process from "process"

import { Server } from "../src/index"

let imeDir = fs.readdirSync(process.cwd())
let services = []

imeDir.forEach(dir => {
    if (fs.lstatSync(path.join(process.cwd(), dir)).isDirectory()) {
        let configFile = fs.readFileSync(path.join(process.cwd(), dir, "ime.json"), "utf-8")
        let config = JSON.parse(configFile)

        let textService = import(`./${dir}/${config.moduleName}`)

        config.textService = textService
        services.push(config)
    }
})

let server = new Server(services)

server.listen()
