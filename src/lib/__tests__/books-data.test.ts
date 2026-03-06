import { describe, it, expect, beforeEach } from 'vitest';
import { addBook, getBooks, getBookById, booksData, Book } from '../books-data';

describe('books-data', () => {
  let initialBooksCount: number;

  beforeEach(() => {
    // Store initial count for reference
    initialBooksCount = booksData.length;
  });

  describe('getBooks', () => {
    it('should return an array of books', () => {
      const books = getBooks();
      expect(Array.isArray(books)).toBe(true);
      expect(books.length).toBeGreaterThan(0);
    });

    it('should return books with all required properties', () => {
      const books = getBooks();
      const firstBook = books[0];
      
      expect(firstBook).toHaveProperty('id');
      expect(firstBook).toHaveProperty('title');
      expect(firstBook).toHaveProperty('author');
      expect(firstBook).toHaveProperty('genre');
      expect(firstBook).toHaveProperty('publishedYear');
      expect(firstBook).toHaveProperty('description');
      expect(firstBook).toHaveProperty('isbn');
      expect(firstBook).toHaveProperty('pages');
      expect(firstBook).toHaveProperty('rating');
    });

    it('should return the default books data', () => {
      const books = getBooks();
      expect(books.length).toBeGreaterThanOrEqual(5);
      
      // Verify first book is "The Great Gatsby"
      expect(books[0].title).toBe('The Great Gatsby');
      expect(books[0].author).toBe('F. Scott Fitzgerald');
    });
  });

  describe('getBookById', () => {
    it('should return a book when valid ID is provided', () => {
      const book = getBookById(1);
      
      expect(book).toBeDefined();
      expect(book?.id).toBe(1);
      expect(book?.title).toBe('The Great Gatsby');
    });

    it('should return undefined when book ID does not exist', () => {
      const book = getBookById(999);
      expect(book).toBeUndefined();
    });

    it('should return undefined for negative ID', () => {
      const book = getBookById(-1);
      expect(book).toBeUndefined();
    });

    it('should return undefined for zero ID', () => {
      const book = getBookById(0);
      expect(book).toBeUndefined();
    });

    it('should return correct book for each valid ID', () => {
      const book1 = getBookById(1);
      const book2 = getBookById(2);
      const book3 = getBookById(3);
      
      expect(book1?.title).toBe('The Great Gatsby');
      expect(book2?.title).toBe('To Kill a Mockingbird');
      expect(book3?.title).toBe('1984');
    });
  });

  describe('addBook', () => {
    it('should add a new book with all fields', () => {
      const newBook: Omit<Book, 'id'> = {
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Fiction',
        publishedYear: 2024,
        description: 'Test description',
        isbn: '978-1234567890',
        pages: 300,
        rating: 4.5
      };

      const addedBook = addBook(newBook);
      
      expect(addedBook).toHaveProperty('id');
      expect(addedBook.id).toBeGreaterThan(0);
      expect(addedBook.title).toBe('Test Book');
      expect(addedBook.author).toBe('Test Author');
      expect(addedBook.genre).toBe('Fiction');
      expect(addedBook.publishedYear).toBe(2024);
      expect(addedBook.description).toBe('Test description');
      expect(addedBook.isbn).toBe('978-1234567890');
      expect(addedBook.pages).toBe(300);
      expect(addedBook.rating).toBe(4.5);
    });

    it('should generate unique incremental IDs', () => {
      const book1 = addBook({
        title: 'Book 1',
        author: 'Author 1',
        genre: 'Fiction',
        publishedYear: 2024,
        description: 'Description 1',
        isbn: '111',
        pages: 100,
        rating: 4.0
      });

      const book2 = addBook({
        title: 'Book 2',
        author: 'Author 2',
        genre: 'Fiction',
        publishedYear: 2024,
        description: 'Description 2',
        isbn: '222',
        pages: 200,
        rating: 4.5
      });

      expect(book2.id).toBe(book1.id + 1);
    });

    it('should add book to the books array', () => {
      const initialCount = getBooks().length;
      
      addBook({
        title: 'New Book',
        author: 'New Author',
        genre: 'Fiction',
        publishedYear: 2024,
        description: 'Description',
        isbn: '123',
        pages: 150,
        rating: 4.0
      });

      const updatedCount = getBooks().length;
      expect(updatedCount).toBe(initialCount + 1);
    });

    it('should make added book retrievable by ID', () => {
      const addedBook = addBook({
        title: 'Retrievable Book',
        author: 'Retrievable Author',
        genre: 'Fiction',
        publishedYear: 2024,
        description: 'Description',
        isbn: '456',
        pages: 250,
        rating: 4.2
      });

      const retrievedBook = getBookById(addedBook.id);
      expect(retrievedBook).toBeDefined();
      expect(retrievedBook?.title).toBe('Retrievable Book');
    });

    it('should handle special characters in title and author', () => {
      const bookWithSpecialChars = addBook({
        title: 'Test & "Special" <Characters>',
        author: "O'Brien & Co.",
        genre: 'Fiction',
        publishedYear: 2024,
        description: 'Description with @#$%',
        isbn: '789',
        pages: 200,
        rating: 4.0
      });

      expect(bookWithSpecialChars.title).toBe('Test & "Special" <Characters>');
      expect(bookWithSpecialChars.author).toBe("O'Brien & Co.");
    });
  });
});
