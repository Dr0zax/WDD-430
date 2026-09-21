const gameBoard = document.querySelector("#board");
const modal = document.querySelector("#modal");
const results = modal.querySelector("#results");
const retryBttn = modal.querySelector("#retry-bttn");
const saveBttn = document.querySelector("#save-bttn");
const savedGames = document.querySelector("#saved-games");

let currentPlayer = "O";

let board = ["", "", "", "", "", "", "", "", ""];

function cellTemplate(item, index) {
    return `<button class="cell" id="cell-${index}" data-index="${index}">${item}</button>`;
}

function boardTemplate(board, container = false) {
    let template = "";
    // check to see if we need the <section> wrapper.
    if (container) {
        // add section element
        template = "<section class='board'>";
        template += board.map(cellTemplate).join("");
        template += "</section>";
    } else {
        template = board.map(cellTemplate).join("");
    }
    return template;
}

function renderBoard(board) {
    gameBoard.innerHTML = "";
    gameBoard.insertAdjacentHTML("afterbegin", boardTemplate(board));
}

function inputHandler(e) {
    const cell = e.target;
    const cellIndex = cell.dataset.index;
    if (board[cellIndex]) {
        return;
    } else {
        board[cellIndex] = currentPlayer;

        renderBoard(board, gameBoard);

        if (currentPlayer == "X") {
            currentPlayer = "O";
        } else {
            currentPlayer = "X";
        }

        const winner = checkGameState();

        if (winner) {
            console.log(winner);

            displayResults(winner);
        }
    }
}

function reset(e) {
    board = ["", "", "", "", "", "", "", "", ""];
    results.innerHTML = "";
    renderBoard(board);
    modal.classList.toggle("hidden");
}

function checkGameState() {
    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8], //rows
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8], //cols
        [0, 4, 8],
        [2, 4, 6], //diagonals
    ];

    for (let condition of winConditions) {
        const [a, b, c] = condition;

        // Check if the first cell is not empty AND matches the other two
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Returns 'X' or 'O' as the winner
        }
    }

    if (!board.includes("")) {
        return "Draw";
    }

    return null;
}

function displayResults(winner) {
    modal.classList.toggle("hidden");
    if (winner == "Draw") {
        results.innerHTML = "Game is a Draw.";
    } else {
        results.innerHTML = `Player ${winner} has won!`;
    }
}

async function saveHandler() {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(board),
    };

    const res = await fetch("http://localhost:3000/boards", options);

    if (res.ok) {
        console.log(await res.json());
        renderHistory();
    }
}

async function renderHistory() {
    const res = await fetch("http://localhost:3000/boards");
    if (res.ok) {
        const data = await res.json();
        savedGames.innerHTML = "";

        const html = data.map((board) => boardTemplate(board, true));
        savedGames.insertAdjacentHTML("afterbegin", html.join(""));
    }
}

gameBoard.addEventListener("click", (e) => {
    inputHandler(e);
});

retryBttn.addEventListener("click", (e) => {
    reset(e);
});

saveBttn.addEventListener("click", (e) => {
    saveHandler();
});

renderBoard(board);
renderHistory();
