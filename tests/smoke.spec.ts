import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

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
test("renders project cards with expected structure and fields matching content files", async ({
  page,
}) => {
  await page.goto("./");

  // Read the actual project files from the content directory dynamically
  const projectsDir = path.join(process.cwd(), "src/content/projects");
  const projectFiles = fs.readdirSync(projectsDir).filter((f) => f.endsWith(".json"));
  const expectedCount = projectFiles.length;

  const cards = page.locator(".project-card");
  await expect(cards).toHaveCount(expectedCount);

  // Validate dynamic constraints for each card
  for (let i = 0; i < expectedCount; i++) {
    const card = cards.nth(i);
    await expect(card).toBeVisible();

    // Check title presence
    const title = card.locator(".card-title");
    await expect(title).toBeVisible();
    const titleText = await title.innerText();
    expect(titleText.trim().length).toBeGreaterThan(0);

    // Check status badge
    const badge = card.locator(".status-badge");
    await expect(badge).toBeVisible();
    const badgeText = await badge.innerText();
    expect(["LAUNCHED", "BETA", "IN DEVELOPMENT"]).toContain(badgeText.toUpperCase());

    // Check blurb
    const blurb = card.locator(".card-blurb");
    await expect(blurb).toBeVisible();
    const blurbText = await blurb.innerText();
    expect(blurbText.trim().length).toBeGreaterThan(0);

    // Check link container and links
    const linkContainer = card.locator(".card-links");
    await expect(linkContainer).toBeVisible();
    const links = linkContainer.locator("a.card-link");
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);

    // Validate structure of each button link
    for (let j = 0; j < linkCount; j++) {
      const link = links.nth(j);
      await expect(link).toHaveAttribute("href", /^https?:\/\//);
      await expect(link).toHaveAttribute("aria-label");
      const label = await link.getAttribute("aria-label");
      expect(label?.trim().length).toBeGreaterThan(0);
    }
  }
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

  // Helper to extract sorting attributes from page
  const getCardAttributes = async (attr: string) => {
    return page.locator(".project-card").evaluateAll((elements, attributeName) => {
      return elements.map((el) => el.getAttribute(attributeName) || "");
    }, attr);
  };

  // 1. Verify default newest-first ordering (dates descending)
  const defaultDates = await getCardAttributes("data-published");
  const sortedDatesDescending = [...defaultDates].sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );
  expect(defaultDates).toEqual(sortedDatesDescending);

  // 2. Click "Project" sorting button (alphabetical A-Z)
  await titleBtn.click();
  await expect(titleBtn).toHaveAttribute("aria-pressed", "true");
  await expect(titleBtn).toHaveClass(/active/);
  await expect(newestBtn).toHaveAttribute("aria-pressed", "false");
  await expect(newestBtn).not.toHaveClass(/active/);

  // Verify alphabetical sorting (titles ascending)
  const alphabeticalTitles = await getCardAttributes("data-title");
  const sortedTitlesAscending = [...alphabeticalTitles].sort((a, b) => a.localeCompare(b));
  expect(alphabeticalTitles).toEqual(sortedTitlesAscending);

  // 3. Click "Newest" sorting button to return to default
  await newestBtn.click();
  await expect(newestBtn).toHaveAttribute("aria-pressed", "true");
  await expect(newestBtn).toHaveClass(/active/);
  await expect(titleBtn).toHaveAttribute("aria-pressed", "false");
  await expect(titleBtn).not.toHaveClass(/active/);

  // Re-verify newest-first order
  const returnedDates = await getCardAttributes("data-published");
  expect(returnedDates).toEqual(sortedDatesDescending);
});

test("makes project cards clickable to site links while leaving sub-links interactive", async ({
  page,
}) => {
  await page.goto("./");

  // Find all cards
  const cards = page.locator(".project-card");
  const count = await cards.count();

  // Test at least one card that has a site link
  let testedCardWithSite = false;

  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    const siteLink = card.locator("a.site-link");
    const hasSiteLink = (await siteLink.count()) > 0;

    if (hasSiteLink) {
      testedCardWithSite = true;
      const targetUrl = await siteLink.getAttribute("href");
      expect(targetUrl).not.toBeNull();

      // Stretched link must exist, point to site URL, and be accessibility-hidden
      const stretchedLink = card.locator("a.card-stretched-link");
      await expect(stretchedLink).toBeVisible();
      await expect(stretchedLink).toHaveAttribute("href", targetUrl!);
      await expect(stretchedLink).toHaveAttribute("aria-hidden", "true");
      await expect(stretchedLink).toHaveAttribute("tabindex", "-1");

      // Verify other sub-links in card-links (like GitHub or Blog) are interactive and have higher z-index
      // relative to the stretched link overlay
      const linksContainer = card.locator(".card-links");
      await expect(linksContainer).toHaveCSS("position", "relative");
      await expect(linksContainer).toHaveCSS("z-index", "2");
    }
  }

  // Sanity check to make sure our test actually tested at least one site-linked card
  expect(testedCardWithSite).toBe(true);
});

test("renders correct favicon link tags in the head", async ({ page }) => {
  await page.goto("./");
  const svgFavicon = page.locator('link[rel="icon"][type="image/svg+xml"]');
  await expect(svgFavicon).toHaveAttribute("href", "/favicon.svg");

  const icoFavicon = page.locator('link[rel="icon"][sizes="any"]');
  await expect(icoFavicon).toHaveAttribute("href", "/favicon.ico");
});
