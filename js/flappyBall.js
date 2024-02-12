const game = (function (ball, btn, restart, pointElId = "point") {
    class Game {
      // a set of blocks
      #blocks = [
        [this.#createBlock("20", "top"), this.#createBlock("50", "bottom")],
        [this.#createBlock("30", "top"), this.#createBlock("40", "bottom")],
        [this.#createBlock("40", "top"), this.#createBlock("30", "bottom")],
        [this.#createBlock("50", "top"), this.#createBlock("20", "bottom")],
      ].sort(() => 0.5 - Math.random());
  
      #ball;
      #firsttime = true;
      #points = 0;
      #movingInterval;
      #show;
  
      constructor(ball, btn, pointElId = "point", restart = "restart") {
        // elements
        this.#initializeRecord()
        this.btn = document.getElementById(btn);
        this.pointEl = document.getElementById(pointElId);
        this.screen = document.querySelector(".screen");
        this.restartEl = document.getElementById(restart);
        this.restartEl.parentNode.style.visibility = "hidden";
        // Events
        this.btn.addEventListener("click", this.#btnOnClick.bind(this));
        this.restartEl.addEventListener("click", this.#restart.bind(this));
  
        // ball object
        this.#ball = ball;
      }
  
      // Generating blocks
      #createBlock(height, position) {
        return { height, position };
      }
  
      // btn click event handler
      #btnOnClick() {
        if (!this.#firsttime) return this.#ball.jump();
        this.#start();
        this.#firsttime = false;
      }
  
      // starting or restarting the game
      #start() {
        this.#ball.continuouslyDropping();
        this.#show = setInterval(this.#showBlocks.bind(this), 1500);
        this.#movingInterval = setInterval(this.#moving.bind(this), 20);
        this.btn.innerText = "Jump!";
      }
  
      #restart() {
        const points = parseFloat(document.getElementById('point').innerText);
        updateRecord(points);
        this.#points = 0;
        this.pointEl.innerText = this.#points;
        this.btn.innerText = "Start";
        document.querySelectorAll(".block").forEach((el) => el.remove());
        this.#ball.init();
        this.#firsttime = true;
        this.restartEl.parentNode.style.visibility = "hidden";
      }
  
      // ending the game when it is over
      #end() {
        clearInterval(this.#movingInterval);
        clearInterval(this.#show);
        this.#ball.die();
        this.restartEl.parentNode.style.visibility = "visible";
        this.btn.removeEventListener("click", this.#btnOnClick.bind(this));
      }
  
      // generating a div element which has classes and styles of a block
      #generateBlock(block) {
        const el = document.createElement("div");
        el.classList.add("block");
        el.classList.add(block.position);
        el.style.right = "-30px";
        el.style.height = block.height + "%";
        return el;
      }
  
      // showing blocks to the screen
      #showBlocks() {
        const blocks = this.#selectRandomBlocks();
        blocks.forEach((el) => this.screen.append(this.#generateBlock(el)));
      }
  
      // selecting random blocks to show them to the screen
      #selectRandomBlocks() {
        return this.#blocks[Math.floor(Math.random() * this.#blocks.length)];
      }
  
      // making those blocks move
      #moving() {
        // selecting all the blocks on the screen
        const blocks = document.querySelectorAll(".block");
        blocks.forEach((el) => {
          // moving them
          const right = parseInt(el.style.right);
          el.style.right = right + 2 + "px";
  
          // adding check class to element if they are near to the ball
  
          // checking whether if the game is over or not
          this.#checkIfOver(blocks);
  
          // Condition for adding points
          if (right === 380) {
            this.#gainPoint();
          }
  
          // removing elements for better performance after it passes through the screen
          if (right > 420) {
            el.remove();
          }
        });
      }
  
      // adding points and showing it to the screen
      #gainPoint() {
        this.#points += 0.5;
        this.pointEl.innerText = this.#points;
      }
  
      // checking if the game is over and not by checking each block
      #checkIfOver(blocks) {
        for (let block of blocks) this.#gameOverLogics(block) && this.#end();
      }
  
      // game over conditions
      #gameOverLogics(block) {
        if (this.#ball.el.classList.contains("die")) return true;
  
        const left = parseInt(block.style.right) + 30;
        const screenHeight = parseInt(
          window.getComputedStyle(this.screen).height
        );
        const style = window.getComputedStyle(block);
        const blockHeightpercent = (parseInt(style.height) / screenHeight) * 100;
  
        if (left > 345 && left < 382) {
          if (
            block.classList.contains("top") &&
            this.#ball.jumpedHeight + this.#ball.height > 100 - blockHeightpercent
          )
            return true;
          if (
            block.classList.contains("bottom") &&
            this.#ball.jumpedHeight < blockHeightpercent
          )
            return true;
        }
      }
      
      #initializeRecord(){
        const recordElement = document.getElementById('record');
        const currentUserData = JSON.parse(localStorage.getItem('current_user'));
        const users = JSON.parse(localStorage.getItem('users'));
        if (currentUserData) {
          const userIndex = users.findIndex(u => u.username === currentUserData.username);
          if (userIndex !== -1) {
            if(users[userIndex].scores[0] > 0){
              const recordElement = document.getElementById('record');
              recordElement.innerText = JSON.parse(users[userIndex].scores[0]);
            }
            else 
              recordElement.innerText = 0;
          } else {
              console.error("User not found in the users array.");
            }
          } else {
              console.error("currentUserData is null or undefined.");
            }
      }
    }
  
    class Ball {
      jumpedHeight = 50;
  
      // height estimated value (1sf) in percentage
      height = 10;
  
      #riseRate = 12;
      #dropRate = 2;
  
      #droppingInterval;
  
      constructor(id) {
        // getting the element
        this.el = document.getElementById(id);
        this.el.style.bottom = this.jumpedHeight + "%";
      }
  
      // initial state
      init() {
        this.el.classList.remove("die");
        this.jumpedHeight = 50;
        this.el.style.bottom = this.jumpedHeight + "%";
      }
  
      // making the ball jump
      jump() {
        // making sure that the ball doesn't fly higher than the box
        if (this.jumpedHeight > 92 || !this.jumpedHeight) return;
  
        // slowing it down to make it relastic when it is bounced with or too closed to the upper border
        if (this.jumpedHeight > 75) {
          this.jumpedHeight += 10;
        } else if (this.jumpedHeight < 85) {
          // normal when the ball is flying lower than 85%
          this.jumpedHeight += this.#riseRate;
        }
  
        this.el.style.bottom = this.jumpedHeight + "%";
      }
  
      // game over scene for the ball
      die() {
        this.el.classList.add("die");
        this.jumpedHeight = 0;
        this.el.style.bottom = this.jumpedHeight + "%";
        clearInterval(this.#droppingInterval);
      }
  
      // making the ball drop to the ground when it is alive
      continuouslyDropping() {
        this.#droppingInterval = setInterval(() => {
          if (this.jumpedHeight < 0) return this.die();
          this.jumpedHeight -= this.#dropRate;
          this.el.style.bottom = this.jumpedHeight + "%";
        }, 60);
      }
    }
  
    return new Game(new Ball(ball), btn, pointElId, restart);
  })("ball", "jump", (restart = "restart"));

  if (!localStorage.getItem('record')) {
    localStorage.setItem('record', '0');
  }

  

  // Function to update the record if necessary
  function updateRecord(points) {
    let record = parseFloat(localStorage.getItem('record'));
    const recordElement = document.getElementById('record');
    if (points > record) {
      record = points;
      recordElement.innerText = record;
      localStorage.setItem('record', record);

       // Update the users array
      const currentUserData = JSON.parse(localStorage.getItem('current_user'));
      const users = JSON.parse(localStorage.getItem('users'));
      if (currentUserData) {
        const userIndex = users.findIndex(u => u.username === currentUserData.username);
        if (userIndex !== -1) {
            const record = parseFloat(document.getElementById('record').innerText);
            users[userIndex].scores[0] = record
            localStorage.setItem('users', JSON.stringify(users));
        } else {
              console.error("User not found in the users array.");
        }
      } else {
          console.error("currentUserData is null or undefined.");
      }
    }
  }
