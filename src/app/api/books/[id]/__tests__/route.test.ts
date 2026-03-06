import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '../route';
import * as booksData from '@/lib/books-data';

// Mock the books-data module
vi.mock('@/lib/books-data', () => ({
  getBookById: vi.fn(),
}));

describe('GET /api/books/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return book with 200 status when book exists', async () => {
    const mockBook = {
      id: 1,
      title: 'Test Book',
      author: 'Test Author',
      genre: 'Fiction',
      publishedYear: 2024,
      description: 'Test description',
      isbn: '123',
      pages: 100,
      rating: 4.0
    };

    vi.mocked(booksData.getBookById).mockReturnValue(mockBook);

    const request = new NextRequest('http://localhost/api/books/1');
    const params = Promise.resolve({ id: '1' });
    
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockBook);
    expect(booksData.getBookById).toHaveBeenCalledWith(1);
  });

  it('should return 404 when book does not exist', async () => {
    vi.mocked(booksData.getBookById).mockReturnValue(undefined);

    const request = new NextRequest('http://localhost/api/books/999');
    const params = Promise.resolve({ id: '999' });
    
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Book not found');
    expect(booksData.getBookById).toHaveBeenCalledWith(999);
  });

  it('should handle string ID and convert to number', async () => {
    const mockBook = {
      id: 5,
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      genre: 'Fantasy',
      publishedYear: 1937,
      description: 'A fantasy novel',
      isbn: '978-0547928241',
      pages: 366,
      rating: 4.5
    };

    vi.mocked(booksData.getBookById).mockReturnValue(mockBook);

    const request = new NextRequest('http://localhost/api/books/5');
    const params = Promise.resolve({ id: '5' });
    
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockBook);
    expect(booksData.getBookById).toHaveBeenCalledWith(5);
  });

  it('should return 404 for invalid ID format', async () => {
    vi.mocked(booksData.getBookById).mockReturnValue(undefined);

    const request = new NextRequest('http://localhost/api/books/invalid');
    const params = Promise.resolve({ id: 'invalid' });
    
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Book not found');
    // parseInt('invalid') returns NaN
    expect(booksData.getBookById).toHaveBeenCalled();
  });

  it('should return 404 for negative ID', async () => {
    vi.mocked(booksData.getBookById).mockReturnValue(undefined);

    const request = new NextRequest('http://localhost/api/books/-1');
    const params = Promise.resolve({ id: '-1' });
    
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Book not found');
    expect(booksData.getBookById).toHaveBeenCalledWith(-1);
  });

  it('should return 404 for zero ID', async () => {
    vi.mocked(booksData.getBookById).mockReturnValue(undefined);

    const request = new NextRequest('http://localhost/api/books/0');
    const params = Promise.resolve({ id: '0' });
    
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Book not found');
    expect(booksData.getBookById).toHaveBeenCalledWith(0);
  });

  it('should call getBookById with correct ID', async () => {
    vi.mocked(booksData.getBookById).mockReturnValue(undefined);

    const request = new NextRequest('http://localhost/api/books/42');
    const params = Promise.resolve({ id: '42' });
    
    await GET(request, { params });

    expect(booksData.getBookById).toHaveBeenCalledWith(42);
    expect(booksData.getBookById).toHaveBeenCalledTimes(1);
  });

  it('should return complete book object with all properties', async () => {
    const completeBook = {
      id: 3,
      title: '1984',
      author: 'George Orwell',
      genre: 'Dystopian',
      publishedYear: 1949,
      description: 'A dystopian social science fiction novel',
      isbn: '978-0451524935',
      pages: 328,
      rating: 4.1
    };

    vi.mocked(booksData.getBookById).mockReturnValue(completeBook);

    const request = new NextRequest('http://localhost/api/books/3');
    const params = Promise.resolve({ id: '3' });
    
    const response = await GET(request, { params });
    const data = await response.json();

    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('title');
    expect(data).toHaveProperty('author');
    expect(data).toHaveProperty('genre');
    expect(data).toHaveProperty('publishedYear');
    expect(data).toHaveProperty('description');
    expect(data).toHaveProperty('isbn');
    expect(data).toHaveProperty('pages');
    expect(data).toHaveProperty('rating');
  });
});
