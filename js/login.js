// Function to load CSS dynamically
function loadCSS(url) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
}

loadCSS("css/login.css");

// function to load the login card
fetch("html/components/login-card.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("login-card").innerHTML = data;

    const loginButton = document.getElementById("login-button"); // Get the login button
    // Add an event listener to the login button
    loginButton.addEventListener("click", () => {
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      // Fetch the login API
      fetch("https://himaikfinance.azurewebsites.net/User/LoginUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
        // Check the response status if it's 200 then return the response as JSON
        .then(async (response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            // If the response status is not 200 then throw an error with the response text
            const errorText = await response.text();
            throw new Error(errorText || "Invalid username or password");
          }
        })
        // Set the token in the cookie and redirect to the dashboard
        .then((data) => {
          const token = data.token;
          document.cookie = `token=${token}; path=/; secure`;
          window.location.href = "dashboard.html";
        })
        .catch((error) => {
          alert(error.message);
          console.error("Error:", error);
        });
    });
  })
  .catch((error) => console.error("Error loading component:", error));
