function Game()
{
	this.board = new Board();
};

Game.prototype.init = function(){
	game.board.draw();
}
