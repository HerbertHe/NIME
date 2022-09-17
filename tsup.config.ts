import { defineConfig} from "tsup"

export const tsup = defineConfig({
    entry: {
        "index": "src/index.ts",
        "lib": "src/lib/index.ts"
    },
    clean: true,
    dts: true,
    format: ["esm"]
})
