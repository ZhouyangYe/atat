import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { vsSource, fsSource, initShaderProgram } from './shader';
import { mat3, mat4, vec3, } from "gl-matrix";

export const canvas = document.createElement('canvas');
let WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
let deltaTime = 0;
let then = 0;
let context: WebGL2RenderingContext;
let programInfo, buffers;
let infoPanel: HTMLDivElement;

// Set the drawing position to the "identity" point, which is
// the center of the scene.
const modelMatrix = mat4.create();

const viewMatrix = mat4.create();

// Create a perspective matrix, a special matrix that is
// used to simulate the distortion of perspective in a camera.
// Our field of view is 45 degrees, with a width/height
// ratio that matches the display size of the canvas
// and we only want to see objects between 0.1 units
// and 100 units away from the camera.
const projectionMatrix = mat4.create();
const fieldOfView = (75 * Math.PI) / 180; // in radians
let aspect = WIDTH / HEIGHT;
const zNear = 0.1;
const zFar = 1000.0;
// note: glmatrix.js always has the first argument
// as the destination to receive the result.
mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

const WORLD_UP = vec3.fromValues(0, 0, 1);
const UP = vec3.fromValues(0, 0, 1);
const FACING = vec3.fromValues(0, 1, 0);
const FORWARD = vec3.clone(FACING);
const RIGHT = vec3.create();
vec3.cross(RIGHT, FACING, UP);

const POSITION = vec3.fromValues(0, -50, 0);
const VELOCITY = 1 / 50;
const F = 0b000001, B = 0b000010, L = 0b000100, R = 0b001000, U = 0b010000, D = 0b100000, H = 0b000000;
let moving = H;

function initBuffers(gl: WebGL2RenderingContext) {
  const positionBuffer = initPositionBuffer(gl);
  const indexBuffer = initIndexBuffer(gl);
  const colorBuffer = initColorBuffer(gl);

  return {
    position: positionBuffer,
    index: indexBuffer,
    color: colorBuffer
  };
}

function initColorBuffer(gl: WebGL2RenderingContext) {
  const faceColors = [
    [1.0, 1.0, 1.0, 1.0], // Front face: white
    [1.0, 0.0, 0.0, 1.0], // Back face: red
    [0.0, 1.0, 0.0, 1.0], // Top face: green
    [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
    [1.0, 1.0, 0.0, 1.0], // Right face: yellow
    [1.0, 0.0, 1.0, 1.0], // Left face: purple
  ];

  // Convert the array of colors into a table for all the vertices.

  let colors: number[] = [];

  for (var j = 0; j < faceColors.length; ++j) {
    const c = faceColors[j];
    // Repeat each color four times for the four vertices of the face
    colors = colors.concat(c, c, c, c);
  }

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  return colorBuffer;
}

function initPositionBuffer(gl: WebGL2RenderingContext) {
  // Create a buffer for the square's positions.
  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the square.
  const positions = [
    // Front face
    -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
  ];

  for (let i = 0; i < positions.length; ++i) {
    positions[i] *= 32;
  }

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return positionBuffer;
}

function initIndexBuffer(gl: WebGL2RenderingContext) {
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  const indices = [
    0,
    1,
    2,
    0,
    2,
    3, // front
    4,
    5,
    6,
    4,
    6,
    7, // back
    8,
    9,
    10,
    8,
    10,
    11, // top
    12,
    13,
    14,
    12,
    14,
    15, // bottom
    16,
    17,
    18,
    16,
    18,
    19, // right
    20,
    21,
    22,
    20,
    22,
    23, // left
  ];

  // Now send the element array to GL

  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW,
  );

  return indexBuffer;
}


function drawScene(gl: WebGL2RenderingContext, programInfo, buffers) {
  {
    const applyVelocity = (v: vec3) => {
      return vec3.scale(vec3.create(), v, VELOCITY * deltaTime);
    }
    if (moving & F)
      vec3.add(POSITION, POSITION, applyVelocity(FORWARD));
    if (moving & B)
      vec3.subtract(POSITION, POSITION, applyVelocity(FORWARD));
    if (moving & L)
      vec3.subtract(POSITION, POSITION, applyVelocity(RIGHT));
    if (moving & R)
      vec3.add(POSITION, POSITION, applyVelocity(RIGHT));
    if (moving & U)
      vec3.add(POSITION, POSITION, applyVelocity(WORLD_UP));
    if (moving & D)
      vec3.subtract(POSITION, POSITION, applyVelocity(WORLD_UP));
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  setPositionAttribute(gl, buffers, programInfo);
  setColorAttribute(gl, buffers, programInfo);
  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index);

  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program);

  mat4.lookAt(viewMatrix, POSITION, vec3.add(vec3.create(), POSITION, FACING), UP);

  gl.uniform3fv(programInfo.uniformLocations["eye_pos"], POSITION);
  // Set the shader uniforms
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.viewMatrix,
    false,
    viewMatrix,
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelMatrix,
    false,
    modelMatrix
  );

  {
    const vertexCount = 36;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }
}

// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
function setPositionAttribute(gl: WebGL2RenderingContext, buffers, programInfo) {
  const numComponents = 3;
  const type = gl.FLOAT; // the data in the buffer is 32bit floats
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set of values to the next
  // 0 = use type and numComponents above
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

// Tell WebGL how to pull out the colors from the color buffer
// into the vertexColor attribute.
function setColorAttribute(gl: WebGL2RenderingContext, buffers, programInfo) {
  const numComponents = 4;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexColor,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}

function createAndSend3DTextureToGpu(gl: WebGL2RenderingContext) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_3D, texture);

  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  // Assuming data is a typed array containing texture data
  const width = 64; // Replace with your desired width
  const height = 64; // Replace with your desired height
  const depth = 64; // Replace with your desired depth
  const data = new Uint8Array(width * height * depth * 4);

  for (let z = 0; z < depth; z++) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Calculate texture value based on procedural generation algorithms
        const value = Math.round(Math.random());
        const offset = (z * width * height + y * width + x) * 4;
        data[offset] = 0; // Red channel
        data[offset + 1] = 0; // Green channel
        data[offset + 2] = 0; // Blue channel
        data[offset + 3] = 255 * value; // Alpha channel (set to 255 for opaque texture)
      }
    }
  }

  gl.texImage3D(
    gl.TEXTURE_3D,
    0, // level
    gl.RGBA, // internalFormat
    width,
    height,
    depth,
    0, // border
    gl.RGBA, // format
    gl.UNSIGNED_BYTE, // type
    data // your texture data (e.g., a typed array)
  );
}

export const init = () => {
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  context = canvas.getContext("webgl2");
  infoPanel = document.getElementById("info");

  if (context === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  const shaderProgram = initShaderProgram(context, vsSource, fsSource);
  if (!shaderProgram) {
    return;
  }

  programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: 0,
      vertexColor: 1,
    },
    uniformLocations: {
      projectionMatrix: context.getUniformLocation(shaderProgram, "uProjectionMatrix"),
      viewMatrix: context.getUniformLocation(shaderProgram, "uViewMatrix"),
      modelMatrix: context.getUniformLocation(shaderProgram, "uModelMatrix"),
      eye_pos: context.getUniformLocation(shaderProgram, "eye_pos"),
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  buffers = initBuffers(context);
  createAndSend3DTextureToGpu(context);

  const handleMove = (e: KeyboardEvent) => {
    switch (e.key) {
      case "w":
        moving |= F;
        break;
      case "s":
        moving |= B;
        break;
      case "a":
        moving |= L;
        break;
      case "d":
        moving |= R;
        break;
      case " ":
        moving |= U;
        break;
      case "z":
        moving |= D;
        break;
      default:
        break;
    }
  };
  window.addEventListener("keydown", handleMove, false);
  const handleStop = (e: KeyboardEvent) => {
    switch (e.key) {
      case "w":
        moving &= ~F;
        break;
      case "s":
        moving &= ~B;
        break;
      case "a":
        moving &= ~L;
        break;
      case "d":
        moving &= ~R;
        break;
      case " ":
        moving &= ~U;
        break;
      case "z":
        moving &= ~D;
        break;
      default:
        break;
    }
  }
  window.addEventListener("keyup", handleStop, false);

  const handleMouseMove = (e: MouseEvent) => {
    const dx = -e.movementX / Math.PI / 2000 * deltaTime, dy = -e.movementY / Math.PI / 2000 * deltaTime;
    let rotate = mat4.create();
    mat4.rotate(rotate, rotate, dx, WORLD_UP);
    mat4.rotate(rotate, rotate, dy, RIGHT);
    vec3.transformMat4(FACING, FACING, rotate);
    rotate = mat4.create();
    mat4.rotate(rotate, rotate, dx, WORLD_UP);
    vec3.transformMat4(RIGHT, RIGHT, rotate);
    vec3.cross(UP, RIGHT, FACING);
    vec3.normalize(FORWARD, vec3.fromValues(FACING[0], FACING[1], 0));
    vec3.normalize(UP, UP);
  };
  const handleMouseDown = () => {
    window.addEventListener("mousemove", handleMouseMove, false);
  };
  const handleMouseUp = () => {
    window.removeEventListener("mousemove", handleMouseMove, false);
  };
  window.addEventListener("mousedown", handleMouseDown, false);
  window.addEventListener("mouseup", handleMouseUp, false);

  const handleResize = () => {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    aspect = WIDTH / HEIGHT;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    context.viewport(0, 0, WIDTH, HEIGHT);
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
  }
  window.addEventListener("resize", handleResize, false);

  return () => {
    window.removeEventListener("keydown", handleMove, false);
    window.removeEventListener("keyup", handleStop, false);
    window.removeEventListener("mousemove", handleMouseMove, false);
    window.removeEventListener("mousedown", handleMouseDown, false);
    window.removeEventListener("mouseup", handleMouseUp, false);
    window.removeEventListener("resize", handleResize, false);
  };
};

export const render = (now: number) => {
  deltaTime = now - then;
  then = now;
  infoPanel.innerHTML = Math.round(1000 / deltaTime).toFixed();

  drawScene(context!, programInfo, buffers);
};
