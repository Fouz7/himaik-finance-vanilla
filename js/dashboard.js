//get the cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Check if the user is logged in
const token = getCookie('token');
if (!token) {
    // If not logged in, redirect to home page
    window.location.href = 'index.html';
}

// Function to load CSS dynamically
function loadCSS(url) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
}

// Load the dashboard CSS
loadCSS('css/dashboard.css');

// fetch the dashboard container
fetch('html/components/dashboard-container.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('dashboard-container').innerHTML = data;
        return fetch('html/components/transaction-info.html');
    })
    // fetch the transaction info
    .then(response => response.text())
    .then(data => {
        document.getElementById('transaction-info').innerHTML = data;
        return fetch('html/components/dashboard-table-container.html');
    })
    // fetch the dashboard table container
    .then(response => response.text())
    .then(data => {
        document.getElementById('dashboard-table-container').innerHTML = data;
        return fetch('html/components/income-table.html');
    })
    // fetch the income table
    .then(response => response.text())
    .then(data => {
        document.getElementById('income-table-container').innerHTML = data;
        return fetch('html/components/transaction-table.html');
    })
    // fetch the transaction table
    .then(response => response.text())
    .then(data => {
        document.getElementById('transaction-table-container').innerHTML = data;
        document.querySelector('.dashboard-container').classList.remove('hidden'); // Remove hidden class here
        document.querySelector('.dashboard-container').classList.add('visible');
        fetchPaginatedIncome();
        fetchPaginatedTransactions();
    })
    .catch(error => console.error('Error loading component:', error));