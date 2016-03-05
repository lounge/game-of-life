(function() {



	var generation = 0;
	var generations = 100;
	var size = 16;

	

	var minX = minY = 0;
	var maxX = maxY = size-1;

	var world = {};
	var cells = [];

	var currentGen = [];
	var nextGen = [];



	function setup() {
		world = $('section');

		$('#start').on('click', function() {
			parse();
			run();
		});

		$('#refresh').on('click', function() {
			refresh();
		});

		$('#random').on('click', function() {
			generate(false);
			run();
		});

		$('body').on('click', '.cell', function() {

			$(this).toggleClass('alive');
		});

		//generate(true);
		//render(size*size, generations);
	}

	function refresh() {
		generations = $('#generations').val();
		size = $('#size').val();

		//init();
		generate(true);
		//run();//render(size*size, 0);
	}

	function generate(clear) {
		cells = [];

		for (y = 0; y < size; y++) {
			var row = [];
			for (x = 0; x < size; x++) {
				if (clear) {
					row.push(0)
				} else {
					row.push(Math.random() > 0.8 ? 1 : 0);
				}
			}
			cells.push(row);
		}

		currentGen = nextGen = cells;

		render(size*size, 0);
	}

	function parse() {
		var rows = $('.row');
		var rowArray = [];
		for (y = 0; y < rows.length; y++) {
			var cellArray = [];
			var row = $(rows[y]);
			var cells = row.find('.cell');

			
			for (x = 0; x < size; x++) {
				var cell = $(cells[x]);
				var state = cell.hasClass('alive') ? 1 : 0;
				cellArray.push(state);
			}

			rowArray.push(cellArray);

		}

		currentGen = nextGen = rowArray;
	}


	function run() {
		

		setTimeout(function () { 

			var aliveCells = 0;

			for (y = 0; y < size; y++) {
				var row = [];
				for (x = 0; x < size; x++) {

					var startPosX = (x - 1 < minX) ? x : x-1;
					var startPosY = (y - 1 < minY) ? y : y-1;
					var endPosX =   (x + 1 > maxX) ? x : x+1;
					var endPosY =   (y + 1 > maxY) ? y : y+1;

					var cell = currentGen[y][x];
					var isAlive = cell === 1;
					var aliveNeighbours = 0;

					for (rowNum = startPosX; rowNum <= endPosX; rowNum++) {
					    for (colNum = startPosY; colNum <= endPosY; colNum++) {
					        var neighbour = currentGen[rowNum][colNum];
					        if (neighbour === 1) {
					        	aliveNeighbours++;
					        }
					    }
					}

					if (isAlive) {
						aliveCells++;
						if (aliveNeighbours > 3 || aliveNeighbours < 2) {
							cell = 0;
						}
					}
					else if (!isAlive && aliveNeighbours === 3) {
						cell = 1;
					}
					row.push(cell);
				}
				nextGen.push(row);
			}

			generation++;
			render(aliveCells, generation);
			
			if (generation < generations) {
				run();
			}
		
		}, 100);
	}

	function render(aliveCells, generation) {
		world.empty();


		for (y = 0; y < size; y++) {
			var row = $('<div class="row"></div>');
			for (x = 0; x < size; x++) {
				var life = nextGen[y][x];
				var cell = $('<span class="cell"></span>');
				cell.addClass(life === 1 ? " alive" : "" );
				row.append(cell);
			}
			world.append(row);
		}

		currentGen = nextGen;
		nextGen = [];

		var totalCells = size * size;

		$('#genCount').text("Generation: " + generation);
		$('#aliveCount').text("Alive: " + aliveCells);
		$('#deadCount').text("Dead: " + (totalCells - aliveCells));
	}

	setup();

}());