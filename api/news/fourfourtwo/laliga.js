import axios from "axios";
import cheerio from "cheerio";
import { formatNewsItem } from "../../../utils/helper.js";
import { URLLISTS } from "../../../utils/constants.js";

export default async function handler(req, res) {
  try {
    const response = await axios.get(URLLISTS.fourfourtwolaliga);
    const $ = cheerio.load(response.data);
    const news = [];
    $(".small").each((_, el) => {
      const url = $(el).find("a").attr("href");
      const title = $(el).find("h3.article-name").text().trim();
      const img = $(el).find("picture img").attr("src");
      if (url && title) news.push(formatNewsItem({ title, url, image: img, source: "FourFourTwo" }));
    });
    res.status(200).json(news);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}