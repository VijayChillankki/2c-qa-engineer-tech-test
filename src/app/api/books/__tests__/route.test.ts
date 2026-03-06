import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '../route';
import * as booksData from '@/lib/books-data';

// Mock the books-data module
vi.mock('@/lib/books-data', () => ({
  getBooks: vi.fn(),
  addBook: vi.fn(),
}));

describe('GET /api/books', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return array of books with 200 status', async () => {
    const mockBooks = [
      {
        id: 1,
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Fiction',
        publishedYear: 2024,
        description: 'Test description',
        isbn: '123',
        pages: 100,
        rating: 4.0
      }
    ];

    vi.mocked(booksData.getBooks).mockReturnValue(mockBooks);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockBooks);
    expect(booksData.getBooks).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no books exist', async () => {
    vi.mocked(booksData.getBooks).mockReturnValue([]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
  });

  it('should call getBooks function', async () => {
    vi.mocked(booksData.getBooks).mockReturnValue([]);

    await GET();

    expect(booksData.getBooks).toHaveBeenCalled();
  });
});

describe('POST /api/books', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a new book with all fields and return 201', async () => {
    const requestBody = {
      title: 'New Book',
      author: 'New Author',
      genre: 'Fiction',
      publishedYear: 2024,
      description: 'New description',
      isbn: '978-1234567890',
      pages: 300,
      rating: 4.5
    };

    const mockCreatedBook = {
      id: 6,
      ...requestBody
    };

    vi.mocked(booksData.addBook).mockReturnValue(mockCreatedBook);

    const request = new NextRequest('http://localhost/api/books', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual(mockCreatedBook);
    expect(booksData.addBook).toHaveBeenCalledWith(requestBody);
  });

  it('should create book with only required fields (title and author)', async () => {
    const requestBody = {
      title: 'Minimal Book',
      author: 'Minimal Author'
    };

    const currentYear = new Date().getFullYear();
    const mockCreatedBook = {
      id: 7,
      title: 'Minimal Book',
      author: 'Minimal Author',
      genre: 'Unknown',
      publishedYear: currentYear,
      description: 'No description available.',
      isbn: 'N/A',
      pages: 0,
      rating: 0
    };

    vi.mocked(booksData.addBook).mockReturnValue(mockCreatedBook);

    const request = new NextRequest('http://localhost/api/books', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.title).toBe('Minimal Book');
    expect(data.author).toBe('Minimal Author');
    expect(data.genre).toBe('Unknown');
    expect(booksData.addBook).toHaveBeenCalled();
  });

  it('should return 400 when title is missing', async () => {
    const requestBody = {
      author: 'Author Only'
    };

    const request = new NextRequest('http://localhost/api/books', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Title and author are required');
    expect(booksData.addBook).not.toHaveBeenCalled();
  });

  it('should return 400 when author is missing', async () => {
    const requestBody = {
      title: 'Title Only'
    };

    const request = new NextRequest('http://localhost/api/books', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Title and author are required');
    expect(booksData.addBook).not.toHaveBeenCalled();
  });

  it('should return 400 when both title and author are missing', async () => {
    const requestBody = {
      genre: 'Fiction'
    };

    const request = new NextRequest('http://localhost/api/books', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Title and author are required');
  });

  it('should return 400 when title is empty string', async () => {
    const requestBody = {
      title: '',
      author: 'Test Author'
    };

    const request = new NextRequest('http://localhost/api/books', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Title and author are required');
  });

  it('should return 400 when author is empty string', async () => {
    const requestBody = {
      title: 'Test Title',
      author: ''
    };

    const request = new NextRequest('http://localhost/api/books', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Title and author are required');
  });

  it('should return 400 for invalid JSON', async () => {
    const request = new NextRequest('http://localhost/api/books', {
      method: 'POST',
      body: 'invalid json {'
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid JSON');
    expect(booksData.addBook).not.toHaveBeenCalled();
  });

  it('should handle special characters in title and author', async () => {
    const requestBody = {
      title: 'Test & "Special" <Characters>',
      author: "O'Brien & Co.",
      genre: 'Fiction',
      publishedYear: 2024,
      description: 'Description with @#$%',
      isbn: '123',
      pages: 200,
      rating: 4.0
    };

    const mockCreatedBook = {
      id: 8,
      ...requestBody
    };

    vi.mocked(booksData.addBook).mockReturnValue(mockCreatedBook);

    const request = new NextRequest('http://localhost/api/books', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.title).toBe('Test & "Special" <Characters>');
    expect(data.author).toBe("O'Brien & Co.");
  });

  it('should apply default values for optional fields', async () => {
    const requestBody = {
      title: 'Test Book',
      author: 'Test Author'
    };

    const currentYear = new Date().getFullYear();

    vi.mocked(booksData.addBook).mockImplementation((book) => ({
      id: 9,
      ...book
    }));

    const request = new NextRequest('http://localhost/api/books', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });

    await POST(request);

    expect(booksData.addBook).toHaveBeenCalledWith({
      title: 'Test Book',
      author: 'Test Author',
      genre: 'Unknown',
      publishedYear: currentYear,
      description: 'No description available.',
      isbn: 'N/A',
      pages: 0,
      rating: 0
    });
  });
});
