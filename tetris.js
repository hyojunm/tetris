const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const scale = 30;
const width = 10;
const height = 20;

canvas.width = width * scale;
canvas.height = height * scale;

const scoreboard = document.querySelector("#scoreboard");
const ctx2 = scoreboard.getContext("2d");

scoreboard.width = 250;
scoreboard.height = height * scale;

ctx2.fillStyle = "black";
ctx2.strokeStyle = "black";
ctx2.font = "24px Calibri";
ctx2.lineWidth = 2;

ctx2.fillText("NEXT", 25, 15);
ctx2.strokeRect(25, 30, 160, 100);
ctx2.fillText("HOLD", 25, 165);
ctx2.strokeRect(25, 180, 160, 100);

ctx2.fillText("SCORE", 25, 315);
ctx2.fillText(0, 35, 360);
ctx2.strokeRect(25, 330, 160, 45);

ctx2.fillText("LINES CLEARED", 25, 415);
ctx2.fillText(0, 35, 460);
ctx2.strokeRect(25, 430, 160, 45);

ctx2.fillText("LEVEL", 25, 510);
ctx2.fillText(1, 35, 555);
ctx2.strokeRect(25, 525, 160, 45);

function showNext() {
	next = Math.floor(Math.random() * 7);
	display(25, 30, 160, 100, next);
}

function hold(current, next) {
	if (!holdBlock) {
		return;
	}

	clearInterval(interval);
	ctx.clearRect(0, 0, width * scale, height * scale);
	display(25, 180, 160, 100, current);

	if (saved || saved == 0) {
		create(3, 0, saved, 1000 - (level - 1) * 100);
	} else {
		create(3, 0, next, 1000 - (level - 1) * 100);
	}

	holdBlock = false;
	saved = current;
}

function display(x, y, w, h, type) {
	let display = tetrominoArray[type];
	let width = 0, height = 0;
	let box = { x: x, y: y, width: w, height: h };

	ctx2.clearRect(x + 5, y + 5, w - 10, h - 10);
	ctx2.fillStyle = display.color;
	ctx2.strokeStyle = "white";
	ctx2.lineWidth = 2;

	for (coordinate of display.coordinates) {
		if ((coordinate.x + 1) * scale > width) {
			width = (coordinate.x + 1) * scale;
		}

		if ((coordinate.y + 1) * scale > height) {
			height = (coordinate.y + 1) * scale;
		}
	}

	box.x += (box.width / 2) - (width / 2);
	box.y += (box.height / 2) - (height / 2);

	for (coordinate of display.coordinates) {
		const x = box.x + (coordinate.x * 30);
		const y = box.y + (coordinate.y * 30);
		ctx2.fillRect(x, y, scale, scale);
		ctx2.strokeRect(x, y, scale, scale);
	}
}

var tetromino, interval;
var blocks = [];
var next = Math.floor(Math.random() * 7);
var saved, holdBlock = true;
var score = 0, level = 1, cleared = 0;

function create(x, y, random, time) {
	tetromino = new Tetromino(x, y, random);
	draw();
	interval = setInterval(function() {
		update("y", 1);
	}, time);
}

function update(coordinate, direction) {
	ctx.clearRect(0, 0, width * scale, height * scale);
	
	if (coordinate == "x") {
		tetromino.x += direction;
		if (collision(tetromino, blocks)) {
			tetromino.x -= direction;
		}
	} else if (coordinate == "y") {
		tetromino.y += direction;
		if (collision(tetromino, blocks)) {
			tetromino.y--;
			clearInterval(interval);

			while (collision(tetromino, blocks)) {
				tetromino.y--;
			}

			for (coordinate of tetromino.block.coordinates) {
				const x = tetromino.x + coordinate.x;
				const y = tetromino.y + coordinate.y;
				const coordinates = { x: x, y: y, color: tetromino.block.color };
				blocks.push(coordinates);
			}

			if (tetromino.y <= 0) {
				alert("Game over...");
				draw();
				return;
			}

			clearRow();
			ctx2.clearRect(30, 435, 150, 35);
			ctx2.fillText(cleared, 35, 460);
			
			if (cleared / level >= 10) {
				level++;
				if (level >= 10) {
					level = 10;
				}
				ctx2.clearRect(30, 530, 150, 35);
				ctx2.fillText(level, 35, 555);
			}

			create(3, 0, next, 1000 - (level - 1) * 100);
			showNext();
			holdBlock = true;
		}
	} else if (coordinate == "rotation") {
		for (coordinate of tetromino.block.coordinates) {
			[coordinate.x, coordinate.y] = 
			[(-1 * coordinate.y) + 2, coordinate.x];

			if (collision(tetromino, blocks)) {
				for (coordinate of tetromino.block.coordinates) {
					if (tetromino.x + coordinate.x <= 0) {
						tetromino.x++;
						break;
					} else if (tetromino.x + coordinate.x >= width) {
						tetromino.x--;
						break;
					}
				}
			}
		}

		if (collision(tetromino, blocks)) {
			for (coordinate of tetromino.block.coordinates) {
				[coordinate.x, coordinate.y] = 
				[coordinate.y, (-1 * coordinate.x) + 2];
			}
		}
	}

	draw();

	ctx2.font = "24px Calibri";
	ctx2.fillStyle = "black";
	ctx2.clearRect(30, 335, 150, 35);
	ctx2.fillText(score, 35, 360);
}

function draw() {
	ctx.lineWidth = 2;

	for (coordinate of tetromino.block.coordinates) {
		const x = (tetromino.x + coordinate.x) * scale;
		const y = (tetromino.y + coordinate.y) * scale;
		ctx.strokeStyle = "black";
		ctx.fillStyle = tetromino.block.color;
		ctx.fillRect(x, y, scale, scale);
		ctx.strokeRect(x, y, scale, scale);
	}

	for (coordinate of blocks) {
		ctx.strokeStyle = "black";
		ctx.fillStyle = coordinate.color;
		ctx.fillRect(coordinate.x * scale, coordinate.y * scale,
								scale, scale);
		ctx.strokeRect(coordinate.x * scale, coordinate.y * scale,
								scale, scale);
	}
}

function move(direction) {
	if (direction == "ArrowRight") {
		update("x", 1);
	} else if (direction == "ArrowLeft") {
		update("x", -1);
	} else if (direction == "ArrowDown") {
		score += 1 * level;
		update("y", 1);
	} else if (direction == "ArrowUp") {
		update("rotation");
	} else if (direction == "Space") {
		const distance = getDistance(tetromino, blocks);
		score += distance * 2 * level;
		update("y", distance);
	} else if (direction == "KeyC") {
		hold(tetromino.block.id, next);
	}
}

function getDistance(player, target) {
	let distance = (height - 1) - tetromino.y;
	
	for (playerCoordinate of player.block.coordinates) {
		for (targetCoordinate of target) {
			if (player.x + playerCoordinate.x == targetCoordinate.x) {
				const newDist = (targetCoordinate.y - 1) - player.y;
				if (newDist < distance && newDist > 0) {
					distance = newDist;
				}
			}
		}
	}

	return distance;
}

function collision(player, target) {
	for (playerCoordinate of player.block.coordinates) {
		for (targetCoordinate of target) {
			if (player.x + playerCoordinate.x == targetCoordinate.x &&
					player.y + playerCoordinate.y == targetCoordinate.y) {
				return true;
			}
		}

		if (player.x + playerCoordinate.x < 0 ||
				player.x + playerCoordinate.x >= width) {
			return true;
		} else if (player.y + playerCoordinate.y >= height) {
			return true;
		}
	}

	return false;
}

function clearRow() {
	let clearedLines = 0;
	for (let i = 0; i < height; i++) {
		let filled = 0;

		for (coordinate of blocks) {
			if (coordinate.y == i) {
				filled++;
			}
		}

		if (filled >= width) {
			cleared++;
			clearedLines++;

			for (coordinate of blocks) {
				if (coordinate.y == i) {
					coordinate.y = 100;
				}
				
				if (coordinate.y < i) {
					coordinate.y++;
				}
			}
		}
	}

	if (clearedLines == 1) {
		score += 100 * level;
	} else if (clearedLines == 2) {
		score += 300 * level;
	} else if (clearedLines == 3) {
		score += 500 * level;
	} else if (clearedLines == 4) {
		score += 800 * level;
	}
}

$(document).keydown(function(e) {
	const key = e.originalEvent.code;
	move(key);
});

create(3, 0, next, 1000);
showNext();