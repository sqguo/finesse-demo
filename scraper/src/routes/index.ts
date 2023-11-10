import express from "express";
import scraperRoutes from "./scraper";

const routes = express.Router();

routes.use("/scrape", scraperRoutes);

export default routes;
