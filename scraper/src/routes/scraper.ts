import express from "express";
import ScraperController from "@lib/controllers/scraper";

const router = express.Router();

router.get("/trending", ScraperController.scrapeTrendingPosts);


export default router;
