const canvas = document.getElementById("GameDisplay");
const gl = canvas.getContext("webgl");

if (!gl) {
  console.error("Unable to initialize WebGL. Your browser may not support it.");
}

// Function to return the vertex shader source code
function getVertexShaderSource() {
  return `
    attribute vec4 aVertexPosition;
    void main(void) {
      gl_Position = aVertexPosition;
    }
  `;
}

// Function to return the fragment shader source code
function getFragmentShaderSource() {
  return `
    precision mediump float;
    void main(void) {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `;
}

// Function to load and compile shaders
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(`Shader compilation failed: ${gl.getShaderInfoLog(shader)}`);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

// Function to initialize shaders and program
function initShaders(gl) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, getVertexShaderSource());
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, getFragmentShaderSource());

  if (!vertexShader || !fragmentShader) {
    console.error('Failed to initialize shaders.');
    return null;
  }

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(`Unable to initialize the shader program: ${gl.getProgramInfoLog(program)}`);
    return null;
  }

  gl.useProgram(program);
  return program;
}

// Function to initialize buffers
function initBuffers(gl, program) {
  const vertices = new Float32Array([
    0.0,  1.0,
   -1.0, -1.0,
    1.0, -1.0,
  ]);

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const positionAttrib = gl.getAttribLocation(program, "aVertexPosition");
  gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionAttrib);

  return vertexBuffer;
}

// Function to clear the canvas and draw the triangle
function render(gl) {
  gl.clearColor(0.9, 0.9, 0.9, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLES, 0, 3);

  requestAnimationFrame(() => render(gl));
}

// Main function to initialize everything
function main() {
  const shaderProgram = initShaders(gl);
  if (!shaderProgram) return;

  const vertexBuffer = initBuffers(gl, shaderProgram);
  if (!vertexBuffer) return;

  // Start the render loop
  render(gl);
}

// Call the main function to initialize
main();
