function gameBoard () {

  let board = [];

  const rows = 3;
  const columns = 3;

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push("");
    }
  };

  function createPlayer (playerOne, playerTwo) {
    let players = [
      {
        playerName: playerOne,
        symbol: "X"
      },
      {
        playerName: playerTwo,
        symbol: "O"
      }
    ];

    let playerToPlay = players[0];

    function switchTurn () {
      if (playerToPlay === players[0]) {
        playerToPlay = players[1];
        return playerToPlay.symbol;
      } else {
        playerToPlay = players[0];
        return playerToPlay.symbol;
      }
    };

    function setCell (row, column) {
      if (board[row][column] === "") {
        board[row][column] = playerToPlay.symbol;
        // Why switch turns here other than in
        // initializeLogic function?
        // because it could change the turn even
        // if the user clicked in filled spots.
        switchTurn();
        console.log(board);
      } else {
        console.log("Cell filled already");
        return;
      }
    };

    function checkWinner (player) {
      // row conditions
      if (
        board[0].every(x => x === player) ||
        board[1].every(x => x === player) ||
        board[2].every(x => x === player)
      ) {
        console.log(true)
        return true;
        // column conditions
      } else if (
        board[0][0] === player &&
        board[1][0] === player &&
        board[2][0] === player ||
        board[0][1] === player &&
        board[1][1] === player &&
        board[2][1] === player ||
        board[0][2] === player &&
        board[1][2] === player &&
        board[2][2] === player
       ) {
        return true
        // diagonal conditions
      } else if (
        board[0][0] === player &&
        board[1][1] === player &&
        board[2][2] === player 
      ) {
        console.log(true)
        return true;
      } else if (
        board[0][2] === player &&
        board[1][1] === player &&
        board[2][0] === player
      ) {
        console.log(true)
        return true;
      } else {
        console.log(false)
        return false;
      }
    };

    function checkTie () {
      if (
        board[0].every(x => x !== "") &&
        board[1].every(x => x !== "") &&
        board[2].every(x => x !== "") 
      ) {
        console.log(`The Game Tied!`);
        return true;
      }
    };

    return {setCell, players, playerToPlay, checkTie, checkWinner, switchTurn};
  };

  //returns the board
  function getBoard () {
    return board;
  };

  return {getBoard, createPlayer};
};

// --> initializing DOM

// player arrays
let playerXName = [];
let playerOName = [];

// container to keep the game board
const boardContainer = document.getElementById('game-board');

// player name inputs and labels
const pOneName = document.getElementById('player-one-name');
const pTwoName = document.getElementById('player-two-name');
const lOne = document.getElementById('label-one');
const lTwo = document.getElementById('label-two');

// arrow buttons
const submitOne = document.getElementById('submit-name-one');
const submitTwo = document.getElementById('submit-name-two');

// info and restart buttons
const infoBtn = document.getElementById('info-btn');
const restartBtn = document.getElementById('restart-btn')

const submitPlayerOneName = () => {
  if (playerXName.length === 0 && pOneName.value !== playerOName[0] && pOneName.value.length > 1) {
    playerXName.push(pOneName.value);
    lOne.innerHTML = `Player <strong>${playerXName[0]}</strong> has <span>X</span>`;
    pOneName.value = '';
  } else {
    alert('A name for this player is already set or equal to the opponent\'s name.')
  }
};

const submitPlayerTwoName = () => {
  if (playerOName.length === 0 && pTwoName.value !== playerXName[0] && pTwoName.value.length > 1) {
    playerOName.push(pTwoName.value);
    lTwo.innerHTML = `Player <strong>${playerOName[0]}</strong> has <span>O</span>`;
    pTwoName.value = '';
  } else {
    alert('A name for this player is already set or equal to the opponent\'s name.')
  }
};

// initializing the game
const tictac = gameBoard();
const game = tictac.createPlayer(pOneName.value, pTwoName.value);

// gets the cells from the 'renderCells()' 'for loop'
let cellRescuer = [];

const initializeLogic = (row, column, index) => {
  if (playerOName.length !== 0 && playerXName.length !== 0) {
    console.log(game.switchTurn(), "1")
    game.setCell(row, column);
    if (game.checkTie()) {
      boardContainer.innerHTML = `
          <dialog class="winner" id="tie">
            <div class="nav-btn-container">
              <button id="play-again-btn" class="buttons">Play Again</button>
            </div>
            <h1><strong>DRAW</strong>!</h1>
          </dialog>
        `;
      document.getElementById('play-again-btn').addEventListener('click', () => {
        window.location.reload();
      });
    };
    if (game.checkWinner(game.switchTurn())) {
      
      if (game.switchTurn() !== "X") {
        console.log(game.switchTurn(), "3")
        infoBtn.style.display = "none";
        restartBtn.style.display = "none";
        boardContainer.innerHTML = `
          <dialog class="winner" id="winner">
            <div class="nav-btn-container">
              <button id="play-again-btn" class="buttons">Play Again</button>
            </div>
            <h1><strong>${playerXName[0]}</strong> WINS!</h1>
          </dialog>
        `;
        const winnerDialog = document.getElementById('winner');
        winnerDialog.showModal();
        // play again button
        document.getElementById('play-again-btn').addEventListener('click', () => {
          window.location.reload();
        });
      
      } else {
        infoBtn.style.display = "none";
        restartBtn.style.display = "none";
        boardContainer.innerHTML = `
          <dialog class="winner" id="winner">
            <div class="nav-btn-container">
              <button id="play-again-btn" class="buttons">Play Again</button>
            </div>
            <h1><strong>${playerOName[0]}</strong> WINS!</h1>
          </dialog>
        `;

        const winnerDialog = document.getElementById('winner');
        winnerDialog.showModal();
        // play again button
        document.getElementById('play-again-btn').addEventListener('click', () => {
          window.location.reload();
        });
      }

      return;
    } else {
      console.log(game.switchTurn(), "2")
      cellRescuer[index].innerHTML = game.switchTurn();
    }
  }
};

// I couldn't use the 'board' array for the UI logic
// this would limit me to set different functions for the nine cells, so i created 'userBoard'
// create the cells for the DOM logic
const userBoard = [
  {
    cellName: "first",
    column: 0,
    row: 0,
    action: function () {
      if (playerXName.length !== 0 && playerOName.length !== 0) {
        initializeLogic(userBoard[0].row, userBoard[0].column, 0);
      } else {
        alert(`A game just starts with two players assigned.`)
      }
    }
  },
  {
    cellName: "second",
    column: 1,
    row: 0,
    action: () => {
      
      if (playerXName.length !== 0 && playerOName.length !== 0) {
        initializeLogic(userBoard[1].row, userBoard[1].column, 1);
      } else {
        alert(`A game just starts with two players assigned.`)
      }
    }
  },
  {
    cellName: "third",
    column: 2,
    row: 0,
    action: () => {
      
      if (playerXName.length !== 0 && playerOName.length !== 0) {
        initializeLogic(userBoard[2].row, userBoard[2].column, 2);
      } else {
        alert(`A game just starts with two players assigned.`)
      }
    }
  },
  {
    cellName: "fourth",
    column: 0,
    row: 1,
    action: () => {
      
      if (playerXName.length !== 0 && playerOName.length !== 0) {
        initializeLogic(userBoard[3].row, userBoard[3].column, 3);
      } else {
        alert(`A game just starts with two players assigned.`)
      }
    }
  },
  {
    cellName: "fifth",
    column: 1,
    row: 1,
    action: () => {
      
      if (playerXName.length !== 0 && playerOName.length !== 0) {
        initializeLogic(userBoard[4].row, userBoard[4].column, 4);
      } else {
        alert(`A game just starts with two players assigned.`)
      }
    }
  },
  {
    cellName: "sixth",
    column: 2,
    row: 1,
    action: () => {
      
      if (playerXName.length !== 0 && playerOName.length !== 0) {
        initializeLogic(userBoard[5].row, userBoard[5].column, 5);
      } else {
        alert(`A game just starts with two players assigned.`)
      }
    }
  },
  {
    cellName: "seventh",
    column: 0,
    row: 2,
    action: () => {
      
      if (playerXName.length !== 0 && playerOName.length !== 0) {
        initializeLogic(userBoard[6].row, userBoard[6].column, 6);
      } else {
        alert(`A game just starts with two players assigned.`)
      }
    }
  },
  {
    cellName: "eigth",
    column: 1,
    row: 2,
    action: () => {
      
      if (playerXName.length !== 0 && playerOName.length !== 0) {
        initializeLogic(userBoard[7].row, userBoard[7].column, 7);
      } else {
        alert(`A game just starts with two players assigned.`)
      }
    }
  },
  {
    cellName: "nineth",
    column: 2,
    row: 2,
    action: () => {
      
      if (playerXName.length !== 0 && playerOName.length !== 0) {
        initializeLogic(userBoard[8].row, userBoard[8].column, 8);
      } else {
        alert(`A game just starts with two players assigned.`)
      }
    }
  },
];

// renders the game cells to the user
const renderCells = () => {
  for (let i = 0; i < userBoard.length; i++) {
    const cells = document.createElement("button");
    const symbolStunt = document.createElement("p");
    symbolStunt.className = "stunt";
    symbolStunt.innerText = "X";
    cells.className = "cell-button";
    cells.addEventListener('click', userBoard[i].action);
    boardContainer.appendChild(cells);
    cells.appendChild(symbolStunt);
    cellRescuer.push(cells);
  }
};

// adding the functions to the buttons
// and enable the "enter keypad" to toggle the function
submitOne.addEventListener('click', submitPlayerOneName);
pOneName.addEventListener('keydown', e => {
  if (e.key === "Enter") {
    submitPlayerOneName()
  }
});
submitTwo.addEventListener('click', submitPlayerTwoName);
pTwoName.addEventListener('keydown', e => {
  if (e.key === "Enter") {
    submitPlayerTwoName()
  }
});

restartBtn.addEventListener('click', () => {
  window.location.reload();
});

infoBtn.addEventListener('click', () => {
  const infoCard = document.getElementById('info-card');

  infoCard.showModal();
  
  document.getElementById('close-info-card').addEventListener('click', () => {
    infoCard.close();
  });
});

// execute function!
renderCells();