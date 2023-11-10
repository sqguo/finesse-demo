import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import "module-alias/register";
import routes from "./routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});

app.use("/api", routes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
