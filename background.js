chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ credentials: [] }); // Initialize storage for credentials
});

function generateRandomEmail() {
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `xx.xx+${randomPart}@xx.com`;
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
  } else if (request.action === "fill-email") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        console.log("changeInfo.status: ", changeInfo.status);

        if (changeInfo.status === "complete") {
          chrome.tabs.onUpdated.removeListener(listener); // Remove the listener after the tab is updated
          chrome.tabs.sendMessage(tabId, { action: "fill-email" }, (response) => {
            if (response) {
              sendResponse({ status: response.status });
            } else if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError.message);
            }
          });
        }
      });
      return true;
    });
    return true; // Keep the message channel open
  }
});
