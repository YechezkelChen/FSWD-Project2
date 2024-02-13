function start8PuzzleGame() {
    window.open('../html/8PuzzleGame.html', replace = '_self');
}

function startFlapyBallGame() {
    window.open('../html/flappyBall.html', replace = '_self');
}

function in_progress() {
    window.open('../html/inProgress.html', replace = '_self');
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}