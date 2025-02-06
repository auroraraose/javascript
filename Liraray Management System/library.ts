namespace LibrarySystem {
    export class Book {
        public title: string;
        public author: string;
        private isbn: string;

        constructor(title: string, author: string, isbn: string) {
            this.title = title;
            this.author = author;
            this.isbn = isbn;
        }
    }

    export class Library {
        private collection: Book[] = [];

        addBook(newBook: Book): void {
            this.collection.push(newBook);
        }

        borrowBook(title: string): Book | null {
            const index = this.collection.findIndex(book => book.title === title);
            return index !== -1 ? this.collection.splice(index, 1)[0] : null;
        }

        protected getBooks(): Book[] {
            return this.collection;
        }
    }

    export class PublicLibrary extends Library {
        showBooks(): void {
            console.log("Books in Library:");
            this.getBooks().forEach(book => console.log(`${book.title} - ${book.author}`));
        }
    }
}

const myLibrary = new LibrarySystem.PublicLibrary();
myLibrary.addBook(new LibrarySystem.Book("The Power of Habit", "Charles Duhigg", "112233"));
myLibrary.addBook(new LibrarySystem.Book("Deep Work", "Cal Newport", "445566"));
myLibrary.showBooks();
const takenBook = myLibrary.borrowBook("Deep Work");
console.log(takenBook ? `You borrowed: ${takenBook.title}` : "Not available");
