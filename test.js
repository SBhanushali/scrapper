const puppeteer = require("puppeteer");

(async function launch() {
  for (let instance = 0; instance < 30; ++instance) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log("[" + instance + "] loading...");
    await page.goto("http://www.google.com");
    console.log("[" + instance + "] loaded");
    await browser.close();
  }
})();
