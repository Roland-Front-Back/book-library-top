const libraryContainer = document.querySelector("#library-container");
const addButton = document.querySelector("#add-btn");
const showDialog = document.querySelector("#dialog");
const closeBtn = document.querySelector("#close-btn");
const submitBtn = document.querySelector("#submit-btn");

// Forms elements
const authorValue = document.querySelector("#author-name");
const bookValue = document.querySelector("#book-name");
const pagesValue = document.querySelector("#page-number");
const readStatus = document.querySelector("#checkbox-yes");

class Book {
  constructor(title, author, pages, status, id) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
    this.id = id;
  }
}

class BookUI {
  constructor(tag, attributes = {}, textContent = "") {
    this.tag = tag;
    this.attributes = attributes;
    this.textContent = textContent;
  }

  createElement() {
    const element = document.createElement(this.tag);
    Object.entries(this.attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    if (this.textContent) element.textContent = this.textContent;
    return element;
  }

  createBookCard(book, { toggleBookStatus, deleteBook }) {
    const card = new BookUI("div", {
      class: "book-card",
      id: book.id,
    }).createElement();

    const title = new BookUI(
      "h2",
      { class: "title-name" },
      book.title
    ).createElement();

    const author = new BookUI(
      "h3",
      { class: "author-name" },
      `Author: ${book.author}`
    ).createElement();

    const pages = new BookUI(
      "p",
      { class: "page-num" },
      `Pages: ${book.pages}`
    ).createElement();

    const statusBtn = new BookUI(
      "button",
      { class: "status-btn", type: "button", "data-book-id": book.id },
      book.status
    ).createElement();

    const removeBtn = new BookUI(
      "button",
      { class: "remove-btn" },
      "X"
    ).createElement();

    statusBtn.onclick = () => toggleBookStatus(book.id);
    removeBtn.onclick = () => deleteBook(book.id);

    card.append(title, author, pages, statusBtn, removeBtn);

    return card;
  }

  displayBooks(myLibrary, libraryContainer, { toggleBookStatus, deleteBook }) {
    libraryContainer.innerHTML = "";
    myLibrary.forEach((book) => {
      const bookCard = this.createBookCard(book, {
        toggleBookStatus,
        deleteBook,
      });
      libraryContainer.appendChild(bookCard);
    });
  }
}

class LibraryManager {
  constructor() {
    this.myLibrary = [];
    this.bookUI = new BookUI();
  }

  addBook(title, author, pages, status) {
    const id = self.crypto.randomUUID(); // Generate random unique id for each books
    const newBook = new Book(title, author, pages, status, id);
    this.myLibrary.push(newBook);
    this.displayBooks();
  }

  deleteBook(id) {
    this.myLibrary = this.myLibrary.filter((book) => book.id !== id);
    this.displayBooks();
  }

  toggleBookStatus(bookId) {
    const book = this.myLibrary.find((book) => book.id === bookId);
    if (book) {
      book.status = book.status === "Read" ? "Unread" : "Read";
      this.displayBooks();
    }
  }

  displayBooks() {
    this.bookUI.displayBooks(this.myLibrary, libraryContainer, {
      toggleBookStatus: (id) => this.toggleBookStatus(id),
      deleteBook: (id) => this.deleteBook(id),
    });
  }
}

class LibraryFormHandler {
  constructor(libraryManager) {
    this.libraryManager = libraryManager;
  }

  handleFormSubmission() {
    if (!authorValue.value || !bookValue.value || !pagesValue.value) {
      alert("Please enter author, book name, and page number!");
      return;
    }

    const status = readStatus.checked ? "Read" : "Unread";
    this.libraryManager.addBook(
      bookValue.value,
      authorValue.value,
      pagesValue.value,
      status
    );

    this.resetForm();
    showDialog.close();
  }

  resetForm() {
    bookValue.value = "";
    authorValue.value = "";
    pagesValue.value = "";
    readStatus.checked = false;
  }
}

const libraryManager = new LibraryManager();
const formHandler = new LibraryFormHandler(libraryManager);

libraryManager.addBook("1984", "George Orwell", 328, "Read");
libraryManager.addBook("The Hobbit", "J.R.R. Tolkien", 310, "Unread");

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formHandler.handleFormSubmission();
});

addButton.addEventListener("click", () => {
  showDialog.showModal();
});
closeBtn.addEventListener("click", () => {
  showDialog.close();
});
