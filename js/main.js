let currentPage = 1;
const pageSize = 10;

// Get the cookie
// function getCookie(name) {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(";").shift();
// }

// Check if the user is logged in
// const token = getCookie("token");

// if (token) {
//   if (window.location.pathname !== "/dashboard.html") {
//     window.location.href = "dashboard.html";
//   }
// } else if (window.location.pathname !== "/index.html") {
//   window.location.href = "index.html";
// }

// Function to load CSS dynamically
function loadCSS(url) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
}

// Load CSS the CSS files
loadCSS("css/header.css");
loadCSS("css/card.css");
loadCSS("css/table-card.css");

// Fetch the header component
fetch("html/components/header.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("header").innerHTML = data;

    // Change the image source and button onclick based on the current page
    const headerImage = document.getElementById("header-image");
    const headerButton = document.getElementById("header-button");
    if (window.location.pathname.includes("dashboard.html")) {
      headerImage.src = "public/logout.svg";
      headerImage.alt = "Logout Button";
      headerButton.onclick = () => {
        document.cookie =
          "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = "index.html";
      };
    } else {
      headerImage.src = "public/login.svg";
      headerImage.alt = "Login Button";
      headerButton.onclick = () => {
        window.location.href = "login.html";
      };
    }
  })
  .catch((error) => console.error("Error loading component:", error));

// Function to create a card with a specific title and body
function createCard(title, body) {
  fetch("html/components/card.html")
    .then((response) => response.text())
    .then((data) => {
      const cardContainer = document.createElement("div");
      cardContainer.innerHTML = data;

      // Set dynamic content for card-title and card-body
      cardContainer.querySelector(".card-title-text").textContent = title;
      cardContainer.querySelector(".card-body-text").textContent = body;

      // Add specific class based on the title
      if (title === "Total Income") {
        cardContainer.classList.add("card-income");
      } else if (title === "Total Outcome") {
        cardContainer.classList.add("card-outcome");
      }

      document.getElementById("cards-container").appendChild(cardContainer);
    })
    .catch((error) => console.error("Error loading component:", error));
}

// Function to show containers
function showContainers() {
  document.getElementById("cards-container").style.display = "block";
  document.getElementById("table-container").style.display = "block";
}

// Fetch balance from the API
async function fetchBalance() {
  try {
    const response = await fetch(
      "https://himaikfinance.azurewebsites.net/Transaction/GetAllTransactions"
    );
    const data = await response.json();
    if (data.length > 0) {
      const lastTransaction = data[data.length - 1];
      const lastBalance = lastTransaction.balance;
      return { title: "Balance", body: `${lastBalance}` };
    } else {
      return { title: "Balance", body: "No transactions found." };
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return { title: "Balance", body: "Error fetching transactions." };
  }
}

// Fetch income from the API and populate the table
async function fetchPaginatedIncome(pageNumber = 1) {
  try {
    const response = await fetch(
      `https://himaikfinance.azurewebsites.net/IncomeData/GetAllIncomeData?nominalSortOrder=asc&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    const data = await response.json();
    const incomeTableBody = document.querySelector("#income-table tbody");
    incomeTableBody.innerHTML = "";

    data.forEach((income) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${income.name}</td>
                <td>${income.nominal}</td>
                <td>${new Date(income.transferDate).toLocaleDateString()}</td>
            `;
      incomeTableBody.appendChild(row);
    });

    const prevIncomePageButton = document.getElementById("prev-income-page");
    const nextIncomePageButton = document.getElementById("next-income-page");

    if (prevIncomePageButton) {
      prevIncomePageButton.disabled = pageNumber === 1;
    }
    if (nextIncomePageButton) {
      nextIncomePageButton.disabled = data.length < pageSize;
    }

    currentPage = pageNumber;

    const totalNominal = data.reduce((acc, income) => acc + income.nominal, 0);
    return { title: "Total Income", body: `${totalNominal}` };
  } catch (error) {
    console.error("Error fetching income:", error);
    return { title: "Total Income", body: "Error fetching income." };
  }
}

// Fetch income from the API
async function fetchIncome() {
  try {
    const response = await fetch(
      "https://himaikfinance.azurewebsites.net/Transaction/GetAllTransactions"
    );
    const data = await response.json();
    const totalIncome = data.reduce(
      (acc, transaction) => acc + transaction.credit,
      0
    );
    return { title: "Total Income", body: `${totalIncome}` };
  } catch (error) {
    console.error("Error fetching income:", error);
    return { title: "Total Income", body: "Error fetching income." };
  }
}

// Fetch outcome from the API
async function fetchOutcome() {
  try {
    const response = await fetch(
      "https://himaikfinance.azurewebsites.net/Transaction/GetAllTransactions"
    );
    const data = await response.json();
    const totalDebit = data.reduce(
      (acc, transaction) => acc + transaction.debit,
      0
    );
    return { title: "Total Outcome", body: `${totalDebit}` };
  } catch (error) {
    console.error("Error fetching outcome:", error);
    return { title: "Total Outcome", body: "Error fetching outcome." };
  }
}

// Fetch paginated transactions from the API and populate the transaction tab
async function fetchPaginatedTransactions(pageNumber = 1) {
  try {
    const response = await fetch(
      `https://himaikfinance.azurewebsites.net/Transaction/GetAllTransactionsPaginated?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    const data = await response.json();
    const transactionTableBody = document.querySelector(
      "#transaction-table tbody"
    );
    transactionTableBody.innerHTML = "";

    data.forEach((transaction) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                    <td>${transaction.debit}</td>
                    <td>${transaction.credit}</td>
                    <td>${transaction.balance}</td>
                    <td>${transaction.notes}</td>
                `;
      transactionTableBody.appendChild(row);
    });

    document.getElementById("prev-transaction-page").disabled =
      pageNumber === 1;
    document.getElementById("next-transaction-page").disabled =
      data.length < pageSize;

    currentPage = pageNumber;
  } catch (error) {
    console.error("Error fetching paginated transactions:", error);
  }
}

// Function to change transaction page
function changeTransactionPage(direction) {
  const newPage = currentPage + direction;
  fetchPaginatedTransactions(newPage);
}

// Function to change income page
function changeIncomePage(direction) {
  const newPage = currentPage + direction;
  fetchPaginatedIncome(newPage);
}

// Fetch all data and create cards
Promise.all([fetchBalance(), fetchIncome(), fetchOutcome()])
  .then((results) => {
    results.forEach((result) => {
      createCard(result.title, result.body);
    });
    showContainers();
  })
  .catch((error) => console.error("Error fetching data:", error));

// Function to update transaction info
function updateTransactionInfo() {
  Promise.all([fetchBalance(), fetchIncome(), fetchOutcome()])
    .then((results) => {
      const transactionInfo = document.getElementById("transaction-info");
      transactionInfo.innerHTML = "";

      results.forEach((result) => {
        const stackDiv = document.createElement("div");
        stackDiv.className = "stack";

        if (result.title === "Total Income") {
          stackDiv.classList.add("income");
        } else if (result.title === "Total Outcome") {
          stackDiv.classList.add("outcome");
        }

        const valueSpan = document.createElement("span");
        valueSpan.className = "transaction-value";
        valueSpan.textContent = result.body;

        const labelSpan = document.createElement("span");
        labelSpan.className = "transaction-label";
        labelSpan.textContent = result.title;

        stackDiv.appendChild(valueSpan);
        stackDiv.appendChild(labelSpan);
        transactionInfo.appendChild(stackDiv);
      });

      // Add the visible class to the dashboard container after updating transaction info
      document.querySelector(".dashboard-container").classList.add("visible");
    })
    .catch((error) => console.error("Error fetching data:", error));
}

// Fetch the dashboard container component
fetch("html/components/dashboard-container.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("dashboard-container").innerHTML = data;
    return fetch("html/components/transaction-info.html");
  })
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("transaction-info").innerHTML = data;
    updateTransactionInfo();
  })
  .catch((error) => console.error("Error loading component:", error));

// Fetch the table component
fetch("html/components/table-card.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("table-container").innerHTML = data;
    fetchPaginatedTransactions();
    fetchPaginatedIncome();

    // Add event listeners for next and prev buttons
    document
      .getElementById("prev-income-page")
      .addEventListener("click", () => changeIncomePage(-1));
    document
      .getElementById("next-income-page")
      .addEventListener("click", () => changeIncomePage(1));
  })
  .catch((error) => console.error("Error loading component:", error));

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
  fetchPaginatedIncome(newPage);
}

// Initialize the first tab to be visible
document.addEventListener("DOMContentLoaded", function () {
  const defaultTab =
    document.querySelector(".tab-button.active") ||
    document.querySelector(".tab-button");
  if (defaultTab) {
    defaultTab.click();
  }
});

console.log("Dashboard script loaded");
