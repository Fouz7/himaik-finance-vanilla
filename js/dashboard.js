// Check for token in cookies
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

const token = getCookie('token');
if (!token) {
    window.location.href = 'index.html';
    return;
}

// Function to load CSS dynamically
function loadCSS(url) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
}

loadCSS('css/dashboard.css');

fetch('html/components/dashboard-container.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('dashboard-container').innerHTML = data;
        return fetch('html/components/transaction-info.html');
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById('transaction-info').innerHTML = data;
        return fetch('html/components/dashboard-table-container.html');
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById('dashboard-table-container').innerHTML = data;
        return fetch('html/components/income-table.html');
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById('income-table-container').innerHTML = data;
        return fetch('html/components/transaction-table.html');
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById('transaction-table-container').innerHTML = data;
        document.querySelector('.dashboard-container').classList.add('visible');
        fetchPaginatedIncome();
        fetchPaginatedTransactions();
    })
    .catch(error => console.error('Error loading component:', error));