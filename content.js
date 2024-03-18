chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("request.action: ", request.action);

  if (request.action === "fill-email") {
    const emailField = document.querySelector('input[type="email"]');
    if (emailField) {
      emailField.value = "example@example.com"; // Set this to the desired email value
      sendResponse({ status: "Email filled" });
    } else {
      sendResponse({ status: "Email field not found" });
    }
  }

  return true;
  // Not necessary to return true here since sendResponse is being called immediately
});
