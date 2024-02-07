function startGame1() {
    alert("Game 1 started!");
}

function startGame2() {
    alert("Game 2 started!");
    var flappyFrame = document.getElementById("flappy");
    var overlay = document.createElement("div");
    overlay.classList.add("overlay");
    document.body.appendChild(overlay);

    flappyFrame.style.display = "block";
    flappyFrame.src = "../html/flappyBall.html";

    overlay.addEventListener("click", function() {
        flappyFrame.classList.remove("show");
        overlay.style.display = "none";
    });

    flappyFrame.classList.add("show");
    flappyFrame.src = "../html/flappyBall.html"; // Change this to the actual URL of Game 2
    overlay.style.display = "block";
}
