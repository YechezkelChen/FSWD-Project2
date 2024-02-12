function loginUser(username, password, users) {
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        throw new Error("Invalid username or password.");
    }

    // Set an expiration time for the session (e.g., 20 minutes)
    const expirationTime = new Date().getTime() + 20 * 60 * 1000; // 20 minutes in milliseconds

    // Store the user and expiration time in local storage
    localStorage.setItem('current_user', JSON.stringify({ username: user.username, expirationTime }));

    return user;
}

function checkSessionExpiration(users) {
    const currentUserData = localStorage.getItem('current_user');

    if (currentUserData) {
        const { expirationTime } = JSON.parse(currentUserData);

        if (new Date().getTime() > expirationTime) {
            // Session has expired, clear the current user
            localStorage.removeItem('current_user');
            return null;
        }

        // Session is still valid, return the current user
        const username = JSON.parse(currentUserData).username;
        return users.find(u => u.username === username);
    }

    // No current user
    return null;
}

function registerUser(username, password, users) {
    if (!username || !password) {
        throw new Error("Username and password are required.");
    }

    if (users.some(u => u.username === username)) {
        throw new Error("Username already exists. Choose another one.");
    }

    const user = { username, password, scores: 0 };
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
}

function updateSwitchers() {
    const switchers = [...document.querySelectorAll('.switcher')]

    switchers.forEach(item => {
        item.addEventListener('click', function () {
            switchers.forEach(item => item.parentElement.classList.remove('is-active'))
            this.parentElement.classList.add('is-active')
        })
    })
}