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
  loadHTMLContent('../html/login.html', updateSwitchers);
}

function loadMainContent(user) {
  loadHTMLContent('../html/mainContent.html', function () {
    document.getElementById('welcome_username').textContent = user.username;
    userScores(user)
  });
}

function loadHTMLContent(filename, callback) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      document.getElementById('main-content').innerHTML = xhr.responseText;

      // Call the callback function if provided
      if (callback) {
        callback();
      }
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
  localStorage.removeItem('record');
  loadLoginPage();
}

function userScores(user){
  const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUserData = JSON.parse(localStorage.getItem('current_user'));
    const userIndex = users.findIndex(u => u.username === currentUserData.username);
    if (userIndex !== -1) {
        let i = 0;
        for (let game in users[userIndex].scores) {
            if (document.getElementById(game)) {
                document.getElementById(game).textContent = users[userIndex].scores[game];
            }
            i++;
        }        
    }
}