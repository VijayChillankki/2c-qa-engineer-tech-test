import test, { expect } from "@playwright/test";

test.describe('Book Library - Error Scenarios', () => {
    
    test('should display 404 error when navigating to non-existent book', async ({ page }) => {
        await test.step('Navigate to non-existent book ID', async () => {
            await page.goto('/book/999');
        });

        await test.step('Verify 404 error is displayed', async () => {
            await expect(page.locator('text=/error/i'),
                'Error message not displayed for non-existent book'
            ).toBeVisible({ timeout: 5000 });
            
            await expect(page.locator('text=/book not found/i'),
                '404 error message not shown for invalid book ID'
            ).toBeVisible();
        });

        await test.step('Verify recovery option is available', async () => {
            await expect(page.getByRole('link', { name: 'Back to Library' }),
                'Back to Library link not available on error page'
            ).toBeVisible();
        });
    });
    
    test('should handle invalid book ID format', async ({ page }) => {
        await test.step('Navigate to book with invalid ID format', async () => {
            await page.goto('/book/invalid-id');
        });

        // Wait for error state to load
        await page.waitForSelector('text=/error/i', { timeout: 5000 });
        
        // Verify error message is displayed
        await expect(page.locator('text=/book not found/i')).toBeVisible();
    });
    
    test('should handle API validation error when adding book', async ({ page }) => {
        await test.step('Navigate to add book page', async () => {
            await page.goto('/add-book');
        });

        await test.step('Bypass HTML5 validation and submit invalid data', async () => {
            // Remove required attributes to test API validation
            await page.locator('#title').evaluate((el: HTMLInputElement) => el.removeAttribute('required'));
            await page.locator('#author').evaluate((el: HTMLInputElement) => el.removeAttribute('required'));
            await page.fill('#pages', '50');
            // Submit empty form
            await page.getByRole('button', { name: 'Add Book' }).click();
        });

        await test.step('Verify API validation error is displayed', async () => {
            await expect(page.locator('text=/title.*author.*required/i'),
                'API validation error not displayed for missing required fields'
            ).toBeVisible({ timeout: 5000 });
        });

        await test.step('Verify user remains on form page', async () => {
            await expect(page,
                'User was redirected despite validation error'
            ).toHaveURL(/.*add-book/);
        });
    });
    
});
