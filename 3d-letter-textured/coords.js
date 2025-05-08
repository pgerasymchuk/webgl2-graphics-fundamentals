export { vertices, normals, indices };

const colors = {
    'red': [1.0, 0.0, 0.0],
    'green': [0.0, 1.0, 0.0],
    'blue': [0.0, 0.0, 1.0],
    'yellow': [1.0, 1.0, 0.0],
    'cyan': [0.0, 1.0, 1.0],
    'magenta': [1.0, 0.0, 1.0],
};

const vertices = new Float32Array([
    // Vertical part
    // Front face
    -0.3, -0.5, 0.3,  ...colors['red'],     0.0, 0.0,  // bottom-left
    0.0,  -0.5, 0.3,  ...colors['red'],     1.0, 0.0,  // bottom-right
    0.0,  0.5,  0.3,  ...colors['red'],     1.0, 1.0,  // top-right
    -0.3, 0.5,  0.3,  ...colors['red'],     0.0, 1.0,  // top-left
    // Back face
    -0.3, -0.5, 0.0,  ...colors['green'],   0.0, 0.0,
    0.0,  -0.5, 0.0,  ...colors['green'],   1.0, 0.0,
    0.0,  0.5,  0.0,  ...colors['green'],   1.0, 1.0,
    -0.3, 0.5,  0.0,  ...colors['green'],   0.0, 1.0,
    // Top face
    -0.3, 0.5,  0.0,  ...colors['blue'],    0.0, 0.0,
    0.0,  0.5,  0.0,  ...colors['blue'],    1.0, 0.0,
    0.0,  0.5,  0.3,  ...colors['blue'],    1.0, 1.0,
    -0.3, 0.5,  0.3,  ...colors['blue'],    0.0, 1.0,
    // Bottom face
    -0.3, -0.5, 0.0,  ...colors['yellow'],  0.0, 0.0,
    0.0,  -0.5, 0.0,  ...colors['yellow'],  1.0, 0.0,
    0.0,  -0.5, 0.3,  ...colors['yellow'],  1.0, 1.0,
    -0.3, -0.5, 0.3,  ...colors['yellow'],  0.0, 1.0,
    // Right face
    0.0,  -0.5, 0.0,  ...colors['cyan'],    0.0, 0.0,
    0.0,  0.5,  0.0,  ...colors['cyan'],    1.0, 0.0,
    0.0,  0.5,  0.3,  ...colors['cyan'],    1.0, 1.0,
    0.0,  -0.5, 0.3,  ...colors['cyan'],    0.0, 1.0,
    // Left face
    -0.3, -0.5, 0.0,  ...colors['magenta'], 0.0, 0.0,
    -0.3, 0.5,  0.0,  ...colors['magenta'], 1.0, 0.0,
    -0.3, 0.5,  0.3,  ...colors['magenta'], 1.0, 1.0,
    -0.3, -0.5, 0.3,  ...colors['magenta'], 0.0, 1.0,

    // Horizontal part
    // Front face
    0.0,  0.2,  0.3,  ...colors['red'],     0.0, 0.0,
    0.5,  0.2,  0.3,  ...colors['red'],     1.0, 0.0,
    0.5,  0.5,  0.3,  ...colors['red'],     1.0, 1.0,
    0.0,  0.5,  0.3,  ...colors['red'],     0.0, 1.0,
    // Back face
    0.0,  0.2,  0.0,  ...colors['green'],   0.0, 0.0,
    0.5,  0.2,  0.0,  ...colors['green'],   1.0, 0.0,
    0.5,  0.5,  0.0,  ...colors['green'],   1.0, 1.0,
    0.0,  0.5,  0.0,  ...colors['green'],   0.0, 1.0,
    // Top face
    0.0,  0.5,  0.0,  ...colors['blue'],    0.0, 0.0,
    0.5,  0.5,  0.0,  ...colors['blue'],    1.0, 0.0,
    0.5,  0.5,  0.3,  ...colors['blue'],    1.0, 1.0,
    0.0,  0.5,  0.3,  ...colors['blue'],    0.0, 1.0,
    // Bottom face
    0.0,  0.2,  0.0,  ...colors['yellow'],  0.0, 0.0,
    0.5,  0.2,  0.0,  ...colors['yellow'],  1.0, 0.0,
    0.5,  0.2,  0.3,  ...colors['yellow'],  1.0, 1.0,
    0.0,  0.2,  0.3,  ...colors['yellow'],  0.0, 1.0,
    // Right face
    0.5,  0.2,  0.0,  ...colors['cyan'],    0.0, 0.0,
    0.5,  0.5,  0.0,  ...colors['cyan'],    1.0, 0.0,
    0.5,  0.5,  0.3,  ...colors['cyan'],    1.0, 1.0,
    0.5,  0.2,  0.3,  ...colors['cyan'],    0.0, 1.0,
    // Left face
    0.0,  0.2,  0.0,  ...colors['magenta'], 0.0, 0.0,
    0.0,  0.5,  0.0,  ...colors['magenta'], 1.0, 0.0,
    0.0,  0.5,  0.3,  ...colors['magenta'], 1.0, 1.0,
    0.0,  0.2,  0.3,  ...colors['magenta'], 0.0, 1.0,
]);

const normals = new Float32Array([
    // Vertical part
    // Front face
    0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,
    // Back face
    0.0, 0.0, -1.0,  0.0, 0.0, -1.0,  0.0, 0.0, -1.0,  0.0, 0.0, -1.0,
    // Top face
    0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,
    // Bottom face
    0.0, -1.0, 0.0,  0.0, -1.0, 0.0,  0.0, -1.0, 0.0,  0.0, -1.0, 0.0,
    // Right face
    1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,
    // Left face
    -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,

    // Horizontal part
    // Front face
    0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,
    // Back face
    0.0, 0.0, -1.0,  0.0, 0.0, -1.0,  0.0, 0.0, -1.0,  0.0, 0.0, -1.0,
    // Top face
    0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,
    // Bottom face
    0.0, -1.0, 0.0,  0.0, -1.0, 0.0,  0.0, -1.0, 0.0,  0.0, -1.0, 0.0,
    // Right face
    1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,
    // Left face
    -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0
]);

const indices = new Uint16Array([
    // Vertical part
    0,  1,  2,   0,  2,  3,    // Front
    4,  5,  6,   4,  6,  7,    // Back
    8,  9,  10,  8,  10, 11,   // Top
    12, 13, 14,  12, 14, 15,   // Bottom
    16, 17, 18,  16, 18, 19,   // Right
    20, 21, 22,  20, 22, 23,   // Left

    // Horizontal part
    24,  25,  26,   24,  26,  27,    // Front
    28,  29,  30,   28,  30,  31,    // Back
    32,  33,  34,   32,  34,  35,    // Top
    36,  37,  38,   36,  38,  39,    // Bottom
    40,  41,  42,   40,  42,  43,    // Right
    44,  45,  46,   44,  46,  47     // Left
]);
