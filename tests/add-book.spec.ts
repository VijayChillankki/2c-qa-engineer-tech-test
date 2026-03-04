import test, { expect } from "@playwright/test";

test.describe('Book Library - Add Book Form', () => {
    
    test('should successfully add a new book with all fields filled', async ({ page }) => {
        // Navigate to add book page
        await page.goto('/add-book');
        
        // Verify we're on the add book page
        await expect(page.locator('h1')).toContainText('Add New Book');
        
        // Fill in the form with all fields
        await page.fill('#title', 'Test Book Title');
        await page.fill('#author', 'Test Author Name');
        await page.selectOption('#genre', 'Fiction');
        await page.fill('#publishedYear', '2024');
        await page.fill('#pages', '350');
        await page.fill('#isbn', '978-1234567890');
        await page.fill('#rating', '4.5');
        await page.fill('#description', 'This is a test book description for automated testing purposes.');
        
        // Submit the form
        await page.getByRole('button', { name: 'Add Book' }).click();
        
        // Wait for success message
        await expect(page.locator('text=/Book Added Successfully/i')).toBeVisible({ timeout: 5000 });
        
        // Wait for redirect to book detail page
        await page.waitForURL('**/book/**', { timeout: 3000 });
        
        // Verify the new book details are displayed
        await expect(page.locator('h1')).toContainText('Test Book Title');
        await expect(page.locator('text=by Test Author Name')).toBeVisible();
        await expect(page.locator('text=Fiction')).toBeVisible();
        await expect(page.locator('text=2024')).toBeVisible();
        await expect(page.locator('text=350 pages')).toBeVisible();
        await expect(page.locator('text=978-1234567890')).toBeVisible();
    });
    
    test('should successfully add a book with only required fields', async ({ page }) => {
        // Navigate to add book page
        await page.goto('/add-book');
        
        // Fill in only required fields (title and author)
        await page.fill('#title', 'Minimal Book');
        await page.fill('#author', 'Minimal Author');
        
        // Submit the form
        await page.getByRole('button', { name: 'Add Book' }).click();
        
        // Wait for success message
        await expect(page.locator('text=/Book Added Successfully/i'), 
            'Failed to add a book with only required fields - success message not displayed'
        ).toBeVisible({ timeout: 5000 });
        
        // Wait for redirect
        await page.waitForURL('**/book/**', { timeout: 3000 });
        
        // Verify the new book is created with default values
        await expect(page.locator('h1'), 
            'Failed to add a book with only required fields - book title not found on detail page'
        ).toContainText('Minimal Book');
        
        await expect(page.locator('text=by Minimal Author'),
            'Failed to add a book with only required fields - author name not displayed'
        ).toBeVisible();
    });
    
    test('should navigate to add book page from home page', async ({ page }) => {
        // Start from home page
        await page.goto('/');
        
        // Click "Add New Book" button
        await page.getByRole('link', { name: 'Add New Book' }).click();
        
        // Verify navigation to add book page
        await page.waitForURL('**/add-book');
        await expect(page.locator('h1')).toContainText('Add New Book');
    });
    
    test('should allow canceling and return to home page', async ({ page }) => {
        // Navigate to add book page
        await page.goto('/add-book');
        
        // Fill in some data
        await page.fill('#title', 'Book to Cancel');
        await page.fill('#author', 'Cancel Author');
        
        // Click Cancel button
        await page.getByRole('link', { name: 'Cancel' }).click();
        
        // Verify navigation back to home page
        await page.waitForURL('/');
        await expect(page.locator('h1')).toContainText('Book Library');
    });
    
});
