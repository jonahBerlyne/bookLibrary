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

function addBook() {
  const book = new Book (
    document.getElementById('title').value,
    document.getElementById('author').value,
    document.getElementById('pages').value 
  );
  myLibrary.push(book);
}

function showBook(){
 myLibrary.forEach(function(item, index){
   let bookIndex = myLibrary.length - 1;
   if (index == bookIndex) {
    let card = document.createElement("div");
    card.setAttribute("id", "card");
    card.className = "card";

    let theTitle = document.createElement("div");
    theTitle.textContent += (`Title: ${item.title}`);

    let theAuthor = document.createElement("div");
    theAuthor.textContent += (`Author: ${item.author}`);

    let thePages = document.createElement("div");
    thePages.textContent += (`Pages: ${item.pages}`);

    const remove_btn = document.createElement("button");
    remove_btn.setAttribute('data-attribute', bookIndex);
    remove_btn.className = "button";
    remove_btn.textContent = "X";
    remove_btn.addEventListener('click', removeBook);

    const read_btn = document.createElement("button");
    read_btn.setAttribute('data-attribute', bookIndex);
    read_btn.className = "button";
    read_btn.textContent = "Not Read";
    read_btn.addEventListener('click', readIt);

    card.appendChild(theTitle);
    card.appendChild(theAuthor);
    card.appendChild(thePages);
    card.appendChild(remove_btn);
    card.appendChild(read_btn);

    book_list.appendChild(card);
   }
 });
}

function removeBook(e) {
  e.target.parentElement.remove();
    myLibrary.splice(e.target, 1);
}

function readIt(e) {
  if (e.target.textContent == "Not Read") {
    e.target.textContent = "Read";
    setData();
  } else e.target.textContent = "Not Read";
}

function submitBook() {
  if (titleInput.value.length !== 0 && authorInput.value.length !== 0 && pagesInput.value >= 1) {
    addBook();
    showBook();
    document.querySelector('form').reset();
  }
}

document.addEventListener('DOMContentLoaded', ()=> {
  document.getElementById('submit').addEventListener('click', (e) => {
    e.preventDefault();
    submitBook();
  });
});

function setData() {
  localStorage.setItem(`myLibrary`, JSON.stringify(myLibrary));
}

function restore() {
  if (localStorage.myLibrary) {
    let books = localStorage.getItem('myLibrary')
    books = JSON.parse(books);
    myLibrary = books;
  }
}

restore();