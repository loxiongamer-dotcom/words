// ======================
// Sound effects
// ======================
const soundCold = new Audio("assets/sounds/cold.mp3");
const soundWarm = new Audio("assets/sounds/warm.mp3");
const soundHot = new Audio("assets/sounds/hot.mp3");
const soundWin = new Audio("assets/sounds/win.mp3");
const soundLose = new Audio("assets/sounds/lose.mp3");

// ======================
// Dictionary
// ======================
const dictionary = [
  "apple","bread","beans","chair","table","guitar","printer","stadium","holiday",
  "television","basketball","microphone","restaurant","computer","technology",
  "music","sports","animals","movies","phone","screen","keyboard"
];

function isValidWord(word) {
  return dictionary.includes(word.toLowerCase());
}

// ======================
// Game variables
// ======================
let selectedCategory = null;
let selectedDifficulty = null;
let currentWord = "";
let coins = 50;
let wins = 0;
let tries = 7;
let lastGuesses = [];

const coinsEl = document.getElementById("coins");
const winsEl = document.getElementById("wins");
const emojiEl = document.getElementById("emoji");
const thermoFill = document.getElementById("thermo-fill");

// ======================
// Category & Difficulty Selection
// ======================
document.querySelectorAll("#categories button").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedCategory = btn.dataset.cat;
    checkStartGame();
  });
});

document.querySelectorAll("#difficulty button").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedDifficulty = btn.dataset.diff;
    checkStartGame();
  });
});

function checkStartGame() {
  if (selectedCategory && selectedDifficulty) {
    startGame(selectedCategory, selectedDifficulty);
  }
}

// ======================
// Thermometer Logic
// ======================
function getLevenshteinDistance(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[b.length][a.length];
}

function getClosenessPercent(guess, solution) {
  const maxLen = Math.max(guess.length, solution.length);
  const distance = getLevenshteinDistance(guess, solution);
  return Math.round(((maxLen - distance) / maxLen) * 100);
}

// ======================
// Start Game
// ======================
function startGame(category, difficulty) {
  currentWord = "television"; // placeholder
  tries = 7;
  lastGuesses = [];
  document.getElementById("game").classList.remove("hidden");
}

// ======================
// Submit Guess
// ======================
document.getElementById("submit").addEventListener("click", () => {
  const guess = document.getElementById("guess").value.toLowerCase();
  if (!guess || lastGuesses.includes(guess)) return;

  if (!isValidWord(guess)) {
    alert("That’s not a valid word!");
    return;
  }

  lastGuesses.push(guess);
  tries--;

  let closeness = getClosenessPercent(guess, currentWord);
  thermoFill.style.width = closeness + "%";

  if (closeness < 30) {
    emojiEl.textContent = "❄️";
    soundCold.play();
  } else if (closeness < 50) {
    emojiEl.textContent = "🧊";
    soundCold.play();
  } else if (closeness < 70) {
    emojiEl.textContent = "☀️";
    soundWarm.play();
  } else if (closeness < 90) {
    emojiEl.textContent = "🌶️";
    soundWarm.play();
  } else {
    emojiEl.textContent = "🔥";
    soundHot.play();
  }

  // Flash animation
  emojiEl.classList.remove("show-emoji");
  void emojiEl.offsetWidth;
  emojiEl.classList.add("show-emoji");
  setTimeout(() => {
    emojiEl.classList.remove("show-emoji");
  }, 1500);

  if (guess === currentWord) {
    wins++;
    winsEl.textContent = wins;
    soundWin.play();
    alert("You win!");
  } else if (tries === 0) {
    soundLose.play();
    alert("Game over! The word was " + currentWord);
  }
});
