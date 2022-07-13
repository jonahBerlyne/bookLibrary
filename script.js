let myLibrary = [];

const popUpForm = document.querySelector('#popUp');
const newBookBtn = document.querySelector('#newBookBtn');
newBookBtn.addEventListener('click', () => popUpForm.style.display = 'block');

const closeBtn = document.getElementsByTagName('span')[0];
closeBtn.addEventListener('click', () => popUpForm.style.display = 'none');

const books = document.querySelector('#books');
const book_list = document.querySelector('#book-list');
const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const pagesInput = document.querySelector("#pages");

class Book {
  constructor(date, id, title, author, pages, read) {
    this.date = date;
    this.id = id;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  } 
}

let theDate = new Date().getTime();
let theId = null;
let found = false;
let bookAdded = false;

function makeId() {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function addBook() {
  theId = makeId();
  let idIsUnique = false;
  while (!idIsUnique) {
    let sameId = myLibrary.find(el => el.key == theId);
    if (sameId !== theId) {
      idIsUnique = true;
      break;
    }
    theId = makeId();
  }
  const book = new Book (
    theDate,
    theId,
    document.getElementById('title').value,
    document.getElementById('author').value,
    document.getElementById('pages').value,
    "Not Read"
  );
  for (let i = 0; i < myLibrary.length; i++) {
    if (myLibrary[i].title == book.title && myLibrary[i].author == book.author) {
      found = true;
      break;
    }
  }
  if (found) {
    found = false;
    alert("Cannot add repeat books");
    return;
  }
  myLibrary.push(book);
  bookAdded = true;
}
  
function showBooks() {
    book_list.innerHTML = '';
    myLibrary.map(item => {
      let card = document.createElement("div");
      card.setAttribute("id", `${item.id}`);
      card.classList.add("card");
      
      let theTitleDiv = document.createElement("div");
      let theTitleText = document.createElement("h3");
      theTitleText.textContent += (`Title: ${item.title}`);
      theTitleDiv.appendChild(theTitleText);
      
      let theAuthorDiv = document.createElement("div");
      let theAuthorText = document.createElement("h3");
      theAuthorText.textContent += (`Author: ${item.author}`);
      theAuthorDiv.appendChild(theAuthorText);
      
      let thePagesDiv = document.createElement("div");
      let thePagesText = document.createElement("h3");
      thePagesText.textContent += (`Pages: ${item.pages}`);
      thePagesDiv.appendChild(thePagesText);
      
      const remove_btn = document.createElement("button");
      remove_btn.className = "button";
      remove_btn.textContent = "X";
      remove_btn.addEventListener('click', removeBook);
      
      const read_btn = document.createElement("button");
      read_btn.className = "button";
      read_btn.textContent = item.read;
      read_btn.addEventListener('click', (e) => readIt(e, item.id));

      let theButtonsDiv = document.createElement("div");
      theButtonsDiv.classList.add("card-btns");
      theButtonsDiv.appendChild(remove_btn);
      theButtonsDiv.appendChild(read_btn);
      
      card.appendChild(theTitleDiv);
      card.appendChild(theAuthorDiv);
      card.appendChild(thePagesDiv);
      card.appendChild(theButtonsDiv);

      book_list.appendChild(card);
    });
    books.classList.remove("books-hide");
}

function removeBook(e) {
  e.target.parentElement.parentElement.remove();
  myLibrary.splice(e.target, 1);
  localStorage.removeItem(e.target.parentElement.parentElement.id);
  if (myLibrary.length === 0) {
    books.classList.add("books-hide");
  }
}

function readIt (e, id) {
  if (e.target.textContent == "Not Read") {
    e.target.textContent = "Read";
  } else {
    e.target.textContent = "Not Read";
  } 
  let book = JSON.parse(localStorage.getItem(id));
  book = {
    ...book,
    "read": book.read === "Not Read" ? "Read" : "Not Read"
  };
  localStorage.setItem(id, JSON.stringify(book));
} 

function submitBook() {
  if (titleInput.value.length !== 0 && authorInput.value.length !== 0 && pagesInput.value >= 1) {
    addBook();
    if (!bookAdded) return;
    setData(titleInput.value, authorInput.value, pagesInput.value);
    showBooks();
    theDate = new Date().getTime();
    theId = null;
    document.querySelector('form').reset();
    bookAdded = false;
  }
}

document.addEventListener('DOMContentLoaded', ()=> {
  document.getElementById('submit').addEventListener('click', (e) => {
    e.preventDefault();
    submitBook();
  });
});

function setData(bookTitle, bookAuthor, bookPages) {
  let book = localStorage.getItem(`${theId}`);
  book = book ? JSON.parse(book) : {};
  const theDateKey = "date";
  book[theDateKey] = theDate;
  const theIdKey = "id";
  book[theIdKey] = theId;
  const theTitleKey = "title";
  book[theTitleKey] = bookTitle;
  const theAuthorKey = "author";
  book[theAuthorKey] = bookAuthor;
  const thePagesKey = "pages";
  book[thePagesKey] = bookPages;
  const theReadKey = "read";
  book[theReadKey] = "Not Read";
  localStorage.setItem(theId, JSON.stringify(book));
}

function restore() {
  let keys = Object.keys(localStorage);
  for (let i = 0; i < keys.length; i++) {
    myLibrary.unshift(JSON.parse(localStorage.getItem(keys[i])));
  }
  if (myLibrary.length === 0) {
    return;
  }
  myLibrary.sort((a, b) => a.date - b.date);
  showBooks();
}

restore();