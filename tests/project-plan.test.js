const { test, expect } = require('@playwright/test');
const credLogin = require('../cred.json').login

const testCases = [
  {
    title: 'Test Case 1',
    project: 'Cross-functional project plan, Project',
    task: 'Draft project brief',
    column: 'To do',
    tags: ['Non-Priority', 'On track'],
  },
  {
    title: 'Test Case 2',
    project: 'Cross-functional project plan, Project',
    task: 'Schedule kickoff meeting',
    column: 'To do',
    tags: ['Medium', 'At risk'],
  },
  {
    title: 'Test Case 3',
    project: 'Cross-functional project plan, Project',
    task: 'Share timeline with teammates',
    column: 'To do',
    tags: ['High', 'Off track'],
  },
  {
    title: 'Test Case 4',
    project: 'Work Requests',
    task: '[Example] Laptop setup for new hire',
    column: 'New Requests',
    tags: ['Medium priority', 'Low effort', 'New hardware', 'Not Started'],
  },
  {
    title: 'Test Case 5',
    project: 'Work Requests',
    task: '[Example] Password not working',
    column: 'In Progress',
    tags: ['Low effort', 'Low priority', 'Password reset', 'Waiting'],
  },
  {
    title: 'Test Case 6',
    project: 'Work Requests',
    task: '[Example] New keycard for Daniela V',
    column: 'Completed',
    tags: ['Low effort', 'New hardware', 'High Priority', 'Done'],
  },
];

// Utility functions
async function login(page) {
  await page.goto(credLogin.URL);
  await page.fill('input[type="email"]', credLogin.Email);
  await page.click('div[role="button"].LoginButton');
  await page.fill('input[type="password"]', credLogin.Password);
  await page.click('div[role="button"].LoginButton');
}

async function verifyTaskInColumn(page, taskName, columnName, tags) {
  // Create a regex pattern to match any whitespace between words since some have `&nbsp;`
  const regexColumn = new RegExp(columnName.split(' ').join('\\s+'), 'i');
  // Locate the column header
  const boardColumn = page.locator('h3.BoardColumnHeaderTitle').filter({ hasText: regexColumn });
  await expect(boardColumn).toHaveCount(1);
  // Get the full column element
  const columnElement = boardColumn.locator('xpath=ancestor::div[contains(@class, "CommentOnlyBoardColumn")]');
  // Locate the task within the column
  const taskLocator = columnElement.locator('span.BoardCard-taskName').filter({ hasText: taskName });
  await expect(taskLocator).toBeVisible();
  // Find the task card element using XPath to find the ancestor with class 'BoardCard'
  const taskCardElement = taskLocator.locator('xpath=ancestor::div[contains(@class, "BoardCard")]');
  // Iterate over each tag within the task card
  for (const tag of tags) {
    const tagLocator = taskCardElement.locator('span.TypographyPresentation--overflowTruncate').filter({ hasText: tag });
    await expect(tagLocator).toBeVisible();
  }
}

test.describe('Asana Data-Driven Test Suite', () => {
  testCases.forEach(({ title, project, task, column, tags }) => {
    test(title, async ({ page }) => {
      await login(page);
      // Navigate to the specific project
      await page.getByLabel(project).click();
      // Verify the task in the column with tags
      await verifyTaskInColumn(page, task, column, tags);
    });
  });
});
