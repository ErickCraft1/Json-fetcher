import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { ApiName, generateType } from "./createApi.mts";
import { log } from "node:console";
import { join } from "node:path";

function sanitizeResourceName(name: string): string {
    return name.replace(/[^\w\-]/g, "_") // reemplaza cualquier cosa rara por "_"
        .replace(/_+/g, "_")      // elimina duplicados de "_"
        .replace(/^_+|_+$/g, "")  // elimina "_" al inicio/fin
        || "api";                // si queda vacío, usa "api
}

function getResourceNameFromUrl(url: string, apiName?: string) {
    const u = new URL(url);
    // Obtiene la última parte no vacía de la URL
    const parts = u.pathname.split("/").filter(Boolean);

    // carpeta principal: usa el último segmento de la URL o "root"
    const folderName = sanitizeResourceName(parts[parts.length - 2] || "root");

    // archivo: usa apiName si lo pasas, sino folderName
    const fileName = sanitizeResourceName(ApiName || folderName);

    return { folderName, fileName };
}
const typeFilePath = join("src", "types", "api.d.ts");


export async function fetchJson(URL: string): Promise<any> {
    const res = await fetch(URL);
    if (!res.ok) throw new Error("Request faild");

    const data = await res.json();
    const { folderName, fileName } = getResourceNameFromUrl(URL, ApiName);
    const validate = fileName.includes('v2') ? fileName.replace("v2", ApiName.toLowerCase()) : fileName;

    // crea carpeta dinámica: src/schemas/<folderName>
    const schemaDir = join("src", "schemas", folderName);
    mkdirSync(schemaDir, { recursive: true });

    const schemaFile = join(schemaDir, `${validate}-schemas.mts`);
    log(schemaFile)

    // Genera el esquema y el tipo
    const jsonString = JSON.stringify(data, null, 2);
    try {
        const zodSchemaCode = await generateType(jsonString, "typescript-zod");
        const tsTypes = await generateType(jsonString, "typescript");
        // updateTypeFile(tsTypes);
        writeFileSync(schemaFile, zodSchemaCode);
        writeFileSync(typeFilePath, tsTypes, { flag: 'a' });
    } catch (e) {
        console.warn("⚠️ quicktype falló, usando fallback...");
    }

    // Importa dinámicamente el esquema generado
    // const schemaModule = await import(`../schemas/${validate}-schemas.mjs`);
    const schemaModule = await import(join("..", "schemas", folderName, `${validate}-schemas.mts`));
    const schemaName = `${capitalize(validate)}Schema`;
    const schema = schemaModule[schemaName];
    if (!schema) throw new Error(`No se encontró el esquema: ${schemaName}`);

    // Valida los datos con el esquema generado
    const parseData = schema.parse(data);
    return parseData;
}

function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function updateTypeFile(newTypes: string) {

    let currentContent = '';

    if (existsSync(typeFilePath)) {
        currentContent = readFileSync(typeFilePath, 'utf-8');
    }

    if (!currentContent.includes(newTypes)) {
        const updatedContent = currentContent + '\n' + newTypes;
        writeFileSync(typeFilePath, updatedContent);
        console.log(`Updated ${typeFilePath} with new types.`);
    } else {
        console.log(`No new types to add to ${typeFilePath}.`);
    }
}