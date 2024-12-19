// getting variables
const newButton = document.getElementById('add-btn');
const bookForm = document.getElementById('creating-book');
const cardsContainer = document.getElementById('cards-container'); 

// holds every new book's information
let myLibrary = JSON.parse(localStorage.getItem('Books')) || [];

// object constructor that helps the creation of new books
function Book(author, title, pages, start, finish, status) {
  this.title = title,
  this.author = author,
  this.pages = pages,
  this.start = start,
  this.finish = finish,
  this.status = status
}

// reformats the dates accordingly
const reformatDate = date => {
  const [year, month, day] = date.split('-');
  return `${month}/${day}/${year}`
};

// creates a form for the user to enter the new book info
newButton.addEventListener('click', () => {
  
  bookForm.innerHTML = `
    <h3>Add your new book:</h3>
      <div class="input-container">
        <label for="author">Author Name:</label>
        <input type="text" id="author" placeholder="George R. R. Martin..." required>
        <label for="title">Title Name:</label>
        <input type="text" id="title" placeholder="Harry Potter..." required>
        <label for="Pages">Pages Count:</label>
        <input type="number" id="pages" placeholder="887..." required >
      </div>
      <h3>Have you finish reading it?</h3>
      <div class="read-container">
        <div class="radio-container">
          <input type="radio" id="did-read" name="option" value="did-read" required>
          <label for="did-read"> Yes</label>
          <input type="radio" id="didnt-read" name="option" value="didnt-read" required>
          <label for="didnt-read"> No</label>
        </div>
        <div class="addon-form hidden" id="add-on-form">
        
        </div>
      </div>
      <div class="btn-container">
        <dialog class='dialog-style-two' id='save-dialog'>
          
        </dialog>
        <button id="save-btn" type='button'>Save</button>

        <dialog id='discard-dialog' class='dialog-style'>
          <p>Are you sure you want to discard it?</p>
          <button id="return-dialog" type='button'>No</button>
          <button id="close-dialog" type='button'>Yes</button>
        </dialog>
        <button id="discard-btn" type='button'>Discard</button>
      </div>
  `
  bookForm.classList.toggle('hidden');

  const iRead = document.getElementById('did-read');
  const iDidntRead = document.getElementById('didnt-read');

  // when the radio input changes, that is checked, it will trigger 'readInfo()'
  iRead.addEventListener('change', readInfo);
  iDidntRead.addEventListener('change', readInfo);
  
  // discardButton will discard the current form
  const discardButton = document.getElementById('discard-btn');
  discardButton.addEventListener('click', () => {
    const dialog = document.getElementById('discard-dialog');
    const closeButton = document.getElementById('close-dialog');
    const returnButton = document.getElementById('return-dialog');
    // show dialog
    dialog.showModal();
    
    // YES
    closeButton.addEventListener('click', () => {
      bookForm.innerHTML = ``;
      bookForm.classList.add('hidden');
    });

    // NO
    returnButton.addEventListener('click', () => {
      dialog.close();
    });
    
  });

  // saves your new book
  const saveButton = document.getElementById('save-btn');
  saveButton.addEventListener('click', getInfo);

}); // end of newButton.eventListener

// generates the dates form which you add the when you started or finished your reading
// it can also be when you will start or finish
const readInfo = () => {
  const iRead = document.getElementById('did-read');
  const iDidntRead = document.getElementById('didnt-read');
  const addOnForm = document.getElementById('add-on-form');

  if (iRead.checked) {
    addOnForm.classList.remove('hidden');
    return addOnForm.innerHTML = `
    <div class="input-container">
      <label for="started">Started in:</label>
      <input type="date" id="started" required>
      <label for="finished">Finished in:</label>
      <input type="date" id="finished" required>
    </div>
  `;
  } else if (iDidntRead.checked) {
    addOnForm.classList.remove('hidden');
    return addOnForm.innerHTML = `
    <div class="input-container">
      <label for="started">Will start in:</label>
      <input type="date" id="started" required>
      <label for="finished">Wanna finish in:</label>
      <input type="date" id="finished" required>
    </div>
  `;
  } else { // probably will never trigger
    alert('Choose an option if you read it or not');
  }
} // end of readInfo()

// this function retrieves the new book info to the server side,
// handles user input restrictions and dialogs
const getInfo = () => {
  /*
  --> returns false: duplicate hyphen or \s, non-capital letter in the
  first word, any special character or number besides hyphen or \s and 
  hypen or \s at the end of the sentence
  --> returns true: anything that doesn't match the above
  */
  const titleRegex = /^(?!.*(\s{2,}|\-{2,}|\:{2,}))[A-Z][A-Za-z\s\-\:]+[a-z]$/gm
   /*
  --> returns false: very similar to the first regex, but returns false
  when 2 or more dot points are used consecutively
  --> return true: if the sentence ends with ONE period point
  */
  const authorRegex = /^(?!.*(\s{2,}|\-{2,}|\.{2,}))[A-Z][A-Za-z\s\-\.]+[a-z\.]$/g

  // getting more variables (global scope)
  const authorName = document.getElementById('author').value;
  const titleName = document.getElementById('title').value;
  const pagesCount = document.getElementById('pages').value;
  const iRead = document.getElementById('did-read');
  const iDidntRead = document.getElementById('didnt-read');

  // tests all regexs and run the code if you read the book
  if (titleRegex.test(titleName) && authorRegex.test(authorName) && parseInt(pagesCount) >= 30 && started.value && finished.value) {

    const started = document.getElementById('started').value;
    const finished = document.getElementById('finished').value;

    const saveDialogContainer = document.getElementById('save-dialog');
    saveDialogContainer.innerHTML = `
    <h3>Check your new book information:</h3>
    <p><span>Author:</span> ${authorName}</p>
    <p><span>Title:</span> ${titleName}</p>
    <p><span>Pages Count:</span> ${parseInt(pagesCount)}</p>
    <p><span>Started in:</span> ${reformatDate(started)}</p>
    <p><span>Finished in:</span> ${reformatDate(finished)}</p>
    <h3>Is it accurate?</h3>
    <button type='button' id='btn-one'>Yes, save</button>
    <button type='button' id='btn-two'>No, return</button>
    `;
    saveDialogContainer.showModal();
    const btnOne = document.getElementById('btn-one');
    const btnTwo = document.getElementById('btn-two');
    
    // button 'Yes, save' when the user is ready to submit the its new book
    btnOne.addEventListener('click', () => {
      
      // check book title duplicates
      const duplicateTitle = myLibrary.find(x => x.title === titleName);
      // console.log(duplicateTitle, myLibrary.indexOf(duplicateTitle));
      
      // send the status if read or not accordingly to the object
      // and check book title duplicates
      if (iRead.checked && !duplicateTitle) {
        myLibrary.push(new Book(
          authorName,
          titleName,
          parseInt(pagesCount),
          reformatDate(started),
          reformatDate(finished),
          "read"
        ));

          // stores the myLibrary data in the local storage
        localStorage.setItem("Books", JSON.stringify(myLibrary));
        bookForm.innerHTML = ``;
        bookForm.classList.add('hidden');

        // clear the container first to prevent rendering duplicates
        cardsContainer.innerHTML = '';

        // renders the book cards and distinguish if the cards that are read or not
        render();
      } else if (iDidntRead.checked && !duplicateTitle) {
        myLibrary.push(new Book(
          authorName,
          titleName,
          parseInt(pagesCount),
          reformatDate(started),
          reformatDate(finished),
          "not read"
        ));

          // stores the myLibrary data in the local storage
        localStorage.setItem("Books", JSON.stringify(myLibrary));
        bookForm.innerHTML = ``;
        bookForm.classList.add('hidden');

        // clear the container first to prevent rendering duplicates
        cardsContainer.innerHTML = '';

        // renders the book cards and distinguish if the cards that are read or not
        render();
      } else {
        alert (`
          ERROR!

          Duplicate book title.
        `);
        saveDialogContainer.close();
      }
      
    });

    btnTwo.addEventListener('click', () => {
      saveDialogContainer.close();
    });
   
  } else {
    alert (
      `
      ERROR!

      Please, ensure that your inputs are correctly filled and formated:

      ---> Title Name: first letter capitalized, no numbers, no duplicate hyphens, spaces or any other special character. Also it CAN'T end with any special character.

      ---> Author Name: first letter capitalized, no numbers, no duplicate hyphens, spaces or any other special character. It CAN end with only period as a special character.

      ---> Pages Count: only books with more than or equal to 30 pages are allowed.

      ---> Make sure that you selected if you read the book or not.
      `
    )
  }
  
};

// renders the books when the page reloads, pulling info from localStorage
const render = () => {
  
  myLibrary.filter(x => x.status === 'not read').map(y => {
    
    const {author, title, pages, start, finish} = y;

    const bookCard = document.createElement('div');
    bookCard.className = "book-card";
    bookCard.innerHTML = `
        <p class="title"><span>Title: </span>${title}</p>
        <p class="author"><span>Author: </span>${author}</p>
        <p class="pages-count"><span>Pages: </span>${pages}</p>
        <p class="started"><span>Will start in: </span>${start}</p>
        <p class="finished"><span>Will finish in: </span>${finish}</p>
        <div class="btn-container">
          <button id="remove-btn" onclick="showDialogTwo()">Remove</button>
          <button id="mark-btn" onclick="showDialog()">Mark as read</button>
          <dialog id="mark-dialog" class='dialog-style-two'>
            <h3>Congrats for finishing the book!</h3>
            <p>What is today's date?</p>
            <input type="date" id="finish" aria-label="finish-reading-date" required>
            <button id="iRead-btn" onclick="readBook('${title}')">Save</button>
            <button id="goBack-btn" onclick="closeDialog()">Go back</button>
          </dialog>
          <dialog id="doubt-dialog" class='dialog-style-two'>
            <h3>Are you sure you want to delete <span>${title}</span>?</h3>
            <button id="sure-btn" onclick="removeBook('${title}')">Yes</button>
            <button id="sure-not-btn" onclick="closeDialogTwo()">No</button>
          </dialog>
        </div>
    `
    
    return cardsContainer.appendChild(bookCard);
  });

  myLibrary.filter(x => x.status === 'read').map(y => {
    
    const {author, title, pages, start, finish} = y;
    
    const bookCard = document.createElement('div');
    bookCard.className = "book-card";
    bookCard.innerHTML = `
        <p class="title"><span>Title: </span>${title}</p>
        <p class="author"><span>Author: </span>${author}</p>
        <p class="pages-count"><span>Pages: </span>${pages}</p>
        <p class="started"><span>Started in: </span>${start}</p>
        <p class="finished"><span>Finished in: </span>${finish}</p>
        <button id="remove-btn" onclick="showDialogTwo()">Remove</button>
        <dialog id="doubt-dialog" class='dialog-style-two'>
          <h3>Are you sure you want to delete <span>${title}</span>?</h3>
          <button id="sure-btn" onclick="removeBook('${title}')">Yes</button>
          <button id="sure-not-btn" onclick="closeDialogTwo()">No</button>
        </dialog>
    `
    // ${title} needs to be quoted in the onclick attribute, because we want it as a string, otherwise it wont work
    return cardsContainer.appendChild(bookCard);
  });
};

// function that removes a book
const removeBook = title => {
  myLibrary = myLibrary.filter(x => x.title !== title);
  localStorage.setItem("Books", JSON.stringify(myLibrary));
  cardsContainer.innerHTML = "";
  render();
}

// show dialog when you want to delete a book
const showDialogTwo = () => {
  const dialog = document.getElementById('doubt-dialog');
  dialog.showModal();
}

// show dialog when you want to mark a book as read
const showDialog = () => {
  const dialog = document.getElementById('mark-dialog');
  dialog.showModal();
};

// ''reads'' the book
const readBook = title => {
  const finished = document.getElementById('finish').value;
  const object = myLibrary.find(x => x.title === title);
  
  if (object.status === 'not read') {
    object.status = 'read';
    object.finish = reformatDate(finished);
    localStorage.setItem("Books", JSON.stringify(myLibrary));
    closeDialog();
    cardsContainer.innerHTML = "";
    render();
  } else (
    // because i don't know how you can trigger this
    alert(`I really don't know how you got this error.`)
  )
};

// closes 'mark as read' dialog
const closeDialog = () => {
  const dialog = document.getElementById('mark-dialog');
  dialog.close();
}

// closes 'delete a book' dialog
const closeDialogTwo = () => {
  const dialog = document.getElementById('doubt-dialog');
  dialog.close();
}

// calling the function so it runs when the page first loads or reloads
render();