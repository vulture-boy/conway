<!doctype html>
<html lang="en">
  <head>
    <?php include "head.php" ?>
    <script src="p5.min.js"></script>
    <script src="p5.dom.js"></script>
    <script src="conway.js"></script>

    <title>ttttttysonmmmmmmoll</title>
  </head>
  <body>

      <div id="menu">
        <h1>conway machine</h1>
        <a href="https://twitter.com/vvvultures"><i class="fab fa-twitter"></i></a>
        <a href="https://www.instagram.com/friendly_vultures/"><i class="fab fa-instagram"></i></a>
        <a href="https://rateyourmusic.com/~amosmyn"><i class="fas fa-headphones-alt"></i></a>
        <a href="https://vultures.itch.io"><i class="fab fa-itch-io"></i></a>
        <br>
        
        <a href="https://tysonmoll.ca">portfolio </a><br>
        <a href="./about.php">about this page</a><br>

        <button id="refresh" onclick="InitializeCells()">Refresh</button>
        <button id="pseToggle" onclick="PauseToggle()">Pause</button>
        <br>
        <button id="optToggle" onclick="OptionToggle()">Hide Options</button>

        <div id="options" display="block">
        <br>
          <div id="cellSizeValue">Cell Size: 5</div>
          <input type="range" min="1" max="128" value="5" class="slider" id="cellSize">
          <div id="updateSpeedValue">Update Delay: 500</div>
          <input type="range" min="1" max="3000" value="500" class="slider" id="updateSpeed">
          <span max-size="50%"><p>Note: update delay (in millis)<br> is dependent on PC processing power.</p></span>

          Live Cell Color
          <input type="number" min="0" max="255" value="0" class="rgb" id="colLiveR">
          <input type="number" min="0" max="255" value="128" class="rgb" id="colLiveG">
          <input type="number" min="0" max="255" value="64" class="rgb" id="colLiveB"> <br>

          Dead Cell Color
          <input type="number" min="0" max="255" value="12" class="rgb" id="colDeadR">
          <input type="number" min="0" max="255" value="168" class="rgb" id="colDeadG">
          <input type="number" min="0" max="255" value="88" class="rgb" id="colDeadB"> <br>

        </div>
      </div>

      <div id="canvas"></div>
  </body></html>