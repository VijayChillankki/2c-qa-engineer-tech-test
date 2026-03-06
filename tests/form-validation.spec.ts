import test, { expect } from "@playwright/test";

test.describe('Book Library - Form Validation', () => {
    
    test('should show validation error when submitting empty form', async ({ page }) => {
        await test.step('Navigate to add book page', async () => {
            await page.goto('/add-book');
            await expect(page.locator('h1'), 
                'Failed to load add book page'
            ).toContainText('Add New Book');
        });

        await test.step('Submit form without filling any fields', async () => {
            await page.getByRole('button', { name: 'Add Book' }).click();
        });

        await test.step('Verify validation prevents submission', async () => {
            // HTML5 validation should prevent submission
            // Form should still be on add-book page (no redirect)
            await expect(page, 
                'Form validation failed - page redirected despite empty required fields'
            ).toHaveURL(/.*add-book/);
            
            // Verify required field validation (browser native validation)
            const titleInput = page.locator('#title');
            const isInvalid = await titleInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
            expect(isInvalid, 
                'Title field should be invalid when empty'
            ).toBeTruthy();
        });
    });
    
    test('should show API validation error when title is missing', async ({ page }) => {
        await test.step('Navigate to add book page', async () => {
            await page.goto('/add-book');
        });

        await test.step('Fill only author field (missing title)', async () => {
            // Remove required attribute to bypass HTML5 validation for testing API validation
            await page.locator('#title').evaluate((el: HTMLInputElement) => el.removeAttribute('required'));
            await page.fill('#author', 'Test Author');
            await page.fill('#pages', '50');
        });

        await test.step('Submit form and verify API error', async () => {
            await page.getByRole('button', { name: 'Add Book' }).click();
            
            // Wait for error message from API
            await expect(page.locator('text=/title.*required/i'),
                'API validation error not displayed for missing title'
            ).toBeVisible({ timeout: 5000 });
        });
    });
    
    test('should show API validation error when author is missing', async ({ page }) => {
        await test.step('Navigate to add book page', async () => {
            await page.goto('/add-book');
        });

        await test.step('Fill only title field (missing author)', async () => {
            // Remove required attribute to bypass HTML5 validation
            await page.locator('#author').evaluate((el: HTMLInputElement) => el.removeAttribute('required'));
            await page.fill('#title', 'Test Book');
            await page.fill('#pages', '50');
        });

        await test.step('Submit form and verify API error', async () => {
            await page.getByRole('button', { name: 'Add Book' }).click();
            
            // Wait for error message from API
            await expect(page.locator('text=/author.*required/i'),
                'API validation error not displayed for missing author'
            ).toBeVisible({ timeout: 5000 });
        });
    });
    
    test('should validate year field accepts only valid years', async ({ page }) => {
        await test.step('Navigate to add book page', async () => {
            await page.goto('/add-book');
        });

        await test.step('Try to enter invalid year', async () => {
            await page.fill('#title', 'Test Book');
            await page.fill('#author', 'Test Author');
            
            // Try to enter year beyond max (current year + 1)
            const currentYear = new Date().getFullYear();
            const invalidYear = (currentYear + 10).toString();
            await page.fill('#publishedYear', invalidYear);
            
            // Check if input validation works
            const yearInput = page.locator('#publishedYear');
            const inputValue = await yearInput.inputValue();
            
            // HTML5 validation should prevent invalid year
            const isValid = await yearInput.evaluate((el: HTMLInputElement) => el.validity.valid);
            expect(isValid, 
                `Year validation failed - accepted invalid year: ${invalidYear}`
            ).toBeFalsy();
        });
    });
    
    test('should validate rating is between 0 and 5', async ({ page }) => {
        await test.step('Navigate to add book page', async () => {
            await page.goto('/add-book');
        });

        await test.step('Try to enter rating above maximum', async () => {
            await page.fill('#title', 'Test Book');
            await page.fill('#author', 'Test Author');
            await page.fill('#rating', '10');
            
            // Check HTML5 validation
            const ratingInput = page.locator('#rating');
            const isValid = await ratingInput.evaluate((el: HTMLInputElement) => el.validity.valid);
            expect(isValid,
                'Rating validation failed - accepted value above 5'
            ).toBeFalsy();
        });
    });
    
});
