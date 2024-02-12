function start8PuzzleGame() {
    window.open('../html/8PuzzleGame.html', replace = '_self');
}

function startFlapyBallGame() {
    window.open('../html/flappyBall.html', replace = '_self');
}

function in_progress() {
    window.open('../html/inProgress.html', replace = '_self');
}

function updateUserScore(score) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUserData = localStorage.getItem('current_user');
    const username = JSON.parse(currentUserData).username;

    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username) {
            users[i]["scores"] = Number(users[i]["scores"]) + Number(score);
        }
    }
    localStorage.setItem('users', JSON.stringify(users));
}