const languageText = function(string, input) {
	var _input = typeof input !== 'object' ? [input].toString() : input;
	return {
		en: {
			title: "Gachatris Sapphirus - Alpha Release",

			splash1: "EricLenovo - ELSQPPH presents...",
			splash2: "Development started on July 14, 2022...",

			hold: "HOLD",
			next: "NEXT",

			hold_initial: "INITIAL",
			rot_cw: `${_input}x CW`,
			rot_ccw: `${_input}x CCW`,
			rot_180: `180`,

			line1: "Single",
			line2: "Double",
			line3: "Triple",
			line4: "Gachatris",
			line5: "Gachatris Plus",

			zspin: "Z-Spin",
			lspin: "L-Spin",
			ospin: "O-Spin", //theres o-spin in other rotation systems, like ascension and SRS + o-spin liquefying
			sspin: "S-Spin",
			ispin: "I-Spin",
			jspin: "J-Spin",
			tspin: "T-Spin",

			zspinmini: "Mini Z-Spin",
			lspinmini: "Mini L-Spin",
			ospinmini: "Mini O-Spin", //is this possible???
			sspinmini: "Mini S-Spin",
			ispinmini: "Mini I-Spin",
			jspinmini: "Mini J-Spin",
			tspinmini: "Mini T-Spin",

			backtoback: `Back-to-Back x${_input}`,
   ren: `${_input} REN`,
   perfectClear: "Perfect<br/>Clear",
		},
	} [["en"][0]][string];
}
