const { test, expect } = require('@playwright/test');
const credLogin = require('../cred.json').login;
const testCases = require('../test-cases.json');

let page;
test.describe('Asana Data-Driven Test Suite', () => {

  test.beforeAll('Login to Asana project',async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    await page.goto(credLogin.URL);
    await page.fill('input[type="email"]', credLogin.Email);
    await page.click('div[role="button"].LoginButton');
    await page.fill('input[type="password"]', credLogin.Password);
    await page.click('div[role="button"].LoginButton');
  });

  test.afterAll('Closing the test page',async () => {
    await page.close();
  });

  testCases.forEach(({ title, project, task, column, tags }) => {
    test(title, async () => {
      const sidebar = page.locator('#asana_sidebar');
      await sidebar.getByLabel(project).click();
      const regexColumn = new RegExp(column.split(' ').join('\\s+'), 'i');
      const boardColumn = page.locator('h3.BoardColumnHeaderTitle').filter({ hasText: regexColumn });
      await expect(boardColumn).toHaveCount(1);
      const columnElement = boardColumn.locator('xpath=ancestor::div[contains(@class, "CommentOnlyBoardColumn")]');
      const taskLocator = columnElement.locator('span.BoardCard-taskName').filter({ hasText: task });
      await expect(taskLocator).toBeVisible();
      const taskCardElement = taskLocator.locator('xpath=ancestor::div[contains(@class, "BoardCard")]');
      for (const tag of tags) {
        const tagLocator = taskCardElement.locator('span.TypographyPresentation--overflowTruncate').filter({ hasText: tag });
        await expect(tagLocator).toBeVisible();
      }
    });
  });
});
