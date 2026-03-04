import test, { expect } from "@playwright/test";

test.describe('Book Library - Book Detail Page', () => {
    
    test('should navigate to book detail page when clicking a book', async ({ page }) => {
        // Navigate to home page
        await page.goto('/');
        
        // Wait for books to load
        await page.waitForSelector('a[href^="/book/"]', { timeout: 5000 });
        
        // Click on the first book (The Great Gatsby)
        const firstBook = page.locator('a[href^="/book/"]').first();
        await firstBook.click();
        
        // Wait for navigation to book detail page
        await page.waitForURL('**/book/1');
        
        // Verify we're on the book detail page
        await expect(page.locator('h1')).toContainText('The Great Gatsby');
        
        // Verify book details are displayed
        await expect(page.locator('text=by F. Scott Fitzgerald')).toBeVisible();
        await expect(page.locator('text=Classic')).toBeVisible();
        await expect(page.locator('text=1925')).toBeVisible();
        await expect(page.locator('text=180 pages')).toBeVisible();
        await expect(page.locator('text=978-0743273565')).toBeVisible();
        
        // Verify rating is displayed in top right corner
        await expect(page.locator('.text-2xl.font-bold').filter({ hasText: '4.2' })).toBeVisible();
        
        // Verify rating is displayed in the rating section with stars
        await expect(page.locator('text=(4.2/5)')).toBeVisible();
        
        // Verify description is present
        await expect(page.locator('text=/decadence and excess/i')).toBeVisible();
        
        // Verify navigation buttons are present
        await expect(page.getByRole('link', { name: /^Back to Library$/ })).toBeVisible();
        await expect(page.getByRole('link', { name: '← Back to Library' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Add Another Book' })).toBeVisible();
    });
    
    test('should display 404 error for non-existent book', async ({ page }) => {
        // Navigate directly to a non-existent book ID
        await page.goto('/book/999');
        
        // Wait for error state to load
        await page.waitForSelector('text=/error/i', { timeout: 5000 });
        
        // Verify error message is displayed
        await expect(page.locator('text=/book not found/i')).toBeVisible();
        
        // Verify "Back to Library" link is present
        await expect(page.getByRole('link', { name: 'Back to Library' })).toBeVisible();
    });
    
});
