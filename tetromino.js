class Tetromino {
	constructor(x, y, type) {
		this.x = x;
		this.y = y;
		this.block = JSON.parse(JSON.stringify(tetrominoArray[type]));
	}
}

const tetrominoArray = [
	{
		id: 0,
		name: "I",
		color: "lightblue",
		coordinates: [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 3, y: 0 }
		]
	},

	{
		id: 1,
		name: "O",
		color: "gold",
		coordinates: [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 }
		]
	},

	{
		id: 2,
		name: "T",
		color: "purple",
		coordinates: [
			{ x: 1, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: 2, y: 1 }
		]
	},

	{
		id: 3,
		name: "S",
		color: "green",
		coordinates: [
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 }
		]
	},

	{
		id: 4,
		name: "Z",
		color: "red",
		coordinates: [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 1, y: 1 },
			{ x: 2, y: 1 }
		]
	},

	{
		id: 5,
		name: "J",
		color: "blue",
		coordinates: [
			{ x: 0, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: 2, y: 1 }
		]
	},

	{
		id: 6,
		name: "L",
		color: "orange",
		coordinates: [
			{ x: 2, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: 2, y: 1 }
		]
	}
];