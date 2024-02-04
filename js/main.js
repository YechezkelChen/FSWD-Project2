// main.js
document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = checkSessionExpiration(users);
  
    if (user) {
      loadMainContent(user);
    } else {
      loadLoginPage();
    }
  });
  
  function loadLoginPage() {
    loadHTMLContent('html/login.html');
  }
  
  function loadRegistrationPage() {
    loadHTMLContent('html/registration.html');
  }
  
  function loadMainContent(user) {
    console.log(document.getElementById('main-content'))
    const mainContent = document.getElementById('main-content');
    console.log(mainContent)
    mainContent.innerHTML = loadHTMLContent('html/mainContent.html');
  
    document.getElementById('username').textContent = user.username;
    console.log(user)
    console.log(user.username)
    document.getElementById('achievements').textContent = user.achievements.join(', ');
  }
  
  function loadHTMLContent(filename) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        document.getElementById('main-content').innerHTML = xhr.responseText;
      }
    };
    xhr.open('GET', filename, true);
    xhr.send();
  }
  

function login() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    try {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = loginUser(usernameInput.value, passwordInput.value, users);
        loadMainContent(user);
    } catch (error) {
        alert(error.message);
    }
}

function register() {
    const newUsernameInput = document.getElementById('new-username');
    const newPasswordInput = document.getElementById('new-password');

    try {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        registerUser(newUsernameInput.value, newPasswordInput.value, users);
        alert("Registration successful. Please log in.");
        loadLoginPage();
    } catch (error) {
        alert(error.message);
    }
}

function logout() {
    localStorage.removeItem('current_user');
    loadLoginPage();
}
