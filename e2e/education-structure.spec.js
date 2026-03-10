const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

// Rules disabled because they concern the host page or design system, not the widget logic:
// - color-contrast: design system responsibility
// - html-has-lang: dev server template lacks lang attr; real host pages provide it
// - page-has-heading-one: widget is embedded; host page provides h1
// - heading-order: recursive module nesting produces deep aria-levels by design
const AXE_DISABLE_RULES = ['color-contrast', 'html-has-lang', 'page-has-heading-one', 'heading-order'];

// Derive a filesystem-safe slug from an option label
// e.g. "Historian kandiohjelma … [KH40_006]" → "kh40-006"
function slugify(text) {
  const codeMatch = text.match(/\[([^\]]+)\]/);
  if (codeMatch) {
    return codeMatch[1].toLowerCase().replaceAll(/[^a-z0-9]+/g, '-');
  }
  return text.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replaceAll(/(^-|-$)/g, '');
}

test.describe('Education structure view', () => {
  test.beforeEach(async ({ page }) => {
    // Block Cookiebot to prevent consent banner from affecting screenshots
    await page.route('**/consent.cookiebot.com/**', (route) => route.abort());
  });

  test('initial page passes accessibility checks', async ({ page }) => {
    await page.goto('/');

    const combobox = page.getByRole('combobox', { name: 'Tutkinto-ohjelmat' });
    await expect(combobox).toBeVisible();

    const initialResults = await new AxeBuilder({ page })
      .disableRules(AXE_DISABLE_RULES)
      .analyze();
    expect(initialResults.violations).toEqual([]);
  });

  test('initial page matches screenshot', async ({ page }) => {
    await page.goto('/');

    const combobox = page.getByRole('combobox', { name: 'Tutkinto-ohjelmat' });
    await expect(combobox).toBeVisible();

    await expect(page).toHaveScreenshot('initial-page.png', { fullPage: true });
  });

  test('each programme passes accessibility checks and matches screenshot', async ({ page }) => {
    test.slow();
    await page.goto('/');

    const combobox = page.getByRole('combobox', { name: 'Tutkinto-ohjelmat' });
    await expect(combobox).toBeVisible();

    // Collect all available option labels from the combobox
    const optionLocator = 'eduviewer-ds-combobox eduviewer-ds-option';
    const optionLabels = await page.locator(optionLocator).allTextContents();

    // Sequential iteration is intentional — each step depends on the previous
    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    for (const label of optionLabels) {
      const slug = slugify(label);
      const searchText = label.split(' [')[0];

      // Select the programme
      await combobox.fill(searchText);
      await page.getByRole('option', { name: searchText }).click();

      // Wait for content to load
      await expect(page.locator('eduviewer-ds-spinner')).toBeHidden();
      await expect(page.locator('#rootRule')).toBeVisible();

      // Axe accessibility check on loaded content
      const loadedResults = await new AxeBuilder({ page })
        .disableRules(AXE_DISABLE_RULES)
        .analyze();
      expect(loadedResults.violations).toEqual([]);

      // Expand full structure
      await page.getByRole('button', { name: 'Avaa koko rakenne' }).click();
      await expect(
        page.getByRole('button', { name: 'Sulje koko rakenne' }),
      ).toBeVisible();

      // Wait for expansion animations to settle
      await page.waitForTimeout(1000);

      // Axe accessibility check on expanded state
      const expandedResults = await new AxeBuilder({ page })
        .disableRules(AXE_DISABLE_RULES)
        .analyze();
      expect(expandedResults.violations).toEqual([]);

      // Visual regression screenshot
      await expect(page).toHaveScreenshot(
        `${slug}-expanded.png`,
        { fullPage: true },
      );

      // Navigate back to select the next programme
      await page.goto('/');
      await expect(combobox).toBeVisible();
    }
    /* eslint-enable no-restricted-syntax, no-await-in-loop */
  });
});
