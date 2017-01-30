var ctx = document.getElementById('canvas').getContext("2d");
var bw = 800, bh = 600; // 画布宽、高
var d = 15; // 格子大小

pauseGameOfLife = false;

function randomColor() {
	return "#"+(Math.round((1<<24)*Math.random())).toString(16);
}

function drawBoard(board, m, n) {
	// 绘制格子
	for(var i=0; i < m; ++i) {
		for(var j = 0; j < n; ++j) {
			if(board[i][j] & 0x1) {
				ctx.beginPath();
				ctx.arc((i+1/2)*d, (j+1/2)*d, d/2, 0, 2*Math.PI);
				ctx.fillStyle = 'green';
				// ctx.fillStyle = randomColor();
				ctx.fill();
			}
			else {
				ctx.clearRect(i*d, j*d, d, d);
			}
			ctx.beginPath();
			ctx.lineWidth = "1";
			ctx.strokeStyle="black";
			ctx.rect(i*d, j*d, d, d);
			ctx.stroke();
		}
	}
}

function getNeighbors(board, x, y, m, n) {
	var cnt = 0;
	for(var i=x-1; i<=x+1; ++i)
		for(var j=y-1; j<=y+1; ++j)
			if(i>=0 && j>=0 && i<m && j<n) {
				if((i != x || j != y)) cnt += board[i][j] & 0x1;
			}
	return cnt;
}

function gameOfLife(board, m, n) {
	for (var i = 0; i < m; ++i)
		for (var j = 0; j < n; ++j) {
			var nebs = getNeighbors(board, i, j, m, n);
			// console.log("("+i+", "+j + "): " + nebs);
			if(nebs == 2) board[i][j] |= (board[i][j] & 0x1) << 1; // 保持不变
			else if(nebs == 3) board[i][j] |= 0x2; // 增生
			else board[i][j] &= 0x1; // 死亡
		}

	for (var i = 0; i < m; ++i)
		for (var j = 0; j < n; ++j)
			board[i][j] >>= 1;
}

function run() {
	// 初始化数组
	if(typeof this.init == 'undefined') {
		board = [];
		m = parseInt(bw/d);
		n = parseInt(bh/d);
		for(var i = 0; i < m; ++i) {
			board[i] = [];
			for(var j = 0; j < n; ++j)
				board[i][j] = Math.round(Math.random());
				board[i][j] = 0;
		}
		document.getElementById('canvas').addEventListener("mousedown", function(e) {
			// console.log(e.pageX, e.pageY, e.button);
			if(e.button == 1) { // 鼠标中键清除
				for (var i = 0; i < m; ++i)
					for (var j = 0; j < n; ++j)
						board[i][j] = 0;
				pauseGameOfLife = true;
			}
			else if(e.button == 2) { // 右键暂停
				pauseGameOfLife = ! pauseGameOfLife;
			} else { // 左键添加细胞
				var x = parseInt(e.pageX/d - 0.5);
				var y = parseInt(e.pageY/d - 0.5);
				board[x][y] = (board[x][y] & 0x1) ^ 0x1;
			}
		}, false);
		this.init = true;
	}

	if(! pauseGameOfLife) {
		gameOfLife(board, m, n);
	}
	drawBoard(board, m, n);
}

setInterval("run()", 400);

