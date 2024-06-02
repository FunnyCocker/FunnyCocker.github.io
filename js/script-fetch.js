const texts = {
    en: async (wordCount) => {
        const response = await fetch(`https://random-word-api.herokuapp.com/word?number=${wordCount}`);
        const words = await response.json();
        return words.join(' ').toLowerCase();
    },
    ru: async (wordCount) => {
        const response = await fetch('data/russian_words.json');
        const data = await response.json();
        const words = data.words;
        return generateText(words, wordCount);
    },
    es: async (wordCount) => {
        const response = await fetch(`https://random-word-api.herokuapp.com/word?number=${wordCount}&lang=es`);
        const words = await response.json();
        return words.join(' ').toLowerCase();
    },
    fr: async (wordCount) => {
        const response = await fetch(`https://random-word-api.herokuapp.com/word?number=${wordCount}&lang=fr`);
        const words = await response.json();
        return words.join(' ').toLowerCase();
    }
};

function generateText(words, length) {
    let text = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        text += words[randomIndex] + ' ';
    }
    return text.trim();
}

async function fetchRandomText(difficulty, language) {
    let wordCount;
    if (difficulty === "short") {
        wordCount = 10;
    } else if (difficulty === "medium") {
        wordCount = 20;
    } else {
        wordCount = 30;
    }
    return texts[language](wordCount);
}
