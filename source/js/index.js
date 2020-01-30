const password = document.getElementById('loginPassword');
const showPassword = document.getElementById('showPassword');

showPassword.addEventListener('click', function () {
  if (showPassword.checked === true) {
    password.type = 'text';
  } else {
    password.type = 'password';
  }
})