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

  // Click the 'Light' option text
  await page.getByText("Light", { exact: true }).click();
  await expect(html).toHaveAttribute("data-theme", "light");

  // Reload and verify theme is persisted
  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "light");
  await expect(page.getByRole("radio", { name: "Light" })).toBeChecked();

  // Click 'Dark' option text
  await page.getByText("Dark", { exact: true }).click();
  await expect(html).toHaveAttribute("data-theme", "dark");

  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("radio", { name: "Dark" })).toBeChecked();
});

test("system theme follows prefers-color-scheme changes", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("./");

  // Click 'System' option text
  await page.getByText("System", { exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("renders 404 page correctly", async ({ page }) => {
  await page.goto("./404/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page Not Found");
});
