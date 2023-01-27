/** COPYRIGHT 2022 EricLenovo
 * Gachatris Sapphirus Sandbox
 * 
 */
"use strict";
/* EricLenovo Polyfill */
const _doc = document,
	_docElem = _doc.documentElement;

var SCREEN_HEIGHT = window.innerHeight,
	SCREEN_WIDTH = window.innerWidth

const $ID = function(id) {
		return _doc.getElementById(id);
	},
	$IH = function(id, iH) {
		if ($ID(id).innerHTML !== iH) {
			$ID(id).innerHTML = iH;
		}
	},
	$IHA = function(id, iH) {
		$ID(id).innerHTML += iH;
	},
	$CLASS = function(c, n) {
		if (n !== void 0)
			return _doc.getElementsByClassName(c)[n];
		return _doc.getElementsByClassName(x);
	},
	$TAG = function(c, n) {
		if (n !== void 0)
			return _doc.getElementsByTagName(c)[n];
		return _doc.getElementsByTagName(c);
	},
	$STYLE = function(id, prop, s) {
		if ($ID(id).style[prop] !== s) {
			$ID(id).style[prop] = s;
		};
	},
	$MAL = function(i, val) {
		var a = [];
		for (var e = 0; e < i; e++) {
			a.push(val !== void 0 ? val : null);
		}
		return a;
	},
	$GRID = function(x, y, val) {
		var a = [];
		for (var e = 0; e < x; e++) {
			a.push([]);
			for (var f = 0; f < y; f++) {
				a[e].push(val);
			}
		};
		return a;
	},
	$ELEM = function(tag, func) {
		var a = _doc.createElement(tag);
		func(a);
	},
	$CLONE = function(arr) {
		var ARR = [];
		for (let a = 0, len = arr.length; a < len; a++) {
			if (typeof arr[a] == "object" && arr[a] instanceof Array) {
				ARR.push([]);
				for (let b = 0, len2 = arr[a].length; b < len2; b++) {
					ARR[a].push(arr[a][b]);
				};
			}
			else {
				ARR.push(arr[a]);
			}
		};
		return ARR;
	};
class ParkMillerPRNG {
	constructor() {
		this.seed = 1;
	}
	next() {
		return this.gen() / 2147483647;
	}
	gen() {
		return (this.seed = (this.seed * 16807) % 2147483647);
	}
};

function starter() {
	var arr = ['player_template', 'howler', 'localization', 'data', 'sound_player', 'player', 'core', 'game'],
		loaded = 0;

	function l() {
		$ELEM("script", function(a) {
			a.src = `js/${arr[loaded]}.js`;
			a.type = "text/javascript";
			document.body.appendChild(a);
			a.onload = () => {
				if (loaded < arr.length) {
					loaded++;
					l();
				}
				if (loaded >= arr.length) {
					gameManager.createPlayer(1);
					gameManager.iteratePlayers(player => {player.setSeed(Math.floor(Math.random() * 2147483647))
				//	player.isAi = true;
					});
					//gameManager.players[0].isAi = true;
					resolution();
					gameManager.initialize();
					addEventListener(`resize`, resolution, false);
				}
			}
		});
	};
	addEventListener("DOMContentLoaded", l, false)

}
starter(0)
//Globally handle errors
window.onerror = (event, source, lineno, colno, error) => {
	if (error instanceof SyntaxError) {
		document.body.innerHTML = (`FATAL ERROR!!! At ${source}, ${lineno}:${colno}, ${event.indexOf('Strict mode code')!==-1||event.indexOf('Identifier \'')!==-1?'':"there is"} ${['a','e','i','o','u'].indexOf(event.toLowerCase().replace('uncaught syntaxerror: ', '').charAt(0)) !== -1?'an':'a'} ${event.replace('Uncaught SyntaxError: ','').toLowerCase()}. Please contact the Gachatris developer and he will fix a discovered bug to recover the game.`)
		document.body.style = "background:#007;color:#fff"
	} else {
		alert(`At ${source}, ${lineno}:${colno}, there is ${[`a`,`e`,`i`,`o`,`u`].indexOf(event.toLowerCase().charAt(0)) !== -1?'an':'a'} ${event}. If you see this error mesage, contact the Gachatris developer.`)
	}
}
