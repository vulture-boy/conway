
// Globals
var cells = [];
var cellsTemp = []; // Used for storing update data
var cellSize = 5; // Cell Size (pixels)
var sliderSize;
var initMethod = 1; // Determines which method to use when assigning init values
var cycleMethod = 0; // Determines which action method to apply each cycle
var autoRun = true;
var autoRunTime = 0;
var autoRunTimeMax = 400; // milliseconds
var extentsX; // Changes the size of the canvas
var extentsY;
var options; // Holds all sliders and buttons for controls

// Initialization
function setup() {

    // Prepare Canvas
    extentsX = windowWidth; 
    extentsY = windowHeight;
    var cnv = createCanvas(extentsX, extentsY);
    cnv.position(0, 0);
    cnv.parent('canvas');
    cnv.style('z-index','-1'); // Canvas as background element

    options = document.getElementById('options');

    // Prepare Sliders
    sliderSize = document.getElementById('cellSize');
    sliderSizeNum = document.getElementById('cellSizeValue');
    sliderSize.value = cellSize;
    sliderSize.min = 1;
    sliderSize.max = 100;

    sliderUpdate = document.getElementById('updateSpeed');
    sliderUpdateNum = document.getElementById('updateSpeedValue');
    sliderUpdate.value = autoRunTimeMax;
    sliderUpdate.min = 1;
    sliderUpdate.max = 750;

    // Setup Cells
    InitializeCells();
}

// Called once every frame
function draw() {

    CheckData(); // Check Data
    RunActions(); // Action
    Visualize(); // Visualization

}

function CheckData() {

    // Update Slider Numbers
    sliderSizeNum.innerHTML = "Cell Size: " + sliderSize.value;
    sliderUpdateNum.innerHTML = "Update Speed: " + sliderUpdate.value;

    var triggerReset = false;
    if (cellSize != sliderSize.value) {
        cellSize = sliderSize.value
        triggerReset = true;
    }
    if (autoRunTimeMax != sliderUpdate.value) {
        autoRunTimeMax = sliderUpdate.value;
        autoRunTime = millis();
    }

    if (triggerReset) {
        InitializeCells();
    }
}

function RunActions() {
        
    if (autoRun) {

        // Check if dx time exceeds wait time
        if (autoRunTimeMax < millis() - autoRunTime) {
            switch (cycleMethod) {
                case 0:
                default:
                    CycleConway();
                break;
            }

            autoRunTime = millis(); // Reset the timer
        }
    }
}

function mouseReleased() {

    // Change cell at position
    var cellX = floor((mouseX / windowWidth) * numCellsX);
    console.log(cellX);
    var cellY = floor((mouseY / windowHeight) * numCellsY);

    if (cellX >= 0 && cellX < numCellsX && cellY >= 0 && cellY < numCellsY)
    if (cells[cellX][cellY] == 0) {
        cells[cellX][cellY] = 1;
    } else if (cells[cellX][cellY] == 1)  {
        cells[cellX][cellY] = 0;
    }

}

function CycleConway() {

    // Iterate through all cells and determine the next generation
    for (var i=0; i<numCellsX; i++) {
        for (var j=0; j<numCellsY; j++) {
            var liveNeighbours = 0;

            // Determine Status of Neighbours
            for (var m = -1; m<2; m++) {
                for (var n = -1; n<2; n++) {

                    // Skip if outside cell region or at cells[0][0]
                    if (m+ i < 0 || n + j < 0 || 
                        m + i >= numCellsX || n + j >= numCellsY
                        || m == 0 && n == 0) {
                        continue;
                    }

                    // Is this valid cell dead or alive?
                    if (cells[i+m][j+n] == 1) {
                        liveNeighbours++;
                    }
                }
            }

            if (cells[i][j] == 0) { // Dead Cell
                // Dead cells with >3 living neighbours become Live
                if (liveNeighbours > 3) {
                    cellsTemp[i][j] = 1;
                } else {
                    cellsTemp[i][j] = 0;
                }

            } else if (cells[i][j] == 1) { // Living Cell
                // Note: Cells with 2-3 living neighbours survive
                
                if (liveNeighbours < 2) {
                    // Cells with fewer than 2 living neighbours die
                    cellsTemp[i][j] = 0;
                } else if (liveNeighbours > 3) {
                    // Cells with more than 3 living neighbours die
                    cellsTemp[i][j] = 0;
                } else {
                    cellsTemp[i][j] = 1;
                }
            }
            
            
            
        }
    }

    // Apply the new generation to the existing generation
    for (var i=0; i<numCellsX; i++) {
        for (var j=0; j<numCellsY; j++) {
            cells[i][j] = cellsTemp[i][j];
            cellsTemp[i][j] = 0;
        }
    }
}

function Visualize() {
    for (var i=0; i<numCellsX; i++) {
        for (var j=0; j<numCellsY; j++) {
        
            noStroke();
            var c = color(0,0,0);
            // Select Color
            if (cells[i][j] == 0) { // Dead
                c = color(181, 224, 190);
            } else if (cells[i][j] == 1) { // Alive
                c = color(104,163,116);
            } else {
                c = color(0,0,0);
            }
            fill(c);

            // Draw Cell
            square(round(i * cellSize), round(j *cellSize), cellSize)
        }
    }
}

/// Sets up the cells used in the application
function InitializeCells() {

    cells = []; // Stores Cell States
    // Determine the number of cells to create based on screen proportions
    numCellsX = floor(extentsX / cellSize); 
    numCellsY = floor(extentsY/ cellSize);

    // Build the array of cells
    for (var i=0; i<numCellsX; i++) {

        cells[i] = [];
        cellsTemp[i] = [];
        for (var j=0; j<numCellsY; j++) {

            switch (initMethod) {
                case 1: // Random
                    cells[i][j] = round(random())
                break;

                case 0: // Blank
                default:
                    cells[i][j] = 0;
                break;
            }

            cellsTemp[i][j] = 0; // Preparing a temp array
        }
    }
}

/// Toggles visibility of options menu
function OptionToggle() {
    optToggle = document.getElementById("optToggle");

    if (options.style.display === "none") {
        options.style.display = "block";
        optToggle.innerHTML = "Hide Options"
    } else {
        options.style.display = "none";
        optToggle.innerHTML = "Show Options"
    }
}
