
var ctx = document.getElementById('canvas').getContext("2d");
var bw = 800, bh = 600; // 画布宽、高
var d = 15; // 格子大小


function drawBoard(board, m, n) {
	// 初始化格子
	for(var x = 0; x<=bw; x+=d) {
		ctx.moveTo(x, 0);
		ctx.lineTo(x, bh);
	}
	for(var y = 0; y<=bh; y+=d) {
		ctx.moveTo(0, y);
		ctx.lineTo(bw, y);
	}
	// 绘制格子
	for(var i=0; i < m; ++i) {
		for(var j = 0; j < n; ++j) {
			if(board[i][j])
				ctx.fillRect(i*d, j*d, d, d);
			else
				ctx.clearRect(i*d, j*d, d, d);
		}
	}
	ctx.stroke();
}

function getNeighbors(board, x, y, m, n) {
	var cnt = 0;
	for(var i=x-1; i<=x+1; ++i)
		for(var j=y-1; j<=y+1; ++j)
			if(i>=0 && j>=0 && i<m && j<n) {
				if((i != x || j != y)) cnt += board[i][j];
			}
	return cnt;
}

function gameOfLife(board, m, n) {
	for (var i = 0; i < m; ++i)
		for (var j = 0; j < n; ++j) {
			var nebs = getNeighbors(board, i, j, m, n);
			if(nebs < 2 || nebs > 3) board[i][j] &= 1;
			else if(nebs == 3) board[i][j] |= 0x2;
		}

	for (var i = 0; i < m; ++i)
		for (var j = 0; j < n; ++j)
			board[i][j] >>= 1;
}

function run() {
	// 初始化数组
	var board = [];
	var m = parseInt(bw/d)+1;
	var n = parseInt(bh/d)+1;
	for(var i = 0; i < m; ++i) {
		board[i] = [];
		for(var j = 0; j < n; ++j)
			board[i][j] = Math.round(Math.random());
	}
	gameOfLife(board, m, n);
	drawBoard(board, m, n);
}
setInterval("run()", 500);

