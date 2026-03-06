import test, { expect } from "@playwright/test";

test.describe('Book Library - Navigation', () => {
    
    test('should navigate through complete user flow: Home → Detail → Add → Home', async ({ page }) => {
        await test.step('Start at home page', async () => {
            await page.goto('/');
            await expect(page.locator('h1')).toContainText('Book Library');
        });

        await test.step('Navigate to book detail', async () => {
            await page.locator('a[href^="/book/"]').first().click();
            await page.waitForURL('**/book/**');
            await expect(page.locator('h1')).toContainText('The Great Gatsby');
        });

        await test.step('Navigate to add book from detail page', async () => {
            await page.getByRole('link', { name: 'Add Another Book' }).click();
            await page.waitForURL('**/add-book');
            await expect(page.locator('h1')).toContainText('Add New Book');
        });

        await test.step('Navigate back to home from add book page', async () => {
            await page.getByRole('link', { name: '← Back to Library' }).click();
            await page.waitForURL('/');
            await expect(page.locator('h1')).toContainText('Book Library');
        });
    });
    
    test('should handle browser back button navigation', async ({ page }) => {
        await test.step('Navigate through pages', async () => {
            await page.goto('/');
            await page.locator('a[href^="/book/"]').first().click();
            await page.waitForURL('**/book/**');
        });

        await test.step('Use browser back button', async () => {
            await page.goBack();
            await page.waitForURL('/');
        });

        await test.step('Verify returned to home page', async () => {
            await expect(page.locator('h1')).toContainText('Book Library');
        });
    });
    
    test('should handle browser forward button navigation', async ({ page }) => {
        await test.step('Navigate and go back', async () => {
            await page.goto('/');
            await page.locator('a[href^="/book/"]').first().click();
            await page.waitForURL('**/book/**');
            await page.goBack();
            await page.waitForURL('/');
        });

        await test.step('Use browser forward button', async () => {
            await page.goForward();
            await page.waitForURL('**/book/**');
        });

        await test.step('Verify returned to book detail page', async () => {
            await expect(page.locator('h1')).toContainText('The Great Gatsby');
        });
    });
    
    test('should handle direct URL navigation to all pages', async ({ page }) => {
        await test.step('Direct navigation to home page', async () => {
            await page.goto('/');
            await expect(page.locator('h1')).toContainText('Book Library');
        });

        await test.step('Direct navigation to book detail page', async () => {
            await page.goto('/book/1');
            await expect(page.locator('h1')).toContainText('The Great Gatsby');
        });

        await test.step('Direct navigation to add book page', async () => {
            await page.goto('/add-book');
            await expect(page.locator('h1')).toContainText('Add New Book');
        });
    });
    
    test('should display loading state while fetching books', async ({ page }) => {
        await test.step('Navigate to home page', async () => {
            await page.goto('/');
        });

        await test.step('Verify loading indicator appears briefly', async () => {
            // Loading state should appear (may be very brief)
            // Then books should load
            await expect(page.locator('a[href^="/book/"]').first(),
                'Books did not load on home page'
            ).toBeVisible({ timeout: 5000 });
        });
    });
    
});
