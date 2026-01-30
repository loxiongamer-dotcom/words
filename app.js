// Temporary dictionary list (expand later or connect to Firebase)
const dictionary = [
  "apple","bread","chair","table","guitar","printer","stadium","holiday",
  "television","basketball","microphone","restaurant","computer","technology",
  "music","sports","animals","movies","phone","screen","keyboard"
];

function isValidWord(word) {
  return dictionary.includes(word.toLowerCase());
}

let coins = 50;
let wins = 0;
let tries = 8;
let currentWord = "";
let lastGuesses = [];

const coinsEl = document.getElementById("coins");
const winsEl = document.getElementById("wins");
const triesEl = document.getElementById("tries-left");
const thermoFill = document.getElementById("thermo-fill");
const emojiEl = document.getElementById("emoji");
const lastGuessesEl = document.getElementById("last-guesses");
const wordLengthEl = document.getElementById("word-length");

let selectedCategory = null;
let selectedDifficulty = null;

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

function checkStartGame() {
  if (selectedCategory && selectedDifficulty) {
    startGame(selectedCategory, selectedDifficulty);
  }
}

function startGame(category = "Food", difficulty = "Beginner") {
  document.getElementById("selection").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  // Temporary word pool (replace with Firebase later)
  const words = {
    Beginner: ["apple", "bread", "chair", "table"],
    Novice: ["guitar", "printer", "stadium", "holiday"],
    Expert: ["television", "basketball", "microphone", "restaurant"]
  };

  const pool = words[difficulty];
  currentWord = pool[Math.floor(Math.random() * pool.length)];
  wordLengthEl.textContent = `Word length: ${currentWord.length} letters`;
}

document.getElementById("submit").addEventListener("click", () => {
  const guess = document.getElementById("guess").value.toLowerCase();
if (!guess || lastGuesses.includes(guess)) return;

// Check dictionary
if (!isValidWord(guess)) {
  alert("That’s not a valid word!");
  return;
}

  lastGuesses.unshift(guess);
  if (lastGuesses.length > 3) lastGuesses.pop();
  lastGuessesEl.textContent = "Last guesses: " + lastGuesses.join(", ");

  tries--;
  triesEl.textContent = tries;

  // Simple closeness check (replace with better algorithm later)
let closeness = getClosenessPercent(guess, currentWord);
thermoFill.style.width = closeness + "%";

  // Emoji feedback
  if (closeness < 30) emojiEl.textContent = "❄️";
  else if (closeness < 50) emojiEl.textContent = "🧊";
  else if (closeness < 70) emojiEl.textContent = "☀️";
  else if (closeness < 90) emojiEl.textContent = "🌶️";
  else emojiEl.textContent = "🔥";

  if (guess === currentWord) {
    wins++;
    winsEl.textContent = wins;
    alert("You win!");
  } else if (tries === 0) {
    alert("Game over! The word was " + currentWord);
  }
});

document.getElementById("hint").addEventListener("click", () => {
  if (coins >= 20) {
    coins -= 20;
    coinsEl.textContent = coins;
    alert("Hint: The word starts with " + currentWord[0]);
  } else {
    alert("Not enough coins!");
  }
});

document.getElementById("watch-ad").addEventListener("click", () => {
  coins += 10;
  coinsEl.textContent = coins;
  alert("You earned 10 coins!");
});
