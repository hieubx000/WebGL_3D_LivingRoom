// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position; \n' +
    'attribute vec4 a_Normal; \n' +
    //  'attribute vec4 a_Color; \n' +
    'attribute vec2 a_TexCoord; \n' +

    'uniform mat4 u_MvpMatrix;\n' +
    'uniform mat4 u_NormalMatrix;\n' +

    'varying vec3 v_Normal;\n' +
    'varying vec2 v_TexCoord;\n' +

    'void main() {\n' +
    '  gl_Position = u_MvpMatrix * a_Position;\n' +
    ' v_TexCoord = a_TexCoord; \n' +
    ' v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'uniform vec3 u_LightPosition;\n' +
    'uniform sampler2D u_Sampler;\n' +
    'varying vec2 v_TexCoord;\n' +
    'varying vec3 v_Normal;\n' +
    'void main() {\n' +
    '  vec3 lightDirection = normalize(u_LightPosition);\n' + // Light direction
    '  vec4 color = texture2D(u_Sampler, v_TexCoord);\n' + //Color
    '  vec3 normal = v_Normal;\n' +
    '  float nDotL = max(dot(normal, lightDirection), 0.0);\n' +
    '  vec4 v_Color = vec4(color.rgb * nDotL + vec3(0.1), color.a);\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';


var wood_TEXTURE, leather_TEXTURE, white_TEXTURE, black_TEXTURE, red_TEXTURE, carpet_TEXTURE, paint_TEXTURE, floor_TEXTURE, light_TEXTURE, painting_TEXTURE, quocky_TEXTURE, TV_TEXTURE;
var lamp_colour, tv_colour;

function main() {
    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');

    // Lấy bối cảnh của WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Khởi tạo shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Set the vertex information
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the vertex information');
        return;
    }

    wood_TEXTURE = initTextures(gl, n, "wood.jpg")
        // Set texture
    if (!initTextures(gl, n, "wood.jpg")) {
        console.log('Failed to intialize the texture.');
        return;
    }

    leather_TEXTURE = initTextures(gl, n, "leather4.jpg")
        // Set texture
    if (!initTextures(gl, n, "leather4.jpg")) {
        console.log('Failed to intialize the texture.');
        return;
    }

    white_TEXTURE = initTextures(gl, n, "white.jpeg")
        // Set texture
    if (!initTextures(gl, n, "white.jpeg")) {
        console.log('Failed to intialize the texture.');
        return;
    }

    light_TEXTURE = initTextures(gl, n, "light.jpeg")
        // Set texture
    if (!initTextures(gl, n, "light.jpeg")) {
        console.log('Failed to intialize the texture.');
        return;
    }

    black_TEXTURE = initTextures(gl, n, "black.jpg")
        // Set texture
    if (!initTextures(gl, n, "black.jpg")) {
        console.log('Failed to intialize the texture.');
        return;
    }

    red_TEXTURE = initTextures(gl, n, "red.jpg")
        // Set texture
    if (!initTextures(gl, n, "red.jpg")) {
        console.log('Failed to intialize the texture.');
        return;
    }

    carpet_TEXTURE = initTextures(gl, n, "tham.jpg")
        // Set texture
    if (!initTextures(gl, n, "tham.jpg")) {
        console.log('Failed to intialize the texture.');
        return;
    }

    paint_TEXTURE = initTextures(gl, n, "tuong.jpg")
        // Set texture
    if (!initTextures(gl, n, "tuong.jpg")) {
        console.log('Failed to intialize the texture.');
        return;
    }

    floor_TEXTURE = initTextures(gl, n, "floor.jpg")
        // Set texture
    if (!initTextures(gl, n, "floor.jpg")) {
        console.log('Failed to intialize the texture.');
        return;
    }

    painting_TEXTURE = initTextures(gl, n, "dhtl2.jpg")
        // Set texture
    if (!initTextures(gl, n, "dhtl2.jpg")) {
        console.log('Failed to intialize the texture.');
        return;
    }

    TV_TEXTURE = initTextures(gl, n, "dhtl1.jpg")
        // Set texture
    if (!initTextures(gl, n, "dhtl1.jpg")) {
        console.log('Failed to intialize the texture.');
        return;
    }

    lamp_colour = white_TEXTURE;
    tv_colour = black_TEXTURE;

    // Set the clear color and enable the depth test
    // gl.clearColor(0.75, 0.75, 0.5, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Get the storage locations of attribute and uniform variables
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    var u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
    if (a_Position < 0 || !u_MvpMatrix || !u_NormalMatrix || !u_LightPosition) {
        console.log('Failed to get the storage location of attribute or uniform variable');
        return;
    }

    // Register the event handler to be called on key press
    //document.onkeydown = function(ev){ keydown(ev, gl, n, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix); };
    document.onkeydown = function(ev) { keydown(ev, gl, n, a_Position, u_MvpMatrix, u_NormalMatrix, canvas, u_LightPosition); };

    //draw(gl, n, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);
    draw(gl, n, a_Position, u_MvpMatrix, u_NormalMatrix, canvas, u_LightPosition);
}

var ANGLE_STEP = 3.0; // The increments of rotation angle (degrees)
var g_xRotAngle = 0.0; // The rotation angle around the x-axis (degrees)
var g_yRotAngle = 90.0; // The rotation angle around the y-axis (degrees)
var g_zRotAngle = 0.0; // The rotation around the z-axis(degrees)

//var g_joint3Angle = 0.0;  // The rotation angle of joint3 (degrees)

var g_eyeX = 30.0;
var g_eyeY = 10.0;
var g_eyeZ = 70.0;
//var g_eyeX = 30.0;
//var g_eyeY = 5.0;
//var g_eyeZ = 30.0; // The eye point

//ánh sáng
//var lightPositions = [1.0, 0.5, 0.7]; // The light positions
var lightPositions = [-1.0, 0.5, 0.7];

function radToDeg(r) {
    return r * 180 / Math.PI;
}

function degToRad(d) {
    return d * Math.PI / 180;
}

//var rotation = [degToRad(190), degToRad(40), degToRad(320)];
var lampRotation = 60.0;
var chair2Rotation = 0.0;
var chair3Position = 23.0;
var rotation = [190.0, 60.0, 320.0];
var rotationSpeed = 1.2;
var TVRotation = 0.0;
var bookPos = 20.0;

//function keydown(ev, gl, o, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix) 
function keydown(ev, gl, o, a_Position, u_MvpMatrix, u_NormalMatrix, canvas, u_LightPosition) {
    switch (ev.keyCode) {
        case 65: // 'a' key
            tv_colour = black_TEXTURE;
            break;
        case 83: // 's' key 
            tv_colour = TV_TEXTURE;
            break;

        case 40: // Up arrow key (40)
            //g_yRotAngle = (g_yRotAngle + ANGLE_STEP) % 360;
            //if (g_eyeY <= 60)
            // if (g_eyeY <= 42.0)
            g_eyeZ += 1;
            break;
        case 38: // Down arrow key (38)
            //g_yRotAngle = (g_yRotAngle - ANGLE_STEP) % 360;
            //if (g_eyeY >= 10)
            // if (g_eyeY >= 15)
            g_eyeZ -= 1;
            break;

        case 39: // Right arrow key (39)                                
            //if (g_eyeZ <= 30.0)
            // if (g_eyeZ <= 30.0)
            g_eyeX -= 1;
            break;
        case 37: // Left arrow key (37)                         
            //if (g_eyeZ >= -40.0)
            // if (g_eyeZ >= -30.0)
            g_eyeX += 1;
            break;

        case 86: // 'v'key 
            //if (g_eyeX <= 50.0)
            if (g_eyeX <= 35.0)
                g_eyeX += 1;
            break;
        case 67: // 'c'key 
            //if (g_eyeX >= -30.0)
            if (g_eyeX >= -20.0)
                g_eyeX -= 1;
            break;

            // case 65: // 'a key'
            //     if (bookPos <= 19.5)
            //         bookPos += 0.5;
            //     break;
            // case 83: // 's key'
            //     if (bookPos >= 15.5)
            //         bookPos -= 0.5;
            //     break;

        case 81: // 'q' key
            lamp_colour = white_TEXTURE;
            break;
        case 87: // 'w' key 
            lamp_colour = light_TEXTURE;
            break;

        case 68: // 'd' key
            if (chair3Position <= 22.0)
                chair3Position += 1.0;
            break;
        case 70: // 'f' key
            if (chair3Position >= 15.0)
                chair3Position -= 1.0;
            break;

        case 69: // 'e' key
            if (TVRotation <= 40.0)
                TVRotation = (TVRotation + rotationSpeed) % 360;
            break;
        case 82: // 'r'
            if (TVRotation >= -28.0)
                TVRotation = (TVRotation - rotationSpeed) % 360;
            break;
        default:
            return; // Skip drawing at no effective action
    }
    // Draw
    //draw(gl, o, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);
    draw(gl, o, a_Position, u_MvpMatrix, u_NormalMatrix, canvas, u_LightPosition);
}

var g_baseBuffer = null; // Buffer object for a base
var g_arm1Buffer = null; // Buffer object for arm1
var g_arm2Buffer = null; // Buffer object for arm2
var g_arm3Buffer = null; // Buffer object for arm3
var g_leg1Buffer = null; // Buffer object for leg1
var g_leg2Buffer = null; // Buffer object for leg2
var g_leg3Buffer = null; // Buffer object for leg3
var g_leg4Buffer = null; // Buffer object for leg4
var g_lampBuffer = null; // Buffer object for lamp
var g_bookBuffer = null; // Buffer onject for book
var g_cubeBuffer = null; // Buffer object for cube
//var g_fingerBuffer = null;   // Buffer object for fingers

function initVertexBuffers(gl) {
    // Vertex coordinate (prepare coordinates of cuboids for all segments)
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3

    var vertices_base = new Float32Array([ // Base(10x2x10)
        5.0, 2.0, 5.0, -5.0, 2.0, 5.0, -5.0, 0.0, 5.0, 5.0, 0.0, 5.0, // v0-v1-v2-v3 front
        5.0, 2.0, 5.0, 5.0, 0.0, 5.0, 5.0, 0.0, -5.0, 5.0, 2.0, -5.0, // v0-v3-v4-v5 right
        5.0, 2.0, 5.0, 5.0, 2.0, -5.0, -5.0, 2.0, -5.0, -5.0, 2.0, 5.0, // v0-v5-v6-v1 up
        -5.0, 2.0, 5.0, -5.0, 2.0, -5.0, -5.0, 0.0, -5.0, -5.0, 0.0, 5.0, // v1-v6-v7-v2 left
        -5.0, 0.0, -5.0, 5.0, 0.0, -5.0, 5.0, 0.0, 5.0, -5.0, 0.0, 5.0, // v7-v4-v3-v2 down
        5.0, 0.0, -5.0, -5.0, 0.0, -5.0, -5.0, 2.0, -5.0, 5.0, 2.0, -5.0 // v4-v7-v6-v5 back
    ]);

    var vertices_arm1 = new Float32Array([ // Arm1(2x10x2)
        1.0, 10.0, 1.0, -1.0, 10.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, 1.0, // v0-v1-v2-v3 front
        1.0, 10.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 10.0, -1.0, // v0-v3-v4-v5 right
        1.0, 10.0, 1.0, 1.0, 10.0, -1.0, -1.0, 10.0, -1.0, -1.0, 10.0, 1.0, // v0-v5-v6-v1 up
        -1.0, 10.0, 1.0, -1.0, 10.0, -1.0, -1.0, 0.0, -1.0, -1.0, 0.0, 1.0, // v1-v6-v7-v2 left
        -1.0, 0.0, -1.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, 1.0, // v7-v4-v3-v2 down
        1.0, 0.0, -1.0, -1.0, 0.0, -1.0, -1.0, 10.0, -1.0, 1.0, 10.0, -1.0 // v4-v7-v6-v5 back
    ]);

    var vertices_arm2 = new Float32Array([ // Arm2(2x5x2)
        1.0, 5.0, 1.0, -1.0, 5.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, 1.0, // v0-v1-v2-v3 front
        1.0, 5.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 5.0, -1.0, // v0-v3-v4-v5 right
        1.0, 5.0, 1.0, 1.0, 5.0, -1.0, -1.0, 5.0, -1.0, -1.0, 5.0, 1.0, // v0-v5-v6-v1 up
        -1.0, 5.0, 1.0, -1.0, 5.0, -1.0, -1.0, 0.0, -1.0, -1.0, 0.0, 1.0, // v1-v6-v7-v2 left
        -1.0, 0.0, -1.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, 1.0, // v7-v4-v3-v2 down
        1.0, 0.0, -1.0, -1.0, 0.0, -1.0, -1.0, 5.0, -1.0, 1.0, 5.0, -1.0 // v4-v7-v6-v5 back
    ]);

    var vertices_leg1 = new Float32Array([ // Leg(1x1x2) 
        0.5, 0.5, 1.0, -0.5, 0.5, 1.0, -0.5, 0.0, 1.0, 0.5, 0.0, 1.0, // v0-v1-v2-v3 front
        0.5, 0.5, 1.0, 0.5, 0.0, 1.0, 0.5, 0.0, -1.0, 0.5, 0.5, -1.0, // v0-v3-v4-v5 right
        0.5, 0.5, 1.0, 0.5, 0.5, -1.0, -0.5, 0.5, -1.0, -0.5, 0.5, 1.0, // v0-v5-v6-v1 up
        -0.5, 0.5, 1.0, -0.5, 0.5, -1.0, -0.5, 0.0, -1.0, -0.5, 0.0, 1.0, // v1-v6-v7-v2 left
        -0.5, 0.0, -1.0, 0.5, 0.0, -1.0, 0.5, 0.0, 1.0, -0.5, 0.0, 1.0, // v7-v4-v3-v2 down
        0.5, 0.0, -1.0, -0.5, 0.0, -1.0, -0.5, 0.5, -1.0, 0.5, 0.5, -1.0 // v4-v7-v6-v5 back
    ]);

    var vertices_lamp = new Float32Array([ // Lamp(0.5x8x0.5)
        0.25, 8.0, 0.25, -0.25, 8.0, 0.25, -0.25, 0.0, 0.25, 0.25, 0.0, 0.25, // v0-v1-v2-v3 front
        0.25, 8.0, 0.25, 0.25, 0.0, 0.25, 0.25, 0.0, -0.25, 0.25, 8.0, -0.25, // v0-v3-v4-v5 right
        0.25, 8.0, 0.25, 0.25, 8.0, -0.25, -0.25, 8.0, -0.25, -0.25, 8.0, 0.25, // v0-v5-v6-v1 up
        -0.25, 8.0, 0.25, -0.25, 8.0, -0.25, -0.25, 0.0, -0.25, -0.25, 0.0, 0.25, // v1-v6-v7-v2 left
        -0.25, 0.0, -0.25, 0.25, 0.0, -0.25, 0.25, 0.0, 0.25, -0.25, 0.0, 0.25, // v7-v4-v3-v2 down
        0.25, 0.0, -0.25, -0.25, 0.0, -0.25, -0.25, 8.0, -0.25, 0.25, 8.0, -0.25 // v4-v7-v6-v5 back
    ]);

    var vertices_lamp_up = new Float32Array([ // (1x2x1) 
        1.0, 2.0, 1.0, -1.0, 2.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, 1.0, // v0-v1-v2-v3 front
        1.0, 2.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 2.0, -1.0, // v0-v3-v4-v5 right
        1.0, 2.0, 1.0, 1.0, 2.0, -1.0, -1.0, 2.0, -1.0, -1.0, 2.0, 1.0, // v0-v5-v6-v1 up
        -1.0, 2.0, 1.0, -1.0, 2.0, -1.0, -1.0, 0.0, -1.0, -1.0, 0.0, 1.0, // v1-v6-v7-v2 left
        -1.0, 0.0, -1.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, 1.0, // v7-v4-v3-v2 down
        1.0, 0.0, -1.0, -1.0, 0.0, -1.0, -1.0, 2.0, -1.0, 1.0, 2.0, -1.0 // v4-v7-v6-v5 back
    ]);

    var vertices_shelf = new Float32Array([ // Shelf1(1x7x1)
        0.5, 7.0, 0.5, -0.5, 7.0, 0.5, -0.5, 0.0, 0.5, 0.5, 0.0, 0.5, // v0-v1-v2-v3 front
        0.5, 7.0, 0.5, 0.5, 0.0, 0.5, 0.5, 0.0, -0.5, 0.5, 7.0, -0.5, // v0-v3-v4-v5 right
        0.5, 7.0, 0.5, 0.5, 7.0, -0.5, -0.5, 7.0, -0.5, -0.5, 7.0, 0.5, // v0-v5-v6-v1 up
        -0.5, 7.0, 0.5, -0.5, 7.0, -0.5, -0.5, 0.0, -0.5, -0.5, 0.0, 0.5, // v1-v6-v7-v2 left
        -0.5, 0.0, -0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, 0.5, // v7-v4-v3-v2 down
        0.5, 0.0, -0.5, -0.5, 0.0, -0.5, -0.5, 7.0, -0.5, 0.5, 7.0, -0.5 // v4-v7-v6-v5 back
    ]);

    var vertices_tv = new Float32Array([ // TV(3x2x3) 
        1.5, 2.0, 1.5, -1.5, 2.0, 1.5, -1.5, 0.0, 1.5, 1.5, 0.0, 1.5, // v0-v1-v2-v3 front
        1.5, 2.0, 1.5, 1.5, 0.0, 1.5, 1.5, 0.0, -1.5, 1.5, 2.0, -1.5, // v0-v3-v4-v5 right
        1.5, 2.0, 1.5, 1.5, 2.0, -1.5, -1.5, 2.0, -1.5, -1.5, 2.0, 1.5, // v0-v5-v6-v1 up
        -1.5, 2.0, 1.5, -1.5, 2.0, -1.5, -1.5, 0.0, -1.5, -1.5, 0.0, 1.5, // v1-v6-v7-v2 left
        -1.5, 0.0, -1.5, 1.5, 0.0, -1.5, 1.5, 0.0, 1.5, -1.5, 0.0, 1.5, // v7-v4-v3-v2 down
        1.5, 0.0, -1.5, -1.5, 0.0, -1.5, -1.5, 2.0, -1.5, 1.5, 2.0, -1.5 // v4-v7-v6-v5 back
    ]);

    var vertices_book = new Float32Array([ // Book(1x2x1) 
        0.5, 2.0, 0.5, -0.5, 2.0, 0.5, -0.5, 0.0, 0.5, 0.5, 0.0, 0.5, // v0-v1-v2-v3 front
        0.5, 2.0, 0.5, 0.5, 0.0, 0.5, 0.5, 0.0, -0.5, 0.5, 2.0, -0.5, // v0-v3-v4-v5 right
        0.5, 2.0, 0.5, 0.5, 2.0, -0.5, -0.5, 2.0, -0.5, -0.5, 2.0, 0.5, // v0-v5-v6-v1 up
        -0.5, 2.0, 0.5, -0.5, 2.0, -0.5, -0.5, 0.0, -0.5, -0.5, 0.0, 0.5, // v1-v6-v7-v2 left
        -0.5, 0.0, -0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, 0.5, // v7-v4-v3-v2 down
        0.5, 0.0, -0.5, -0.5, 0.0, -0.5, -0.5, 2.0, -0.5, 0.5, 2.0, -0.5 // v4-v7-v6-v5 back
    ]);


    var vertices_cube = new Float32Array([
        5, 10.0, 5, -5, 10.0, 5, -5, 0.0, 5, 5, 0.0, 5, // v0-v1-v2-v3 front 
        5, 10.0, 5, 5, 0.0, 5, 5, 0.0, -5, 5, 10.0, -5, // v0-v3-v4-v5 right 
        5, 10.0, 5, 5, 10.0, -5, -5, 10.0, -5, -5, 10.0, 5, // v0-v5-v6-v1 up
        -5, 10.0, 5, -5, 10.0, -5, -5, 0.0, -5, -5, 0.0, 5, // v1-v6-v7-v2 left
        -5, 0.0, -5, 5, 0.0, -5, 5, 0.0, 5, -5, 0.0, 5, // v7-v4-v3-v2 down 
        5, 0.0, -5, -5, 0.0, -5, -5, 10.0, -5, 5, 10.0, -5 // v4-v7-v6-v5 back
    ]);

    // Normal
    var normals = new Float32Array([
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, // v0-v1-v2-v3 front
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, // v0-v3-v4-v5 right
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, // v0-v5-v6-v1 up
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, // v7-v4-v3-v2 down
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0 // v4-v7-v6-v5 back
    ]);

    // Indices of the vertices
    var indices = new Uint8Array([
        0, 1, 2, 0, 2, 3, // front
        4, 5, 6, 4, 6, 7, // right
        8, 9, 10, 8, 10, 11, // up
        12, 13, 14, 12, 14, 15, // left
        16, 17, 18, 16, 18, 19, // down
        20, 21, 22, 20, 22, 23 // back
    ]);


    // Write coords to buffers, but don't assign to attribute variables
    g_baseBuffer = initArrayBufferForLaterUse(gl, vertices_base, 3, gl.FLOAT);
    g_arm1Buffer = initArrayBufferForLaterUse(gl, vertices_arm1, 3, gl.FLOAT);
    g_arm2Buffer = initArrayBufferForLaterUse(gl, vertices_arm2, 3, gl.FLOAT);
    g_arm3Buffer = initArrayBufferForLaterUse(gl, vertices_arm2, 3, gl.FLOAT);
    g_leg1Buffer = initArrayBufferForLaterUse(gl, vertices_leg1, 3, gl.FLOAT);
    g_leg2Buffer = initArrayBufferForLaterUse(gl, vertices_leg1, 3, gl.FLOAT);
    g_leg3Buffer = initArrayBufferForLaterUse(gl, vertices_leg1, 3, gl.FLOAT);
    g_leg4Buffer = initArrayBufferForLaterUse(gl, vertices_leg1, 3, gl.FLOAT);
    g_cubeBuffer = initArrayBufferForLaterUse(gl, vertices_cube, 3, gl.FLOAT);

    g_lampBuffer = initArrayBufferForLaterUse(gl, vertices_lamp, 3, gl.FLOAT);
    g_lamp_upBuffer = initArrayBufferForLaterUse(gl, vertices_lamp_up, 3, gl.FLOAT);

    g_shelfBuffer = initArrayBufferForLaterUse(gl, vertices_shelf, 3, gl.FLOAT);

    g_tvBuffer = initArrayBufferForLaterUse(gl, vertices_tv, 3, gl.FLOAT);

    g_bookBuffer = initArrayBufferForLaterUse(gl, vertices_book, 3, gl.FLOAT);
    //g_fingerBuffer = initArrayBufferForLaterUse(gl, vertices_finger, 3, gl.FLOAT);

    g_cubeBuffer = initArrayBufferForLaterUse(gl, vertices_cube, 3, gl.FLOAT);

    //if (!g_baseBuffer || !g_arm1Buffer || !g_arm2Buffer || !g_palmBuffer || !g_fingerBuffer) return -1;
    if (!g_baseBuffer || !g_arm1Buffer || !g_arm2Buffer || !g_arm3Buffer || !g_leg1Buffer || !g_leg2Buffer || !g_leg3Buffer || !g_leg4Buffer || !g_lampBuffer ||
        !g_lamp_upBuffer || !g_shelfBuffer || !g_tvBuffer || !g_bookBuffer || !g_cubeBuffer) return -1;

    // Write normals to a buffer, assign it to a_Normal and enable it
    if (!initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT)) return -1;

    // Write the indices to the buffer object
    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    /*
    var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    if (a_TexCoord < 0) {
      console.log('Failed to get the storage location of a_TexCoord');
      return -1;
    }
    */


    //var textureBuffer = gl.createBuffer();
    //gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);

    var textureCoordinates = new Float32Array([
        // Front
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Back
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Top
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Bottom
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Right
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Left
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
    ]);

    var textureBuffer = gl.createBuffer();
    if (!textureBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, textureCoordinates, gl.STATIC_DRAW);

    //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

    //textureBuffer.itemSize = 2;
    //textureBuffer.numItems = 24;

    //gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);

    var FSIZE = textureCoordinates.BYTES_PER_ELEMENT;
    //Get the storage location of a_Position, assign and enable buffer
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position); // Enable the assignment of the buffer object


    // Get the storage location of a_TexCoord
    var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    if (a_TexCoord < 0) {
        console.log('Failed to get the storage location of a_TexCoord');
        return -1;
    }

    // Assign the buffer object to a_TexCoord variable
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, 0, 0);
    //gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord); // Enable the assignment of the buffer object

    return indices.length;
}

function initArrayBufferForLaterUse(gl, data, num, type) {
    var buffer = gl.createBuffer(); // Create a buffer object
    if (!buffer) {
        console.log('Failed to create the buffer object');
        return null;
    }
    // Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    // Store the necessary information to assign the object to the attribute variable later
    buffer.num = num;
    buffer.type = type;

    return buffer;
}

function initArrayBuffer(gl, attribute, data, num, type) {
    var buffer = gl.createBuffer(); // Create a buffer object
    if (!buffer) {
        console.log('Failed to create the buffer object');
        return false;
    }
    // Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    // Assign the buffer object to the attribute variable
    var a_attribute = gl.getAttribLocation(gl.program, attribute);
    if (a_attribute < 0) {
        console.log('Failed to get the storage location of ' + attribute);
        return false;
    }
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    // Enable the assignment of the buffer object to the attribute variable
    gl.enableVertexAttribArray(a_attribute);

    return true;
}


// Coordinate transformation matrix
var g_modelMatrix = new Matrix4(),
    g_mvpMatrix = new Matrix4();

//function draw(gl, n, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix) 
function draw(gl, n, a_Position, u_MvpMatrix, u_NormalMatrix, canvas, u_LightPosition) {

    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform3fv(u_LightPosition, lightPositions);

    // Calculate the view projection matrix
    var viewProjMatrix = new Matrix4();
    viewProjMatrix.setPerspective(40.0, canvas.width / canvas.height, 1.0, 200.0);
    viewProjMatrix.lookAt(g_eyeX, g_eyeY, g_eyeZ, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    // Chair 1 //

    // Draw a base
    var baseHeight = 2.0;
    g_modelMatrix.setTranslate(-10.0, -10.0, -3.0);
    g_modelMatrix.rotate(g_xRotAngle, 1.0, 0.0, 0.0); //  Rotate around the x-axis
    g_modelMatrix.rotate(g_yRotAngle, 0.0, 1.0, 0.0); // Rotate around the y-axis
    g_modelMatrix.rotate(g_zRotAngle, 0.0, 0.0, 1.0); //  Rotate around the z-axis
    drawSegment(gl, n, g_baseBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, leather_TEXTURE);

    // Arm1
    var arm1Length = 10.0;
    g_modelMatrix.translate(5.0, baseHeight + 1, -4.0); // Move onto the base
    //g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0);  // Rotate around the y-axis
    //g_modelMatrix.rotate(90, 0.0, 1.0, 0.0); //y-axis
    g_modelMatrix.rotate(90, 0.0, 0.0, 1.0); //z-axis
    //g_modelMatrix.rotate(45, 1.0, 0.0, 0.0); //x-axis
    drawSegment(gl, n, g_arm1Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, leather_TEXTURE); // Draw

    // Arm2
    var arm2Length = 5.0;
    g_modelMatrix.translate(0.0, arm1Length - 1, 1.0); // Move to joint1
    //g_modelMatrix.translate(0.0, baseHeight-1.0, 1.0);
    //g_modelMatrix.rotate(g_joint1Angle, 0.0, 0.0, 1.0);  // Rotate around the z-axis
    g_modelMatrix.rotate(90, 1.0, 0.0, 0.0); //x-axis
    //g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0); 
    //g_modelMatrix.rotate(90, 0.0, 1.0, 0.0); //y-axis
    //g_modelMatrix.rotate(90, 0.0, 0.0, 1.0); //z-axis
    drawSegment(gl, n, g_arm2Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, leather_TEXTURE); // Draw

    // Arm3
    var arm3Length = 5.0;
    //g_modelMatrix.translate(0.0, baseHeight+3, -8.0);
    g_modelMatrix.translate(0.0, arm1Length - 5, 8.0);
    g_modelMatrix.rotate(90, 1.0, 0.0, 0.0); //x-axis
    g_modelMatrix.rotate(90, 0.0, 1.0, 0.0); //y-axis
    g_modelMatrix.rotate(90, 0.0, 0.0, 1.0); //z-axis
    drawSegment(gl, n, g_arm3Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, leather_TEXTURE); // Draw

    // Leg1 
    var leg1Length = 2.0;
    g_modelMatrix.translate(0.0, baseHeight - 5, -4.0);
    drawSegment(gl, n, g_leg1Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, wood_TEXTURE); // Draw

    // Leg2 
    var leg2Length = 2.0;
    g_modelMatrix.translate(-8.0, baseHeight - 2, 0.0);
    drawSegment(gl, n, g_leg2Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, wood_TEXTURE); // Draw

    // Leg3
    var leg3Length = 2.0;
    g_modelMatrix.translate(8.0, baseHeight + 7, 0.0);
    drawSegment(gl, n, g_leg3Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, wood_TEXTURE); // Draw

    // Leg4
    var leg4Length = 2.0;
    g_modelMatrix.translate(-8.0, baseHeight - 2, 0.0);
    drawSegment(gl, n, g_leg4Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, wood_TEXTURE); // Draw



    // Lamp //

    // Move 
    // g_modelMatrix.setTranslate(-10.0, 0.0, 0.0); - use this so that lamp and chair don't move together 
    g_modelMatrix.translate(12.0, -8.0, -1.0);

    var lampHeight = 8.0
    g_modelMatrix.rotate(90, 1.0, 0.0, 0.0); //x-axis
    g_modelMatrix.rotate(lampRotation, 0.0, 1.0, 0.0); //y-axis
    //g_modelMatrix.rotate(90, 0.0, 0.0, 1.0); //z-axis
    drawSegment(gl, n, g_lampBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, wood_TEXTURE); // Draw

    // upper part 
    g_modelMatrix.translate(0.0, lampHeight, -1.0);
    g_modelMatrix.rotate(90, 1.0, 0.0, 0.0); //x-axis
    //g_modelMatrix.rotate(rotation[1], 0.0, 0.0, 1.0);
    //g_modelMatrix.rotate(90, 0.0, 1.0, 0.0); //y-axis
    //g_modelMatrix.rotate(90, 0.0, 0.0, 1.0); //z-axis
    drawSegment(gl, n, g_lamp_upBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, lamp_colour); // Draw


    // Chair 2 //

    //g_modelMatrix.translate(10.0, 0.0, 0.0);

    // Draw a base
    var baseHeight = 2.0;

    //chair 1 and chair 2 don't move together
    //g_modelMatrix.setTranslate(10.0, -10.0, -15.0);
    //g_modelMatrix.rotate(-90, 0.0, 1.0, 0.0);

    //g_modelMatrix.translate(10.0, 10.0, 7.0);
    g_modelMatrix.setTranslate(5.0, -10.0, -15.0)
    g_modelMatrix.rotate(-90, 1.0, 0.0, 0.0);
    g_modelMatrix.rotate(-180, 0.0, 1.0, 0.0);
    g_modelMatrix.rotate(chair2Rotation, 0.0, 0.0, 1.0);

    //g_modelMatrix.rotate(g_xRotAngle, 1.0, 0.0, 0.0); //  Rotate around the x-axis
    g_modelMatrix.rotate(-90.0, 1.0, 0.0, 0.0);
    //g_modelMatrix.rotate(g_yRotAngle, 0.0, 1.0, 0.0);  // Rotate around the y-axis
    g_modelMatrix.rotate(-180, 0.0, 1.0, 0.0);
    //g_modelMatrix.rotate(g_zRotAngle, 0.0, 0.0, 1.0); //  Rotate around the z-axis
    drawSegment(gl, n, g_baseBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, leather_TEXTURE);

    // Arm1
    g_modelMatrix.translate(5.0, baseHeight + 1, -4.0); // Move onto the base
    g_modelMatrix.rotate(90, 0.0, 0.0, 1.0); //z-axis
    drawSegment(gl, n, g_arm1Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, leather_TEXTURE); // Draw

    // Arm2
    g_modelMatrix.translate(0.0, arm1Length - 1, 1.0); // Move to arm1
    g_modelMatrix.rotate(90, 1.0, 0.0, 0.0); //x-axis
    drawSegment(gl, n, g_arm2Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, leather_TEXTURE); // Draw

    // Arm3
    g_modelMatrix.translate(0.0, arm1Length - 5, 8.0);
    g_modelMatrix.rotate(90, 1.0, 0.0, 0.0); //x-axis
    g_modelMatrix.rotate(90, 0.0, 1.0, 0.0); //y-axis
    g_modelMatrix.rotate(90, 0.0, 0.0, 1.0); //z-axis
    drawSegment(gl, n, g_arm3Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, leather_TEXTURE); // Draw

    // Leg1 
    g_modelMatrix.translate(0.0, baseHeight - 5, -4.0);
    drawSegment(gl, n, g_leg1Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, wood_TEXTURE); // Draw

    // Leg2 
    g_modelMatrix.translate(-8.0, baseHeight - 2, 0.0);
    drawSegment(gl, n, g_leg2Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, wood_TEXTURE); // Draw

    // Leg3
    g_modelMatrix.translate(8.0, baseHeight + 7, 0.0);
    drawSegment(gl, n, g_leg3Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, wood_TEXTURE); // Draw

    // Leg4
    g_modelMatrix.translate(-8.0, baseHeight - 2, 0.0);
    drawSegment(gl, n, g_leg4Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, wood_TEXTURE); // Draw


    // Shelves + books 1 //
    // shelf1
    g_modelMatrix.setTranslate(-19.5, 0.0, 15.0);
    g_modelMatrix.rotate(90, 1.0, 0.0, 0.0); //x-axis
    //g_modelMatrix.rotate(90, 0.0, 1.0, 0.0); //y-axis
    drawSegment(gl, n, g_shelfBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, wood_TEXTURE); // Draw

    // shelf2
    g_modelMatrix.translate(0.0, 0.0, -5.0);
    //g_modelMatrix.rotate(-90, 1.0, 0.0, 0.0); //x-axis
    drawSegment(gl, n, g_shelfBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, wood_TEXTURE); // Draw

    // shelf3
    g_modelMatrix.translate(0.0, 0.0, 2.5);
    //g_modelMatrix.rotate(-90, 1.0, 0.0, 0.0); //x-axis
    drawSegment(gl, n, g_shelfBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, wood_TEXTURE); // Draw

    // book1
    g_modelMatrix.setTranslate(0.0, 0.0, 0.0);
    g_modelMatrix.translate(-19.5, 6.0, bookPos);
    g_modelMatrix.rotate(90.0, 1.0, 0.0, 0, 0); //x-axis
    drawSegment(gl, n, g_bookBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, red_TEXTURE); // Draw

    // book2
    g_modelMatrix.translate(0.0, 0.0, 5.0);
    drawSegment(gl, n, g_bookBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, red_TEXTURE); // Draw


    // Shelves + books 2 //
    // shelf1
    g_modelMatrix.setTranslate(-19.5, 0.0, -17.0);
    g_modelMatrix.rotate(90, 1.0, 0.0, 0.0); //x-axis
    //g_modelMatrix.rotate(90, 0.0, 1.0, 0.0); //y-axis
    drawSegment(gl, n, g_shelfBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, wood_TEXTURE); // Draw

    // shelf2
    g_modelMatrix.translate(0.0, 0.0, -5.0);
    //g_modelMatrix.rotate(-90, 1.0, 0.0, 0.0); //x-axis
    drawSegment(gl, n, g_shelfBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, wood_TEXTURE); // Draw

    // shelf3
    g_modelMatrix.translate(0.0, 0.0, 2.5);
    //g_modelMatrix.rotate(-90, 1.0, 0.0, 0.0); //x-axis
    drawSegment(gl, n, g_shelfBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, wood_TEXTURE); // Draw

    // book1
    g_modelMatrix.setTranslate(0.0, 0.0, 0.0);

    g_modelMatrix.translate(-19.5, 6.0, bookPos - 32);
    g_modelMatrix.rotate(90.0, 1.0, 0.0, 0, 0); //x-axis
    drawSegment(gl, n, g_bookBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, red_TEXTURE); // Draw

    // book2
    g_modelMatrix.translate(0.0, 0.0, 5.0);
    drawSegment(gl, n, g_bookBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, red_TEXTURE); // Draw


    // Chair 3 //
    // Draw a base
    var baseHeight = 2.0;

    //g_modelMatrix.translate(10.0, 10.0, 7.0);
    //g_modelMatrix.setTranslate(5.0, -10.0, 23.0);
    g_modelMatrix.setTranslate(5.0, -10.0, chair3Position);
    g_modelMatrix.rotate(-90, 1.0, 0.0, 0.0);
    g_modelMatrix.rotate(-180, 0.0, 1.0, 0.0);
    g_modelMatrix.rotate(180, 0.0, 0.0, 1.0);
    //g_modelMatrix.rotate(chair2Rotation, 0.0, 0.0, 1.0);

    //g_modelMatrix.rotate(g_xRotAngle, 1.0, 0.0, 0.0); //  Rotate around the x-axis
    g_modelMatrix.rotate(-90.0, 1.0, 0.0, 0.0);
    //g_modelMatrix.rotate(g_yRotAngle, 0.0, 1.0, 0.0);  // Rotate around the y-axis
    g_modelMatrix.rotate(-180, 0.0, 1.0, 0.0);
    //g_modelMatrix.rotate(g_zRotAngle, 0.0, 0.0, 1.0); //  Rotate around the z-axis
    drawSegment(gl, n, g_baseBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, leather_TEXTURE);

    // Arm1
    g_modelMatrix.translate(5.0, baseHeight + 1, -4.0); // Move onto the base
    g_modelMatrix.rotate(90, 0.0, 0.0, 1.0); //z-axis
    drawSegment(gl, n, g_arm1Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, leather_TEXTURE); // Draw

    // Arm2
    g_modelMatrix.translate(0.0, arm1Length - 1, 1.0); // Move to arm1
    g_modelMatrix.rotate(90, 1.0, 0.0, 0.0); //x-axis
    drawSegment(gl, n, g_arm2Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, leather_TEXTURE); // Draw

    // Arm3
    g_modelMatrix.translate(0.0, arm1Length - 5, 8.0);
    g_modelMatrix.rotate(90, 1.0, 0.0, 0.0); //x-axis
    g_modelMatrix.rotate(90, 0.0, 1.0, 0.0); //y-axis
    g_modelMatrix.rotate(90, 0.0, 0.0, 1.0); //z-axis
    drawSegment(gl, n, g_arm3Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, leather_TEXTURE); // Draw

    // Leg1 
    g_modelMatrix.translate(0.0, baseHeight - 5, -4.0);
    drawSegment(gl, n, g_leg1Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, wood_TEXTURE); // Draw

    // Leg2 
    g_modelMatrix.translate(-8.0, baseHeight - 2, 0.0);
    drawSegment(gl, n, g_leg2Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, wood_TEXTURE); // Draw

    // Leg3
    g_modelMatrix.translate(8.0, baseHeight + 7, 0.0);
    drawSegment(gl, n, g_leg3Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, wood_TEXTURE); // Draw

    // Leg4
    g_modelMatrix.translate(-8.0, baseHeight - 2, 0.0);
    drawSegment(gl, n, g_leg4Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, wood_TEXTURE); // Draw


    // Chair 4 //
    // Draw a base
    var baseHeight = 2.0;

    //g_modelMatrix.translate(10.0, 10.0, 7.0);
    g_modelMatrix.setTranslate(-10.0, -10.0, 10.0);

    g_modelMatrix.rotate(-90, 1.0, 0.0, 0.0);
    g_modelMatrix.rotate(-180, 0.0, 1.0, 0.0);
    g_modelMatrix.rotate(-90, 0.0, 0.0, 1.0);

    //g_modelMatrix.rotate(g_xRotAngle, 1.0, 0.0, 0.0); //  Rotate around the x-axis
    g_modelMatrix.rotate(-90.0, 1.0, 0.0, 0.0);
    //g_modelMatrix.rotate(g_yRotAngle, 0.0, 1.0, 0.0);  // Rotate around the y-axis
    g_modelMatrix.rotate(-180, 0.0, 1.0, 0.0);
    //g_modelMatrix.rotate(g_zRotAngle, 0.0, 0.0, 1.0); //  Rotate around the z-axis
    drawSegment(gl, n, g_baseBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, leather_TEXTURE);

    // Arm1
    g_modelMatrix.translate(5.0, baseHeight + 1, -4.0); // Move onto the base
    g_modelMatrix.rotate(90, 0.0, 0.0, 1.0); //z-axis
    drawSegment(gl, n, g_arm1Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, leather_TEXTURE); // Draw

    // Arm2
    g_modelMatrix.translate(0.0, arm1Length - 1, 1.0); // Move to arm1
    g_modelMatrix.rotate(90, 1.0, 0.0, 0.0); //x-axis
    drawSegment(gl, n, g_arm2Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, leather_TEXTURE); // Draw

    // Arm3
    g_modelMatrix.translate(0.0, arm1Length - 5, 8.0);
    g_modelMatrix.rotate(90, 1.0, 0.0, 0.0); //x-axis
    g_modelMatrix.rotate(90, 0.0, 1.0, 0.0); //y-axis
    g_modelMatrix.rotate(90, 0.0, 0.0, 1.0); //z-axis
    drawSegment(gl, n, g_arm3Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, leather_TEXTURE); // Draw

    // Leg1 
    g_modelMatrix.translate(0.0, baseHeight - 5, -4.0);
    drawSegment(gl, n, g_leg1Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, wood_TEXTURE); // Draw

    // Leg2 
    g_modelMatrix.translate(-8.0, baseHeight - 2, 0.0);
    drawSegment(gl, n, g_leg2Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, wood_TEXTURE); // Draw

    // Leg3
    g_modelMatrix.translate(8.0, baseHeight + 7, 0.0);
    drawSegment(gl, n, g_leg3Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, wood_TEXTURE); // Draw

    // Leg4
    g_modelMatrix.translate(-8.0, baseHeight - 2, 0.0);
    drawSegment(gl, n, g_leg4Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, wood_TEXTURE); // Draw


    // Table + TV //
    // table
    g_modelMatrix.setTranslate(20.0, -10.0, 0.0);
    g_modelMatrix.rotate(90, 1.0, 0.0, 0.0); //x-axis
    g_modelMatrix.rotate(TVRotation, 0.0, 0.0, 1.0);
    g_modelMatrix.scale(0.5, 1.0, 0.5);
    drawSegment(gl, n, g_cubeBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, wood_TEXTURE); // Draw

    // TV
    g_modelMatrix.translate(-3.0, 5.0, -10.0);
    g_modelMatrix.rotate(180, 1.0, 0.0, 0.0); //x-axis
    //g_modelMatrix.rotate(90, 0.0, 1.0, 0.0); //y-axis
    g_modelMatrix.rotate(-90, 0.0, 0.0, 1.0); //z-axis
    g_modelMatrix.scale(0.75, 0.2, 1.0);
    //drawSegment(gl, n, g_tvBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, black_TEXTURE);  // Draw
    drawSegment(gl, n, g_cubeBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, tv_colour); // Draw


    // Carpet //
    g_modelMatrix.setTranslate(5.0, -11.0, 5.0);
    g_modelMatrix.rotate(0.0, 1.0, 0.0, 0.0); //x-axis
    //g_modelMatrix.rotate(90.0, 0.0, 1.0, 0.0); //y-axis
    g_modelMatrix.scale(1.0, 0.02, 1.5);
    drawSegment(gl, n, g_cubeBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, carpet_TEXTURE); // Draw


    // // Shelf  + books //
    // // shelf
    // g_modelMatrix.setTranslate(20.0, -12.0, -27.0);
    // g_modelMatrix.scale(1.0, 1.0, 0.25);
    // drawSegment(gl, n, g_cubeBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, wood_TEXTURE); // Draw
    // // book1
    // g_modelMatrix.translate(-1.0, 11.5, -5.0);
    // g_modelMatrix.rotate(90.0, 1.0, 0.0, 0.0); //x-axis
    // g_modelMatrix.rotate(90.0, 0.0, 1.0, 0.0); //y-axis
    // //g_modelMatrix.rotate(90.0, 0.0, 0.0, 1.0); //z-axis
    // g_modelMatrix.scale(3.0, 2.0, 2.0);
    // drawSegment(gl, n, g_bookBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, red_TEXTURE); // Draw

    // // book2
    // g_modelMatrix.translate(0.0, 3.5, 1.25);
    // g_modelMatrix.rotate(90.0, 1.0, 0.0, 0.0); //x-axis
    // g_modelMatrix.rotate(90.0, 0.0, 1.0, 0.0); //y-axis
    // g_modelMatrix.rotate(90.0, 0.0, 0.0, 1.0); //z-axis
    // //g_modelMatrix.scale(1.0, 1.0, 1.0);
    // drawSegment(gl, n, g_bookBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, red_TEXTURE); // Draw


    // Walls + floor //
    // wall1
    g_modelMatrix.setTranslate(3.70, -1.5, -29.0);
    g_modelMatrix.rotate(90.0, 1.0, 0.0, 0.0); //x-axis
    //g_modelMatrix.rotate(90.0, 0.0, 1.0, 0.0); //y-axis
    g_modelMatrix.scale(4.75, 0.02, 2.0);
    drawSegment(gl, n, g_cubeBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, paint_TEXTURE); // Draw

    // wall2
    g_modelMatrix.setTranslate(-20.0, -1.5, 0.0);
    g_modelMatrix.rotate(90.0, 1.0, 0.0, 0, 0); //x-axis
    g_modelMatrix.rotate(-90.0, 0.0, 0.0, 1.0); //z-axis
    g_modelMatrix.scale(5.75, 0.02, 2.0);
    drawSegment(gl, n, g_cubeBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, paint_TEXTURE); // Draw

    // wall3
    g_modelMatrix.setTranslate(27.35, -1.5, 0.0);
    g_modelMatrix.rotate(-90.0, 1.0, 0.0, 0, 0); //x-axis
    g_modelMatrix.rotate(-90.0, 0.0, 0.0, 1.0); //z-axis
    g_modelMatrix.scale(5.75, 0.02, 2.0);
    drawSegment(gl, n, g_cubeBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, paint_TEXTURE); // Draw

    // floor
    g_modelMatrix.setTranslate(3.70, -11.5, 0.0);
    g_modelMatrix.rotate(0.0, 1.0, 0.0, 0, 0); //x-axis
    //g_modelMatrix.rotate(90.0, 0.0, 1.0, 0.0); //y-axis
    g_modelMatrix.scale(4.75, 0.02, 5.75);
    drawSegment(gl, n, g_cubeBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, floor_TEXTURE); // Draw


    // Painting //
    g_modelMatrix.setTranslate(5.0, 0.0, -28.5);
    g_modelMatrix.rotate(90.0, 1.0, 0.0, 0, 0); //x-axis
    g_modelMatrix.rotate(90.0, 0.0, 1.0, 0.0); //y-axis
    g_modelMatrix.scale(1.0, 0.02, 1.5);
    drawSegment(gl, n, g_cubeBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, painting_TEXTURE); // Draw
    /*
    // Draw finger1
    pushMatrix(g_modelMatrix);
    g_modelMatrix.translate(0.0, 0.0, 2.0);
    g_modelMatrix.rotate(g_joint3Angle, 1.0, 0.0, 0.0); // Rotate around the x-axis
    drawSegment(gl, n, g_fingerBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);
    g_modelMatrix = popMatrix();

    // Finger2
    g_modelMatrix.translate(0.0, 0.0, -2.0);
    g_modelMatrix.rotate(-g_joint3Angle, 1.0, 0.0, 0.0); // Rotate around the x-axis
    drawSegment(gl, n, g_fingerBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);
    */
}

var g_matrixStack = []; // Array for storing a matrix
function pushMatrix(m) { // Store the specified matrix to the array
    var m2 = new Matrix4(m);
    g_matrixStack.push(m2);
}

function popMatrix() { // Retrieve the matrix from the array
    return g_matrixStack.pop();
}

var g_normalMatrix = new Matrix4(); // Coordinate transformation matrix for normals

// Draw segments
//function drawSegment(gl, n, buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix)
function drawSegment(gl, n, buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix, TEXTURE) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // Assign the buffer object to the attribute variable
    gl.vertexAttribPointer(a_Position, buffer.num, buffer.type, false, 0, 0);
    // Enable the assignment of the buffer object to the attribute variable
    gl.enableVertexAttribArray(a_Position);

    // Calculate the model view project matrix and pass it to u_MvpMatrix
    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);
    // Calculate matrix for normal and pass it to u_NormalMatrix
    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, TEXTURE);

    // Draw
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}


function initTextures(gl, n, imageName) {
    // Create a texture object
    var texture = gl.createTexture();
    if (!texture) {
        console.log('Failed to create the texture object');
        return false;
    }

    // Get the storage location of u_Sampler
    var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
    if (!u_Sampler) {
        console.log('Failed to get the storage location of u_Sampler');
        return false;
    }

    // Create the image object
    var image = new Image();
    if (!image) {
        console.log('Failed to create the image object');
        return false;
    }
    // Register the event handler to be called on loading an image
    image.onload = function() { loadTexture(gl, n, texture, u_Sampler, image); };
    // Tell the browser to load an image
    //image.crossOrigin = "anonymous";
    image.crossOrigin = "";
    image.src = "../resources/" + imageName;

    //return true;
    return texture;
}

function loadTexture(gl, n, texture, u_Sampler, image) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    /// Enable texture unit0
    gl.activeTexture(gl.TEXTURE0);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    console.log(image.width, image.height);

    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler, 0);

    //gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

    // gl.drawArrays(gl.TRIANGLES, 0, n); // Draw the rectangle
}

function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
}