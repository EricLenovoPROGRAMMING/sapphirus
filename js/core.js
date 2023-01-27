const SAPPHIRUS_VERSION = `0.0.001 Alpha`;

var CELL_SIZE = 12;
const MAIN_FRAMESPERSECOND = 480,
	GRAVITY_CONSTANT = 1 / 2048,
	GRAVITY_ARRAY = (function() {
		var arr = [];
		for (var i = 0; i < MAIN_FRAMESPERSECOND; i++) {
			arr.push(i / 512);
		};
		for (var i = 0; i < 20; i++) {
			arr.push(i);
		};
		return arr;
	})(),
GACHATRIS_CANVASSES = {
	skin: $ID(`SkinCanvas`),
	},
GACHATRIS_CANVAS_CONTEXTS = {
	skin:	GACHATRIS_CANVASSES.skin.getContext(`2d`),
	} 
const CNVSIZE = function(cnv,x,y){
		GACHATRIS_CANVASSES[cnv].width = x;
		GACHATRIS_CANVASSES[cnv].height = y;
	}

function resolution() {
	const inPlace = $TAG(`GTRIS-TEXT-INPLACE`);
 SCREEN_WIDTH = window.innerWidth;
 SCREEN_HEIGHT = window.innerHeight;
	for (var e of inPlace) {
		e.style.fontSize = `${CELL_SIZE * 0.8}px`;
	};
	let PADDING = (SCREEN_HEIGHT - (CELL_SIZE * 20 + 2)) / 3;
for(var e of $TAG(`GTRIS-TETRION-PADDING`)) e.style.paddingTop = `${PADDING}px`;

 gameManager.iteratePlayers(player => player.resize(CELL_SIZE, PADDING));
 
 
 $STYLE(`SkinImage`, `width`, `${CELL_SIZE * 11}px`);
 $STYLE(`SkinImage`, `height`, `${CELL_SIZE * 2}px`);
 $STYLE(`SkinCanvas`, `width`, `${CELL_SIZE * 11}px`);
 $STYLE(`SkinCanvas`, `height`, `${CELL_SIZE * 2}px`);

 CNVSIZE(`skin`, CELL_SIZE * 11, CELL_SIZE * 2)
	_docElem.style.fontSize = `${CELL_SIZE}px`;
	createSkin()
}

const createSkin = function(){
	const skinImg = $ID(`SkinImage`);
	skinImg.src = `skin/default.png`;
	skinImg.onload = () => {
		GACHATRIS_CANVAS_CONTEXTS.skin.drawImage(
			skinImg,
			0,
			0,
			GACHATRIS_CANVASSES.skin.width,
			GACHATRIS_CANVASSES.skin.height
			)
	}
};

function drawCell(ctx, x, y, color, row) {
	x = x * CELL_SIZE;
	x = ~~x;
	y = y * CELL_SIZE - (2 * CELL_SIZE);
	GACHATRIS_CANVAS_CONTEXTS[ctx].drawImage(
		GACHATRIS_CANVASSES.skin,
		color * CELL_SIZE,
		row * CELL_SIZE,
		CELL_SIZE,
		CELL_SIZE,
		x,
		y,
		CELL_SIZE,
		CELL_SIZE,
	);
};

function drawMatrix(ctx, matrix, cx, cy, color, row) {
	for (var x = 0, len = matrix.length; x < len; x++) {
		for (var y = 0, wid = matrix[x].length; y < wid; y++) {
			if (matrix[x][y])
				drawCell(ctx, x + cx, y + cy, color !== void 0 ? color : matrix[x][y], row)
		}
	}
}

function clearCanvas(ctx){
	GACHATRIS_CANVAS_CONTEXTS[ctx].clearRect(
		0,
		0,
		GACHATRIS_CANVAS_CONTEXTS[ctx].canvas.width,
		GACHATRIS_CANVAS_CONTEXTS[ctx].canvas.height
	)
}

/**/
