// import zod schema validation PokeApiResponeSchema

import { writeFileSync } from "node:fs";
import { generateType } from "./createApi.mts";

function getResourceNameFromUrl(url: string): string {
    // Obtiene la última parte no vacía de la URL
    const parts = url.split("/").filter(Boolean);
    return parts[parts.length - 1] || "Api";
}

export async function fetchJson(URL: string): Promise<any> {
    const res = await fetch(URL);
    if (!res.ok) throw new Error("Request faild");

    const data = await res.json();
    const resourceName = getResourceNameFromUrl(URL);
    const schemaFile = `src/schemas/${resourceName}-schemas.mts`;
    const typeFile = `src/types/${resourceName}.d.ts`;

    // Genera el esquema y el tipo
    const jsonString = JSON.stringify(data);
    try {
        const zodSchemaCode = await generateType(jsonString, "typescript-zod");
        const tsTypes = await generateType(jsonString, "typescript");
        writeFileSync(typeFile, tsTypes);
        writeFileSync(schemaFile, zodSchemaCode);
    } catch (e) {
        console.warn("⚠️ quicktype falló, usando fallback...");
    }

    // Importa dinámicamente el esquema generado
    const schemaModule = await import(`../schemas/${resourceName}-schemas.mts`);
    const schemaName = `${capitalize(resourceName)}Schema`;
    const schema = schemaModule[schemaName];
    if (!schema) throw new Error(`No se encontró el esquema: ${schemaName}`);

    // Valida los datos con el esquema generado
    const parseData = schema.parse(data);
    return parseData;
}

function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}