const soundPlayer = new class {
	constructor() {
		this.sounds = {};
		this.current = 339;
		this.soundsArr = ["ready1", "ready2", "ready3", "start", "prespin", "prespinmini",
		"move", "rotate", "harddrop", "land", "lock", "bravo", "b2b"
		];
		this.allSfxLoaded = true;
	};
	loadSfx(cur) {
		if (this.current !== cur) {
			this.current = cur;
			this.allSfxLoaded = false;
			var directory = `assets/sounds/game/default`;
			for (let sounds of this.soundsArr) {
				this.sounds[sounds] = new Howl({
					preload: false,
					src: `${directory}/${sounds}.ogg`
				});
			};

			for (let sounds = 1; sounds <= 4; sounds++) {
				this.sounds[`line${sounds}`] = new Howl({
					preload: false,
					src: `${directory}/line${sounds}.ogg`
				});
			};

			for (let sounds = 0; sounds <= 3; sounds++) {
				this.sounds[`tspin${sounds}`] = new Howl({
					preload: false,
					src: `${directory}/tspin${sounds}.ogg`
				});
			};

			for (let sounds = 0; sounds <= 3; sounds++) {
				this.sounds[`tspinmini${sounds}`] = new Howl({
					preload: false,
					src: `${directory}/tspinmini${sounds}.ogg`
				});
			};
			this.sfxLoaded = 0;
			for (let sounds in this.sounds) {
				this.sounds[sounds].load();
				for (let e of ["load", "loaderror"]) {
					this.sounds[sounds].once(e, () => {
						this.sfxLoaded++;
						this.allSfxLoaded = this.sfxLoaded >= Object.keys(this.sounds).length;
					});
				};
			};
		};
	};
	playSfx(name) {
		//TODO settings to be made so its set to true
		if (true) {
			this.sounds[name].volume(50 / 100);
			this.sounds[name].stop();
			this.sounds[name].play();
		}
	}
}();
