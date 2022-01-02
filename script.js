let myLibrary = [];

const popUpForm = document.querySelector('#popUp');
const newBookBtn = document.querySelector('#newBookBtn');
newBookBtn.addEventListener('click', () => popUpForm.style.display = 'block');

const closeBtn = document.getElementsByTagName('span')[0];
closeBtn.addEventListener('click', () => popUpForm.style.display = 'none');

const book_list = document.querySelector('#book-list');
const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const pagesInput = document.querySelector("#pages");

class Book {
  constructor(title, author, pages) {
    this.title = title;
    this.author = author;
    this.pages = pages;
  } 
}

let theIndex = null;
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
  const book = new Book (
    document.getElementById('title').value,
    document.getElementById('author').value,
    document.getElementById('pages').value
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
  theIndex = makeId();
  let idIsUnique = false;
  while (!idIsUnique) {
    let sameId = myLibrary.find(el => el.key == theIndex);
    if (sameId !== theIndex) {
      idIsUnique = true;
      break;
    }
    theIndex = makeId();
  }
  bookAdded = true;
}
  
function showBook() {
    book_list.innerHTML = '';
    myLibrary.map(item => {
      let card = document.createElement("div");
      card.setAttribute("id", `${item.key}`);
      card.className = "card";
      
      let theTitle = document.createElement("div");
      theTitle.textContent += (`Title: ${item.title}`);
      
      let theAuthor = document.createElement("div");
      theAuthor.textContent += (`Author: ${item.author}`);
      
      let thePages = document.createElement("div");
      thePages.textContent += (`Pages: ${item.pages}`);
      
      const remove_btn = document.createElement("button");
      remove_btn.className = "button";
      remove_btn.textContent = "X";
      remove_btn.addEventListener('click', removeBook);
      
      const read_btn = document.createElement("button");
      read_btn.className = "button";
      read_btn.textContent = "Not Read";
      read_btn.addEventListener('click', readIt);
      
      card.appendChild(theTitle);
      card.appendChild(theAuthor);
      card.appendChild(thePages);
      card.appendChild(remove_btn);
      card.appendChild(read_btn);

      book_list.appendChild(card);
    });
}

function removeBook(e) {
  e.target.parentElement.remove();
  myLibrary.splice(e.target, 1);
  localStorage.removeItem(e.target.parentElement.id);
}

const readIt = e => e.target.textContent == "Not Read" ? e.target.textContent = "Read" : e.target.textContent = "Not Read";

function submitBook() {
  if (titleInput.value.length !== 0 && authorInput.value.length !== 0 && pagesInput.value >= 1) {
    addBook();
    if (!bookAdded) return;
    setData(titleInput.value, authorInput.value, pagesInput.value);
    showBook();
    theIndex = null;
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
  let book = localStorage.getItem(`${theIndex}`);
  book = book ? JSON.parse(book) : {};
  const theKey = "key";
  book[theKey] = theIndex;
  const theTitle = "title";
  book[theTitle] = bookTitle;
  const theAuthor = "author";
  book[theAuthor] = bookAuthor;
  const thePages = "pages";
  book[thePages] = bookPages;
  localStorage.setItem(theIndex, JSON.stringify(book));
}

function restore() {
  let keys = Object.keys(localStorage);
  for (let i = 0; i < keys.length; i++) {
    myLibrary.push(JSON.parse(localStorage.getItem(keys[i])));
  }
  myLibrary.sort((a, b) => {
    if (a.title < b.title) return -1; 
    if (a.title > b.title) return 1;
    if (a.title == b.title) {
      if (a.author < b.author) return -1;
      if (a.author > b.author) return 1;
    }
  });
  showBook();
}

restore();