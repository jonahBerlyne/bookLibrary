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

function addBook() {
  const book = new Book (
    document.getElementById('title').value,
    document.getElementById('author').value,
    document.getElementById('pages').value
  );
  myLibrary.push(book);
}

function showBook(){
 myLibrary.map((item, index) => {
   console.log(typeof item);
    theIndex = `${index}`;

    let card = document.createElement("div");
    card.setAttribute("id", `${index}`);
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
}

function readIt(e) {
  if (e.target.textContent == "Not Read") {
    e.target.textContent = "Read";
  } else e.target.textContent = "Not Read";
}

function submitBook() {
  if (titleInput.value.length !== 0 && authorInput.value.length !== 0 && pagesInput.value >= 1) {
    addBook();
    showBook();
    setData(titleInput.value, authorInput.value, pagesInput.value);
    document.querySelector('form').reset();
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
  const theTitle = "title";
  book[theTitle] = bookTitle;
  const theAuthor = "author";
  book[theAuthor] = bookAuthor;
  const thePages = "pages";
  book[thePages] = bookPages;
  localStorage.setItem(theIndex, JSON.stringify(book));
  theIndex = null;
}

// function SortLocalStorage(){
//    if(localStorage.length > 0){
//       var localStorageArray = new Array();
//       for (let i=0;i<localStorage.length;i++){
//           localStorageArray[i] = localStorage.key(i)+localStorage.getItem(localStorage.key(i));
//       }
//    }
//    console.log(localStorageArray);
//    var sortedArray = localStorageArray.sort();
//    return localStorageArray;
// }

function restore() {
  let keys = Object.keys(localStorage);
  for (let i = 0; i < keys.length; i++) {
    console.log(keys[i]);
    myLibrary.push(JSON.parse(localStorage.getItem(keys[i])));
  }
  console.log(myLibrary);
  showBook();
}

restore();