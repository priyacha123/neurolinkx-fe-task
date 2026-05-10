import { test, expect } from "@playwright/test";

test("user can login and see dashboard", async ({ page }) => {
  await page.goto("/login");

  await page.fill('input[type="email"]', "admin@neurolinkx.com");
  await page.fill('input[type="password"]', "password123");
  
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL("/dashboard");
  await expect(page.locator("h2")).toContainText("Overview");
  await expect(page.locator("aside")).toBeVisible();
});

test("user can navigate to shipments", async ({ page }) => {
  await page.goto("/login");
  await page.fill('input[type="email"]', "admin@neurolinkx.com");
  await page.fill('input[type="password"]', "password123");
  await page.click('button[type="submit"]');

  await page.click('text=Shipments');
  await expect(page).toHaveURL("/dashboard/shipments");
  await expect(page.locator("h2")).toContainText("Shipments");
});
