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
        document.querySelector('.dashboard-container').classList.remove('hidden');
        document.querySelector('.dashboard-container').classList.add('visible');
        fetchPaginatedIncome();
        fetchPaginatedTransactions();
    })
    .catch(error => console.error('Error loading component:', error));
    
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM fully loaded and parsed');
    
        // Function to show dialog
        function showDialog(formUrl) {
            console.log('Showing dialog with form:', formUrl);
            fetch('html/components/dialog.html')
                .then(response => response.text())
                .then(dialogHtml => {
                    document.getElementById('dialog-container').innerHTML = dialogHtml;
                    return fetch(formUrl);
                })
                .then(response => response.text())
                .then(formHtml => {
                    document.getElementById('dialog-form-container').innerHTML = formHtml;
                    document.querySelector('.dialog').classList.add('visible');
                    document.querySelector('.close-button').addEventListener('click', closeDialog);
                    console.log('Dialog shown successfully');
                })
                .catch(error => console.error('Error loading dialog:', error));
        }
    
        // Function to close dialog
        function closeDialog() {
            document.querySelector('.dialog').classList.remove('visible');
            console.log('Dialog closed');
        }
    
        // Add event listeners for buttons
        document.getElementById('add-income').addEventListener('click', () => {
            showDialog('html/components/income-form.html');
        });
    
        document.getElementById('add-transactions').addEventListener('click', () => {
            showDialog('html/components/transaction-form.html');
        });
    
        console.log('Event listeners added');
    });