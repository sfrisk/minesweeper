var Board = function() {
	this.canvas = document.getElementById("minesweeper");
	this.ctx = this.canvas.getContext("2d");
	this.width = 400;
	this.height = 400;
	this.cellwidth = 50;

	// this handles click events, and prevents the contextmenu from appearing
	this.canvas.addEventListener("click", this.onClick);
	this.canvas.addEventListener("contextmenu", this.onClick);
}

Board.prototype.draw = function() {
	this.clear();
	this.generateGrid();
}

Board.prototype.clear = function() {
	this.ctx.clearRect(0, 0, this.width, this.height);
}

Board.prototype.generateGrid = function() {
	this.ctx.fillStyle = 'rgb(139, 137, 137)';
	this.ctx.rect(0,0,this.width,this.height);
	this.ctx.closePath();
	this.ctx.fill();
}


Board.prototype.onClick = function(event) {
	event.preventDefault();
	var clickButton = "";
	switch (event.button) {
		case 0:
			clickButton = "Left Click";
			break;
		case 2:
			clickButton = "Right Click";
			break;
		default:
			clickButton = "Unknown Click";
	}
	alert("x = "+event.offsetX+", y = "+event.offsetY +", " + clickButton);
	return false;
}
