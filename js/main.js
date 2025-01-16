let currentPage = 1;
const pageSize = 10;

// Function to load CSS dynamically
function loadCSS(url) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
}

// Load CSS the CSS files
loadCSS('css/card.css');
loadCSS('css/table-card.css');

// Fetch the header component
fetch('html/components/header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header').innerHTML = data;
        loadCSS('css/header.css');
    })
    .catch(error => console.error('Error loading component:', error));

// Function to create a card with a specific title and body
function createCard(title, body) {
    fetch('html/components/card.html')
        .then(response => response.text())
        .then(data => {
            const cardContainer = document.createElement('div');
            cardContainer.innerHTML = data;

            // Set dynamic content for card-title and card-body
            cardContainer.querySelector('.card-title-text').textContent = title;
            cardContainer.querySelector('.card-body-text').textContent = body;

            // Add specific class based on the title
            if (title === 'Total Income') {
                cardContainer.classList.add('card-income');
            } else if (title === 'Total Outcome') {
                cardContainer.classList.add('card-outcome');
            }

            document.getElementById('cards-container').appendChild(cardContainer);
        })
        .catch(error => console.error('Error loading component:', error));
}

// Function to show containers
function showContainers() {
    document.getElementById('cards-container').style.display = 'block';
    document.getElementById('table-container').style.display = 'block';
}

// Fetch transactions from the API
function fetchTransactions() {
    return fetch('https://himaikfinance.azurewebsites.net/Transaction/GetAllTransactions')
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const lastTransaction = data[data.length - 1];
                const lastBalance = lastTransaction.balance;
                return { title: 'Balance', body: `${lastBalance}` };
            } else {
                return { title: 'Balance', body: 'No transactions found.' };
            }
        })
        .catch(error => {
            console.error('Error fetching transactions:', error);
            return { title: 'Balance', body: 'Error fetching transactions.' };
        });
}

// Fetch income from the API and populate the table
function fetchIncome(pageNumber = 1) {
    return fetch(`https://himaikfinance.azurewebsites.net/IncomeData/GetAllIncomeData?nominalSortOrder=asc&pageNumber=${pageNumber}&pageSize=${pageSize}`)
        .then(response => response.json())
        .then(data => {
            const incomeTableBody = document.querySelector('#income-table tbody');
            incomeTableBody.innerHTML = '';

            data.forEach(income => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${income.name}</td>
                    <td>${income.nominal}</td>
                    <td>${new Date(income.transferDate).toLocaleDateString()}</td>
                `;
                incomeTableBody.appendChild(row);
            });

            document.getElementById('prev-page').disabled = pageNumber === 1;
            document.getElementById('next-page').disabled = data.length < pageSize;

            currentPage = pageNumber;

            const totalNominal = data.reduce((acc, income) => acc + income.nominal, 0);
            
            // Tampilkan table-container setelah data berhasil di-fetch
            document.getElementById('table-container').style.display = 'block';

            return { title: 'Total Income', body: `${totalNominal}` };
        })
        .catch(error => {
            console.error('Error fetching income:', error);
            return { title: 'Total Income', body: 'Error fetching income.' };
        });
}

// Fetch outcome from the API
function fetchOutcome() {
    return fetch('https://himaikfinance.azurewebsites.net/Transaction/GetAllTransactions')
        .then(response => response.json())
        .then(data => {
            const totalDebit = data.reduce((acc, transaction) => acc + transaction.debit, 0);
            return { title: 'Total Outcome', body: `${totalDebit}` };
        })
        .catch(error => {
            console.error('Error fetching outcome:', error);
            return { title: 'Total Outcome', body: 'Error fetching outcome.' };
        });
}

// Fetch paginated transactions from the API and populate the transaction tab
function fetchPaginatedTransactions(pageNumber = 1) {
    return fetch(`https://himaikfinance.azurewebsites.net/Transaction/GetAllTransactionsPaginated?pageNumber=${pageNumber}&pageSize=${pageSize}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const transactionTableBody = document.querySelector('#transaction-table tbody');
            transactionTableBody.innerHTML = '';

            data.forEach(transaction => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${transaction.debit}</td>
                    <td>${transaction.credit}</td>
                    <td>${transaction.balance}</td>
                    <td>${transaction.notes}</td>
                `;
                transactionTableBody.appendChild(row);
            });

            document.getElementById('prev-transaction-page').disabled = pageNumber === 1;
            document.getElementById('next-transaction-page').disabled = data.length < pageSize;

            currentPage = pageNumber;
        })
        .catch(error => {
            console.error('Error fetching paginated transactions:', error);
        });
}

// Function to change transaction page
function changeTransactionPage(direction) {
    const newPage = currentPage + direction;
    fetchPaginatedTransactions(newPage);
}

// Fetch all data and create cards
Promise.all([fetchTransactions(), fetchIncome(), fetchOutcome()])
    .then(results => {
        results.forEach(result => {
            createCard(result.title, result.body);
        });
        showContainers(); // Show containers after data is fetched and cards are created
    })
    .catch(error => console.error('Error fetching data:', error));

// Fetch the table component
fetch('html/components/table-card.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('table-container').innerHTML = data;
        fetchPaginatedTransactions(); // Fetch paginated transactions after table component is loaded
    })
    .catch(error => console.error('Error loading component:', error));

// Function to handle tab switching
function openTab(evt, tabName) {
    let i, tabcontent, tabbuttons;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove("active");
    }
    tabbuttons = document.getElementsByClassName("tab-button");
    for (i = 0; i < tabbuttons.length; i++) {
        tabbuttons[i].classList.remove("active");
    }
    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// Function to change page
function changePage(direction) {
    const newPage = currentPage + direction;
    fetchIncome(newPage);
}

// Initialize the first tab to be visible
document.addEventListener("DOMContentLoaded", function() {
    const defaultTab = document.querySelector(".tab-button.active") || document.querySelector(".tab-button");
    if (defaultTab) {
        defaultTab.click();
    }
});