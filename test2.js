const puppeteer = require("puppeteer");
const { Cluster } = require("puppeteer-cluster");

(async () => {
  let marketArr = [];
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 2
  });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url = "https://www.commodityonline.com/commodity-trading-markets/";
  await page.goto(url, { waitUntil: "load" });

  const markets = await page.evaluate(() =>
    Array.from(document.querySelectorAll("div#warelist a")).map(
      market => market.href
    )
  );

  await cluster.task(async ({ page, data: url }) => {
    await page.goto(url);
    var description = await page.evaluate(
      () => document.querySelector("div.mrkets_d_04 h1").innerText
    );
    var products = await page.evaluate(() =>
      Array.from(document.querySelectorAll("div.mrkets_d_04 span a")).map(
        product => product.innerText
      )
    );

    if (description && products) {
      marketArr.push({ description: description, products: products });
    }
  });

  markets.forEach(market => {
    cluster.queue(market);
  });

  //   cluster.queue("http://www.google.com/");
  //   cluster.queue("http://www.wikipedia.org/");
  // many more pages
  console.log(marketArr);
  await cluster.idle();
  await cluster.close();
})();
