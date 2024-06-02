document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && textInput.disabled && !gameStarted) {
        startGame();
    }
});

textInput.addEventListener('input', () => {
    const inputText = textInput.value;
    const textSpans = textDisplay.querySelectorAll('span:not(.cursor)');
    errorCount = 0;
    correctChars = 0;

    for (let i = 0; i < inputText.length; i++) {
        const char = inputText[i];
        const charSpan = textSpans[i];

        if (charSpan) {
            if (char === charSpan.innerText) {
                charSpan.classList.add('correct');
                charSpan.classList.remove('incorrect');
                correctChars++;
            } else {
                charSpan.classList.add('incorrect');
                charSpan.classList.remove('correct');
                errorCount++;
            }
        }
    }

    for (let i = inputText.length; i < textSpans.length; i++) {
        textSpans[i].classList.remove('correct', 'incorrect');
    }

    errorCountDisplay.innerText = `Errors: ${errorCount}`;

    const elapsedTime = (new Date() - startTime) / 1000 / 60;
    const wpm = Math.round((correctChars / 5) / elapsedTime);
    const cpm = Math.round(correctChars / elapsedTime);
    speedCountDisplay.innerText = `WPM: ${wpm} | CPM: ${cpm}`;

    updateCursorPosition();

    if (inputText.trim() === randomText) {
        clearInterval(timer);
        showNotification(`Congratulations!🥳 You've finished typing. WPM: ${wpm}, CPM: ${cpm}, Errors: ${errorCount}`);
        saveResult(wpm, cpm, errorCount);
        displayResults();
    }
});

textInput.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        event.preventDefault();
        textInput.value += ' ';
        const inputEvent = new Event('input');
        textInput.dispatchEvent(inputEvent);
    }
});

difficultySelect.addEventListener('change', initializeGame);

restartButton.addEventListener('click', () => {
    initializeGame();
    startGame();
});

time30Button.addEventListener('click', () => {
    timeLimit = 30;
    initializeGame();
});
time60Button.addEventListener('click', () => {
    timeLimit = 60;
    initializeGame();
});
time120Button.addEventListener('click', () => {
    timeLimit = 120;
    initializeGame();
});

languageButton.addEventListener('click', () => {
    languageSelect.style.display = languageSelect.style.display === 'block' ? 'none' : 'block';
});

languageSelect.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        currentLanguage = event.target.getAttribute('data-lang');
        languageSelect.style.display = 'none';
        initializeGame();
    }
});

okButton.addEventListener('click', () => {
    hideNotification();
});

retryButton.addEventListener('click', () => {
    hideNotification();
    initializeGame();
    startGame();
});

// Добавление обработчиков для клавиши Enter на кнопках уведомления
okButton.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        hideNotification();
    }
});

retryButton.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        hideNotification();
        initializeGame();
        startGame();
    }
});

