chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ credentials: [] }); // Initialize storage for credentials
});

function generateRandomEmail() {
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `sijo.sam+${randomPart}@diagnal.com`;
}

function generateRandomPassword() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "generateCredentials") {
    const email = generateRandomEmail();
    const password = generateRandomPassword();
    const dateCreated = new Date().toISOString(); // Store the creation date in ISO format
    const credential = { email, password, dateCreated };
    console.log("credential: ", credential);
    chrome.storage.sync.get("credentials", (data) => {
      const updatedCredentials = [...data.credentials, credential];
      chrome.storage.sync.set({ credentials: updatedCredentials }, () => {
        sendResponse({ credential: credential, allCredentials: updatedCredentials });
      });
    });
    return true; // Indicates that the response is asynchronous
  } else if (request.action === "fillCredentials") {
    // Retrieve the latest credentials to fill in the fields
    chrome.storage.sync.get("credentials", (data) => {
      const latestCredential = data.credentials[data.credentials.length - 1];
      sendResponse(latestCredential);
    });
    return true; // Indicates that the response is asynchronous
  }
});
