$(document).ready(() => {
  document.getElementById('size').addEventListener('input', () => setupValues());
  document.getElementById('pause').addEventListener('click', () => {
    document.querySelector('.btn > span').innerHTML = (paused) ? 'Play' : 'Pause';
    if (paused) noLoop();
    else loop();
    paused = !paused;
  });
  document.getElementById('random').addEventListener('click', () => {
    for (let i = 1; i < nCols-1; i++)
      for (let j = 1; j < nRows-1; j++)
        grid[i][j] = random() < 0.2 ? 1 : 0;
    drawing();
  });
  document.getElementById('speed').addEventListener('input', () => {
    frameRate(parseInt(document.getElementById('speed').value))
  });
});

let cellWidth, cellHeight, nCols, nRows, paused;
function setup(){
  let field = createCanvas(windowWidth * 0.7, windowWidth/2 * 0.7);
  field.mousePressed(drawCustom);
  stroke(252, 246, 255);
  frameRate(parseInt(document.getElementById('speed').value));
  setupValues();
  noLoop();
  paused = false;
  fill(149, 179, 157);
}

function windowResized(){
  resizeCanvas(windowWidth * 0.7, windowWidth/2 * 0.7);
  setupValues();
}

function mouseDragged(){
  if($('#defaultCanvas0:hover').length === 1) drawCustom();
}

function keyPressed() {                                                         // обработка нажатий клавиш
  if(keyCode === 67) newGrid();
  if(keyCode === 80) document.querySelector('.btn > span').click();
  if(keyCode === 82) document.getElementById('random').click();
  if(keyCode === 83) {
    if (!paused) draw();
  }
}

function draw(){
  grid = calculateNextGeneration();
  drawing();
}

function setupValues(){
  let multiplierWidth = pow(2, parseInt(document.getElementById('size').value));
  cellWidth = width/screen.pixelDepth/multiplierWidth;
  cellHeight = height/screen.pixelDepth/(multiplierWidth/2);
  nCols = width/cellWidth;
  nRows = height/cellHeight;
  newGrid();
}

function drawing(){
  clear();
  for (let i = 0; i < nCols; i++)                                               // отрисовка клеток
    for (let j = 0; j < nRows; j++)
      if (grid[i][j] === 1)
        rect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);
                                                                                // отрисовка бортиков с верхнего против часовой стрелки
  for (let i = 0; i < nCols; i++) rect(i * cellWidth, 0, cellWidth, cellHeight);
  for (let i = 0; i < nRows; i++) rect(0, i * cellHeight, cellWidth, cellHeight);
  for (let i = 0; i < nCols; i++) rect(i * cellWidth, (nRows - 1) * cellHeight, cellWidth, cellHeight);
  for (let i = 0; i < nRows; i++) rect((nCols - 1) * cellWidth, i * cellHeight, cellWidth, cellHeight);
}

function newGrid(){
  grid = createGrid();
  drawing();
}

function drawCustom(){
  let cellX = round((mouseX - (mouseX % cellWidth))/cellWidth);
  let cellY = round((mouseY - (mouseY % cellHeight))/cellHeight);
  if(mouseButton === 'left') grid[cellX][cellY] = 1;
  else if(mouseButton === 'right') grid[cellX][cellY] = 0;
  drawing();
}

function createGrid() {
  let newGrid = new Array(nCols);
  for (let i = 0; i < nCols; i++) newGrid[i] = new Array(nRows);
  for (let i = 0; i < nCols; i++)
    for (let j = 0; j < nRows; j++) newGrid[i][j] = 0;
  return newGrid;
}

function calculateNextGeneration() {
  let nextGrid = createGrid();
  for (let i = 1; i < nCols - 1; i++)
    for (let j = 1; j < nRows - 1; j++) {
      let actualCell = grid[i][j];
      let neighbors = 0;

      for (let x = -1; x <= 1; x++)
        for (let y = -1; y <= 1; y++)
          if (!(x === 0 && y === 0))
            neighbors += grid[(x + i + nCols) % nCols][(y + j + nRows) % nRows];

      if ((neighbors < 2 || neighbors > 3) && actualCell === 1) nextGrid[i][j] = 0;
      else if (neighbors === 3 && actualCell === 0) nextGrid[i][j] = 1;
      else nextGrid[i][j] = actualCell;
    }
  return nextGrid;
}
