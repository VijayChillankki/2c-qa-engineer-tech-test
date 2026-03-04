import test, { expect } from "@playwright/test";

test.describe('Book Library - Home Page', () => {
    
    test('should display list of books on home page', async ({ page }) => {
        // Navigate to home page
        await page.goto('/');
        
        // Wait for books to load
        await page.waitForSelector('a[href^="/book/"]', { timeout: 5000 });
        
        // Verify page title
        await expect(page.locator('h1')).toContainText('Book Library');
        
        // Verify books are displayed (default data has 5 books)
        const bookCards = page.locator('a[href^="/book/"]');
        const count = await bookCards.count();
        expect(count).toBeGreaterThan(3);
        
        // Verify first book details are visible
        const firstBook = bookCards.first();
        await expect(firstBook).toContainText('The Great Gatsby');
        await expect(firstBook).toContainText('F. Scott Fitzgerald');
        await expect(firstBook).toContainText('Classic');
        await expect(firstBook).toContainText('1925');
        
        // Verify "Add New Book" button is present
        await expect(page.locator('a[href="/add-book"]')).toBeVisible();
    });
    
});
