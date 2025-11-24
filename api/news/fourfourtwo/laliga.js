import axios from "axios";
import cheerio from "cheerio";
import { formatNewsItem } from "../../../utils/helper.js";
import { URLLISTS } from "../../../utils/constants.js";

export default async function handler(req, res) {
  try {
    const response = await axios.get(URLLISTS.fourfourtwolaliga, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/123 Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data);
    const news = [];

    // selector mới (FourFourTwo thay đổi giao diện)
    $(".card").each((_, el) => {
      const url = $(el).find("a").attr("href");
      const title = $(el).find(".card__title").text().trim();
      const img = $(el).find("img").attr("src");

      if (url && title) {
        news.push(
          formatNewsItem({
            title,
            url,
            image: img,
            source: "FourFourTwo",
          })
        );
      }
    });

    return res.status(200).json(news);
  } catch (err) {
    console.error("Error scraping:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}