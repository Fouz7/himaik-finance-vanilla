function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Function to load CSS dynamically
function loadCSS(url) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
}

// Load the dashboard CSS
loadCSS("css/dashboard.css");

// fetch the dashboard container
fetch("html/components/dashboard-container.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("dashboard-container").innerHTML = data;
    return fetch("html/components/transaction-info.html");
  })
  // fetch the transaction info
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("transaction-info").innerHTML = data;
    return fetch("html/components/dashboard-table-container.html");
  })
  // fetch the dashboard table container
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("dashboard-table-container").innerHTML = data;
    return fetch("html/components/income-table.html");
  })
  // fetch the income table
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("income-table-container").innerHTML = data;
    return fetch("html/components/transaction-table.html");
  })
  // fetch the transaction table
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("transaction-table-container").innerHTML = data;
    document.querySelector(".dashboard-container").classList.remove("hidden");
    document.querySelector(".dashboard-container").classList.add("visible");
    fetchPaginatedIncome();
    fetchPaginatedTransactions();
  })
  .catch((error) => console.error("Error loading component:", error));

function showDialog(contentUrl) {
    fetch(contentUrl)
        .then(response => response.text())
        .then(data => {
            document.getElementById('dialog-content').innerHTML = data;
            const dialog = document.querySelector('.dialog');
            if (dialog) {
                dialog.style.display = 'block';
                dialog.showModal();

                // Add event listener to close dialog when clicking outside
                window.addEventListener('click', function(event) {
                    if (event.target === dialog) {
                        dialog.style.display = 'none';
                        dialog.close();
                    }
                });

                // Add event listener to the form submit
                if (contentUrl.includes('income-form.html')) {
                    document.getElementById('income-form').addEventListener('submit', function(event) {
                        event.preventDefault();
                        const name = document.getElementById('name').value;
                        const nominal = parseFloat(document.getElementById('nominal').value);
                        const date = document.getElementById('date').value;
                        dialog.style.display = 'none';
                        dialog.close();
                        showConfirmDialog('income', { name, nominal, date });
                    });
                } else if (contentUrl.includes('transaction-form.html')) {
                    document.getElementById('transaction-form').addEventListener('submit', function(event) {
                        event.preventDefault();
                        const debit = parseFloat(document.getElementById('debit').value);
                        const notes = document.getElementById('notes').value;
                        dialog.style.display = 'none';
                        dialog.close();
                        showConfirmDialog('transaction', { debit, notes });
                    });
                }
            } else {
                console.error('Dialog element not found');
            }
        })
        .catch(error => console.error('Error loading dialog content:', error));
}

// Fetch the dialog component
fetch("html/components/dialog.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("dialog-container").innerHTML = data;

    // Add event listener to the add-income button
    document.getElementById("add-income").addEventListener("click", () => {
      showDialog("html/components/income-form.html");
    });

    // Add event listener to the add-transactions button
    document
      .getElementById("add-transactions")
      .addEventListener("click", () => {
        showDialog("html/components/transaction-form.html");
      });
  })
  .catch((error) => console.error("Error loading dialog component:", error));

// Fetch the confirm dialog component
fetch("html/components/confirm-dialog.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("confirm-dialog-container").innerHTML = data;
  })
  .catch((error) =>
    console.error("Error loading confirm dialog component:", error)
  );

function showConfirmDialog(type, data) {
    const confirmDialog = document.querySelector('.confirm-dialog');
    let dialogContent = `<p class="label">Are you sure want to submit the ${type}?</p>`;

    if (type === 'income') {
        dialogContent += `
            <p><span class="label">Name:</span> ${data.name}</p>
            <p><span class="label">Nominal:</span> ${data.nominal}</p>
            <p><span class="label">Date:</span> ${data.date}</p>
        `;
    } else if (type === 'transaction') {
        dialogContent += `
            <p><span class="label">Debit:</span> ${data.debit}</p>
            <p><span class="label">Notes:</span> ${data.notes}</p>
        `;
    }

    dialogContent += `
        <div class="button-container">
            <button id="cancel-button" class="cancel-button">Cancel</button>
            <button id="submit-button" class="submit-button">Submit</button>
        </div>
    `;

    document.getElementById('confirm-dialog-content').innerHTML = dialogContent;
    confirmDialog.style.display = 'block';
    confirmDialog.showModal();

    document.getElementById('cancel-button').addEventListener('click', function() {
        confirmDialog.style.display = 'none';
        confirmDialog.close();
    });

    document.getElementById('submit-button').addEventListener('click', function() {
        submitForm(type, data);
    });
}

function submitForm(type, data) {
  let url = "";
  if (type === "income") {
    url = "https://himaikfinance.azurewebsites.net/IncomeData/AddIncomeData";
  } else if (type === "transaction") {
    url = "https://himaikfinance.azurewebsites.net/Transaction/AddTransaction";
  }

  const token = getCookie('token');

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Something was wrong");
      }
    })
    .then((data) => {
      console.log("Success:", data);
      alert("Success: Data has been submitted successfully!");
      const confirmDialog = document.querySelector(".confirm-dialog");
      confirmDialog.style.display = "none";
      confirmDialog.close();
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error: There was a problem submitting the data.");
    });
}

console.log("Dashboard script loaded");