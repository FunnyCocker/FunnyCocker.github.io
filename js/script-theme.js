

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const themeButton = document.getElementById('switch-theme-button');

    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') {
        body.classList.add('light-theme');
        themeButton.innerHTML = '😎';
    }

    
    themeButton.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        let theme = 'dark';
        if (body.classList.contains('light-theme')) {
            theme = 'light';
            themeButton.innerHTML = '😎';
        } else {
            themeButton.innerHTML = '🤓';
        }
        localStorage.setItem('theme', theme);
    });
});

 