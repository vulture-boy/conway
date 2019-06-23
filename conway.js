/* Conway Machine
Based on Conway's Game of Life
Written by Tyson Moll */

////////////////// GLOBAL VARIABLES //////////////////////
{
    // Cell Properties 
    {    
        var cells = []; // Array of all cells in process
        var cellsTemp = []; // Used for storing update data (aka next generation)
        var cellSize = 15; // Cell Size (pixels)
        var deadColor; // The colour of a dead cell
        var liveColor; // The colour of a live cell
    }

    // Method Properties
    {
        var initMethod = 1; // Determines which method to use when assigning init values
        var cycleMethod = 0; // Determines which action method to apply each cycle
        var mirrorMethod = 0; // Method of symmettry
        var autoRun = true; // Whether to automatically advance the cycle
        var tick = false; // Set to true to advance by one cycle while paused
        var generations = 3; // Number of cell generations to track
        var maxCellAge = 25; // Maximum number of cell generations to track (DOM LIMIT)
        var genColMethod = 1; // Method to apply colour for generations
        var genColOptions = 2; // Total num. of options
        var autoRunTime = 0; // Last recorded cycle end time
        var autoRunTimeMax = 30; // Required difference between current time and last recorded cycle time
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
        var sliderSizeNum;
        var sliderUpdate;
        var sliderUpdateNum;
        var fieldCellAge;
        var fieldGenCol;
        var fieldMirror;
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
        UpdateAll(); // Runs all Update scripts
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

        // Cell Age
        fieldCellAge = document.getElementById('cellAge');
        fieldCellAge.value = generations;
        fieldGenCol = document.getElementById('cellAgeCol');
        fieldGenCol.value = genColMethod;

        // SFX
        fieldMirror = document.getElementById('cellMirror');
        fieldMirror.value = mirrorMethod;
        
    }

    function UpdateAll() {
        UpdateCellSize();
        UpdateDelay();
        UpdateAge();
        UpdateGenCol();
        UpdateMirror();
        GetNewColor();
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
        RunActions(); // Process Actions
        Visualize(); // Visualization
    }

    /// Determines when cycles are processed
    function RunActions() {
            
        if (autoRun || tick) {

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

            tick = false;
        }
    }
    /// Draws the cell status to the screen
    function Visualize() {
        for (var i=0; i<numCellsX; i++) {
            for (var j=0; j<numCellsY; j++) {
            
                var mirroredGrid = GridMirror(i,j); // Get symmettry viz
                var m = mirroredGrid[0]; var n = mirroredGrid[1]; // Substitution values

                noStroke();
                var c = color(0,0,0);
                // Select Color
                if (cells[m][n] == 0) { // Dead
                    c = deadColor;
                } else if (cells[m][n] == 1 && generations == 1) { // Alive
                    c = liveColor;
                } else if (cells[m][n] >= 1 && generations > 1) { // Alive, Multigenerational

                    if (genColMethod == 0) { // Brightening
                        c = color(red(liveColor) + round((255 - red(liveColor)) * cells[m][n] / generations), 
                            green(liveColor) + round((255 - green(liveColor)) * cells[m][n] / generations), 
                            blue(liveColor) + round((255 - blue(liveColor)) * cells[m][n] / generations)
                        );
                    } else if (genColMethod == 1) { // Darken Inverse
                        c = color(round(red(liveColor) * (1 - cells[m][n] / generations)), 
                            round(green(liveColor) * (1 - cells[m][n] / generations)), 
                            round(blue(liveColor) * (1 - cells[m][n] / generations))
                        );
                    } else if (genColMethod == 2) {
                        c = color(round(red(liveColor) * cells[m][n] / generations), 
                            round(green(liveColor) * cells[m][n] / generations), 
                            round(blue(liveColor) * cells[m][n] / generations)
                        );
                    }
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
                        if (cells[i+m][j+n] >= 1) {
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

                } else if (cells[i][j] >= 1) { // Living Cell
                    // Note: Cells with 2-3 living neighbours survive
                    
                    if (liveNeighbours < 2) {
                        // Cells with fewer than 2 living neighbours die
                        cellsTemp[i][j] = 0;
                    } else if (liveNeighbours > 3) {
                        // Cells with more than 3 living neighbours die
                        cellsTemp[i][j] = 0;
                    } else {
                        cellsTemp[i][j] = cells[i][j] + 1; // Cell gets older
                        cellsTemp[i][j] = Math.min(cellsTemp[i][j], generations); // Generation Cap
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

    /// Gets mirrored co-ordinates
    function GridMirror(xPoint, yPoint) {
    
        var newM = xPoint; var newN = yPoint;

        if (mirrorMethod == 1) { // Horizontal
            if (xPoint > numCellsX/2) {newM = numCellsX - xPoint;} 
        } else if (mirrorMethod == 2) { // Vertical
            if (yPoint > numCellsY/2) {newN = numCellsY - yPoint;}
        } else if (mirrorMethod == 3) { // Both
            if (xPoint > numCellsX/2) {newM = numCellsX - xPoint;} 
            if (yPoint > numCellsY/2) {newN = numCellsY - yPoint;}
        }

        return [newM, newN];
    }
}

////////////////// USER INTERACTION ELEMENTS /////////////
{
    /// Mouse Press: inverts a cell at the clicked location
    function mousePressed() {

        // Find cell position relative to mouse
        var i = floor((mouseX / windowWidth) * numCellsX);
        var j = floor((mouseY / windowHeight) * numCellsY);

        var mPoint = GridMirror(i,j);

        // Confirm Cell is within space
        if (mPoint[0] >= 0 && mPoint[0] < numCellsX && mPoint[1] >= 0 && mPoint[1] < numCellsY) {
            if (cells[mPoint[0]][mPoint[1]] == 0) {
                cells[mPoint[0]][mPoint[1]] = 1;
            } else if (cells[mPoint[0]][mPoint[1]] >= 1)  {
                cells[mPoint[0]][mPoint[1]] = 0;
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
    function Tick() {
        tick = true;
    }

    function UpdateCellSize() {
        sliderSizeNum.innerHTML = "Cell Size: " + sliderSize.value;
        if (cellSize != sliderSize.value) {  // Size Change
            cellSize = sliderSize.value
            InitializeCells();
        }
    }
    
    function UpdateDelay() {
        sliderUpdateNum.innerHTML = "Update Delay: " + sliderUpdate.value;
        if (autoRunTimeMax != sliderUpdate.value) { // Delay Change
            autoRunTimeMax = sliderUpdate.value;
            autoRunTime = millis();
        }
    }
    
    function UpdateAge() {
        fieldCellAge.value = clamp(fieldCellAge.value, 1, maxCellAge);
        generations = fieldCellAge.value;
    }
    
    function UpdateGenCol() {
        fieldGenCol.value = clamp(fieldGenCol.value, 0, genColOptions);
        genColMethod = fieldGenCol.value;
    }
    
    function UpdateMirror() {
        fieldMirror.value = clamp(fieldMirror.value, 0, 3);
        mirrorMethod = fieldMirror.value;
    }
}

////////////////// HELPERS ///////////////////////////////
{
    function clamp(value, minVal, maxVal) {
        return Math.min(Math.max(value, minVal), maxVal);
    }
}