function loadCSS(url) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
}

fetch('html/components/login-card.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('login-card').innerHTML = data;
        loadCSS('css/login.css');

        const loginButton = document.getElementById('login-button');
        loginButton.addEventListener('click', () => {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            fetch('https://himaikfinance.azurewebsites.net/User/LoginUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error('Invalid username or password');
                }
            })
            .then(data => {
                const token = data.token;
                document.cookie = `token=${token}; path=/; secure`;
                window.location.href = 'dashboard.html';
            })
            .catch(error => {
                alert(error.message);
                console.error('Error:', error);
            });
        });
    })
    .catch(error => console.error('Error loading component:', error));