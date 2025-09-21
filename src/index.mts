import { log } from "console";
import { rl } from "./services/createApi.mjs";
import { fetchJson } from "./services/fetchData.mjs";

const API_URL = await rl.question("Enter the API URL: ");
rl.close();

async function main() {
    try {
        log(`🔗 Fetching from: ${API_URL}`);
        const data = await fetchJson(API_URL);

        const filtered = Object.fromEntries(
            Object.entries(data).filter(([key]) => !key.includes("-"))
        )
        const filtered2 = Object.fromEntries(
            Object.entries(data as object).filter(([key]) => key.includes("-"))
        )

        log("✅ Data validate.", data);
        // log({
        //     "Menu": filtered,
        //     "Sub-Menu": filtered2
        // })

    } catch (e) {
        console.error("Error fetching or processing data:", e);
    }
}

main()