var gameState;
var gameOverMenu;
var gameStartMenu;

var restartButton;
var startButton;
var playHUD;
var scoreboard;
//var highScore;
//var hScore = 0;

const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

gameOverMenu = document.getElementById("gameOver");
centerMenuPosition(gameOverMenu);

restartButton = document.getElementById("restartButton");
restartButton.addEventListener("click", gameRestart);

gameStartMenu = document.getElementById("gameStart");
centerMenuPosition(gameStartMenu);

startButton = document.getElementById("startButton");
startButton.addEventListener("click", gameStart);

playHUD = document.getElementById("playHUD");
scoreboard = document.getElementById("scoreboard");
//highScore = document.getElementById("highscore");
// create the unit
const box = 32;



// load images
const ground = new Image();
ground.src = "img/ground.png";

const foodImg = new Image();
foodImg.src = "img/food.png";

// load audio files

let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();

dead.src = "audio/dead.mp3";
eat.src = "audio/eat.mp3";
up.src = "audio/up.mp3";
right.src = "audio/right.mp3";
left.src = "audio/left.mp3";
down.src = "audio/down.mp3";

// create the snake

let snake = [];

snake[0] = {
    x : 9 * box,
    y : 10 * box
};

// create the food

let food = {
    x : Math.floor(Math.random()*17+1) * box,
    y : Math.floor(Math.random()*15+3) * box
}

// create the score var

let score = 0;



//control the snake

let d;

document.addEventListener("keydown",direction);

function direction(event){
    let key = event.keyCode;
    if( key == 37 && d != "RIGHT"){
        left.play();
        d = "LEFT";
    }else if(key == 38 && d != "DOWN"){
        d = "UP";
        up.play();
    }else if(key == 39 && d != "LEFT"){
        d = "RIGHT";
        right.play();
    }else if(key == 40 && d != "UP"){
        d = "DOWN";
        down.play();
    }
}

//restart game

function gameRestart(menu, snake) {
    
    //displayGame(gameOverMenu, cvs);
    location.reload();
    menu.style.visibility = "hidden";
    snake.style.visibility = "visible";
}
// start game
function gameStart(gameStartMenu, ctx) {
    gameStartMenu.style.visibility = "hidden";
    ctx.style.visibility = "visible";
}

// cheack collision function
function collision(head,array){
    for(let i = 0; i < array.length; i++){
        if(head.x == array[i].x && head.y == array[i].y){
            return true;
        }
    }
    return false;
}

// draw everything to the canvas

function draw(){
   
    ctx.drawImage(ground,0,0);
    
    for( let i = 0; i < snake.length ; i++){
        ctx.fillStyle = ( i == 0 )? "green" : "white";
        ctx.fillRect(snake[i].x,snake[i].y,box,box);
        
        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x,snake[i].y,box,box);
    }
    
    ctx.drawImage(foodImg, food.x, food.y);
    
    // old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    
    // which direction
    if( d == "LEFT") snakeX -= box;
    if( d == "UP") snakeY -= box;
    if( d == "RIGHT") snakeX += box;
    if( d == "DOWN") snakeY += box;
    
    // if the snake eats the food
    if(snakeX == food.x && snakeY == food.y){
        score++;
        eat.play();
        food = {
            x : Math.floor(Math.random()*17+1) * box,
            y : Math.floor(Math.random()*15+3) * box
        }
        // we don't remove the tail
    }else{
        // remove the tail
        snake.pop();
    }
    
    // add new Head
    
    let newHead = {
        x : snakeX,
        y : snakeY
    }
    
    // game over
    
    if(snakeX < box || snakeX > 17 * box || snakeY < 3 * box || snakeY > 17 * box || collision(newHead, snake)){
        
        for(let i = 0; i < snake.length ; i++) {
            
            ctx.fillStyle = ( i == 0 )? "white" : "red";
            ctx.fillRect(snake[i].x,snake[i].y,box,box);
            
            ctx.strokeStyle = "white";
            ctx.strokeRect(snake[i].x,snake[i].y,box,box);
        }
        clearInterval(game);
        dead.play();
        //if (score > hScore) {
        //   hScore = score;
        //}
        
        setTimeout(function() {
            displayMenu(gameOverMenu, cvs, playHUD)
        }, 500);
        
        setTimeout(function() {
            drawScoreBoard()
        }, 500);
        
    }
    
    snake.unshift(newHead);
    
    ctx.fillStyle = "white";
    ctx.font = "45px Changa one";
    ctx.fillText(score,2*box,1.6*box);
}

// call draw function every 100 ms

let game = setInterval(draw, 100);

function displayMenu(menu, snake, playHUD) {
    menu.style.visibility = "visible";
    snake.style.visibility = "hidden";
    playHUD.style.visibility = "visible";
}

function centerMenuPosition(menu) {
    menu.style.top = (680/2) - (menu.offsetHeight) + "px";
    menu.style.left = (550/2)- (menu.offsetHeight) + "px";
}

function drawScoreBoard() {
    scoreboard.innerHTML = "Length: " + score;
    //highScore.innerHTML = "High Score: " + hScore ;
}
