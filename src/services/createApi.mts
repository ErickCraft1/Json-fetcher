import { createInterface } from "node:readline/promises";
import { quicktype, InputData, jsonInputForTargetLanguage } from "quicktype-core";

export const rl = createInterface({
    input: process.stdin,
    output: process.stdout
})
export const ApiName = await rl.question("Enter the API Name: \n")
export async function generateType(jsonStrign: string, lang: "typescript" | "typescript-zod" = "typescript-zod"): Promise<string> {
    const jsonInput = jsonInputForTargetLanguage("typescript")
    await jsonInput.addSource({ name: ApiName, samples: [jsonStrign] })
    rl.close()
    const inputData = new InputData()
    inputData.addInput(jsonInput)

    const result = await quicktype({
        inputData,
        lang,
        rendererOptions: {
            "just-types": "true"  // no genera funciones innecesarias
        }
    })
    return result.lines.join("\n")
}

// function createZodSchemaFromObject(obj: Record<string, any>) {
//     const entries = Object.entries(obj).map(([key, value]) => {
//         const type = typeof value
//         return `  "${key}": z.${type === "string" ? "string()" : type === "number" ? "number()" : "unknown()"}`
//     })

//     return `import { z } from "zod";

// export const PokeApiResponseSchema = z.object({
// ${entries.join(",\n")}
// })
// export type PokeApiResponse = z.infer<typeof PokeApiResponseSchema>;`
// }