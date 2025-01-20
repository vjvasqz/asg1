// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    //gl_PointSize = 10.0;
    gl_PointSize = u_Size;
  }`

// Fragment shader program
var FSHADER_SOURCE =`
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});

  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}


function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_Size
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}
//Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

//Global UI elements
let g_selectedColor = [1.0,1.0,1.0,1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedSegments = 25;

//13. Awesomeness!
let g_rainbowMode = false;
let g_colorIndex = 0;


//13. Awesomeness! The rainbow colors
const rainbowColors = [
  [1.0, 0.0, 0.0, 1.0],  // Red
  [1.0, 0.5, 0.0, 1.0],  // Orange
  [1.0, 1.0, 0.0, 1.0],  // Yellow
  [0.0, 1.0, 0.0, 1.0],  // Green
  [0.0, 0.0, 1.0, 1.0],  // Blue
  [0.5, 0.0, 1.0, 1.0]   // Purple
];

//Set up actions for the HTML UI elements
function addActionsForHtmlUI(){
  //Clear Button
  document.getElementById('clear').onclick = function() {g_shapesList=[]; renderAllShapes(); };

  // Add this to your HTML button handlers in addActionsForHtmlUI()
  document.getElementById('painting').onclick = drawWave;

  //Switch Buttons
  document.getElementById('square').onclick = function() {g_selectedType = POINT };
  document.getElementById('triangle').onclick = function() {g_selectedType = TRIANGLE };
  document.getElementById('circle').onclick = function() {g_selectedType = CIRCLE };

  //For Sliders
  document.getElementById('redSlider').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100; });
  document.getElementById('greenSlider').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100; });
  document.getElementById('blueSlider').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/100; });
  
  document.getElementById('sizeSlider').addEventListener('mouseup', function() { g_selectedSize = this.value; });
  document.getElementById('circleSlider').addEventListener('mouseup', function() { g_selectedSegments = this.value; });

  // 13. Awesomeness! rainbow mode checkbox
  document.getElementById('rainbow').onchange = function() { g_rainbowMode = this.checked; };

}



function main() {
  setupWebGL();

  connectVariablesToGLSL();

  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) {if(ev.buttons == 1) { click(ev) } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}


var g_shapesList = [];

function click(ev) {
  let [x,y] = convertCoordinatesEventToGL(ev);
  
  // 13. Awesomeness! Make sure that switch back and forth works
  let currentColor;
  if (g_rainbowMode) {
      currentColor = rainbowColors[g_colorIndex].slice();
      g_colorIndex = (g_colorIndex + 1) % rainbowColors.length;
  } else {
      currentColor = g_selectedColor.slice();
  }

  let point;
  if(g_selectedType==POINT) {
      point = new Point();
  } else if (g_selectedType == TRIANGLE){
      point = new Triangle();
  } else {
      point = new Circle();
      point.segments = g_selectedSegments;
  }
  point.position = [x,y];
  point.color = currentColor;  // 13. Awesomeness! Use the user choosen color
  point.size = g_selectedSize;
  g_shapesList.push(point);

  renderAllShapes();
}


//Extract the event click and return it in WebGL coordinates
function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}



function renderAllShapes(){

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }
}

