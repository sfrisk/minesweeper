var Board = function() {
	board = this;
	board.canvas = document.getElementById("minesweeper");
	board.ctx = this.canvas.getContext("2d");
	board.width = 400;
	board.height = 400;
	board.cellwidth = 50;
	board.cellsX = 8;
	board.cellsY = 8;
	board.playerMap = board.initializeArray();
	board.minefield = board.initializeArray();


	// this handles click events, and prevents the contextmenu from appearing
	board.canvas.addEventListener("click", function(event){
		board.onClick(event,board);
	});
	board.canvas.addEventListener("contextmenu", function(event){
		board.onClick(event,board);
	});
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
				case 0:
					board.drawRect(x*board.cellwidth,y*board.cellwidth, board.cellwidth, board.cellwidth, [255, 140, 0]);
					break;
				case 2:
					board.drawRect(x*board.cellwidth,y*board.cellwidth, board.cellwidth, board.cellwidth, [136, 136, 136]);
					break;
				default:
					board.drawRect(x*board.cellwidth,y*board.cellwidth, board.cellwidth, board.cellwidth, [224, 224, 224]);
			}

		}
	}
}

Board.prototype.drawRect = function(x,y,w,h,color) {
	board = this;
	board.ctx.beginPath();
	board.ctx.fillStyle = 'rgb('+color[0]+', '+color[1]+', '+color[2]+')';
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
	board.playerMap[x][y] = mouseClick;
}

Board.prototype.onClick = function(event,board) {
	event.preventDefault();
	var x = Math.floor(event.offsetX / board.cellwidth);
	var y = Math.floor(event.offsetY / board.cellwidth);
	board.updatePlayerMap(x, y, event.button);
	board.draw();
	return false;
}
