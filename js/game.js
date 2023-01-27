const gameManager = new class {
	constructor(){
		this.frames = 0;
		this.syncFrames = 0;
		this.syncTime = 0;
	 this.actualFrames = 0;
	 this.startFrame = 0;
	 this.startTime;
	 this.gameRunner;
	 this.isRunning = false;
	 this.isReplay = false;
	 this.isPaused = false;
	 this.players = [];
	 this.playersCount = 71;
	 this.replayData = {
	 	keyLists: [{},{}],
	 	tunings: [{},{}],
	 	names: ["",""],
	 	characters: [],
	 	mode: 0,
	 	parameter: {}
	 };
	};
	iteratePlayers(func) {
		for(let player = 0, e = this.players.length; player < e; player++) func(this.players[player], player);
	};
	createPlayer(integer) {
		this.players = []
		var int = integer ? integer : 1;
		if(int !== this.playersCount) {
			$IH("SandboxArea", "")
  	this.players = [];
  	this.playersCount = int ? int : 1;
  	for(var i = 0; i < this.playersCount; i++) {
  	$IHA("SandboxArea", PLAYER_TEMPLATE(i + 1))
  	$IHA("playerStyles", PLAYER_TEMPLATE_STYLE(i + 1))
  	}
  }
		for(var e = 0; e < int; e++)/**/
		this.players.push(new GachatrisPlayer(this.players.length + 1));
  


	}
	initialize() {
		resolution()
		this.iteratePlayers(player => {
			player.resetPlayer();
		});
		soundPlayer.loadSfx(0);
		this.startFrame = 3 * MAIN_FRAMESPERSECOND + 1
		
		
		
		
		this.startLoad()
	}
	startLoad() {
		var canStart = true;
		this.iteratePlayers(player => { if(!player.allAssetsLoaded) canStart = false });
		if (!soundPlayer.allSfxLoaded) canStart = false;
		if(canStart) {
			$STYLE("loader", "display", "none")
			this.gameLoopStarter()
		} else {
			$STYLE("loader", "display", "flex")
			requestAnimationFrame(() => this.startLoad())
		}
	}
	gameLoopStarter(){
		if (!this.isRunning) {
			this.startTime = Date.now();
			this.actualFrames = 0;
			this.syncFrames = 0;
			this.gameRunner = setInterval(()=> {
				this.syncTime = Math.floor((Date.now() - this.startTime) / (1000 / MAIN_FRAMESPERSECOND));
				this.syncFrames = this.syncTime - this.actualFrames;
				for (var i = 0; i < this.syncFrames; i++, this.actualFrames++)
					this.loop();
			}, 1000 / MAIN_FRAMESPERSECOND);
		};
		this.isRunning = true;
	};
	loop(){
		try{
			this.frames++;
			if(this.startFrame >= 0) {
				this.startFrame--;
			};
			switch(this.startFrame) {
				case 3 * MAIN_FRAMESPERSECOND:
					soundPlayer.playSfx("ready3");
					break;
				case 2 * MAIN_FRAMESPERSECOND:
					soundPlayer.playSfx("ready2");
				 break;
				case 1 * MAIN_FRAMESPERSECOND:
					soundPlayer.playSfx("ready1");
			 	break;
				case 0 * MAIN_FRAMESPERSECOND:
					soundPlayer.playSfx("start");
					this.iteratePlayers(player => {
						player.injectPiece(player.previewNext());
						
					})
	 			break;
			}
			this.iteratePlayers(player => {
				player.playerUpdate()
   	})
		}catch(e){
			this.isRunning = false;
			clearInterval(this.gameRunner)
			console.log(e.stack)
		}
	}
}();
