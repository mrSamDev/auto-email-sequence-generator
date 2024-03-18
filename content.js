chrome.runtime.sendMessage({ action: "fillCredentials" }, (response) => {
  const { email, password } = response;
  const emailField = document.querySelector('input[type="email"]');
  const passwordField = document.querySelector('input[type="password"]');

  if (emailField && passwordField) {
    emailField.value = email;
    passwordField.value = password;
  }
});
