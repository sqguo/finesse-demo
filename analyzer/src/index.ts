import bodyParser from "body-parser";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import "module-alias/register";
import { AnalyzerService } from "./service";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

AnalyzerService();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
