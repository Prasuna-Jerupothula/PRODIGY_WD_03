let boardState = [];
let boardDimension = 3;
let currentMode = "pvp";
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const welcomeScreen = document.getElementById("welcomeScreen");
const gameScreen = document.getElementById("gameScreen");

const gameMode = document.getElementById("gameMode");
const boardSize = document.getElementById("boardSize");

const selectedMode = document.getElementById("selectedMode");
const selectedSize = document.getElementById("selectedSize");

const board = document.getElementById("board");
const statusText = document.getElementById("status");

let currentPlayer = "X";
let gameActive = true;
let xWins = 0;
let oWins = 0;
let draws = 0;

const xScore =
    document.getElementById("xScore");

const oScore =
    document.getElementById("oScore");

const drawScore =
    document.getElementById("drawScore");
const newGameBtn =
    document.getElementById("newGameBtn");

newGameBtn.addEventListener("click", () => {

    gameScreen.style.display = "none";

    welcomeScreen.style.display = "block";

});
const winnerPopup =
    document.getElementById("winnerPopup");

const winnerMessage =
    document.getElementById("winnerMessage");

const closePopup =
    document.getElementById("closePopup");
 const winningLine =
    document.getElementById("winningLine"); 
const clickSound = new Audio("mixkit-interface-click-1126.wav");   


startBtn.addEventListener("click", () => {

    currentMode = gameMode.value;
    boardDimension = Number(boardSize.value);

    welcomeScreen.style.display = "none";
    gameScreen.style.display = "block";

    selectedMode.textContent =
        currentMode === "ai"
        ? "Mode: Player vs AI"
        : "Mode: Player vs Player";

    selectedSize.textContent =
        `Grid: ${boardDimension}×${boardDimension}`;

    createBoard(boardDimension);
});


function createBoard(size){

    board.innerHTML = "";
     winningLine.style.display = "none";
    winningLine.style.transform = "";
    winningLine.style.width = "";
    winningLine.style.height = "";
    winningLine.style.top = "";
    winningLine.style.left = "";

    boardState = Array(size * size).fill("");

    board.style.gridTemplateColumns =
        `repeat(${size},1fr)`;

    currentPlayer = "X";
    gameActive = true;

    for(let i=0;i<size*size;i++){

        const cell = document.createElement("div");

        cell.classList.add("cell");
        cell.dataset.index = i;

        cell.addEventListener(
            "click",
            handleCellClick
        );

        board.appendChild(cell);
    }
}



function handleCellClick(e){

    const cell = e.target;
    const index = Number(cell.dataset.index);

    if(
        boardState[index] !== "" ||
        !gameActive
    ){
        return;
    }

    makeMove(index, cell, currentPlayer);

    if(checkWinner()){
        return;
    }

    if(checkDraw()){
        return;
    }

    currentPlayer =
        currentPlayer === "X"
        ? "O"
        : "X";

    statusText.textContent =
        `Player ${currentPlayer}'s Turn`;

    if(
        currentMode === "ai" &&
        currentPlayer === "O"
    ){
        setTimeout(aiMove,500);
    }
}
function makeMove(index, cell, player){
    clickSound.currentTime = 0;
    clickSound.play();
    boardState[index] = player;

    cell.textContent = player;

    cell.classList.add(
        player.toLowerCase()
    );
}
function aiMove(){

    let available = [];

    boardState.forEach((cell,index)=>{

        if(cell===""){
            available.push(index);
        }

    });

    if(available.length===0){
        return;
    }

    const randomIndex =
        available[
            Math.floor(
                Math.random() *
                available.length
            )
        ];

    const cell =
        document.querySelector(
            `[data-index="${randomIndex}"]`
        );

    makeMove(
        randomIndex,
        cell,
        "O"
    );

    if(checkWinner()){
        return;
    }

    if(checkDraw()){
        return;
    }

    currentPlayer = "X";

    statusText.textContent =
        "Player X's Turn";
}
function checkDraw(){

    const draw =
        boardState.every(
            cell => cell !== ""
        );

    if(draw){

       draws++;

        drawScore.textContent = draws;

        statusText.textContent =
            "It's a Draw!";

        gameActive = false;

        return true;
    }

    return false;
}
function checkWinner(){

    if(boardDimension === 3){

        const wins = [

            [0,1,2],
            [3,4,5],
            [6,7,8],

            [0,3,6],
            [1,4,7],
            [2,5,8],

            [0,4,8],
            [2,4,6]
        ];

        for(let combo of wins){

            const [a,b,c] = combo;

            if(
                boardState[a] &&
                boardState[a] === boardState[b] &&
                boardState[a] === boardState[c]
            ){

                declareWinner(combo);

                return true;
            }
        }
    }

    else{
        return checkWinner5x5();
    }

    return false;
}
function checkWinner5x5(){

    const size = 5;

    const directions = [

        [0,1],
        [1,0],
        [1,1],
        [1,-1]
    ];

    for(let row=0;row<size;row++){

        for(let col=0;col<size;col++){

            const current =
                boardState[
                    row*size+col
                ];

            if(!current){
                continue;
            }

            for(let [dr,dc] of directions){

                let count = 1;

                for(let k=1;k<5;k++){

                    const nr =
                        row + dr*k;

                    const nc =
                        col + dc*k;

                    if(
                        nr<0 ||
                        nr>=size ||
                        nc<0 ||
                        nc>=size
                    ){
                        break;
                    }

                    const next =
                        boardState[
                            nr*size+nc
                        ];

                    if(next===current){
                        count++;
                    }
                }

               if(count === 5){

    gameActive = false;

    if(current === "X"){

        xWins++;
        xScore.textContent = xWins;

    }
    else{

        oWins++;
        oScore.textContent = oWins;

    }

    statusText.textContent =
        `${current} Wins!`;
    celebrateWinner(current);
    return true;
}
            }
        }
    }

    return false;
}
function declareWinner(combo){

    gameActive = false;
    drawWinningLine(combo);
    combo.forEach(index=>{

        document
        .querySelector(
            `[data-index="${index}"]`
        )
        .classList.add(
            "winner"
        );
    });
    if(currentPlayer === "X"){

    xWins++;
    xScore.textContent = xWins;

}
else{

    oWins++;
    oScore.textContent = oWins;

}
statusText.textContent =
    `${currentPlayer} Wins!`;

celebrateWinner(currentPlayer);

}
function celebrateWinner(player){

    winnerMessage.textContent =
        `🎉 Congratulations! ${player} Wins!`;

    winnerPopup.style.display = "flex";

    launchConfetti();
}
closePopup.addEventListener("click",()=>{

    winnerPopup.style.display = "none";

});


restartBtn.addEventListener("click", () => {

    

    createBoard(boardDimension);

    statusText.textContent =
        "Player X's Turn";
});
function launchConfetti(){

    const canvas =
        document.getElementById(
            "confettiCanvas"
        );

    const ctx =
        canvas.getContext("2d");

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;

    const pieces = [];

    for(let i=0;i<150;i++){

        pieces.push({

            x:Math.random()*canvas.width,

            y:-20,

            size:Math.random()*10+5,

            speed:Math.random()*4+2,

            color:[
                "#ff0000",
                "#00ff00",
                "#ffff00",
                "#00ffff",
                "#ff00ff",
                "#ff8800"
            ][Math.floor(Math.random()*6)]

        });
    }

    let frame = 0;

    function animate(){

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        pieces.forEach(piece=>{

            piece.y += piece.speed;

            ctx.fillStyle =
                piece.color;

            ctx.fillRect(
                piece.x,
                piece.y,
                piece.size,
                piece.size
            );
        });

        frame++;

        if(frame < 180){

            requestAnimationFrame(
                animate
            );
        }
        else{

            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );
        }
    }

    animate();
}
function drawWinningLine(combo){

    const size = boardDimension;

    if(size !== 3) return;

    winningLine.style.display = "block";

    if(JSON.stringify(combo) === JSON.stringify([0,1,2])){
        winningLine.style.width = "100%";
        winningLine.style.height = "6px";
        winningLine.style.top = "16.5%";
        winningLine.style.left = "0";
    }

    else if(JSON.stringify(combo) === JSON.stringify([3,4,5])){
        winningLine.style.width = "100%";
        winningLine.style.height = "6px";
        winningLine.style.top = "50%";
        winningLine.style.left = "0";
    }

    else if(JSON.stringify(combo) === JSON.stringify([6,7,8])){
        winningLine.style.width = "100%";
        winningLine.style.height = "6px";
        winningLine.style.top = "83.5%";
        winningLine.style.left = "0";
    }

    else if(JSON.stringify(combo) === JSON.stringify([0,3,6])){
        winningLine.style.width = "6px";
        winningLine.style.height = "100%";
        winningLine.style.left = "16.5%";
        winningLine.style.top = "0";
    }

    else if(JSON.stringify(combo) === JSON.stringify([1,4,7])){
        winningLine.style.width = "6px";
        winningLine.style.height = "100%";
        winningLine.style.left = "50%";
        winningLine.style.top = "0";
    }

    else if(JSON.stringify(combo) === JSON.stringify([2,5,8])){
        winningLine.style.width = "6px";
        winningLine.style.height = "100%";
        winningLine.style.left = "83.5%";
        winningLine.style.top = "0";
    }

    else if(JSON.stringify(combo) === JSON.stringify([0,4,8])){
        winningLine.style.width = "140%";
        winningLine.style.height = "6px";
        winningLine.style.top = "50%";
        winningLine.style.left = "-20%";
        winningLine.style.transform = "rotate(45deg)";
    }

    else if(JSON.stringify(combo) === JSON.stringify([2,4,6])){
        winningLine.style.width = "140%";
        winningLine.style.height = "6px";
        winningLine.style.top = "50%";
        winningLine.style.left = "-20%";
        winningLine.style.transform = "rotate(-45deg)";
    }
}