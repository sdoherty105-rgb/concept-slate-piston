import { expect, test, type Page } from "@playwright/test";

const pages = ["/", "/prices", "/book", "/services/brakes", "/services/general", "/this-page-does-not-exist"];
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

test("home is a console, not a card grid", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/what the car is doing/i);
  const layouts = await page.locator("[data-layout]").evaluateAll((els) => els.map((e) => e.getAttribute("data-layout")));
  expect(layouts).toEqual(["console", "orthographic", "spec-sheet", "price-table", "job-track", "bay-grid", "floor-plan"]);
  await expect(page.locator(".sheet")).toHaveCount(6);
  await expect(page.locator(".tracker li")).toHaveCount(4);
  await expect(page.locator(".service-card")).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  await expect(page.getByText("Demo data, Perth clock")).toBeVisible();
});

test("concept label is inside the first viewport at 390 and 1440", async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    const box = await page.getByTestId("concept-label").boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y + box!.height).toBeLessThan(800);
  }
});

async function pickSymptom(page: Page, name: RegExp) {
  await page.locator(".symptom").filter({ hasText: name }).locator("label").click();
}

test("symptom gauge names a cause and leads to a pre-filled booking", async ({ page }) => {
  await page.goto("/");
  const result = page.getByTestId("dx-result");
  await expect(result).toContainText("Pick a symptom to start");

  await pickSymptom(page, /squealing when i brake/i);
  await expect(result).toContainText("Worn brake pads");
  await expect(result).toContainText("Brakes");
  await result.getByRole("link", { name: /book a brakes inspection/i }).click();

  await expect(page).toHaveURL(/\/book$/);
  await expect(page.locator("#f-service")).toHaveValue("brakes");
  await expect(page.locator("#f-notes")).toHaveValue(/Squealing when I brake/);
});

test("every console symptom is selectable by keyboard and maps to a service", async ({ page }) => {
  await page.goto("/");
  const radios = page.locator("#diagnose .symptom input");
  await expect(radios).toHaveCount(6);
  await radios.first().focus();
  await page.keyboard.press("Space");
  for (let i = 1; i < 6; i++) {
    await page.keyboard.press("ArrowDown");
    await expect(page.getByTestId("dx-result").getByRole("link", { name: /^Book a .* inspection$/ })).toBeVisible();
  }
});

test("booking form validates on the client", async ({ page }) => {
  await page.goto("/book");
  const form = page.getByTestId("booking-form");
  await expect(form.getByRole("button", { name: /request a booking/i })).toBeEnabled();
  await form.getByRole("button", { name: /request a booking/i }).click();
  await expect(page.locator(".form__summary")).toContainText("Please fix");
  await expect(page.locator("#f-name")).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByTestId("booking-success")).toHaveCount(0);
});

test("booking form shows a demo success state and never makes a network request", async ({ page }) => {
  await page.goto("/book");
  await page.waitForLoadState("networkidle");
  const origin = new URL(page.url()).origin;
  const marker = "Test Driver";

  const requests: { method: string; url: string; body: string | null; type: string }[] = [];
  page.on("request", (r) => requests.push({ method: r.method(), url: r.url(), body: r.postData(), type: r.resourceType() }));

  await page.locator(".slot label").first().click();
  await page.fill("#f-name", marker);
  await page.fill("#f-phone", "0400 000 000");
  await page.fill("#f-email", "test@example.com");
  await page.fill("#f-vehicle", "2016 Mazda 3");
  await page.selectOption("#f-service", "logbook");
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

test("form has no action endpoint and the page makes no third-party requests", async ({ page, baseURL }) => {
  const external: string[] = [];
  page.on("request", (r) => {
    const u = new URL(r.url());
    if (u.origin !== new URL(baseURL!).origin && !r.url().startsWith("data:")) external.push(r.url());
  });
  await page.goto("/book");
  await page.waitForLoadState("networkidle");
  const form = page.getByTestId("booking-form");
  expect(await form.getAttribute("action")).toBeNull();
  expect(external).toEqual([]);
});

function contrast(fg: number[], bg: number[]) {
  const lin = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const L = (rgb: number[]) => 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
  const [a, b] = [L(fg), L(bg)];
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

async function pair(page: Page, selector: string) {
  return page.locator(selector).evaluate((el) => {
    const parse = (color: string) => {
      const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (!m) return null;
      return { rgb: [Number(m[1]), Number(m[2]), Number(m[3])], a: m[4] === undefined ? 1 : Number(m[4]) };
    };
    const fg = parse(getComputedStyle(el).color);
    let node: Element | null = el;
    let bg: { rgb: number[]; a: number } | null = null;
    while (node) {
      const candidate = parse(getComputedStyle(node).backgroundColor);
      if (candidate && candidate.a > 0.9) {
        bg = candidate;
        break;
      }
      node = node.parentElement;
    }
    return { fg: fg?.rgb ?? [0, 0, 0], bg: bg?.rgb ?? [255, 255, 255] };
  });
}

test("booking labels and inputs stay visible in carbon and daylight", async ({ page }) => {
  await page.goto("/book");
  for (const mode of ["carbon", "day"] as const) {
    if (mode === "day") await page.getByRole("button", { name: /daylight/i }).click();
    const label = await pair(page, "label[for='f-name']");
    const input = await pair(page, "#f-name");
    expect(contrast(label.fg, label.bg), `${mode} label`).toBeGreaterThanOrEqual(4.5);
    expect(contrast(input.fg, input.bg), `${mode} input`).toBeGreaterThanOrEqual(4.5);
    const inputBorder = await page.locator("#f-name").evaluate((el) => getComputedStyle(el).borderTopColor);
    expect(inputBorder).not.toBe("rgba(0, 0, 0, 0)");
  }
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("content stays readable and every console symptom is listed", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/what the car is doing/i);
    await expect(page.locator("#diagnose")).toContainText("Worn brake pads");
    await expect(page.locator("#diagnose")).toContainText("Faulty oxygen or emissions sensor");
    await expect(page.locator("#prices")).toContainText("$229");
    await expect(page.locator("#workshop")).toContainText("Welshpool");
    await expect(page.getByRole("link", { name: "Squealing when I brake" })).toHaveAttribute("href", "/services/brakes");
    await expect(page.getByTestId("concept-label")).toBeVisible();
  });
});

test("prices page shows every service group", async ({ page }) => {
  await page.goto("/prices");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/fixed price/i);
  await expect(page.locator(".price-group")).toHaveCount(5);
  await expect(page.getByText(/demonstration price/i).first()).toBeVisible();
});

test("brake sheet is a specification, with the one render", async ({ page }) => {
  await page.goto("/services/brakes");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/brake inspection/i);
  await expect(page.locator(".checks li")).toHaveCount(6);
  await expect(page.locator(".render img")).toHaveCount(1);
  await expect(page.getByText(/demonstration band/i)).toBeVisible();
});

test.describe("OFF/SHIFT showroom links", () => {
  const ENQUIRY = "https://offshiftstudio.com.au/?concept=slate-piston#contact";
  for (const path of ["/", "/book", "/prices", "/services/brakes"]) {
    test(`${path} has the enquiry CTA, the return link and the disclosure`, async ({ page }) => {
      await page.goto(path);
      const cta = page.getByTestId("studio-cta");
      await expect(cta).toBeVisible();
      await expect(cta).toHaveText("Want a website like this?");
      await expect(cta).toHaveAttribute("href", ENQUIRY);
      const foot = page.getByRole("contentinfo");
      await expect(foot.getByRole("link", { name: "Start a project with OFF/SHIFT" })).toHaveAttribute("href", ENQUIRY);
      await expect(foot.getByRole("link", { name: "Back to the concept page" })).toHaveAttribute("href", CONCEPT_URL);
      await expect(foot).toContainText("Slate Piston is not a real business");
    });
  }
});

test.describe("mobile 390", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test("no horizontal overflow at 390 or 320, and the CTA is in the first screen", async ({ page }) => {
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      for (const path of ["/", "/book", "/prices", "/services/brakes"]) {
        await page.goto(path);
        const sw = await page.evaluate(() => document.documentElement.scrollWidth);
        expect(sw, `${path} at ${width}`).toBeLessThanOrEqual(width);
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const box = await page.getByTestId("studio-cta").boundingBox();
    expect(box!.y + box!.height).toBeLessThan(844 - 64);
  });

  test("symptom and bay carry through the summary strip into the booking form", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("summary-strip")).toHaveCount(0);
    await pickSymptom(page, /squealing when i brake/i);
    const strip = page.getByTestId("summary-strip");
    await expect(strip).toContainText("Squealing when I brake");
    await page.locator("#schedule .day-picker label").nth(2).click();
    await page.locator("#schedule .slot label").filter({ visible: true }).first().click();
    await expect(page.locator("#schedule .scheduler__chosen")).toContainText("Bay");
    await strip.getByRole("link", { name: "Book" }).click();
    await expect(page).toHaveURL(/\/book$/);
    await expect(page.locator("#f-service")).toHaveValue("brakes");
    // The day picker follows the chosen bay, so the selected cell is on screen.
    await expect(page.locator(".slot input:checked + label")).toBeVisible();
    await expect(page.locator(".slot input:checked + label")).toContainText("Selected");
  });
});
