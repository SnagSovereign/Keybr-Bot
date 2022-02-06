const puppeteer = require("puppeteer-extra");
// Stealth Plugin is necessary for logging into google account
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const completeKeybrPractice = async () => {
  // non-headless browser so the user can see what the bot is doing
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // logs into your google account
  await page.goto("https://www.keybr.com/auth/oauth-init/google");
  await page.waitForSelector('input[type="email"]', { visible: true });
  await page.type('input[type="email"]', "youremail@gmail.com");
  await page.keyboard.press("Enter");
  await page.waitForSelector('input[type="password"]', { visible: true });
  await page.type('input[type="password"]', "YOUR_GMAIL_PASSWORD");
  await page.keyboard.press("Enter");
  await page.waitForNavigation();

  // navigates to Keybr practice page and clicks on the inputfield
  await page.goto("https://www.keybr.com");
  await page.waitForSelector('input[type="text"]');
  await page.click('input[type="text"]');

  // loop through x amount of practice lessons
  for (let lesson = 0; lesson < 3; lesson++) {
    // stores all of the characters that need to be typed in an array
    let elements = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".tt4sGumlutkEo8jwMfdf")).map(
        (el) => el.textContent
      );
    });

    // remove the first element from the array because it is unnecessary
    elements = elements.slice(1);

    // replaces any '␣' with an actual space
    for (let index = 0; index < elements.length; index++) {
      if (elements[index] === "␣") {
        elements[index] = " ";
      }
    }

    // joins the elements in the array to create a string
    elements = elements.join("");

    // types the required text with a 50 ms delay after each character
    await page.type('input[type="text"]', elements, { delay: 50 });
  }
  // waits 1.5 seconds so the user can see the result before closing
  await page.waitForTimeout(1500);
  await browser.close();
};

completeKeybrPractice();
