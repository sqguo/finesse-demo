import { Request, Response } from "express";
import ScraperService from "@lib/service/scraper";
import ProducerService from "@lib/service/producer";
import _ from "lodash";
import { SCRAPER_LIMIT } from "@lib/service/constants";

// TODO: setup swagger UI for API documentation
async function scrapeTrendingPosts(req: Request, res: Response) {
  try {
    const { limit } = req.query;
    const posts = await ScraperService.scrapeTrendingPosts(limit ? Number(limit) : SCRAPER_LIMIT);
    await ProducerService.producePosts(posts);
    return res.status(200).send();
  } catch (e) {
    console.log(e);
    return res.status(500).send();
  }
}

const ScraperController = {
  scrapeTrendingPosts
};

export default ScraperController;
