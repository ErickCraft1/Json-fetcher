import express, { type Request, type Response } from "express";
import logger from "morgan";
import path from "path";

const url = "https://localhost:";

const port = process.env.PORT ?? 3000;

const app = express();

app.use(logger("dev"));

app.use(express.static(path.join(process.cwd(), "src", "init")));

app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), "src", "init", "index.html"));
});

app.listen(port, () => {
    console.log(`Server running at ${url}${port}`);
});