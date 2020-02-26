const puppeteer = require("puppeteer");

function run() {
  return new Promise(async (resolve, reject) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = "https://www.commodityonline.com/commodity-trading-markets/";
    await page.goto(url, { waitUntil: "load" });
    const markets = await page.evaluate(() =>
      Array.from(document.querySelectorAll("div#warelist a")).map(
        market => market.href
      )
    );
    // console.log(markets);
    var marketArr = [];
    try {
      for (let i = 0; i < 100; i++) {
        const isGoTo = await page.goto(markets[0], { waitUntil: "load" });
        if (isGoTo) {
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
        }
      }

      const closeBrowser = await browser.close();
      if (closeBrowser) {
        console.log(marketArr);
        return resolve(marketArr);
      }
    } catch (err) {
      reject(err);
    }
  });
}

run()
  .then(markets => {
    console.log(markets);
  })
  .catch(err => console.error(err));
