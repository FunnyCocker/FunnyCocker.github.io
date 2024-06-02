const textDisplay = document.getElementById('text-display');
const textInput = document.getElementById('text-input');
const errorCountDisplay = document.getElementById('error-count');
const speedCountDisplay = document.getElementById('speed-count');
const timerDisplay = document.getElementById('timer');
const restartButton = document.getElementById('restart-button');
const time30Button = document.getElementById('time-30');
const time60Button = document.getElementById('time-60');
const time120Button = document.getElementById('time-120');
const difficultySelect = document.getElementById('difficulty');
const languageButton = document.getElementById('language-button');
const languageSelect = document.getElementById('language-select');
const resultsDisplay = document.getElementById('results');
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notification-message');
const okButton = document.getElementById('ok-button');
const retryButton = document.getElementById('retry-button');

let randomText = "";
let startTime;
let errorCount = 0;
let correctChars = 0;
let timer;
let timeLimit = 30;
let gameStarted = false;
let currentLanguage = 'en';

function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    textInput.disabled = false;
    textInput.focus();
    textDisplay.classList.add('active');
    startTime = new Date();
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
}

async function initializeGame() {
    const difficulty = difficultySelect.value;
    randomText = await fetchRandomText(difficulty, currentLanguage);
    textDisplay.innerHTML = randomText.split('').map(char =>
        `<span>${char}</span>`).join('') + '<span class="cursor"></span>';
    textInput.value = "";
    textInput.disabled = true;
    textDisplay.classList.remove('active');
    errorCount = 0;
    correctChars = 0;
    errorCountDisplay.innerText = "Errors: 0";
    speedCountDisplay.innerText = "WPM: 0 | CPM: 0";
    clearInterval(timer);
    timerDisplay.innerText = `Timer: ${timeLimit}`;
    updateCursorPosition();
    hideNotification();
    gameStarted = false;
}

function updateTimer() {
    let elapsedTime = Math.floor((new Date() - startTime) / 1000);
    let remainingTime = timeLimit - elapsedTime;
    timerDisplay.innerText = `Timer: ${remainingTime}`;
    if (remainingTime <= 0) {
        clearInterval(timer);
        endGame();
    }
}

function endGame() {
    textInput.disabled = true;
    const elapsedTime = (new Date() - startTime) / 1000 / 60;
    const charsTyped = textInput.value.length;
    const wpm = Math.round((correctChars / 5) / elapsedTime);
    const cpm = Math.round(correctChars / elapsedTime);
    showNotification(`Time's up! WPM: ${wpm}, CPM: ${cpm}, Errors: ${errorCount}`);
    saveResult(wpm, cpm, errorCount);
    displayResults();
}

function saveResult(wpm, cpm, errors) {
    const results = JSON.parse(localStorage.getItem('typingTestResults')) || [];
    results.push({ date: new Date().toLocaleDateString(), wpm, cpm, errors });
    localStorage.setItem('typingTestResults', JSON.stringify(results));
}

function displayResults() {
    const results = JSON.parse(localStorage.getItem('typingTestResults')) || [];
    resultsDisplay.innerHTML = '<h3>Past Results:</h3>';
    const highestWPM = Math.max(...results.map(result => result.wpm), 0);
    results.forEach(result => {
        const isHighest = result.wpm === highestWPM;
        const emojis = isHighest ? '🥳' : '';
        resultsDisplay.innerHTML += `<p class="${isHighest ? 'highest-rating' : ''}">${emojis} ${result.date} - WPM: ${result.wpm}, CPM: ${result.cpm}, Errors: ${result.errors} ${emojis}</p>`;
    });

    // Check if the last result is the highest WPM and show confetti if it is
    if (results.length > 0 && results[results.length - 1].wpm === highestWPM) {
        showConfetti();
    }
}

function showConfetti() {
    confetti({
        particleCount: 1000,
        spread: 300,
        origin: { y: 0.6 }
    });
}

function showNotification(message) {
    notificationMessage.innerText = message;
    notification.style.display = 'block';
    restrictTabAccess(true);
    blurBackground(true);
    okButton.focus(); // Установить фокус на первую кнопку уведомления
}

function hideNotification() {
    notification.style.display = 'none';
    restrictTabAccess(false);
    blurBackground(false);
    textInput.disabled = true; // Блокировать поле ввода при скрытии уведомления
}

function restrictTabAccess(restrict) {
    const focusableElements = document.querySelectorAll('button, input, select');
    const notificationElements = notification.querySelectorAll('button');
    focusableElements.forEach(el => {
        if (!notification.contains(el)) {
            el.tabIndex = restrict ? -1 : 0;
        }
    });
    notificationElements.forEach(el => el.tabIndex = 0);
}

function blurBackground(blur) {
    const overlay = document.getElementById('overlay');
    overlay.style.display = blur ? 'block' : 'none';
}

function updateCursorPosition() {
    const inputText = textInput.value;
    const textSpans = textDisplay.querySelectorAll('span');
    const cursorSpan = textDisplay.querySelector('.cursor');
    const cursorIndex = inputText.length;

    if (cursorSpan) {
        if (cursorIndex > 0) {
            const precedingSpan = textSpans[cursorIndex - 1];
            const precedingRect = precedingSpan.getBoundingClientRect();
            const textDisplayRect = textDisplay.getBoundingClientRect();

            cursorSpan.style.position = 'absolute';
            cursorSpan.style.top = `${precedingSpan.offsetTop}px`;
            cursorSpan.style.left = `${precedingRect.left + precedingRect.width - textDisplayRect.left}px`;
        } else {
            const firstSpan = textSpans[0];
            cursorSpan.style.position = 'absolute';
            cursorSpan.style.top = `${firstSpan.offsetTop}px`;
            cursorSpan.style.left = `${firstSpan.offsetLeft}px`;
        }
    }
}

displayResults();
initializeGame();
