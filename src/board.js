var MINE = "MINE";
var MINE_GUESS = "x";
var UNKNOWN = "?";
var MINE_TILE = "#F44336";
var DEFAULT_TILE = "#BDBDBD";
var BLANK_TITLE = "#E0E0E0";
var SUSPECTED_TITLE = "#F8BBD0";

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

var Board = function() {
	board = this;
	board.canvas = document.getElementById("minesweeper");
	board.ctx = this.canvas.getContext("2d");
	board.width = 400;
	board.height = 400;
	board.cellwidth = 50;
	board.cellsX = 8;
	board.cellsY = 8;
	board.playerMap = [];
	board.minefield = [];


	// this handles click events, and prevents the contextmenu from appearing
	board.canvas.addEventListener("click", function(event){
		board.onClick(event,board);
	});
	board.canvas.addEventListener("contextmenu", function(event){
		board.onClick(event,board);
	});
}

Board.prototype.init = function() {
	board = this;
	console.log("init");
	board.playerMap = board.initializeArray();
	board.minefield = board.initializeArray();
	board.generateMinefield();
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
	for (var x = 0; x < board.cellsY; x++){
		for (var y = 0; y < board.cellsX; y++){
			switch (board.playerMap[x][y]) {
				case MINE:
					board.drawRect(x*board.cellwidth,y*board.cellwidth, board.cellwidth, board.cellwidth, MINE_TILE);
					break;
				case MINE_GUESS:
					board.drawRect(x*board.cellwidth,y*board.cellwidth, board.cellwidth, board.cellwidth, SUSPECTED_TITLE);
					break;
				case undefined:
					board.drawRect(x*board.cellwidth,y*board.cellwidth, board.cellwidth, board.cellwidth, DEFAULT_TILE);
					break;
				default:
					board.drawRect(x*board.cellwidth,y*board.cellwidth, board.cellwidth, board.cellwidth, BLANK_TITLE);
					board.drawText(x*board.cellwidth,y*board.cellwidth,board.playerMap[x][y]);
			}

		}
	}
}

Board.prototype.drawText = function(x, y, text) {
	board = this;
	if( text != 0 ) {
		board.ctx.font = "30px serif";
		board.ctx.fillStyle = "orange";
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
				board.fillBlankArea(x,y);
			}
			else {
				board.playerMap[x][y] = board.minefield[x][y];
			}
			break;
		default:
			board.playerMap[x][y] = MINE_GUESS;
	}
}

Board.prototype.showAllMines = function() {
	board = this;
	for (var x = 0; x < board.cellsX; x++) {
		for (var y = 0; y < board.cellsY; y++) {
			if (board.minefield[x][y] == MINE) {
				board.playerMap[x][y] = MINE;
			}
		}
	}
}

Board.prototype.fillBlankArea = function(x,y) {
	board = this;

	if (board.playerMap[x][y] != board.minefield[x][y]){
		board.playerMap[x][y] = board.minefield[x][y];
		for( var i = 0; i < DIRECTIONS.length; i++) {
			if(board.checkLocation(x,y,DIRECTIONS[i][0], DIRECTIONS[i][1]) ) {
				var xa = x+DIRECTIONS[i][0]
				var ya = y+DIRECTIONS[i][1]
				if(board.minefield[xa][ya] == 0) {
					board.fillBlankArea(xa, ya );
				}
				else {
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
	if(board.minefield[x][y] != MINE){
		board.minefield[x][y] = MINE;
		board.adjustMineCount(x,y);
	} else {
		board.generateMine();
	}
}

Board.prototype.adjustMineCount = function(x,y){
	var board = this;

	for (var i = 0; i < DIRECTIONS.length; i++) {
		if(board.checkLocation(x,y,DIRECTIONS[i][0], DIRECTIONS[i][1]) &&
			board.minefield[x + DIRECTIONS[i][0]][y + DIRECTIONS[i][1]] != MINE
		) {
			board.minefield[x + DIRECTIONS[i][0]][y + DIRECTIONS[i][1]]++;
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

Board.prototype.onClick = function(event,board) {
	event.preventDefault();
	var x = Math.floor(event.offsetX / board.cellwidth);
	var y = Math.floor(event.offsetY / board.cellwidth);
	board.updatePlayerMap(x, y, event.button);
	board.draw();
	return false;
}
