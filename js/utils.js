function getCurrentUser(users) {
    const username = localStorage.getItem('current_user');
    return users.find(u => u.username === username);
}
