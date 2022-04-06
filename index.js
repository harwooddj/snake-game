let timer;
let level = 1;
let foodLevel;
let playAreaSize = 25 * 25;
let rowLength = Math.sqrt(playAreaSize);
let gameOverBool = false;
let startBtn = document.querySelector('#start-btn');
let difficulty = document.querySelector('#level');
let snakeStart;
let direction;
let snakeArray;

//build play area
const playArea = document.querySelector('.play-area');
for(let i=0;i<playAreaSize;i++){
    let playAreaTile = document.createElement('div');
    playAreaTile.classList.add('play-area-tile');
    playAreaTile.setAttribute('id', i);
    playArea.appendChild(playAreaTile);
}
const tiles = document.querySelectorAll('.play-area-tile');

const drawSnake = (status) => {
    let head, body;
    if(status == 'play'){
        head = 'snake-head';
        body = 'snake-tile';
    }else if(status == 'win'){
        head, body = 'win';
    }else{
        head, body = 'lose';
    }
    tiles[snakeStart].classList.add(head);
    for(let i=1;i<snakeArray.length;i++){
        tiles[snakeArray[i]].classList.add(body);
    }
}

const unDrawSnake = () => {
    snakeArray.forEach(e => {
        tiles[e].classList.remove('snake-tile', 'snake-head', 'win', 'lose', 'food');
    })
}

const checkValidMove = () => {
    //check if snake goes off bottom of screen
    if(snakeStart > playAreaSize - rowLength - 1 && snakeStart < playAreaSize && direction == rowLength){
        snakeStart -= playAreaSize;
    }
    //check if snake goes off top of screen
    if(snakeStart > -1 && snakeStart < rowLength && direction == -rowLength){
        snakeStart += playAreaSize;
    }
    //check if snake goes off left of screen
    if(snakeStart % rowLength == 0 && direction == -1){
        snakeStart += rowLength;
    }
    //check if snake goes off right of screen
    if(snakeStart % rowLength == rowLength - 1 && direction == 1){
        snakeStart -= rowLength;
    }
     //check if snake crashed into itself
     if(tiles[snakeStart + direction].classList.contains('snake-tile')) {
        gameOver('lose');
    }
    //check if picked up food
    if(tiles[snakeStart + direction].classList.contains('food')) {
        foodLevel -= 1;
        addFoodToSnake(tiles);
        if(foodLevel == 0) {
            gameOver('win');
        }
    }
}

const addFoodToSnake = () => {
    unDrawSnake();
    tiles[snakeStart + direction].classList.remove('food');
    snakeArray.unshift(snakeStart + direction);
    snakeStart += direction;
    drawSnake('play');
}

const gameOver = (status) => {
    clearInterval(timer);
    unDrawSnake();
    drawSnake(status);
    document.removeEventListener('keydown', checkKeys);
    gameOverBool = true;
}


const moveSnake = () => {
    checkValidMove();
    if(!gameOverBool){
        unDrawSnake();
        snakeStart += direction;
        for(let i=snakeArray.length-1;i>0;i--){
            snakeArray[i] = snakeArray[i-1];
        }
        snakeArray[0] = snakeStart;
        drawSnake('play');
    }
}

const checkKeys = (event) => {
    clearInterval(timer);
    const keyValues = {
        'ArrowUp': -rowLength,
        'ArrowDown': rowLength,
        'ArrowLeft': -1,
        'ArrowRight': 1
    }
    direction = keyValues[event.key];
    moveSnake();
    if(!gameOverBool) timer = setInterval(moveSnake, 500);
}

const startGame = () => {
    //clear tiles
    tiles.forEach(t => {
        t.classList.remove('snake-tile', 'snake-head', 'win', 'lose', 'food');
    })
    //reset snake
    snakeStart = Math.round(playAreaSize / 2)-2 ;
    direction = -1;
    snakeArray = [snakeStart, snakeStart + 1, snakeStart + 2, snakeStart + 3];
    //get level
    const difficultyValues = {
        'easy': 1,
        'normal': 2,
        'hard': 3
    }
    level = difficultyValues[difficulty.value];
    //add random food
    foodLevel = level * 10;
    for(let i=0;i<foodLevel;i++){
        let foodPos = Math.round(Math.random()*playAreaSize);
        tiles[foodPos].classList.add('food');
    }
    //start game
    drawSnake('play');
    document.addEventListener('keydown', checkKeys, tiles);
    moveSnake();
}



startBtn.addEventListener('click', startGame);





