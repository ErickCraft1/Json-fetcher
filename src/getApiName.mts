import { log } from "console";
import { fetchJson } from "./services/fetchData.mts";
import { type Request, type Response } from "express";

let API_URL = "";
export const handleApiRequest = async (req: Request, res: Response) => {
    const { apiName } = req.body;
    API_URL = apiName;
    log("Datos recibidos", apiName);
    const dataRes = await main();

    res.json({ ok: true, message: `Datos recibidos correctamente`, apiName, data: dataRes });
}

async function main() {
    try {
        log(`🔗 Fetching from: ${API_URL}`);
        const contentData = await fetchJson(API_URL);

        log("✅ Data validate:", contentData);
        return contentData;
        // log({
        //     "Menu": filtered,
        //     "Sub-Menu": filtered2
        // })

    } catch (e) {
        console.error("Error fetching or processing data:", e);
        throw e;
    }
}
