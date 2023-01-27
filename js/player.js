class GachatrisPlayer {
	constructor(player, assets) {
		this.canvasses = {
			hold: $ID(`P${player}-CANVAS-HOLD`),
			field: $ID(`P${player}-CANVAS-FIELD`),
			piece: $ID(`P${player}-CANVAS-PIECE`),
			next: $ID(`P${player}-CANVAS-NEXT`),
			queue: $ID(`P${player}-CANVAS-QUEUE`),
		};
		this.canvasCtx = {
			hold: this.canvasses.hold.getContext("2d"),
			field: this.canvasses.field.getContext("2d"),
			piece: this.canvasses.piece.getContext("2d"),
			next: this.canvasses.next.getContext("2d"),
			queue: this.canvasses.queue.getContext("2d"),
		};
		this.isActive = false;
		this.player = player;
		this.keysPressed = 0;
		this.score = 0;
		this.scoreTemplate = SCORE_TABLE;
		this.keysLast = 0;
		this.statistics = {};
		this.pieces = 0;
		this.combo = 0;
		this.b2b = -1;
		this.character = {
			fieldArr: ["normal", "warning"],
			path: {},
			load: {},
			current: 93993933993993
		};
		this.isWarning = false;
		this.allAssetsLoaded = true;
		this.assetsLoaded = 0;
		this.assetsLength = null;

		this.grid;
		this.width = 0;
		this.height = 0;
		this.clearedLinesDelayed = [];

		this.pieceDirty = false;
		this.pieceLast = {
			x: 0,
			y: 0,
		};
		this.spin = {
			line: false,
			zero: false,
			x: 0,
			y: 0,
			normal: 0,
			mini: 0
		};
		this.wallKick;
		this.kickDistance = {
			x: 0,
			y: 0,
		};
		this.isAllSpin = true;
		this.active = null;
		this.initialSystemEnabled = true;
		this.initialSystem = {
			rot: 0,
			hold: 0
		};
		this.activeMatrix;
		this.matrixTemplate;
		this.spinDetection;
		this.spinDetected = {
			normal: false,
			mini: false,
		};
		this.pieceX;
		this.pieceY;
		this.rot = 0;
		this.pieceXMoveRel = true;
		this.pieceXDirection = 0;
		this.isLanded = false;
		this.delay = {
			line: 0,
			piece: 0,
		};
		this.delayAdd = {
			line: 0,
			piece: 0,
		};
		this.lock = {
			delay: 0,
			limit: {
				move: 15,
				rotate: 15,
			},
		};
		this.handlingDelays = {
			autodel: 0,
			autorate: 0,
		};
		this.playerSettings = {
			AUTODEL: 48,
			AUTORATE: 0,
			SOFTDROP: 256 / 256 * 20,
			PREVIEW: 5,
			GRAVITY: 1 / 256,
			LOCK: 240,
		};

		this.bag = [0, 1, 2, 3, 4, 5, 6];
		this.queueBag = [];
		this.previewRNG = new ParkMillerPRNG();
		this.fieldRNG = new ParkMillerPRNG();
		this.holdPiece;
		this.isHeld = false;
		this.isAi = false;
		this.ai = {
			controlImg: {
				x: 0,
				y: 0,
				rot: 0,
				hold: 0
			},
			grid: [],
			delay: 0,
			delayReset: 20,
			movements: [],
			x: 0,
			y: 0,
			rot: 0,
			matrix: [],
			heuristicsWeight: {
				aggHeight: 0.0000510066,
				bump: -0.184483,
				lines: 60.1760666,
				holes: -9.0000300044,
				blockade: -0.0666
			},

		};


	};
	setSeed(seed) {
		this.previewRNG.seed = seed;
		this.fieldRNG.seed = seed
	};
	clearCanvas(ctx) {
		this.canvasCtx[ctx].clearRect(
			0,
			0,
			this.canvasCtx[ctx].canvas.width,
			this.canvasCtx[ctx].canvas.height
		)
	};

	CNVSIZE(cnv, x, y) {
		this.canvasses[cnv].width = x;
		this.canvasses[cnv].height = y;
	};

	resize(cell_size, pad) {
		$STYLE(`P${this.player}-LP`, `width`, `${cell_size * 5}px`);
		$STYLE(`P${this.player}-HOLDP`, `height`, `${cell_size * 1}px`);
		$STYLE(`P${this.player}-CANVAS-HOLD`, `height`, `${cell_size * 3}px`);
		this.CNVSIZE(`hold`, cell_size * 5, cell_size * 3);
		$STYLE(`P${this.player}-FIELD`, `width`, `${cell_size * 10}px`);
		$STYLE(`P${this.player}-FIELD`, `height`, `${cell_size * 20.4}px`);
		$STYLE(`P${this.player}-CANVAS-FIELD`, `width`, `${cell_size * 10}px`);
		$STYLE(`P${this.player}-CANVAS-FIELD`, `height`, `${cell_size * 20.4}px`);
		this.CNVSIZE(`field`, cell_size * 10, cell_size * 20.4);
		$STYLE(`P${this.player}-CANVAS-PIECE`, `width`, `${cell_size * 10}px`);
		$STYLE(`P${this.player}-CANVAS-PIECE`, `height`, `${cell_size * 20.4}px`);
		this.CNVSIZE(`piece`, cell_size * 10, cell_size * 20.4)
		$STYLE(`P${this.player}-RP`, `width`, `${cell_size * 5}px`);
		$STYLE(`P${this.player}-NEXTP`, `height`, `${cell_size * 1}px`);
		this.CNVSIZE(`next`, cell_size * 5, cell_size * 3);
		$STYLE(`P${this.player}-CANVAS-NEXT`, `width`, `${cell_size * 5}px`);
		$STYLE(`P${this.player}-CANVAS-NEXT`, `height`, `${cell_size * 3}px`);
		this.CNVSIZE(`queue`, cell_size * 5, cell_size * 11 * 3);
		$STYLE(`P${this.player}-CANVAS-QUEUE`, `width`, `${(cell_size * 5) * (1 * 0.5)}px`);
		$STYLE(`P${this.player}-CANVAS-QUEUE`, `height`, `${(cell_size * 3) * (11 * 0.5)}px`);
		$STYLE(`P${this.player}-CLEARTEXTS`, `right`, `${cell_size * 15.6}px`);
		$STYLE(`P${this.player}-CLEARTEXTS`, `top`, `${cell_size * 4}px`);
		$STYLE(`P${this.player}-PCDIV`, `paddingTop`, `${(cell_size * 8) + pad}px`);
	};

	drawCell(ctx, x, y, color, row) {
		x = x * CELL_SIZE;
		x = ~~x;
		y = y * CELL_SIZE - (2 * CELL_SIZE);
		this.canvasCtx[ctx].drawImage(
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

	drawMatrix(ctx, matrix, cx, cy, color, row) {
		for (var x = 0, len = matrix.length; x < len; x++) {
			for (var y = 0, wid = matrix[x].length; y < wid; y++) {
				if (matrix[x][y])
					this.drawCell(ctx, x + cx, y + cy, color !== void 0 ? color : matrix[x][y], row)
			};
		};
	};

	loadCharacter(character) {
		//TODO settings to be made
		character = character || 0;
		if (this.character.current !== character) {
			this.character.current = character;
			this.allAssetsLoaded = false;
			this.assetsLoaded = 0;
			var directory = `assets/characters/sapphirus/default`;
			for (let names of this.character.fieldArr) {
				this.character.path[names] = `${directory}/${names}.png`;
				this.character.load[names] = new Image();
				this.character.load[names].src = this.character.path[names];
				this.assetsLength = Object.keys(this.character.load).length
				for (let e of ["load", "error"])
					this.character.load[names].addEventListener(e, () => {
						this.assetsLoaded++;
						this.checkLoaded();
					}, { once: true })
			};
		};
	};
	checkLoaded() {
		this.allAssetsLoaded = this.assetsLoaded >= this.assetsLength;
	}
	setFieldImage(name) {
		$ID(`P${this.player}-FIELD-IMAGE`).src = this.character.path[name];
	};
	resetPlayer() {
		this.fieldAnimate()
		$STYLE(`P${this.player}-Body`, "opacity", "100%")
		this.isActive = true;
		this.pieces = 0;
		this.grid = $GRID(10, 42, 0);
		this.width = 10;
		this.height = 42;
		this.previewInit();
		this.drawGrid();
		this.isHeld = false;
		this.combo = -1;
		this.b2b = -1;
		this.pieceY = -20;
		this.holdPiece = void 0;
		this.pieceXMoveRel = true;
		this.pieceXDirection = 0;
		this.score = 0;
		this.holdDraw();
		this.loadCharacter();
		this.setFieldImage("normal");
		for (var e in this.delay) {
			this.delay[e] = 0;
		};
		this.activeMatrix = [[]];
		this.clearedLinesDelayed = [];
		this.showClearTextSpin(false);
		this.showClearTextRegular(false);
		this.showClearTextB2B(false);
		this.showClearTextREN(false);
		this.previewDraw();
		this.drawGrid();
	};
	injectPiece(id) {
		if (this.putPiece(id)) {


			if (this.initialSystem.hold == 1) {
				var holdTemp = this.holdPiece;
				if (!this.isHeld) {
					if (this.holdPiece !== void 0) {
						this.holdPiece = this.active;
						this.putPiece(holdTemp);
					} else {
						this.holdPiece = this.active;
						this.putPiece(this.previewNext());
					};
					this.isHeld = true;
					this.holdDraw();
				};
				this.setInitialParameter("hold", "set", 0);
			};

			if (this.initialSystem.rot !== 0) {
				if (this.initialSystem.rot > 0) {
					for (var i = 0; i < this.initialSystem.rot; i++) {
						this.rotatePiece(1);
					};
				};
				if (this.initialSystem.rot < 0) {
					for (var i = 0; i > this.initialSystem.rot; i--) {
						this.rotatePiece(-1);
					};
				};
				this.setInitialParameter("rot", "set", 0);
			};
			if (this.isAi) this.aiEvaluatePiece(id, this.isHeld);
		};
	};

	putPiece(ind) {
		this.active = ind;
		this.wallKick = GACHAMINO_SET[ind].wallKick;
		this.pieceDirty = true;
		this.matrixTemplate = GACHAMINO_SET[ind].matrix
		this.activeMatrix = this.matrixTemplate[0];
		this.rot = 0;
		this.spinDetection = GACHAMINO_SET[ind].spinDetection;
		this.pieceX = GACHAMINO_SET[ind].x;
		this.pieceY = GACHAMINO_SET[ind].y;
		this.pieceY += 20;
		this.isLanded = false;
		this.pieceMoved = false;
		this.pieceDirty = true;
		this.isHardDrop = false;
		this.lock.delay = this.playerSettings.LOCK;
		this.lock.limit = {
			move: 15,
			rotate: 15,
		};
		if (!this.checkValidation(0, 0, this.activeMatrix)) {
			this.isHardDrop = true;
			return false;
		};
		this.pieceY += this.checkDrop(1);
		return true;
	};

	checkValidation(cx, cy, matrix) {
		cx = cx + this.pieceX;
		cy = Math.floor(cy + this.pieceY);
		for (var x = 0, len = matrix.length; x < len; x++) {
			for (var y = 0, wid = matrix[x].length; y < wid; y++) {
				if (
					matrix[x][y] && (
						x + cx < 0 ||
						x + cx >= this.width ||
						y + cy >= this.height ||
						this.grid[x + cx][y + cy])
				)
					return false;
			};
		};
		return true;
	};

	checkDrop(d) {
		for (var i = 1; i <= d; i++) {
			if (!this.checkValidation(0, i, this.activeMatrix)) return i - 1;
		};
		return i - 1;
	};

	softDrop() {
		if (this.checkValidation(0, 1, this.activeMatrix) && this.pieceY > -10) {
			this.pieceMoved = true
			var grav = this.playerSettings.SOFTDROP;
			if (grav > 1) {
				this.pieceY += this.checkDrop(grav);
				this.score += this.checkDrop(grav)
			}
			else if (grav === 1) {
				this.score++;
				this.pieceY += this.checkDrop(1);
			}
			else {
				if (this.pieceY >= Math.round(this.pieceY) - grav && this.pieceY <= Math.round(this.pieceY)) {
					this.score++
				};
				this.pieceY += grav;
			};
		};
	};
	hardDrop() {
		if (this.pieceY > -10) {
			for (var i = Math.floor(this.pieceY); i <= this.height; i++) {
				if (this.checkValidation(0, 1, this.activeMatrix)) {
					this.pieceMoved = true;
					this.score += 2;
				};
			};
			soundPlayer.playSfx("harddrop");
			this.pieceY += this.checkDrop(this.height);
			this.isHardDrop = true;
		};
	};

	checkPieceXMovement(keysDown, lastKeys) {
		if (keysDown & KEY_FLAGS.LEFT && !(lastKeys & KEY_FLAGS.LEFT)) {
			this.handlingDelays.autodel = 0;
			this.handlingDelays.autorate = 0;
			this.pieceXMoveRel = true;
			this.pieceXDirection = -1;
		} else if (keysDown & KEY_FLAGS.RIGHT && !(lastKeys & KEY_FLAGS.RIGHT)) {
			this.handlingDelays.autodel = 0;
			this.handlingDelays.autorate = 0;
			this.pieceXMoveRel = true;
			this.pieceXDirection = 1;
		};
		if (
			this.pieceXDirection === 1 &&
			!(keysDown & KEY_FLAGS.RIGHT) &&
			lastKeys & KEY_FLAGS.RIGHT &&
			keysDown & KEY_FLAGS.LEFT
		) {
			this.handlingDelays.autodel = 0;
			this.handlingDelays.autorate = 0;
			this.pieceXMoveRel = true;
			this.pieceXDirection = -1;
		} else if (
			this.pieceXDirection === -1 &&
			!(keysDown & KEY_FLAGS.LEFT) &&
			lastKeys & KEY_FLAGS.LEFT &&
			keysDown & KEY_FLAGS.RIGHT
		) {
			this.handlingDelays.autodel = 0;
			this.handlingDelays.autorate = 0;
			this.pieceXMoveRel = true;
			this.pieceXDirection = 1;
		} else if (
			!(keysDown & KEY_FLAGS.RIGHT) &&
			lastKeys & KEY_FLAGS.RIGHT &&
			keysDown & KEY_FLAGS.LEFT
		) {
			this.pieceXDirection = -1;
		} else if (
			!(keysDown & KEY_FLAGS.LEFT) &&
			lastKeys & KEY_FLAGS.LEFT &&
			keysDown & KEY_FLAGS.RIGHT
		) {
			this.pieceXDirection = 1;
		} else if (
			(!(keysDown & KEY_FLAGS.LEFT) && lastKeys & KEY_FLAGS.LEFT) ||
			(!(keysDown & KEY_FLAGS.RIGHT) && lastKeys & KEY_FLAGS.RIGHT)
		) {
			this.handlingDelays.autodel = 0;
			this.handlingDelays.autorate = 0;
			this.pieceXMoveRel = true;
			this.pieceXDirection = 0;
		};
		if (this.pieceXDirection) {
			if (this.pieceXMoveRel) {
				this.movePieceX(this.pieceXDirection);
				this.handlingDelays.autodel++;
				this.pieceXMoveRel = false;
			} else if (this.handlingDelays.autodel < this.playerSettings.AUTODEL) {
				this.handlingDelays.autodel++;
			} else if (this.handlingDelays.autodel === this.playerSettings.AUTODEL && this.playerSettings.AUTODEL !== 0) {
				this.movePieceX(this.pieceXDirection);
				if (this.playerSettings.AUTORATE !== 0) this.handlingDelays.autodel++;
			} else if (this.handlingDelays.autorate < this.playerSettings.AUTORATE) {
				this.handlingDelays.autorate++;
			} else if (this.handlingDelays.autorate === this.playerSettings.AUTORATE && this.playerSettings.AUTORATE !== 0) {
				this.movePieceX(this.pieceXDirection);
			};
		};
	};

	movePieceX(d) {
		this.handlingDelays.autorate = 0;
		if (this.pieceY > -10) {
			if (this.playerSettings.AUTORATE === 0 && this.handlingDelays.autodel === this.playerSettings.AUTODEL) {
				for (var i = 1; i < this.width; i++) {
					if (!this.checkValidation(i * d, 0, this.activeMatrix)) {
						this.pieceX += (i * d) - d;
						break;
					};
					if (this.checkValidation(d, 0, this.activeMatrix)) soundPlayer.playSfx("move");
					this.pieceMoved = true;
					this.lock.delay = this.playerSettings.LOCK;
					if (!this.checkValidation(0, 1, this.activeMatrix)) this.lock.limit.move--;
				};
			} else if (this.checkValidation(d, 0, this.activeMatrix)) {
				this.pieceX += d;
				this.lock.delay = this.playerSettings.LOCK;
				this.pieceMoved = true;
				if (this.checkValidation(d, 0, this.activeMatrix)) soundPlayer.playSfx("move");
				if (!this.checkValidation(0, 1, this.activeMatrix)) {
					this.lock.limit.move--;
				};
			};
		};
	};

	rotatePiece(dir) {
		if (this.pieceY > -10) {
			var currentRot = ((this.rot % 4) + 4) % 4;
			var newRot = (((this.rot + dir) % 4) + 4) % 4;
			var rotateTemp = this.matrixTemplate[newRot];

			var dirType;
			switch (dir) {
				case 1:
					dirType = "right";
					break;
				case -1:
					dirType = "left";
					break;
				case 2:
					dirType = "double";
					break;
			};

			for (var ITERATION = 0, length = this.wallKick[dirType][newRot].length; ITERATION < length; ITERATION++) {
				if (this.checkValidation(
						this.wallKick[dirType][currentRot][ITERATION][0] - this.wallKick[dirType][newRot][ITERATION][0],
						this.wallKick[dirType][currentRot][ITERATION][1] - this.wallKick[dirType][newRot][ITERATION][1],
						rotateTemp
					)) {
					this.pieceX += this.wallKick[dirType][currentRot][ITERATION][0] - this.wallKick[dirType][newRot][ITERATION][0];
					this.pieceY += this.wallKick[dirType][currentRot][ITERATION][1] - this.wallKick[dirType][newRot][ITERATION][1];
					this.kickDistance.x = this.wallKick[dirType][currentRot][ITERATION][0] - this.wallKick[dirType][newRot][ITERATION][0];
					this.kickDistance.y = this.wallKick[dirType][currentRot][ITERATION][1] - this.wallKick[dirType][newRot][ITERATION][1];
					this.spin.x = Math.floor(this.pieceX);
					this.spin.y = Math.floor(this.pieceY);
					this.activeMatrix = rotateTemp;
					this.rot = newRot;
					soundPlayer.playSfx("rotate");
					this.pieceMoved = false;
					this.lock.delay = this.playerSettings.LOCK;
					if (!this.checkValidation(0, 1, this.activeMatrix)) this.lock.limit.rotate--;
					this.detectSpin();
					if (this.spinDetected.normal) {
						soundPlayer.playSfx("prespin");
					} else if (this.spinDetected.mini) {
						soundPlayer.playSfx("prespinmini");
					} else if (this.kickDistance.y == 2 && (this.kickDistance.x == 1 || this.kickDistance.x == -1)) {
						soundPlayer.playSfx("prespin");
					};
					break;
				};
			};
		} else this.setInitialParameter("rot", "add", dir);
	};

	setInitialParameter(type, operation, value) {
		if (this.initialSystemEnabled)
			switch (type) {
				case "rot":
					if (operation == "set") {
						this.initialSystem.rot = value;
					};
					if (operation == "add") {
						this.initialSystem.rot += value;
					};

					if (this.initialSystem.rot === 4 || this.initialSystem.rot === -4) {
						this.initialSystem.rot = 0;
					};

					if (this.initialSystem.rot === 0) {
						$IH(`P${this.player}-NEXT`, languageText("next"))
					};

					if (this.initialSystem.rot === 2 || this.initialSystem.rot === -2) {
						$IH(`P${this.player}-NEXT`, languageText("rot_180"));
					};

					if (this.initialSystem.rot === 1 || this.initialSystem.rot === 3) {
						$IH(`P${this.player}-NEXT`, languageText("rot_cw", this.initialSystem.rot));
					};

					if (this.initialSystem.rot === -1 || this.initialSystem.rot === -3) {
						$IH(`P${this.player}-NEXT`, languageText("rot_cw", this.initialSystem.rot * -1));
					};

					break;
				case "hold":
					if (operation == "set") {
						this.initialSystem.hold = value;
					};
					if (operation == "add") {
						this.initialSystem.hold += value;
					};

					if (this.initialSystem.hold === 2) {
						this.initialSystem.hold = 0;
					};

					if (this.initialSystem.hold === 0) {
						$IH(`P${this.player}-HOLD`, languageText("hold"));
					} else {
						$IH(`P${this.player}-HOLD`, languageText("hold_initial"));
					};

					break
			};
	};

	swapHold() {
		if (this.pieceY > -10) {
			var holdTemp = this.holdPiece;
			if (!this.isHeld) {
				if (this.holdPiece !== void 0) {
					this.holdPiece = this.active;
					this.injectPiece(holdTemp);
				} else {
					this.holdPiece = this.active;
					this.injectPiece(this.previewNext());
				};
				this.isHeld = true;
				this.holdDraw();
			};
		} else this.setInitialParameter("hold", "add", 1);
	};

	pieceUpdate() {
		if (this.pieceY > -10) {
			if (this.checkValidation(0, 1, this.activeMatrix)) {
				this.isLanded = false;
				this.pieceMoved = true;
				var grav = this.playerSettings.GRAVITY;
				if (grav > 1) this.pieceY += this.checkDrop(grav);
				else if (grav === 1) this.pieceY += this.checkDrop(1);
				else this.pieceY += grav;
			} else {
				if (!this.isLanded) {
					this.isLanded = true;
					if (!this.isHardDrop) soundPlayer.playSfx("land");
				};
				this.pieceY = Math.floor(this.pieceY);
				if (this.lock.delay <= 0 ||
					this.lock.limit.rotate <= 0 ||
					this.lock.limit.move <= 0 ||
					this.isHardDrop
				) {
					var isNoDelay = true
					if (!this.isHardDrop) soundPlayer.playSfx("lock");
					this.detectSpin();
					this.addMatrixToField(this.activeMatrix);
					this.delay.piece = this.delayAdd.piece;
					this.pieceY = -20;
					for (var e in this.delay)
						if (this.delay[e] > 1) isNoDelay = false;
					if (isNoDelay) this.injectPiece(this.previewNext());
					this.isHeld = false;
					this.holdDraw();
				} else {
					if (this.spinDetected.normal && this.active == 6) {
						if ((this.lock.delay + 60) % 60 == 0) {
							this.drawMatrix(`piece`, this.activeMatrix, this.pieceX, Math.floor(this.pieceY) - 19.6, void 0, 0);
						};
						if ((this.lock.delay + 40) % 60 == 0) {
							this.drawMatrix(`piece`, this.activeMatrix, this.pieceX, Math.floor(this.pieceY) - 19.6, 9, 0);
						};
						if ((this.lock.delay + 20) % 60 == 0) {
							this.drawMatrix(`piece`, this.activeMatrix, this.pieceX, Math.floor(this.pieceY) - 19.6, 10, 0);
						};
					};
					if (this.spinDetected.mini && this.active == 6) {
						if ((this.lock.delay + 60) % 60 == 0) {
							this.drawMatrix(`piece`, this.activeMatrix, this.pieceX, Math.floor(this.pieceY) - 19.6, void 0, 0);
						};
						if ((this.lock.delay + 30) % 60 == 0) {
							this.drawMatrix(`piece`, this.activeMatrix, this.pieceX, Math.floor(this.pieceY) - 19.6, 9, 0);
						};
					};

					this.lock.delay--;
				};
			};
		};
	};
	simulatePieceDraw() {
		if (
			this.pieceLast.x !== this.pieceX ||
			this.pieceLast.y !== this.pieceY ||
			this.pieceLast.rot !== this.rot ||
			this.pieceDirty
		) {
			this.clearCanvas(`piece`);
			this.drawPieceGhost();
			this.drawPiece();
			if (this.pieceDirty) this.pieceDirty = false;
		};
		this.pieceLast.x = this.pieceX;
		this.pieceLast.y = this.pieceY;
		this.pieceLast.rot = this.rot;
	};

	drawPiece() {
		this.drawMatrix(`piece`, this.activeMatrix, this.pieceX, Math.floor(this.pieceY) - 19.6, void 0, 0);
	};
	drawPieceGhost() {
		this.drawMatrix(`piece`, this.activeMatrix, this.pieceX, (Math.floor(this.pieceY) + this.checkDrop(30)) - 19.6, void 0, 1);
	};
	previewInit() {
		this.queueBag = this.previewGen();
		this.queueBag.push.apply(this.queueBag, this.previewGen());
		this.previewDraw();
	};
	previewGen() {
		let pieceList = [];
		this.bag.forEach(function(a) { pieceList.push(a) });
		for (var i = 0; i < pieceList.length - 1; i++)
		{
			var temp = pieceList[i];
			var rand = ~~((pieceList.length - i) * this.previewRNG.next()) + i;
			pieceList[i] = pieceList[rand];
			pieceList[rand] = temp;
		};
		return pieceList;
	};

	previewNext() {
		var next = this.queueBag.shift();
		this.queueBag.push.apply(this.queueBag, this.previewGen());
		this.previewDraw();
		return next;
	};

	previewDraw() {
		this.clearCanvas(`next`);
		this.clearCanvas(`queue`);
		for (var i = 0; i < Math.min(this.playerSettings.PREVIEW); i++) {
			if (i == 0) {
				if (this.queueBag[i] == 4) {
					this.drawMatrix(
						`next`,
						GACHAMINO_SET[this.queueBag[i]].matrix[0],
						GACHAMINO_SET[this.queueBag[i]].x - 2.5,
						GACHAMINO_SET[this.queueBag[i]].y + 2,
						void 0,
						0
					)
				} else if (this.queueBag[i] == 2) {
					this.drawMatrix(
						`next`,
						GACHAMINO_SET[this.queueBag[i]].matrix[0],
						GACHAMINO_SET[this.queueBag[i]].x - 2.5,
						GACHAMINO_SET[this.queueBag[i]].y + 2.5,
						void 0,
						0
					)
				} else {
					this.drawMatrix(
						`next`,
						GACHAMINO_SET[this.queueBag[i]].matrix[0],
						GACHAMINO_SET[this.queueBag[i]].x - 2,
						GACHAMINO_SET[this.queueBag[i]].y + 2.5,
						void 0,
						0
					)
				};
			} else {
				if (this.queueBag[i] == 4) {
					this.drawMatrix(
						`queue`,
						GACHAMINO_SET[this.queueBag[i]].matrix[0],
						GACHAMINO_SET[this.queueBag[i]].x - 2.5,
						(GACHAMINO_SET[this.queueBag[i]].y + 2) + (i - 1) * 3,
						void 0,
						0
					)
				} else if (this.queueBag[i] == 2) {
					this.drawMatrix(
						`queue`,
						GACHAMINO_SET[this.queueBag[i]].matrix[0],
						GACHAMINO_SET[this.queueBag[i]].x - 2.5,
						(GACHAMINO_SET[this.queueBag[i]].y + 2.5) + (i - 1) * 3,
						void 0,
						0
					)
				} else {
					this.drawMatrix(
						`queue`,
						GACHAMINO_SET[this.queueBag[i]].matrix[0],
						GACHAMINO_SET[this.queueBag[i]].x - 2,
						(GACHAMINO_SET[this.queueBag[i]].y + 2.5) + (i - 1) * 3,
						void 0,
						0
					)
				};
			};

		};
	};

	holdDraw() {
		this.clearCanvas(`hold`)
		if (this.holdPiece == 4) {
			this.drawMatrix(
				`hold`,
				GACHAMINO_SET[this.holdPiece].matrix[0],
				GACHAMINO_SET[this.holdPiece].x - 2.5,
				GACHAMINO_SET[this.holdPiece].y + 2,
				this.isHeld ? 1 : void 0,
				0
			)
		} else if (this.holdPiece == 2) {
			this.drawMatrix(
				`hold`,
				GACHAMINO_SET[this.holdPiece].matrix[0],
				GACHAMINO_SET[this.holdPiece].x - 2.5,
				GACHAMINO_SET[this.holdPiece].y + 2.5,
				this.isHeld ? 1 : void 0,
				0
			)
		} else if (this.holdPiece !== void 0) {
			this.drawMatrix(
				`hold`,
				GACHAMINO_SET[this.holdPiece].matrix[0],
				GACHAMINO_SET[this.holdPiece].x - 2,
				GACHAMINO_SET[this.holdPiece].y + 2.5,
				this.isHeld ? 1 : void 0,
				0
			)
		};
	};

	checkBlockGrid(x, y) {
		if (this.grid[x] !== undefined && this.grid[x] !== 0) {
			if (y < this.height) {
				if (this.grid[x][y] !== undefined && this.grid[x][y] !== 0) {
					return true;
				} else {
					return false;
				};
			} else {
				return true;
			};
		} else {
			return true;
		};
	};
	drawGrid() {
		this.clearCanvas(`field`)
		this.drawMatrix(`field`, this.grid, 0, -19.6, void 0, 0);
	};
	detectSpin() {
		this.spinDetected.normal = false;
		this.spinDetected.mini = false;
		this.spin.normal = 0;
		this.spin.mini = 0;

		var checkPoints = 0;
		if (!this.pieceMoved && this.isLanded) {
			if (this.isAllSpin) {
				if (this.active !== 4) {
					this.spin.normal = 0;
					for (var i = 0; i < this.spinDetection.highX[0].length; i++) {
						if ((this.checkBlockGrid(this.pieceX + this.spinDetection.highX[this.rot][i], this.pieceY + this.spinDetection.highY[this.rot][i])) == true) {
							this.spin.normal++;
							checkPoints++;
						};
					};
					for (var i = 0; i < this.spinDetection.lowX[0].length; i++) {
						if ((this.checkBlockGrid(this.pieceX + this.spinDetection.lowX[this.rot][i], this.pieceY + this.spinDetection.lowY[this.rot][i])) == true) {
							this.spin.mini++;
							checkPoints++;
						};
					};
					if (this.kickDistance.y == 2 && (this.kickDistance.x == 1 || this.kickDistance.x == -1)) {
						this.spin.normal++;
					};
				}
				else {
					for (var i = 0; i < 2; i++) {
						this.spin.normal = 0;
						if (((this.checkBlockGrid(this.pieceX + this.spinDetection.highX[this.rot][i], this.pieceY + this.spinDetection.highY[this.rot][i]))) || ((this.checkBlockGrid(this.pieceX + this.spinDetection.highX[this.rot][i + 2], this.pieceY + this.spinDetection.highY[this.rot][i + 2])) == true)) {
							this.spin.normal++;
							checkPoints++;
						}
					}
					for (var i = 0; i < 2; i++) {
						if (((this.checkBlockGrid(this.pieceX + this.spinDetection.lowX[this.rot][i], this.pieceY + this.spinDetection.lowY[this.rot][i])) == true) || ((this.checkBlockGrid(this.pieceX + this.spinDetection.lowX[this.rot][i + 2], this.pieceY + this.spinDetection.lowY[this.rot][i + 2])) == true)) {
							this.spin.normal++;
							checkPoints++;
						}
					}
					if (this.kickDistance.y == 2 && (this.kickDistance.x == 1 || this.kickDistance.x == -1)) {
						this.spin.normal++;
					};
				};
			} else if (this.active == 6) {
				this.spin.normal = 0;
				for (var i = 0; i < this.spinDetection.highX[0].length; i++) {
					if ((this.checkBlockGrid(this.pieceX + this.spinDetection.highX[this.rot][i], this.pieceY + this.spinDetection.highY[this.rot][i])) == true) {
						this.spin.normal++;
						checkPoints++;
					};
				};
				for (var i = 0; i < this.spinDetection.lowX[0].length; i++) {
					if ((this.checkBlockGrid(this.pieceX + this.spinDetection.lowX[this.rot][i], this.pieceY + this.spinDetection.lowY[this.rot][i])) == true) {
						this.spin.mini++;
						checkPoints++;
					};
				};
				if (this.kickDistance.y == 2 && (this.kickDistance.x == 1 || this.kickDistance.x == -1)) {
					this.spin.normal++;
				};
			};
			if (checkPoints >= 3) {
				if (this.spin.normal >= 2) {
					this.spinDetected.normal = true;
				}
				else if (this.spin.mini < 3) {
					this.spinDetected.mini = true;
				};
			};

		};
	};

	removeLines() {
		var blocksExist = false;
		for (var y of this.clearedLinesDelayed) {
			for (var full = y; full >= 1; full--) {
				for (var x = 0; x < this.width; x++) {
					if (!blocksExist && this.checkBlockGrid(x, full)) blocksExist = true;
					this.grid[x][full] = this.grid[x][full - 1];
				};
			};
		};
		this.clearedLinesDelayed = [];
		this.drawGrid();
	};
	fieldResult(type, isDownfall, text) {
		switch (type) {
			case "win":
				break;
			case "lose":
				this.fieldAnimate("board-downfall", "1900m", 1, "ease-in")
				$STYLE(`P${this.player}-Body`, "opacity", "0%")
				this.checkWarning("fall");
				break;
		}
		this.pieceY = -30;
		this.isActive = false;
		throw new Errow("locked out")
	};
	fieldAnimate(name, durationS, iterationCount, timingFunction, delay) {
		var e = `P${this.player}-Body`;
		$ID(e).offsetHeight;
		$STYLE(e, "animationName", name || "none");
		$STYLE(e, "animationDuration", `${durationS || 1}s`);
		$STYLE(e, "animationIterationCoumt", iterationCount || "1");
		$STYLE(e, "animationTimingFunction", timingFunction || "linear");
	}
	addMatrixToField(matrix) {
		var matrixPos = [],
			lines = 0;
		let spinDetected = this.spinDetected.normal,
			miniDetected = this.spinDetected.mini;
		this.isValidated = false;
		for (var x = 0, len = matrix.length; x < len; x++) {
			for (var y = 0, wid = matrix[x].length; y < wid; y++) {
				if (matrix[x][y] !== 0) {
					this.grid[x + this.pieceX][this.pieceY + y] = matrix[x][y];
					if (matrixPos.indexOf(this.pieceY + y) == -1) matrixPos.push(this.pieceY + y);
					if (y + this.pieceY > 21) this.isValidated = true;
				};
			};
		};
		if (!this.isValidated) {
			this.fieldResult("lose", true)
			return false;
		};
		for (var y = 0; y < this.height; y++) {
			var fill = 0;
			for (var x = 0; x < this.width; x++) {
				if (this.grid[x][y] !== 0) {
					fill++;
				};
			};
			if (fill >= this.width) {
				lines++;
				this.delay.line = this.delayAdd.line;
				if (this.delay.line >= 1) {
					this.clearedLinesDelayed.push(y);
					for (var x = 0; x < this.width; x++) {
						this.grid[x][y] = 0;
					};
				} else {
					for (var full = y; full >= 1; full--) {
						for (var x = 0; x < this.width; x++) {
							this.grid[x][full] = this.grid[x][full - 1];
						};
					};
				};
			};
		};
		var isPC = true;
		for (var x = 0; x < this.width; x++) {
			for (var y = 0; y < this.height; y++) {
				if (this.checkBlockGrid(x, y)) isPC = false;
			};
		};
		this.pieces++;

		if (lines == 0) {
			if (this.combo >= 0) {
				this.combo = -1;
				this.showClearTextREN(false);
			}
			if (spinDetected) {
				soundPlayer.playSfx("tspin0");
				this.showClearTextSpin(true, this.active, false);
			};
			if (miniDetected) {
				soundPlayer.playSfx("tspinmini0");
				this.showClearTextSpin(true, this.active, true);
			};
		} else {
			this.combo++;
			if (this.combo >= 1) {
				this.showClearTextREN(true, languageText("ren", this.combo));
			};
			if (isPC) {
				soundPlayer.playSfx("bravo");
				this.showPerfectClear(languageText("perfectClear"))
			};
			if (spinDetected) {
				soundPlayer.playSfx(`tspin${Math.min(lines, 3)}`);
				this.b2b++;
				this.showClearTextSpin(true, this.active, false);
			} else
			if (miniDetected) {
				soundPlayer.playSfx(`tspinmini${Math.min(lines, 3)}`);
				this.b2b++;
				this.showClearTextSpin(true, this.active, true);
			} else {
				soundPlayer.playSfx(`line${Math.min(lines, 4)}`);
				if (lines > 3) {
					this.b2b++;
				} else {
					this.b2b = -1;
				};
			};
			if (this.b2b > 0) {
				soundPlayer.playSfx("b2b");
				this.showClearTextB2B(true, languageText("backtoback", this.b2b))
			} else {
				this.showClearTextB2B(false);
			}
			this.showClearTextRegular(true, languageText(`line${Math.min(lines, 5)}`));
		};
		this.checkWarning()
		this.score += this.scoreTemplate[isPC ? "pc" : "nopc"][`${this.b2b > 0 ? "" : "no"}b2b`][`${spinDetected ? "spin" : miniDetected ? "mini" : "line"}`][lines]
		this.score += this.scoreTemplate.combo * Math.max(0, this.combo);
		this.drawGrid();
		return true;
	};

	modifyGrid(gridArr, cy, isFlipped) {
		if (isFlipped == false) {
			for (let x = 0; x < this.width; x++) {
				for (let y = 0; y < gridArr[x].length; y++)
					this.grid[x][y + cy] = gridArr[x][y];
			}
		} else {
			for (let x = 0; x < this.width; x++) {
				for (let y = 0; y < gridArr[x].length; y++)
					this.grid[x][y + cy] = gridArr[(this.width - 1) - x][y];
			}
		};
		this.drawGrid();
	};
	modifyPreview(array, count) {
		if (count == void 0) {
			this.grabBag = array;
		} else {
			this.queueBag = [];
			for (let e = 0; e < count; e++) {
				for (let ee = 0; ee < array.length; ee++) {
					this.queueBag.push(array[ee]);
				}
			}
		}
		this.previewDraw()
	};
	showPerfectClear(text) {
		var a = `P${this.player}-PERFECTCLEAR1`,
			b = `P${this.player}-PERFECTCLEAR2`;

		$IH(a, text);
		$IH(b, text);
		$STYLE(a, "animationName", "none");
		$STYLE(b, "animationName", "none");
		$ID(a).offsetHeight;
		$ID(b).offsetHeight;
		$STYLE(a, "animationName", "perfectClear1");
		$STYLE(b, "animationName", "perfectClear2");
	};
	showClearTextRegular(canShow, text) {
		var e = `P${this.player}-CLEARTEXT-REGULAR`;
		$STYLE(e, "animationName", "none");
		$ID(e).offsetHeight;
		$IH(e, text);
		if (canShow) {
			$STYLE(e, "animationName", "cleartext-animation");
		};
	};
	showClearTextSpin(canShow, index, isMini) {
		var e = `P${this.player}-CLEARTEXT-SPIN`;
		$STYLE(e, "animationName", "none");
		$ID(e).offsetHeight;
		if (canShow) {
			var colorSelect = ["#e00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f"][index];
			var letterSelect = ["z", "l", "o", "s", "i", "j", "t"][index]
			$IH(e, languageText(`${letterSelect}spin${isMini ? "mini" : ""}`));
			$STYLE(e, "color", colorSelect);
			$STYLE(e, "animationName", "cleartext-animation");
		};
	};
	showClearTextB2B(canShow, text) {
		var e = `P${this.player}-CLEARTEXT-B2B`;
		$STYLE(e, "animationName", "none");
		$ID(e).offsetHeight;
		$IH(e, text);
		$STYLE(e, "opacity", "0%");
		if (canShow) {
			$STYLE(e, "opacity", "100%");
			$STYLE(e, "letterSpacing", "0.1em");
			$STYLE(e, "animationName", "cleartext-animation-nofadeout");
		};
	};
	showClearTextREN(canShow, text) {
		var e = `P${this.player}-CLEARTEXT-REN`;
		if (canShow) {
			$STYLE(e, "opacity", "100%");
			$STYLE(e, "letterSpacing", "0.05em");
			$IH(e, text);
		} else {
			$STYLE(e, "opacity", "0%");
			$STYLE(e, "letterSpacing", "-0.2em");
		}
	};
	checkWarning(cmd) {
		let check = false
		for (var x = 0; x < this.width; x++) {
			for (var y = 0; y < this.height - 17; y++) {
				if (this.checkBlockGrid(x, y)) check = true;
			};
		};
		if (cmd == "stop" || cmd == "fall") check = false;

		if (check) {
			if (!this.isWarning) {
				this.isWarning = true;
				this.setFieldImage("warning");
			};
		} else {
			if (this.isWarning) {
				this.isWarning = false;
				this.setFieldImage("normal");
			};
		};
		if (cmd === "fall") {
			this.isWarning = false;
			this.setFieldImage("warning");
		}

	};

	playerUpdate() {
		if (this.isActive) {
			if (this.keysPressed & KEY_FLAGS.HOLD && !(this.keysLast & KEY_FLAGS.HOLD)) {
				this.swapHold()
			};
			if (this.keysPressed & KEY_FLAGS.CW && !(this.keysLast & KEY_FLAGS.CW)) {
				this.rotatePiece(1)
			};
			if (this.keysPressed & KEY_FLAGS.CCW && !(this.keysLast & KEY_FLAGS.CCW)) {
				this.rotatePiece(-1)
			};
			if (this.keysPressed & KEY_FLAGS.C180W && !(this.keysLast & KEY_FLAGS.C180W)) {
				this.rotatePiece(2)
			};
			if (this.keysPressed & KEY_FLAGS.SOFTDROP) {
				this.softDrop()
			};

			this.checkPieceXMovement(this.keysPressed, this.keysLast);
			if (this.keysPressed & KEY_FLAGS.HARDDROP && !(this.keysLast & KEY_FLAGS.HARDDROP)) {
				this.hardDrop()
			};
			this.pieceUpdate();
			this.simulatePieceDraw();
			this.keysLast = this.keysPressed;

			if (this.isAi) this.aiRun()

			if (this.delay.line >= 1) {
				this.delay.line--;
			} else if (this.delay.piece >= 1) {
				this.delay.piece--;
			};

			if (this.delay.line == 1) {
				this.removeLines();
				if (this.delay.piece < 1) this.injectPiece(this.previewNext());
			};
			if (this.delay.piece == 1) {
				this.injectPiece(this.previewNext());
			};

		}
	};


	aiRun() {
		if (this.pieceY > -10) {
			if (this.keysPressed == 0 && this.ai.delay <= 0) {
				if (this.ai.controlImg.hold === 1) {
					this.keysPressed |= KEY_FLAGS.HOLD;
					this.ai.controlImg.hold = 0;
				} else

				if (this.ai.controlImg.x > Math.round(this.pieceX) && this.checkValidation(1, 0, this.activeMatrix)) {
					this.keysPressed |= KEY_FLAGS.RIGHT;
				} else
				if (this.ai.controlImg.x < Math.round(this.pieceX) && this.checkValidation(-1, 0, this.activeMatrix)) {
					this.keysPressed |= KEY_FLAGS.LEFT;
				} else
				if (this.ai.controlImg.rot === 1) {
					this.keysPressed |= KEY_FLAGS.CW;
					this.ai.controlImg.rot = 0;
				} else
				if (this.ai.controlImg.rot === 2) {
					this.keysPressed |= KEY_FLAGS.C180W;
					this.ai.controlImg.rot = 0;
				} else
				if (this.ai.controlImg.rot === 3) {
					this.keysPressed |= KEY_FLAGS.CCW;
					this.ai.controlImg.rot = 0;
				} else
				if (this.ai.movements.length !== 0) {
					var f = this.ai.movements.shift();
					switch (f) {
						case 1: {
							this.keysPressed |= KEY_FLAGS.SOFTDROP;
							if (this.checkValidation(0, 1, this.activeMatrix))
								this.ai.movements.unshift(1);
							break;
						};

					case 4: {
						this.keysPressed |= KEY_FLAGS.CW;
						break;
					};
					case 5: {
						this.keysPressed |= KEY_FLAGS.CCW;
						break;
					};
					case 6: {
						this.keysPressed |= KEY_FLAGS.C180W;
						break;
					};
					};
				} else {
					this.keysPressed |= KEY_FLAGS.HARDDROP
				}
				this.ai.delay = this.keysPressed & KEY_FLAGS.SOFTDROP ? 2 : this.ai.delayReset;
			} else {
				this.keysPressed = 0
				this.ai.delay--;
			}
		}
	};

	aiEvaluatePiece(P, isHeld) {
		let a1 = this.aiEvaluate(P),
			a2 = this.aiEvaluate(this.queueBag[0]),
			a3,
			canHold = false,
			best;
		if (this.holdPiece !== void 0) {
			a3 = this.aiEvaluate(this.holdPiece);
		};
		if (this.holdPiece == void 0) {
			if (a1.score < a2.score && !isHeld) {
				best = a2;
				canHold = true;
			} else best = a1;
		} else
		if (a1.score < a3.score && !isHeld) {
			best = a3
			canHold = true;
		} else {
			best = a1;
			canHold = false;
		}
		this.ai.controlImg.x = best.x;
		this.ai.controlImg.rot = best.rot;
		this.ai.controlImg.hold = canHold ? 1 : 0;
		this.ai.movements = best.move;
		this.ai.index = best.index;
		this.drawMatrix(`field`, best.grid, best.mx, best.y - 19.6, 10, 0)
	}

	aiEvaluate(P) {
		var PIECE = P;
		var matrixTemp = GACHAMINO_SET[PIECE].matrix
		this.ai.matrix = matrixTemp[0];
		this.ai.index = PIECE;
		this.ai.wk = GACHAMINO_SET[PIECE].wallKick['left'];
		this.ai.x = GACHAMINO_SET[PIECE].x;
		this.ai.y = 14;
		this.ai.rot = 0;

		var lastX = this.ai.x;
		var prediction = [];

		let rotationTrials;
		if (PIECE === 2) { rotationTrials = 1; }
		else rotationTrials = 4;
		for (var rotations = 0; rotations < rotationTrials; rotations++) {
			//lastX = this.ai.x
			this.ai.y = 9;
			this.ai.x = 4;
			this.ai.matrix = matrixTemp[rotations];
			this.ai.grid = $CLONE(this.grid);
			if (rotations !== -1) {
				let currentRot = ((this.ai.rot % 4) + 4) % 4;
				let newRot = (((this.ai.rot + 1) % 4) + 4) % 4;
				let rotateTemp = matrixTemp[newRot];
				for (var ITERATION = 0, length = this.ai.wk[newRot].length; ITERATION < length; ITERATION++) {
					if (this.checkAIValidation(
							this.ai.wk[currentRot][ITERATION][0] - this.ai.wk[newRot][ITERATION][0],
							this.ai.wk[currentRot][ITERATION][1] - this.ai.wk[newRot][ITERATION][1],
							rotateTemp
						)) {
						this.ai.x += this.ai.wk[currentRot][ITERATION][0] - this.ai.wk[newRot][ITERATION][0];
						this.ai.y += this.ai.wk[currentRot][ITERATION][1] - this.ai.wk[newRot][ITERATION][1];

						this.ai.matrix = rotateTemp;
						this.ai.rot = newRot;
						break;
					};
				};
			}; /**/
			for (; this.checkAIValidation(-1, 0, this.ai.matrix); this.ai.x--) {};
			for (let movements = 0; movements < 14; movements++) {
				this.ai.grid = $CLONE(this.grid);
				//this.ai.x = lastX;
				if (movements !== 0 && this.checkAIValidation(1, 0, this.ai.matrix, void 0, void 0)) {
					this.ai.x++;
				}

				let moves = [];
				var mrot = this.ai.rot;
				var mx = this.ai.x;
				var my = 10;
				for (var dropRotation = 0; dropRotation < 4; dropRotation++) {
					if (dropRotation !== 0 && dropRotation !== 2 || (rotations == 1 || rotations == 3)) moves.push(1);
					var mt = this.ai.matrix;
     mx = this.ai.x;
     my = 18;
					this.ai.grid = $CLONE(this.grid);
				 my += this.checkAIDrop(49,mx,my,mt);
					for (let GX = 0; GX < 10; GX++) {
						for (let GY = 0; GY < 42; GY++) {
							if (typeof this.ai.grid[GX][GY] == "undefined") this.ai.grid[GX][GY] = 0;
						}
					}
					if (this.ai.rot == 1 && dropRotation >= 1) {
						let currentRot = ((mrot % 4) + 4) % 4;
						let newRot = (((mrot + 1) % 4) + 4) % 4;
						let rotateTemp = matrixTemp[newRot];
						for (var ITERATION = 0, length = this.ai.wk[newRot].length; ITERATION < length; ITERATION++) {
							if (this.checkAIValidation(
									this.ai.wk[currentRot][ITERATION][0] - this.ai.wk[newRot][ITERATION][0],
									this.ai.wk[currentRot][ITERATION][1] - this.ai.wk[newRot][ITERATION][1],
									rotateTemp, mx, my
								)) {
								mx += this.ai.wk[currentRot][ITERATION][0] - this.ai.wk[newRot][ITERATION][0];
								my += this.ai.wk[currentRot][ITERATION][1] - this.ai.wk[newRot][ITERATION][1];

								mt = rotateTemp;
								mrot = newRot;
								moves.push(4);
								break;
							};
						};
					}
					if (this.ai.rot == 3 && dropRotation != 0) {
						let currentRot = ((mrot % 4) + 4) % 4;
						let newRot = (((mrot - 1) % 4) + 4) % 4;
						let rotateTemp = matrixTemp[newRot];
						for (var ITERATION = 0, length = this.ai.wk[newRot].length; ITERATION < length; ITERATION++) {
							if (this.checkAIValidation(
									this.ai.wk[currentRot][ITERATION][0] - this.ai.wk[newRot][ITERATION][0],
									this.ai.wk[currentRot][ITERATION][1] - this.ai.wk[newRot][ITERATION][1],
									rotateTemp, mx, my
								)) {
								mx += this.ai.wk[currentRot][ITERATION][0] - this.ai.wk[newRot][ITERATION][0];
								my += this.ai.wk[currentRot][ITERATION][1] - this.ai.wk[newRot][ITERATION][1];

								mt = rotateTemp;
								mrot = newRot;
								moves.push(5);
								break;
							};
						};
					} /**/
					my += this.checkAIDrop(5,mx,my,mt);
					for (var x = 0, len = mt.length; x < len; x++) {
						for (var y = 0, hght = mt[x].length; y < hght; y++) {
							if (mt[x][y]) {
								this.ai.grid[x + mx][y + my] = mt[x][y];
							};
						};
					};

					var linesComplete = 0,
						holes = 0,
						blockade = 0,
						bump = 0;

					for (var lineTest = 18; lineTest < this.height; lineTest++) {
						var count = 0;
						for (var ex = 0; ex < this.width; ex++) {
							if (this.ai.grid[ex][lineTest] !== 0) count++;
						}
						if (count == this.width) {
							for (var full = lineTest; full >= 18; full--) {
								for (var x = 0; x < this.width; x++) {
									this.ai.grid[x][full] = this.ai.grid[x][full - 1];
								};
							};
							linesComplete+=455
						}
					};
					var columnHeight = [];
					var aggHeight = 0;
					for (let gx = 0; gx < 10; gx++) {
						for (let gy = 18; gy < this.height; gy++) {}
						var r = 0;
						for (; r < this.height && (this.ai.grid[gx][r] == 0 || typeof this.ai.grid[gx][r] == "undefined"); r++);
						columnHeight[gx] = 20 - r;
					}
					for (let value of columnHeight)
						aggHeight += value;

					for (var c = 0, T = columnHeight.length - 1; c < T; c++) {
						bump += Math.abs(columnHeight[c] - columnHeight[c + 1]);
					}


					for (var x = 0; x < 10; x++) {
						let block = false;
						for (var y = 18; y < 42; y++) {
							if (this.ai.grid[x][y]) {
								block = true;
							} else if (this.ai.grid[x][y] == 0 && block) {
								holes++;
							}
						}
					};

					var bCount = 0;
					for (var c = 0; c < 10; c++) {
						let hole = false;
						for (var r = 42; r >= 18; r--) {
							if (this.ai.grid[c][r] == 0 || typeof this.ai.grid[c][r] == "undefined") {
								hole = true;
							} else if ((this.ai.grid[c][r] != 0 && hole || typeof this.ai.grid[c][r] !== "undefined" && hole)) {
								bCount++;
							}
						}
					}
					blockade = bCount;


					let score = (aggHeight * (this.ai.heuristicsWeight.aggHeight)) + (linesComplete * (this.ai.heuristicsWeight.lines)) + (bump * (this.ai.heuristicsWeight.bump)) + (holes * (this.ai.heuristicsWeight.holes)) + (blockade * (this.ai.heuristicsWeight.blockade));

					prediction.push({
						x: this.ai.x,
						mx: mx,
						y: my,
						rot: this.ai.rot,
						index: prediction.length,
						move: $CLONE(moves),
						lines: linesComplete,
						score: score,
						grid: $CLONE(mt)
					})
				};


			}

		};
		var bestIndex = 0,
			highestScore = -999999999999;

		for (let evaluate of prediction) {
			if (evaluate.score > highestScore) {
				bestIndex = evaluate.index;
				highestScore = evaluate.score;
			}
		};
		return prediction[bestIndex]
	}



	checkAIValidation(cx, cy, matrix, px, py) {
		cx = cx + (px !== void 0 ? px : this.ai.x);
		cy = Math.floor(cy + (py !== void 0 ? py : this.ai.y));
		for (var x = 0, len = matrix.length; x < len; x++) {
			for (var y = 0, wid = matrix[x].length; y < wid; y++) {
				if (
					matrix[x][y] && (
						x + cx < 0 ||
						x + cx >= this.width ||
						y + cy >= this.height ||
						this.ai.grid[x + cx][y + cy])
				)
					return false;
			};
		};
		return true;
	};
	checkAIDrop(d, tx, ty, matrix) {
		var x = tx !== void 0 ? tx : this.ai.x,
		y = ty !== void 0 ? ty : this.ai.y;
		for (var i = 1; i <= d; i++) {
			if (!this.checkAIValidation(0, i, matrix, x, y)) return i - 1;
		};
		return i - 1;
	};


};
