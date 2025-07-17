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

const myLibrary = [];

function Book(title, author, pages, status, id) {
  (this.title = title),
    (this.author = author),
    (this.pages = pages),
    (this.status = status),
    (this.id = id);
}

function createElement(tag, attributes = {}, textContent = "") {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  if (textContent) element.textContent = textContent;
  return element;
}

function handleFormSubmission() {
  if (!authorValue.value || !bookValue.value || !pagesValue.value) {
    alert("Please enter author,book name, and page number!");
    return;
  }

  const status = readStatus.checked ? "Read" : "Unread";
  addBookToLibrary(
    bookValue.value,
    authorValue.value,
    pagesValue.value,
    status
  );
  resetForm();
  showDialog.close();
}

function addBookToLibrary(title, author, pages, status) {
  const id = self.crypto.randomUUID();
  const newBook = new Book(title, author, pages, status, id);
  myLibrary.push(newBook);
  displayBooks();
}

function toggleBookStatus(bookId) {
  const book = myLibrary.find((book) => book.id === bookId);
  if (book) {
    book.status = book.status === "Read" ? "Unread" : "Read";
    displayBooks();
  }
}

function deleteBook(id) {
  const bookIndex = myLibrary.findIndex((book) => book.id === id);
  if (bookIndex !== -1) {
    myLibrary.splice(bookIndex, 1);
    displayBooks();
  }
}

function createBookCard(book) {
  const card = createElement("div", {
    class: "book-card",
    id: book.id,
  });

  const title = createElement(
    "h2",
    {
      class: "title-name",
    },
    book.title
  );
  const author = createElement(
    "h3",
    {
      class: "author-name",
    },
    `Author: ${book.author}`
  );
  const pages = createElement(
    "p",
    {
      class: "pages-num",
    },
    `Pages: ${book.pages}`
  );

  const statusBtn = createElement(
    "button",
    {
      class: "status-btn",
      type: "button",
      "data-book-id": book.id,
    },
    book.status
  );

  const removeBtn = createElement(
    "button",
    {
      class: "remove-btn",
    },
    "X"
  );

  statusBtn.onclick = () => toggleBookStatus(book.id);
  removeBtn.onclick = () => deleteBook(book.id);

  card.append(title, author, pages, statusBtn, removeBtn);

  return card;
}

function displayBooks() {
  libraryContainer.innerHTML = "";
  myLibrary.forEach((book) => {
    const bookCard = createBookCard(book);
    libraryContainer.appendChild(bookCard);
  });
}

function resetForm() {
  bookValue.value = "";
  authorValue.value = "";
  pagesValue.value = "";
  readStatus.checked = false;
}

function initializeLibrary() {
  addBookToLibrary("The Meditations", "Marcus Aurelius", 600, "Read");
  addBookToLibrary("Talk Like Ted", "Carmine Gallo", 263, "Unread");
  console.log(myLibrary);
}

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  handleFormSubmission();
});

addButton.addEventListener("click", () => {
  showDialog.showModal();
});
closeBtn.addEventListener("click", () => {
  showDialog.close();
});

initializeLibrary();
