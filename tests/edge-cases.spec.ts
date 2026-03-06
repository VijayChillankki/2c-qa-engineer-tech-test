import test, { expect } from "@playwright/test";

test.describe('Book Library - Edge Cases', () => {
    
    test('should handle special characters in book title and author', async ({ page }) => {
        await test.step('Navigate to add book page', async () => {
            await page.goto('/add-book');
        });

        await test.step('Enter book with special characters', async () => {
            await page.fill('#title', 'Test & "Special" Characters: <Title>');
            await page.fill('#author', "O'Brien & Co. - Author's Name");
            await page.fill('#description', 'Description with special chars: @#$%^&*()');
            await page.fill('#pages', '3');
        });

        await test.step('Submit form', async () => {
            await page.getByRole('button', { name: 'Add Book' }).click();
        });

        await test.step('Verify special characters are preserved', async () => {
            await expect(page.locator('text=/Book Added Successfully/i')).toBeVisible({ timeout: 5000 });
            await page.waitForURL('**/book/**', { timeout: 5000 });
            
            // Verify title with special characters is displayed
            await expect(page.locator('h1')).toContainText('Test & "Special" Characters');
            await expect(page.locator('text=/O\'Brien & Co/i')).toBeVisible();
        });
    });
    
    test('should handle very long text in book fields', async ({ page }) => {
        const longTitle = 'A'.repeat(200);
        const longAuthor = 'B'.repeat(150);
        const longDescription = 'This is a very long description. '.repeat(50);
        
        await test.step('Navigate to add book page', async () => {
            await page.goto('/add-book');
        });

        await test.step('Enter book with very long text', async () => {
            await page.fill('#title', longTitle);
            await page.fill('#author', longAuthor);
            await page.fill('#description', longDescription);
            await page.fill('#pages', '5');
        });

        await test.step('Submit form', async () => {
            await page.getByRole('button', { name: 'Add Book' }).click();
        });

        await test.step('Verify long text is handled', async () => {
            await expect(page.locator('text=/Book Added Successfully/i')).toBeVisible({ timeout: 5000 });
            await page.waitForURL('**/book/**', { timeout: 5000 });
            
            // Verify book was created (title should be visible, possibly truncated)
            const titleElement = page.locator('h1');
            await expect(titleElement).toBeVisible();
        });
    });
    
    test('should handle numeric edge cases in form fields', async ({ page }) => {
        await test.step('Navigate to add book page', async () => {
            await page.goto('/add-book');
        });

        await test.step('Enter edge case numeric values', async () => {
            await page.fill('#title', 'Edge Case Book');
            await page.fill('#author', 'Test Author');
            await page.fill('#publishedYear', '1000'); // Minimum year
            await page.fill('#pages', '1'); // Minimum pages
            await page.fill('#rating', '0'); // Minimum rating
        });

        await test.step('Submit form', async () => {
            await page.getByRole('button', { name: 'Add Book' }).click();
        });

        await test.step('Verify edge case values are accepted', async () => {
            await expect(page.locator('text=/Book Added Successfully/i')).toBeVisible({ timeout: 5000 });
            await page.waitForURL('**/book/**', { timeout: 5000 });
            
            await expect(page.locator('h1')).toContainText('Edge Case Book');
            await expect(page.locator('text=1000')).toBeVisible();
            await expect(page.locator('text=1 pages')).toBeVisible();
        });
    });
    
    test('should handle maximum rating value', async ({ page }) => {
        await test.step('Navigate to add book page', async () => {
            await page.goto('/add-book');
        });

        await test.step('Enter book with maximum rating', async () => {
            await page.fill('#title', 'Perfect Book');
            await page.fill('#author', 'Perfect Author');
            await page.fill('#pages', '5');
            await page.fill('#rating', '5'); // Maximum rating
        });

        await test.step('Submit form', async () => {
            await page.getByRole('button', { name: 'Add Book' }).click();
        });

        await test.step('Verify maximum rating is accepted', async () => {
            await expect(page.locator('text=/Book Added Successfully/i')).toBeVisible({ timeout: 5000 });
            await page.waitForURL('**/book/**', { timeout: 5000 });
            
            // Verify rating is displayed in top right corner
            await expect(page.locator('.text-2xl.font-bold').filter({ hasText: '5' })).toBeVisible();
            
            // Verify rating is displayed in the rating section with stars
            await expect(page.locator('text=(5/5)')).toBeVisible();
        });
    });
    
});
