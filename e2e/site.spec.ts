import { expect, test, type Page } from "@playwright/test";

const pages = ["/", "/pricing", "/this-page-does-not-exist"];
const CONCEPT_URL = "https://offshiftstudio.com.au/concepts/slate-piston";

for (const path of pages) {
  test.describe(`page ${path}`, () => {
    test("renders with a heading and landmarks", async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(path.includes("does-not-exist") ? 404 : 200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("main")).toHaveCount(1);
      await expect(page.getByRole("banner")).toHaveCount(1);
      await expect(page.getByRole("contentinfo")).toHaveCount(1);
    });

    test("is noindex in meta, header", async ({ page, request }) => {
      await page.goto(path);
      const contents = await page.locator('meta[name="robots"]').evaluateAll((els) => els.map((e) => e.getAttribute("content") ?? ""));
      expect(contents.length).toBeGreaterThan(0);
      expect(contents.some((c) => c.includes("noindex") && c.includes("nofollow"))).toBe(true);
      for (const c of contents) expect(c).toContain("noindex");
      const res = await request.get(path);
      expect(res.headers()["x-robots-tag"]).toContain("noindex");
    });

    test("shows the visible concept label linking to OFF/SHIFT", async ({ page }) => {
      await page.goto(path);
      const label = page.getByTestId("concept-label");
      await expect(label).toBeVisible();
      await expect(label).toHaveText("An OFF/SHIFT concept — fictional demonstration");
      await expect(label.getByRole("link")).toHaveAttribute("href", CONCEPT_URL);
    });
  });
}

test("robots.txt disallows everything", async ({ request }) => {
  const res = await request.get("/robots.txt");
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body).toMatch(/User-Agent: \*/i);
  expect(body).toMatch(/Disallow: \//);
  expect(body).not.toMatch(/Allow: \//);
});

test("home page has every required section", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/built on precision/i);
  for (const id of ["services", "diagnose", "how-it-works", "pricing", "book", "visit"]) {
    await expect(page.locator(`section#${id}`)).toHaveCount(1);
  }
  await expect(page.locator("#services .service-card")).toHaveCount(5);
  await expect(page.locator("#how-it-works .step")).toHaveCount(4);
});

async function pickSymptom(page: Page, name: RegExp) {
  await page.getByRole("radio", { name }).click();
}

test("diagnostics panel shows causes and leads to a pre-filled booking", async ({ page }) => {
  await page.goto("/");
  const result = page.getByTestId("dx-result");
  await expect(result).toContainText("Pick a symptom to start");

  await pickSymptom(page, /squeal or grind when braking/i);
  await expect(result).toContainText("Worn brake pads");
  await expect(result).toContainText("Brakes");
  await result.getByRole("link", { name: /book a brakes inspection/i }).click();

  await expect(page).toHaveURL(/#book$/);
  await expect(page.locator("#f-service")).toHaveValue("brakes");
  await expect(page.locator("#f-notes")).toHaveValue(/Squeal or grind when braking/);
});

test("every symptom is selectable by keyboard and maps to a service", async ({ page }) => {
  await page.goto("/");
  const radios = page.getByRole("radio");
  const count = await radios.count();
  expect(count).toBeGreaterThanOrEqual(6);
  await radios.first().focus();
  await page.keyboard.press("Space");
  for (let i = 1; i < count; i++) {
    await page.keyboard.press("ArrowDown");
    await expect(page.getByTestId("dx-result").getByRole("link", { name: /^Book a .* inspection$/ })).toBeVisible();
  }
});

test("booking form validates on the client", async ({ page }) => {
  await page.goto("/");
  const form = page.getByTestId("booking-form");
  await expect(form.getByRole("button", { name: /request a booking/i })).toBeEnabled();
  await form.getByRole("button", { name: /request a booking/i }).click();
  await expect(page.locator(".form__summary")).toContainText("Please fix");
  await expect(page.locator("#f-name")).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByTestId("booking-success")).toHaveCount(0);
});

test("booking form shows a demo success state and never makes a network request", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const origin = new URL(page.url()).origin;
  const marker = "Test Driver";

  const requests: { method: string; url: string; body: string | null; type: string }[] = [];
  page.on("request", (r) => requests.push({ method: r.method(), url: r.url(), body: r.postData(), type: r.resourceType() }));

  const nextSat = new Date();
  nextSat.setDate(nextSat.getDate() + ((6 - nextSat.getDay() + 7) % 7 || 7));
  const pad = (n: number) => String(n).padStart(2, "0");
  const iso = `${nextSat.getFullYear()}-${pad(nextSat.getMonth() + 1)}-${pad(nextSat.getDate())}`;

  await page.fill("#f-name", marker);
  await page.fill("#f-phone", "0400 000 000");
  await page.fill("#f-email", "test@example.com");
  await page.fill("#f-vehicle", "2016 Mazda 3");
  await page.selectOption("#f-service", "logbook");
  await page.fill("#f-date", iso);
  await page.selectOption("#f-window", "early");
  requests.length = 0;
  await page.getByRole("button", { name: /request a booking/i }).click();

  const success = page.getByTestId("booking-success");
  await expect(success).toBeVisible();
  await expect(success).toContainText(/demonstration/i);
  await expect(success).toContainText(/not sent/i);
  await page.waitForTimeout(500);

  expect(page.url().startsWith(origin)).toBe(true);
  expect(new URL(page.url()).search).toBe("");
  expect(requests.filter((r) => r.method !== "GET")).toEqual([]);
  expect(requests.filter((r) => r.type === "document")).toEqual([]);
  const leaked = requests.filter((r) => `${r.url} ${r.body ?? ""}`.includes("Driver") || `${r.url} ${r.body ?? ""}`.includes("example.com"));
  expect(leaked).toEqual([]);
  expect(requests.filter((r) => new URL(r.url).origin !== origin)).toEqual([]);
});

test("form has no action endpoint and the page makes no third-party requests", async ({ page }) => {
  const external: string[] = [];
  page.on("request", (r) => {
    const u = new URL(r.url());
    if (u.origin !== new URL(page.url() === "about:blank" ? "http://localhost:3000" : page.url()).origin && !r.url().startsWith("data:")) {
      external.push(r.url());
    }
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const form = page.getByTestId("booking-form");
  expect(await form.getAttribute("action")).toBeNull();
  expect(external).toEqual([]);
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("content stays readable and every symptom is listed", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/built on precision/i);
    await expect(page.locator("#diagnose")).toContainText("Worn brake pads");
    await expect(page.locator("#diagnose")).toContainText("Faulty oxygen or emissions sensor");
    await expect(page.locator("#pricing")).toContainText("$229");
    await expect(page.locator("#visit")).toContainText("Welshpool");
    await expect(page.getByTestId("concept-label")).toBeVisible();
  });
});

test("pricing page shows every service group", async ({ page }) => {
  await page.goto("/pricing");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/priced in the open/i);
  await expect(page.locator(".price-group")).toHaveCount(5);
});
