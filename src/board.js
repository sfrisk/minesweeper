var Board = function() {
	board = this;
	board.canvas = document.getElementById("minesweeper");
	board.timerInput = document.getElementById("timer");
	board.minesLeftInput = document.getElementById("minesLeft");
	board.restartButton = document.getElementById("newGame");
	board.ctx = this.canvas.getContext("2d");
	board.width = 400;
	board.height = 400;
	board.cellwidth = 50;
	board.cellsX = 8;
	board.cellsY = 8;
	board.playerMap = [];
	board.minefield = [];
	board.gameState = null;
	board.startLocation = null;
	board.timer = 0;
	board.minesLeft = 10;

	// this handles click events, and prevents the contextmenu from appearing
	board.canvas.addEventListener("click", function(event){
		board.onClick(event,board);
	});
	board.canvas.addEventListener("contextmenu", function(event){
		board.onClick(event,board);
	});
	board.restartButton.addEventListener("click", function(event){
		board.init(board);
	})
}

Board.prototype.init = function(board) {
	if(!board){
		board = this;
	}
	board.timer = 0;
	board.minesLeft = 10;
	board.gameState = null;
	board.playerMap = board.initializeArray();
	board.minefield = board.initializeArray();
	board.timerInput.value = board.timer;
	board.minesLeftInput.value = board.minesLeft;
	board.draw();
}

Board.prototype.draw = function() {
	board = this;
	this.clear();
	this.generateGrid();
}

Board.prototype.clear = function() {
	board = this;
	board.ctx.clearRect(0, 0, board.width, board.height);
}

Board.prototype.generateGrid = function() {
	board = this;
	var safeSpots = 0;
	for (var x = 0; x < board.cellsY; x++){
		for (var y = 0; y < board.cellsX; y++){
			switch (board.playerMap[x][y]) {
				case MINE:
					board.drawRect(x*board.cellwidth,y*board.cellwidth, board.cellwidth, board.cellwidth, MINE_TILE);
					break;
				case MINE_GUESS:
					board.drawRect(x*board.cellwidth,y*board.cellwidth, board.cellwidth, board.cellwidth, SUSPECTED_TILE);
					board.drawText(x*board.cellwidth,y*board.cellwidth,board.playerMap[x][y]);
					break;
				case undefined:
					board.drawRect(x*board.cellwidth,y*board.cellwidth, board.cellwidth, board.cellwidth, DEFAULT_TILE);
					break;
				default:
					safeSpots++;
					board.drawRect(x*board.cellwidth,y*board.cellwidth, board.cellwidth, board.cellwidth, BLANK_TILE);
					board.drawText(x*board.cellwidth,y*board.cellwidth,board.playerMap[x][y]);
			}
		}
		if(safeSpots == 54) {
			board.gameState = GAME_WON;
		}
	}
}

Board.prototype.drawText = function(x, y, text) {
	board = this;
	board.ctx.font = "30px serif";
	if( text != 0 && text != MINE_GUESS ) {
		board.ctx.fillStyle = TEXT_COLORS[text-1];
		board.ctx.fillText(text, x+18, y+35);
	} else if ( text == MINE_GUESS) {
		board.ctx.fillStyle = "#000000";
		board.ctx.fillText(text, x+18, y+35);
	}

}

Board.prototype.drawRect = function(x,y,w,h,color) {
	board = this;
	board.ctx.beginPath();
	board.ctx.fillStyle = color;
	board.ctx.rect(x+1,y+1,w-1,h-1);
	board.ctx.closePath();
	board.ctx.fill();
}

Board.prototype.initializeArray = function() {
	board = this;
	var array = new Array(board.cellsX);
	for (x = 0; x < board.cellsX; x++) {
		array[x] = new Array(board.cellsY);
	}
	return array;
}

Board.prototype.updatePlayerMap = function(x, y, mouseClick) {
	board = this;
	switch (mouseClick) {
		case 0:
			if (board.minefield[x][y] == MINE) {
				board.playerMap[x][y] = board.minefield[x][y];
				board.showAllMines();
			} else if ( board.minefield[x][y] == 0 ) {
				board.playerMap[x][y] = null;
				board.fillBlankArea(x,y);
			}
			else {
				board.playerMap[x][y] = board.minefield[x][y];
			}
			break;
		default:
			if(board.playerMap[x][y] == MINE_GUESS) {
				board.playerMap[x][y] = undefined;
				board.minesLeft++;
			} else {
				board.playerMap[x][y] = MINE_GUESS;
				board.minesLeft--;
			}
			board.minesLeftInput.value = board.minesLeft;
	}
}

Board.prototype.showAllMines = function() {
	board = this;
	for (var x = 0; x < board.cellsX; x++) {
		for (var y = 0; y < board.cellsY; y++) {
			if (board.minefield[x][y] == MINE && board.playerMap[x][y] != MINE_GUESS) {
				board.playerMap[x][y] = MINE;
			}
		}
	}
	board.gameState = GAME_OVER;
}

Board.prototype.fillBlankArea = function(x,y) {
	board = this;

	if (board.playerMap[x][y] != board.minefield[x][y] && board.playerMap[x][y] != MINE_GUESS){
		board.playerMap[x][y] = board.minefield[x][y];
		for( var i = 0; i < DIRECTIONS.length; i++) {
			var dx = DIRECTIONS[i][0];
			var dy = DIRECTIONS[i][1];
			if(board.checkLocation(x, y, dx, dy) ) {
				xa = dx + x;
				ya = dy + y;
				if(board.minefield[xa][ya] == 0) {
					board.fillBlankArea(xa, ya );
				}
				else if (board.playerMap[xa][ya] != MINE_GUESS){
					board.playerMap[xa][ya] = board.minefield[xa][ya]
				}
			}
		}
	}
}

Board.prototype.generateMinefield = function() {
	board = this;
	for (var x = 0; x < board.cellsX; x ++) {
		for (var y = 0; y < board.cellsY; y ++) {
			board.minefield[x][y] = 0;
		}
	}
	for (var i = 0; i < 10; i++) {
		board.generateMine();
	}
}

Board.prototype.generateMine = function() {
	board = this;
	var x = Math.floor(Math.random() * (8));
	var y = Math.floor(Math.random() * (8));
	if(board.minefield[x][y] != MINE && !board.checkForStartLocation(x,y)){
		board.minefield[x][y] = MINE;
		board.adjustMineCount(x,y);
	} else {
		board.generateMine();
	}
}

Board.prototype.checkForStartLocation = function(x,y) {
	return x == board.startLocation[0] && y == board.startLocation[1];
}

Board.prototype.adjustMineCount = function(x,y){
	var board = this;
	for (var i = 0; i < DIRECTIONS.length; i++) {
		var dx = DIRECTIONS[i][0];
		var dy = DIRECTIONS[i][1];
		if(board.checkLocation(x, y, dx, dy) &&
			board.minefield[x + dx][y + dy] != MINE ) {
			board.minefield[x + dx][y + dy]++;
		}
	}
}

Board.prototype.checkLocation = function(x,y,xa,ya) {
	board = this;
	return xa + x >= 0 &&
				xa + x < board.cellsX &&
				ya + y >= 0 &&
				ya + y < board.cellsY;
}

Board.prototype.updateTimer = function() {
	board = this;
	if (board.gameState == PLAYING) {
		board.timerInput.value = board.timer;
		board.timer ++;
		window.setTimeout("board.updateTimer()", 1000)
	}
}

Board.prototype.onClick = function(event,board) {
	event.preventDefault();
	if(board.gameState != GAME_OVER){
		var x = Math.floor(event.offsetX / board.cellwidth);
		var y = Math.floor(event.offsetY / board.cellwidth);
		if (!board.startLocation) {
			board.startLocation = [x, y];
			board.generateMinefield();
			board.gameState = PLAYING;
			board.updateTimer();
		}
		board.updatePlayerMap(x, y, event.button);
		board.draw();
		if(board.gameState == GAME_OVER) {
			alert("Game Over!");
		}
		if(board.gameState == GAME_WON) {
			alert("You Won!");
		}
	}
	return false;
}

var MINE = "MINE";
var MINE_GUESS = "x";
var UNKNOWN = "?";
var MINE_TILE = "#C62828";
var DEFAULT_TILE = "#BDBDBD";
var BLANK_TILE = "#E0E0E0";
var SUSPECTED_TILE = "#F8BBD0";
var PLAYING = 0;
var GAME_OVER = 1;
var GAME_WON = 2;
var TEXT_COLORS = [
	"#E91E63",
	"#9C27B0",
	"#3F51B5",
	"#2196F3",
	"#009688",
	"#4CAF50",
	"#CDDC39",
	"#FF9800"
];
var DIRECTIONS = [
	[0,1],
	[1,1],
	[1,0],
	[1,-1],
	[0,-1],
	[-1,-1],
	[-1,0],
	[-1,1]
];
