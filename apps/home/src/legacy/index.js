// ColoredCube.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'attribute vec4 a_Normal;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'uniform mat4 u_MdlMatrix;\n' +
  'uniform mat4 u_NMdlMatrix;\n' +
  'uniform float u_NormalDirection;\n' +
  'varying vec4 v_Color;\n' +
  'varying vec4 v_Position;\n' +
  'varying vec4 v_Normal;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * u_MdlMatrix * a_Position;\n' +
  '  v_Color = a_Color;\n' +
  '  v_Position = u_MdlMatrix * a_Position;\n' +
  '  v_Normal = u_NormalDirection * u_NMdlMatrix *a_Normal;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'varying vec4 v_Position;\n' +
  'varying vec4 v_Normal;\n' +
  'uniform vec4 u_Ambient;\n' +
  'uniform vec4 u_Diffuse;\n' +
  'uniform vec4 u_Specular;\n' +
  'uniform vec4 u_LightLocation;\n' +
  'uniform vec4 u_Eye;\n' +
  'void main() {\n' +
  '  float nDotL = max(0.0, dot(normalize(v_Normal), normalize(u_LightLocation-v_Position)));\n' +
  '  float hDotL = max(0.0, dot(normalize(v_Normal), normalize(normalize(u_LightLocation-v_Position)+normalize(u_Eye-v_Position))));\n' +
  '  gl_FragColor = v_Color*u_Ambient + v_Color*u_Diffuse*nDotL + v_Color*u_Specular*pow(hDotL, 256.0);\n' +
  '}\n';

// Star vertex shader
var STAR_VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  '  gl_PointSize = 2.0;\n' +
  '}\n';

// Star fragment shader
var STAR_FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform vec4 color;\n' +
  'void main() {\n' +
  '  gl_FragColor = color;\n' +
  '}\n';

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');
  var hud = document.getElementById('hud');
  if (!canvas || !hud) {
    console.log('Failed to get HTML elements');
    return false;
  }

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);

  var ctx = hud.getContext('2d');
  if (!gl || !ctx) {
    console.log('Failed to get rendering context');
    return;
  }

  // Initialize shaders
  /*if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }*/

  var roomProgram = createProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  var starProgram = createProgram(gl, STAR_VSHADER_SOURCE, STAR_FSHADER_SOURCE);
  if (!roomProgram || !starProgram) {
    console.log('Failed to intialize shaders.');
    return;
  }

  starProgram.a_Position = gl.getAttribLocation(starProgram, 'a_Position');
  starProgram.a_Color = gl.getAttribLocation(starProgram, 'a_Position');
  starProgram.u_MvpMatrix = gl.getUniformLocation(starProgram, 'u_MvpMatrix');
  if (starProgram.a_Position < 0 || starProgram.a_Color < 0 || starProgram.u_MvpMatrix < 0) {
    'Failed to get the storage location of attribute or uniform variable'
  }

  // Set the clear color and enable the depth test
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Get the storage location of u_MvpMatrix
  var u_MvpMatrix = gl.getUniformLocation(roomProgram, 'u_MvpMatrix');
  if (!u_MvpMatrix) {
    console.log('Failed to get the storage location of u_MvpMatrix');
    return;
  }

  // Get the storage location of u_MdlMatrix
  var u_MdlMatrix = gl.getUniformLocation(roomProgram, 'u_MdlMatrix');
  if (!u_MdlMatrix) {
    console.log('Failed to get the storage location of u_MdlMatrix');
    return;
  }

  // Get the storage location of u_NMdlMatrix
  var u_NMdlMatrix = gl.getUniformLocation(roomProgram, 'u_NMdlMatrix');
  if (!u_NMdlMatrix) {
    console.log('Failed to get the storage location of u_NMdlMatrix');
    return;
  }

  // Set the eye point and the viewing volume
  //var EYE=new Float32Array([3+3*Math.random(), 3*Math.random(), 3+3*Math.random()]);
  var viewProjMatrix = new Matrix4();
  viewProjMatrix.setPerspective(30, 1, 1, 100);
  viewProjMatrix.lookAt(0, 0, 6, 0, 0, 0, 0, 1, 0);

  // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var mdlMatrix = new Matrix4();
  mdlMatrix.setIdentity();

  /*var r1 = Math.random()-0.5;
  var r2 = Math.random()-0.5;*/

  var currentAngle = [0.0, 0.0]; // Current rotation angle ([x-axis, y-axis] degrees)
  var bounceAngle = [0.0, 0.0, 0.0];
  var move = [0.0, 0.0];
  var bounce = [0.5, 0.5, 0.5];
  var velocityX = 0.01 + 0.05 * Math.random();
  var velocityY = 0.01 + 0.05 * Math.random();
  var velocityZ = 0.01 + 0.05 * Math.random();
  var velocity = [velocityX, velocityY, velocityZ];
  var angleVelocity = [40.0, 40.0, 40.0];
  var FPS = 0.0;//frames per second
  var dltTime = 0;

  initEventHandlers(canvas, currentAngle, move);

  var lastT = Date.now();
  var tick = function () {
    var nowT = Date.now();
    FPS = 1000 / (nowT - lastT);
    lastT = nowT;
    draw2D(ctx, FPS);
    draw(gl, dltTime, roomProgram, starProgram, u_MdlMatrix, mdlMatrix, u_NMdlMatrix, viewProjMatrix, u_MvpMatrix, move, currentAngle, bounce, velocity, bounceAngle, angleVelocity);
    requestAnimationFrame(tick, canvas);
  };
  tick();
}


var RED = new Float32Array([1, 0, 0]);
var WHITE = new Float32Array([1, 1, 1]);
var GRAY = new Float32Array([0.5, 0.5, 0.5]);
var SILVER = new Float32Array([0.75, 0.75, 0.75]);
var BLACK = new Float32Array([0.0, 0.0, 0.0]);
var BLUE = new Float32Array([0.0, 0.0, 1.0]);
var YELLOW = new Float32Array([1.0, 1.0, 0.0]);
var GREEN = new Float32Array([0.0, 1.0, 0.0]);

function getInverseTranspose(mat4) {
  m = new Matrix4();
  m.setInverseOf(mat4);
  m.transpose();
  return m;
}


function initEventHandlers(canvas, currentAngle, move) {
  var dragging = false;         // Dragging or not
  var lastX = -1, lastY = -1;   // Last position of the mouse
  //var keyPressing = false;         // Keyboard is being pressed or not

  hud.onmousedown = function (ev) {   // Mouse is pressed
    var x = ev.clientX, y = ev.clientY;
    // Start dragging if a moue is in <canvas>
    var rect = ev.target.getBoundingClientRect();
    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
      lastX = x; lastY = y;
      dragging = true;
    }
  };

  hud.onmouseup = function (ev) { dragging = false; }; // Mouse is released

  hud.onmousemove = function (ev) { // Mouse is moved
    var x = ev.clientX, y = ev.clientY;
    if (dragging) {
      var factor = 100 / canvas.height; // The rotation ratio
      var dx = factor * (x - lastX);
      var dy = factor * (y - lastY);
      // Limit x-axis rotation angle to -90 to 90 degrees
      currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy, 90.0), -90.0);
      currentAngle[1] = currentAngle[1] + dx;
    }
    lastX = x, lastY = y;
  };

  window.addEventListener("keydown", onkeydown, false);
  onkeydown = function (ev) {
    //alert(ev.keyCode);
    if (ev.keyCode == 83) {
      //alert(ev.keyCode);
      move[1] = Math.max(Math.min(move[1] + 0.01, 0.8), -0.8);
    }
    else if (ev.keyCode == 87) {
      move[1] = Math.max(Math.min(move[1] - 0.01, 0.8), -0.8);
    }
    else if (ev.keyCode == 68) {
      move[0] = Math.max(Math.min(move[0] + 0.01, 0.8), -0.8);
    }
    else if (ev.keyCode == 65) {
      move[0] = Math.max(Math.min(move[0] - 0.01, 0.8), -0.8);
    }
    else { }
  };
}


function drawRoom(gl, program, u_MdlMatrix, mdlMatrix, u_NMdlMatrix, move, bounce, bounceAngle) {

  //Walls
  gl.uniformMatrix4fv(u_MdlMatrix, false, mdlMatrix.elements);
  cubeColors = [null, null, null, RED, GRAY, RED];
  gl.uniformMatrix4fv(u_NMdlMatrix, false, getInverseTranspose(mdlMatrix).elements);
  drawCube(gl, program, cubeColors, -1);

  mdlMatrixChild = new Matrix4(mdlMatrix);
  mdlMatrixChild.translate(bounce[0], bounce[1], bounce[2]);
  mdlMatrixChild.rotate(bounceAngle[0], 1.0, 0.0, 0.0);
  mdlMatrixChild.rotate(bounceAngle[1], 0.0, 1.0, 0.0);
  mdlMatrixChild.rotate(bounceAngle[2], 0.0, 0.0, 1.0);
  mdlMatrixChild.translate(-bounce[0], -bounce[1], -bounce[2]);
  mdlMatrixChild.translate(bounce[0], bounce[1], bounce[2]);
  mdlMatrixChild.scale(0.1, 0.1, 0.1);
  gl.uniformMatrix4fv(u_MdlMatrix, false, mdlMatrixChild.elements);
  gl.uniformMatrix4fv(u_NMdlMatrix, false, getInverseTranspose(mdlMatrixChild).elements);
  cubeColors = [GREEN, GREEN, GREEN, GREEN, GREEN, GREEN];
  drawCube(gl, program, cubeColors, 1);

  //Table
  mdlMatrix.translate(move[0], -0.6, move[1]);
  drawTable(gl, program, u_MdlMatrix, mdlMatrix, u_NMdlMatrix);
}


function drawTable(gl, program, u_MdlMatrix, mdlMatrix, u_NMdlMatrix) {
  mdlMatrixChild = new Matrix4(mdlMatrix);
  mdlMatrixChild.translate(0.0, 0.2, 0.0);
  mdlMatrixChild.scale(0.02, 0.02, 0.02);
  gl.uniformMatrix4fv(u_MdlMatrix, false, mdlMatrixChild.elements);
  gl.uniformMatrix4fv(u_NMdlMatrix, false, getInverseTranspose(mdlMatrixChild).elements);
  cubeColors = [YELLOW, YELLOW, YELLOW, YELLOW, YELLOW, YELLOW];
  drawCube(gl, program, cubeColors, -1);

  mdlMatrixChild = new Matrix4(mdlMatrix);
  mdlMatrixChild.scale(0.2, 0.01, 0.2);
  gl.uniformMatrix4fv(u_MdlMatrix, false, mdlMatrixChild.elements);
  gl.uniformMatrix4fv(u_NMdlMatrix, false, getInverseTranspose(mdlMatrixChild).elements);
  cubeColors = [BLUE, BLUE, BLUE, BLUE, BLUE, BLUE];
  drawCube(gl, program, cubeColors, 1);

  mdlMatrixChild = new Matrix4(mdlMatrix);
  mdlMatrixChild.translate(0.00, -0.2, 0.0);
  mdlMatrixChild.scale(0.01, 0.2, 0.01);
  gl.uniformMatrix4fv(u_MdlMatrix, false, mdlMatrixChild.elements);
  gl.uniformMatrix4fv(u_NMdlMatrix, false, getInverseTranspose(mdlMatrixChild).elements);
  cubeColors = [BLACK, BLACK, BLACK, BLACK, BLACK, BLACK];
  drawCube(gl, program, cubeColors, 1);

  mdlMatrixChild = new Matrix4(mdlMatrix);
  mdlMatrixChild.translate(0.00, -0.4, 0.0);
  mdlMatrixChild.scale(0.1, 0.01, 0.1);
  gl.uniformMatrix4fv(u_MdlMatrix, false, mdlMatrixChild.elements);
  gl.uniformMatrix4fv(u_NMdlMatrix, false, getInverseTranspose(mdlMatrixChild).elements);
  cubeColors = [SILVER, SILVER, SILVER, SILVER, SILVER, SILVER];
  drawCube(gl, program, cubeColors, 1);
}


function drawCube(gl, program, cubeColors, normalDirection) {
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3

  var vertices = new Float32Array([   // Vertex coordinates
    1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,  // v0-v1-v2-v3 front
    1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,  // v0-v3-v4-v5 right
    1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,  // v1-v6-v7-v2 left
    -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,  // v7-v4-v3-v2 down
    1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0   // v4-v7-v6-v5 back
  ]);

  var normals = new Float32Array([   // Normal coordinates
    0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0,  // v0-v1-v2-v3 front
    1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0,  // v0-v3-v4-v5 right
    0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0,  // v0-v5-v6-v1 up
    -1.0, 0.0, 0.0, 0.0, -1.0, 0.0, 0.0, 0.0, -1.0, 0.0, 0.0, 0.0, -1.0, 0.0, 0.0, 0.0,  // v1-v6-v7-v2 left
    0.0, -1.0, 0.0, 0.0, 0.0, -1.0, 0.0, 0.0, 0.0, -1.0, 0.0, 0.0, 0.0, -1.0, 0.0, 0.0,  // v7-v4-v3-v2 down
    0.0, 0.0, -1.0, 0.0, 0.0, 0.0, -1.0, 0.0, 0.0, 0.0, -1.0, 0.0, 0.0, 0.0, -1.0, 0.0  // v4-v7-v6-v5 back
  ]);

  /*var colors = new Float32Array([     // Colors
    0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // v0-v1-v2-v3 front(blue)
    0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // v0-v3-v4-v5 right(green)
    1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // v0-v5-v6-v1 up(red)
    1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
    1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
    0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0   // v4-v7-v6-v5 back
  ]);*/

  var BLACK = new Float32Array([0.0, 0.0, 0.0]);

  var indicesTemp = [];
  var colors = new Float32Array(6 * 4 * 3);
  for (i = 0; i < 6; i++) {

    var faceColor = cubeColors[i];

    if (null != faceColor) {
      indicesTemp.push(i * 4);
      indicesTemp.push(i * 4 + 1);
      indicesTemp.push(i * 4 + 2);

      indicesTemp.push(i * 4);
      indicesTemp.push(i * 4 + 2);
      indicesTemp.push(i * 4 + 3);
    } else {
      faceColor = BLACK;
    }


    for (j = 0; j < 4; j++) {
      for (k = 0; k < 3; k++) {
        colors[k + 3 * j + 4 * 3 * i] = faceColor[k];
      }
    }
  }

  var indices = new Uint8Array(indicesTemp);

  /* var indices = new Uint8Array([       // Indices of the vertices
      0, 1, 2,   0, 2, 3,    // front
      4, 5, 6,   4, 6, 7,    // right
      8, 9,10,   8,10,11,    // up
     12,13,14,  12,14,15,    // left
     16,17,18,  16,18,19,    // down
     20,21,22,  20,22,23     // back
   ]);*/

  // Create a buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer)
    return -1;

  // Write the vertex coordinates and color to the buffer object
  if (!initArrayBuffer(gl, program, vertices, 3, gl.FLOAT, 'a_Position'))
    return -1;

  if (!initArrayBuffer(gl, program, colors, 3, gl.FLOAT, 'a_Color'))
    return -1;

  if (!initArrayBuffer(gl, program, normals, 4, gl.FLOAT, 'a_Normal'))
    return -1;

  // Write the indices to the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  // Get the storage location of u_NormalDirection
  var u_NormalDirection = gl.getUniformLocation(program, 'u_NormalDirection');
  if (!u_NormalDirection) {
    console.log('Failed to get the storage location of u_NormalDirection');
    return;
  }

  gl.uniform1f(u_NormalDirection, normalDirection);

  // Draw the cube
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
}


function initArrayBuffer(gl, program, data, num, type, attribute) {
  var buffer = gl.createBuffer();   // Create a buffer object
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}


var mvpMatrix = new Matrix4();
var modelMatrix = new Matrix4();
function draw(gl, dltTime, program, starProgram, u_MdlMatrix, mdlMatrix, u_NMdlMatrix, viewProjMatrix, u_MvpMatrix, move, currentAngle, bounce, velocity, bounceAngle, angleVelocity) {
  gl.useProgram(program);
  mvpMatrix.set(viewProjMatrix);
  mvpMatrix.rotate(currentAngle[0], 1.0, 0.0, 0.0);
  mvpMatrix.rotate(currentAngle[1], 0.0, 1.0, 0.0);
  modelMatrix.set(mdlMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
  //gl.uniformMatrix4fv(u_MdlMatrix, false, modelMatrix.elements);
  //gl.uniformMatrix4fv(u_NMdlMatrix, false, getInverseTranspose(modelMatrix).elements);
  var EYEINIT = new Object();
  EYEINIT.elements = new Float32Array([
    0, 0, 6, 1,
    0, 0, 0, 1,
    0, 0, 0, 1,
    0, 0, 0, 0
  ]);
  var eyeTransformMatrix = new Matrix4(EYEINIT);
  eyeTransformMatrix.transpose();
  eyeTransformMatrix.rotate(currentAngle[0], 1.0, 0.0, 0.0);
  eyeTransformMatrix.rotate(currentAngle[1], 0.0, 1.0, 0.0);

  //eyeTransformMatrix.concat(EYEINIT);
  var EYE = new Float32Array([eyeTransformMatrix.elements[0], eyeTransformMatrix.elements[4], eyeTransformMatrix.elements[8]]);

  for (i = 0; i < 3; i++) {
    bounce[i] = bounce[i] + velocity[i];
    //bounce[i] = 0.0;
    //bounceAngle[i] = animate(bounceAngle[i],angleVelocity[i]);
    if (bounce[i] > 0.86 || bounce[i] < -0.86) {
      document.getElementById('audiotag1').play();
      velocity[i] = -velocity[i];
      angleVelocity[0] = -360.0 * Math.random() + 360.0 * Math.random();
      angleVelocity[1] = -360.0 * Math.random() + 360.0 * Math.random();
      angleVelocity[2] = -360.0 * Math.random() + 360.0 * Math.random();
      //angleVelocity[2] = 0.0;
    }
  }

  bounceAngle = animate(bounceAngle, angleVelocity);

  setupLight(gl, program, EYE, move);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  drawRoom(gl, program, u_MdlMatrix, modelMatrix, u_NMdlMatrix, move, bounce, bounceAngle);
  drawStar(gl, starProgram, program, mvpMatrix, u_MvpMatrix);
}


function draw2D(ctx, FPS) {//draw information
  ctx.clearRect(0, 0, 400, 400); // Clear <hud>
  // Draw white letters
  ctx.font = '18px "Times New Roman"';
  ctx.fillStyle = 'rgba(255, 255, 255, 1)'; // Set white to the color of letters
  ctx.fillText('FPS: ' + Math.round(FPS * 100) / 100, 40, 380);
}


function setupLight(gl, program, EYE, move) {

  // Get the storage location of u_Ambient
  var u_Ambient = gl.getUniformLocation(program, 'u_Ambient');
  if (!u_Ambient) {
    console.log('Failed to get the storage location of u_Ambient');
    return;
  }

  // Get the storage location of u_Diffuse
  var u_Diffuse = gl.getUniformLocation(program, 'u_Diffuse');
  if (!u_Diffuse) {
    console.log('Failed to get the storage location of u_Diffuse');
    return;
  }

  // Get the storage location of u_Specular
  var u_Specular = gl.getUniformLocation(program, 'u_Specular');
  if (!u_Specular) {
    console.log('Failed to get the storage location of u_Specular');
    return;
  }

  // Get the storage location of u_LightLocation
  var u_LightLocation = gl.getUniformLocation(program, 'u_LightLocation');
  if (!u_LightLocation) {
    console.log('Failed to get the storage location of u_LightLocation');
    return;
  }

  // Get the storage location of u_Eye
  var u_Eye = gl.getUniformLocation(program, 'u_Eye');
  if (!u_Eye) {
    console.log('Failed to get the storage location of u_Eye');
    return;
  }

  gl.uniform4f(u_Ambient, 0.2, 0.2, 0.2, 1.0);

  gl.uniform4f(u_Diffuse, 0.8, 0.8, 0.8, 1.0);

  gl.uniform4f(u_Specular, 0.8, 0.8, 0.0, 0.8);

  gl.uniform4f(u_LightLocation, move[0], -0.4, move[1], 1.0);

  gl.uniform4f(u_Eye, EYE[0], EYE[1], EYE[2], 1.0);
}


var last = Date.now(); // Last time that this function was called
function animate(angle, angleVelocity) {
  var now = Date.now();   // Calculate the elapsed time
  var elapsed = now - last;
  last = now;
  var newAngle = angle;
  // Update the current rotation angle (adjusted by the elapsed time)
  for (i = 0; i < angle.length; i++) {
    newAngle[i] = (angle[i] + (angleVelocity[i] * elapsed) / 1000.0) % 360;
  }
  return newAngle;
}


var starLocation = [];
function creatArray() {
  var random = Math.floor(128 + 64 * Math.random());
  for (i = 0; i < random; i++) {
    var r1 = -2 + 4 * Math.random();
    var r2 = -2 + 4 * Math.random();
    starLocation[i] = new Float32Array([r1, r2, -3]);
  }
  return starLocation;
}


var setArray = creatArray();
function drawStar(gl, program, roomProgram, mvpMatrix, u_MvpMatrix) {
  gl.disableVertexAttribArray(gl.getAttribLocation(roomProgram, 'a_Position'));
  gl.disableVertexAttribArray(gl.getAttribLocation(roomProgram, 'a_Color'));
  gl.disableVertexAttribArray(gl.getAttribLocation(roomProgram, 'a_Normal'));
  gl.useProgram(program);
  gl.uniformMatrix4fv(program.u_MvpMatrix, false, mvpMatrix.elements);
  var array = setArray;
  for (i = 0; i < array.length; i++) {
    var r1 = Math.random();
    var r2 = Math.random();
    var r3 = Math.random();
    var r4 = Math.random();
    var colors = [r1, r2, r3, r4];
    drawPoints(gl, program, array[i], colors);
  }
}


function drawPoints(gl, program, array, colors) {
  var a_Position = gl.getAttribLocation(program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }
  gl.vertexAttrib3f(a_Position, array[0], array[1], array[2]);
  var color = gl.getUniformLocation(program, 'color');
  if (!color) {
    console.log('Failed to get the storage location of color');
    return;
  }
  gl.uniform4f(color, colors[0], colors[1], colors[2], colors[3]);

  gl.drawArrays(gl.POINTS, 0, 1);
}

main();
