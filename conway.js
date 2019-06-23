/* Conway Machine
Based on Conway's Game of Life
Written by Tyson Moll */

////////////////// GLOBAL VARIABLES //////////////////////
{
    // Cell Properties 
    {    
        var cells = []; // Array of all cells in process
        var cellsTemp = []; // Used for storing update data (aka next generation)
        var cellSize = 5; // Cell Size (pixels)
        var deadColor; // The colour of a dead cell
        var liveColor; // The colour of a live cell
    }

    // Method Properties
    {
        var initMethod = 1; // Determines which method to use when assigning init values
        var cycleMethod = 0; // Determines which action method to apply each cycle
        var autoRun = true; // Whether to automatically advance the cycle
        var autoRunTime = 0; // Last recorded cycle end time
        var autoRunTimeMax = 60; // Required difference between current time and last recorded cycle time
    }

    // Canvas Properties
    {
        var extentsX; // Determines the size of the canvas
        var extentsY;
    }

    // DOM References
    {
        var options; // DOM div holding all sliders and buttons for controls
        var sliderSize; // Slider reference for 
        var fieldColDead = []; // numeric DOM fields for dead cell colours
        var fieldColLive = []; // numeric DOM fields for live cell colours
    }
}

////////////////// SETUP METHODS /////////////////////////
{
    // Initialization
    function setup() {
        CanvasPrep(); // Prepare Canvas
        DOMPrep(); // Prepare Option DOMs
        InitializeCells(); // Setup Cells
    }
    /// Setup for Canvas elements
    function CanvasPrep() {
        extentsX = windowWidth; 
        extentsY = windowHeight;
        var cnv = createCanvas(extentsX, extentsY);
        cnv.position(0, 0);
        cnv.parent('canvas');
        cnv.style('z-index','-1'); // Canvas as background element
    }
    /// Setup for DOM elements
    function DOMPrep() {

        options = document.getElementById('options');

        // Size Slider
        sliderSize = document.getElementById('cellSize');
        sliderSizeNum = document.getElementById('cellSizeValue');
        sliderSize.value = cellSize;
        sliderSize.min = 1;
        sliderSize.max = 100;

        // Update Slider
        sliderUpdate = document.getElementById('updateSpeed');
        sliderUpdateNum = document.getElementById('updateSpeedValue');
        sliderUpdate.value = autoRunTimeMax;
        sliderUpdate.min = 1;
        sliderUpdate.max = 750;

        // Live / Dead Colors
        fieldColLive = [document.getElementById('colLiveR'), document.getElementById('colLiveG'), document.getElementById('colLiveB')];
        fieldColDead = [document.getElementById('colDeadR'), document.getElementById('colDeadG'), document.getElementById('colDeadB')];
        RandomizeColors();
        
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
}

////////////////// RUNTIME METHODS ///////////////////////
{
    /// Main Loop
    function draw() {
        CheckData(); // Check Option Data
        RunActions(); // Process Actions
        Visualize(); // Visualization
    }
    /// Reads the current status of DOM inputs
    function CheckData() {

        // Update Slider Numbers
        sliderSizeNum.innerHTML = "Cell Size: " + sliderSize.value;
        sliderUpdateNum.innerHTML = "Update Delay: " + sliderUpdate.value;

        var triggerReset = false; // Flag to refresh cell status
        if (cellSize != sliderSize.value) { 
            cellSize = sliderSize.value
            triggerReset = true;
        }
        if (autoRunTimeMax != sliderUpdate.value) {
            autoRunTimeMax = sliderUpdate.value;
            autoRunTime = millis();
        }
        GetNewColor();

        if (triggerReset) {
            InitializeCells();
        }
    }
    /// Determines when cycles are processed
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
    /// Draws the cell status to the screen
    function Visualize() {
        for (var i=0; i<numCellsX; i++) {
            for (var j=0; j<numCellsY; j++) {
            
                noStroke();
                var c = color(0,0,0);
                // Select Color
                if (cells[i][j] == 0) { // Dead
                    c = deadColor;
                } else if (cells[i][j] == 1) { // Alive
                    c = liveColor;
                } else {
                    c = color(0,0,0);
                }
                fill(c);

                // Draw Cell
                square(round(i * cellSize), round(j *cellSize), cellSize)
            }
        }
    }
}

////////////////// CYCLE ALGORITHMS //////////////////////
{
    /// The standard Conway cycle, applied to the cells array
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
                    // Dead cells with exactly 3 living neighbours become Live
                    if (liveNeighbours == 3) {
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
}

////////////////// USER INTERACTION ELEMENTS /////////////
{
    /// Mouse Press: inverts a cell at the clicked location
    function mousePressed() {

        // Find cell position relative to mouse
        var cellX = floor((mouseX / windowWidth) * numCellsX);
        var cellY = floor((mouseY / windowHeight) * numCellsY);

        // Confirm Cell is within space
        if (cellX >= 0 && cellX < numCellsX && cellY >= 0 && cellY < numCellsY) {
            if (cells[cellX][cellY] == 0) {
                cells[cellX][cellY] = 1;
            } else if (cells[cellX][cellY] == 1)  {
                cells[cellX][cellY] = 0;
            }
        }

    }
    /// Toggles visibility of options menu
    function PauseToggle() {
        optToggle = document.getElementById("pseToggle");

        if (autoRun) {
            optToggle.innerHTML = "Play";
        } else {
            optToggle.innerHTML = "Pause";
        }

        autoRun = !autoRun;
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
    /// Reads DOM to retrieve new colour values
    function GetNewColor() {
        // Clamp values first...
        for (var i=0; i<2; i++) {
            fieldColDead[i].value = clamp(fieldColDead[i].value, 0,255);
            fieldColLive[i].value = clamp(fieldColLive[i].value, 0,255);
        }

        CreateColors();
    }
    /// Randomizes Colors
    function RandomizeColors() {
        for (var i=0; i<2; i++) {
            fieldColDead[i].value = round(random() * 255);
            fieldColLive[i].value = round(random() * 255);
        }

        CreateColors();
    }
    /// Creates colors with DOM values
    function CreateColors() {
        liveColor = color(fieldColLive[0].value, fieldColLive[1].value, fieldColLive[2].value);
        deadColor = color(fieldColDead[0].value, fieldColDead[1].value, fieldColDead[2].value);
    }
    /// Refreshes window when resized
    function windowResized() {
        extentsX = windowWidth;
        extentsY = windowHeight;
        resizeCanvas(extentsX, extentsY);
        InitializeCells(); // Refresh cell drawing
    }
}

////////////////// HELPERS ///////////////////////////////
{
    function clamp(value, minVal, maxVal) {
        return Math.min(Math.max(value, minVal), maxVal);
    }
}