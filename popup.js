document.addEventListener("DOMContentLoaded", () => {
  const generateButton = document.getElementById("generateCredentials");
  const credentialsList = document.getElementById("credentialsList");

  // Load and display existing credentials
  chrome.storage.sync.get("credentials", ({ credentials }) => {
    credentials.forEach(({ email, password, dateCreated }) => {
      addCredentialToList(email, password, dateCreated);
    });
  });

  generateButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "generateCredentials" }, (response) => {
      const { credential: { email, password, dateCreated } = {} } = response;
      console.log("email, password, dateCreated: ", email, password, dateCreated);
      addCredentialToList(email, password, dateCreated);

      // Optional: Save the new credentials to chrome.storage for persistent storage
    });
  });

  function addCredentialToList(email, password, dateCreated) {
    const li = document.createElement("li");
    li.className = "flex flex-col md:flex-row justify-between items-center credential-item p-2 md:p-4 rounded-md space-y-2 md:space-y-0";

    // Format the date
    const date = new Date(dateCreated);
    const formattedDate = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(date);

    li.innerHTML = `
      <div class="font-mono text-sm flex-grow">
        <div>Email: <span class="email-text">${email}</span></div>
        <div>Password: <span class="password-text">${password}</span></div>
        <div>Date: <span class="date-text">${formattedDate}</span></div>
      </div>
      <div class="flex flex-row md:flex-col md:space-y-1 space-x-1 md:space-x-0">
        <button class="copy-btn text-white font-bold py-1 px-2 text-xs rounded" data-credential="${email}" data-type="email">
          Copy Email
        </button>
        <button class="copy-btn text-white font-bold py-1 px-2 text-xs rounded" data-credential="${password}" data-type="password">
          Copy Password
        </button>
      </div>
    `;

    credentialsList.appendChild(li);
  }

  // Event listener for copy buttons
  credentialsList.addEventListener("click", (event) => {
    if (event.target.classList.contains("copyBtn")) {
      const credential = event.target.getAttribute("data-credential");
      navigator.clipboard
        .writeText(credential)
        .then(() => {
          // Provide feedback, e.g., changing the button text temporarily
          event.target.textContent = "Copied!";
          setTimeout(() => {
            event.target.textContent = event.target.textContent.includes("Email") ? "Copy Email" : "Copy Password";
          }, 2000);
        })
        .catch((err) => console.error("Error copying credentials:", err));
    }
  });
});
