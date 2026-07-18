import { expect, test } from "@playwright/test";

test("navigates to home and renders the title", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Patrick Meenan's Project Playground",
  );
});

test("offers a first-focusable skip link", async ({ page }) => {
  await page.goto("./");
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Skip to main content" });
  await expect(skipLink).toBeFocused();
  await skipLink.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

test("persists an explicit theme selection", async ({ page }) => {
  await page.goto("./");

  // Default theme should be dark (we check HTML has data-theme light or dark)
  const html = page.locator("html");

  // Click the 'Light' option label
  await page.locator('label:has-text("Light")').click();
  await expect(html).toHaveAttribute("data-theme", "light");

  // Reload and verify theme is persisted
  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "light");
  await expect(page.getByRole("radio", { name: "Light" })).toBeChecked();

  // Click 'Dark' option label
  await page.locator('label:has-text("Dark")').click();
  await expect(html).toHaveAttribute("data-theme", "dark");

  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("radio", { name: "Dark" })).toBeChecked();
});

test("system theme follows prefers-color-scheme changes", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("./");

  // Click 'System' option label
  await page.locator('label:has-text("System")').click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("renders correct header profile links", async ({ page }) => {
  await page.goto("./");
  const nav = page.getByRole("navigation", { name: "Profile links" });

  await expect(nav.locator('a[aria-label="GitHub Profile"]')).toHaveAttribute(
    "href",
    "https://github.com/pmeenan",
  );
  await expect(nav.locator('a[aria-label="Blog"]')).toHaveAttribute(
    "href",
    "https://blog.patrickmeenan.com",
  );
  await expect(nav.locator('a[aria-label="Twitter / X Profile"]')).toHaveAttribute(
    "href",
    "https://x.com/patmeenan",
  );
  await expect(nav.locator('a[aria-label="Bluesky Profile"]')).toHaveAttribute(
    "href",
    "https://bsky.app/profile/patmeenan.com",
  );
});

test("renders hero and swaps theme-based hero images", async ({ page }) => {
  await page.goto("./");

  // Verify heading and subheading
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Patrick Meenan's Project Playground",
  );
  // Match a stable prefix so copy tuning (e.g. the parenthetical) doesn't break the smoke test.
  await expect(page.locator(".hero-subtitle")).toContainText(
    "Tools and projects I built for fun or my own use",
  );

  // The hero art is a theme-scoped CSS background so only the active theme's
  // image is fetched. Assert the computed background swaps and never carries
  // the off-theme image (D-016).
  const heroBg = page.locator(".hero-bg");
  const bgImage = () => heroBg.evaluate((el) => getComputedStyle(el).backgroundImage);

  await page.locator('label:has-text("Dark")').click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const darkBg = await bgImage();
  expect(darkBg).toContain("hero-dark");
  expect(darkBg).not.toContain("hero-light");

  await page.locator('label:has-text("Light")').click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  const lightBg = await bgImage();
  expect(lightBg).toContain("hero-light");
  expect(lightBg).not.toContain("hero-dark");
});

test("renders correct footer text and copyright year", async ({ page }) => {
  await page.goto("./");
  const footer = page.locator(".site-footer");
  const currentYear = new Date().getFullYear().toString();

  await expect(footer).toContainText(`© ${currentYear} Patrick Meenan`);
  await expect(footer).toContainText("Licensed under Apache-2.0");
  await expect(footer).toContainText("Built with Astro, by AI agents under human direction.");
});

test("renders 404 page correctly", async ({ page }) => {
  await page.goto("./404/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page Not Found");
});

test("renders exactly 2 project cards with correct contents", async ({ page }) => {
  await page.goto("./");

  const cards = page.locator(".project-card");
  await expect(cards).toHaveCount(2);

  // Assert Waterfall Tools details
  const wtCard = cards.filter({ hasText: "Waterfall Tools" });
  await expect(wtCard).toBeVisible();
  await expect(wtCard.locator(".status-badge")).toHaveText("Launched");
  await expect(wtCard.locator(".card-blurb")).toContainText(
    "A fast, zero-bloat browser and Node.js library",
  );
  await expect(
    wtCard.locator('a[aria-label="Visit Waterfall Tools live website"]'),
  ).toHaveAttribute("href", "https://waterfall-tools.com/");
  await expect(
    wtCard.locator('a[aria-label="View Waterfall Tools source on GitHub"]'),
  ).toHaveAttribute("href", "https://github.com/pmeenan/waterfall-tools");
  await expect(
    wtCard.locator('a[aria-label="Read blog post about Waterfall Tools"]'),
  ).toHaveAttribute(
    "href",
    "https://blog.patrickmeenan.com/2026/04/12/introducing-waterfall-tools/",
  );

  // Assert Golemine details
  const golemCard = cards.filter({ hasText: "Golemine" });
  await expect(golemCard).toBeVisible();
  await expect(golemCard.locator(".status-badge")).toHaveText("Beta");
  await expect(golemCard.locator(".card-blurb")).toContainText(
    "A secure, browser-based iTunes and Finder backup explorer",
  );
  await expect(golemCard.locator('a[aria-label="Visit Golemine live website"]')).toHaveAttribute(
    "href",
    "https://golemine.com",
  );
  await expect(golemCard.locator('a[aria-label="View Golemine source on GitHub"]')).toHaveAttribute(
    "href",
    "https://github.com/pmeenan/golemine",
  );
  // Golemine does not have a blog link; verify it is omitted
  await expect(golemCard.locator('a[aria-label^="Read blog post"]')).toHaveCount(0);
});

test("sort controls are hidden when JS is disabled", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("./");
  const sortControls = page.locator("#sort-controls");
  await expect(sortControls).toBeHidden();
  await context.close();
});

test("sort controls are visible and toggle active states when JS is enabled", async ({ page }) => {
  await page.goto("./");

  const sortControls = page.locator("#sort-controls");
  await expect(sortControls).toBeVisible();

  const newestBtn = page.locator('.sort-btn[data-sort="newest"]');
  const titleBtn = page.locator('.sort-btn[data-sort="title"]');

  // Default active state should be newest-first
  await expect(newestBtn).toHaveAttribute("aria-pressed", "true");
  await expect(newestBtn).toHaveClass(/active/);
  await expect(titleBtn).toHaveAttribute("aria-pressed", "false");
  await expect(titleBtn).not.toHaveClass(/active/);

  // Default card order (newest first): Golemine, then Waterfall Tools
  const cardTitles = page.locator(".project-card .card-title");
  await expect(cardTitles.nth(0)).toHaveText("Golemine");
  await expect(cardTitles.nth(1)).toHaveText("Waterfall Tools");

  // Click "Project" sorting button
  await titleBtn.click();
  await expect(titleBtn).toHaveAttribute("aria-pressed", "true");
  await expect(titleBtn).toHaveClass(/active/);
  await expect(newestBtn).toHaveAttribute("aria-pressed", "false");
  await expect(newestBtn).not.toHaveClass(/active/);

  // Alphabetical (A-Z) order for Golemine (G) and Waterfall Tools (W) is also Golemine, then Waterfall Tools
  await expect(cardTitles.nth(0)).toHaveText("Golemine");
  await expect(cardTitles.nth(1)).toHaveText("Waterfall Tools");

  // Go back to newest
  await newestBtn.click();
  await expect(newestBtn).toHaveAttribute("aria-pressed", "true");
  await expect(newestBtn).toHaveClass(/active/);
});

test("renders correct favicon link tags in the head", async ({ page }) => {
  await page.goto("./");
  const svgFavicon = page.locator('link[rel="icon"][type="image/svg+xml"]');
  await expect(svgFavicon).toHaveAttribute("href", "/favicon.svg");

  const icoFavicon = page.locator('link[rel="icon"][sizes="any"]');
  await expect(icoFavicon).toHaveAttribute("href", "/favicon.ico");
});
