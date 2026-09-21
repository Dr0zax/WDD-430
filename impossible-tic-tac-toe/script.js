(() => {
    "use strict";
    const cells = [...document.querySelectorAll(".cell")];
    const board = document.querySelector("#board");
    const status = document.querySelector("#round-status");
    const playerScoreEl = document.querySelector("#player-score");
    const machineScoreEl = document.querySelector("#machine-score");
    const thinking = document.querySelector("#thinking-label");
    const overlay = document.querySelector("#result-overlay");
    const resultTitle = document.querySelector("#result-title");
    const resultMessage = document.querySelector("#result-message");
    const soundToggle = document.querySelector("#sound-toggle");
    const wins = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    let state = Array(9).fill("");
    let playerScore = 0,
        machineScore = 0,
        gameOver = false,
        soundOn = true,
        audioContext,
        turnToken = 0;

    function tone(frequency, duration = 0.08, type = "sine") {
        if (!soundOn) return;
        audioContext ||= new (
            window.AudioContext || window.webkitAudioContext
        )();
        const oscillator = audioContext.createOscillator(),
            gain = audioContext.createGain();
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.035, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + duration,
        );
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
    }
    function winner(current) {
        const line = wins.find(
            (item) =>
                current[item[0]] &&
                current[item[0]] === current[item[1]] &&
                current[item[1]] === current[item[2]],
        );
        return line ? current[line[0]] : null;
    }
    function render() {
        cells.forEach((cell, index) => {
            cell.textContent =
                state[index] === "X" ? "×" : state[index] === "O" ? "○" : "";
            cell.className = `cell ${state[index] ? state[index].toLowerCase() : ""}`;
            cell.disabled = Boolean(state[index]) || gameOver;
            cell.setAttribute(
                "aria-label",
                `${["Top left", "Top center", "Top right", "Middle left", "Center", "Middle right", "Bottom left", "Bottom center", "Bottom right"][index]}, ${state[index] ? (state[index] === "X" ? "your X" : "machine O") : "empty"}`,
            );
        });
    }
    function finish(result, line) {
        gameOver = true;
        line?.forEach((index) => cells[index].classList.add("win"));
        thinking.classList.remove("active");
        if (result === "X") {
            playerScore++;
            playerScoreEl.textContent = playerScore;
            resultTitle.textContent = "You won!";
            resultMessage.textContent =
                "Against a perfect machine? That was remarkable.";
            status.textContent = "You won";
            tone(660, 0.18, "triangle");
        } else if (result === "O") {
            machineScore++;
            machineScoreEl.textContent = machineScore;
            resultTitle.textContent = "Machine wins";
            resultMessage.textContent =
                "The machine saw it coming. Better luck next round.";
            status.textContent = "Machine wins";
            tone(170, 0.2, "sawtooth");
        } else {
            resultTitle.textContent = "A draw";
            resultMessage.textContent = "A flawless defense from both sides.";
            status.textContent = "Draw game";
            tone(390, 0.13, "triangle");
        }
        setTimeout(() => {
            overlay.hidden = false;
            document.querySelector("#play-again").focus();
        }, 450);
    }
    function checkGame() {
        const result = winner(state);
        if (result) {
            finish(
                result,
                wins.find((item) =>
                    item.every((index) => state[index] === result),
                ),
            );
            return true;
        }
        if (state.every(Boolean)) {
            finish("draw");
            return true;
        }
        return false;
    }
    function play(index, mark) {
        state[index] = mark;
        render();
        tone(mark === "X" ? 440 : 330, 0.07);
        return checkGame();
    }
    function minimax(current, maximizing, depth = 0) {
        const result = winner(current);
        if (result === "O") return 10 - depth;
        if (result === "X") return depth - 10;
        if (current.every(Boolean)) return 0;
        const available = current
            .map((v, i) => (v ? null : i))
            .filter((v) => v !== null);
        const scores = available.map((index) => {
            current[index] = maximizing ? "O" : "X";
            const score = minimax(current, !maximizing, depth + 1);
            current[index] = "";
            return { index, score };
        });
        return maximizing
            ? Math.max(...scores.map((x) => x.score))
            : Math.min(...scores.map((x) => x.score));
    }
    function computerMove(position = state) {
        const available = position
            .map((v, i) => (v ? null : i))
            .filter((v) => v !== null);
        const scored = available.map((index) => {
            position[index] = "O";
            const score = minimax(position, false);
            position[index] = "";
            return { index, score };
        });
        const bestScore = Math.max(...scored.map((item) => item.score));
        const best = scored
            .filter((item) => item.score === bestScore)
            .map((item) => item.index);
        return best[Math.floor(Math.random() * best.length)];
    }
    function playerMove(event) {
        const index = Number(event.currentTarget.dataset.index);
        if (gameOver || state[index]) return;
        if (play(index, "X")) return;
        status.textContent = "Machine is thinking";
        cells.forEach((cell) => (cell.disabled = true));
        thinking.classList.add("active");
        const activeTurn = turnToken;
        setTimeout(() => {
            if (gameOver || activeTurn !== turnToken) return;
            const move = computerMove();
            play(move, "O");
            if (!gameOver) {
                status.textContent = "Your turn";
                thinking.classList.remove("active");
                render();
            }
        }, 420);
    }
    function newGame() {
        turnToken++;
        state = Array(9).fill("");
        gameOver = false;
        overlay.hidden = true;
        status.textContent = "Your turn";
        thinking.classList.remove("active");
        render();
    }
    cells.forEach((cell) => cell.addEventListener("click", playerMove));
    document.querySelector("#new-game").addEventListener("click", newGame);
    document.querySelector("#play-again").addEventListener("click", newGame);
    document.querySelector("#reset-score").addEventListener("click", () => {
        playerScore = 0;
        machineScore = 0;
        playerScoreEl.textContent = "0";
        machineScoreEl.textContent = "0";
        newGame();
    });
    soundToggle.addEventListener("click", () => {
        soundOn = !soundOn;
        soundToggle.setAttribute("aria-pressed", String(soundOn));
        soundToggle.setAttribute(
            "aria-label",
            soundOn ? "Turn sound off" : "Turn sound on",
        );
        soundToggle.style.opacity = soundOn ? "1" : ".45";
        if (soundOn) tone(520);
    });
    window.__tttTest = {
        getState: () => [...state],
        getScores: () => ({ player: playerScore, machine: machineScore }),
        getWinner: (position) => winner([...position]),
        getBestMove: (position) => computerMove([...position]),
        isGameOver: () => gameOver,
        newGame,
    };
    render();
})();
