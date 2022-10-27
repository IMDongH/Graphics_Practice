var canvas;
var gl;

var numVertices = 36;

var texSize = 64;

var program;

var pointsArray = [];
var colorsArray = [];
var texCoordsArray = [];

var texture;

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];


var vertices = [
    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, 0.5, 0.5, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5, 0.5, -0.5, 1.0),
    vec4(0.5, 0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0)
];

var vertexColors = [
    vec4(0.0, 0.0, 0.0, 1.0),  
    vec4(1.0, 0.0, 0.0, 1.0),  
    vec4(1.0, 1.0, 0.0, 1.0),  
    vec4(0.0, 1.0, 0.0, 1.0),    
    vec4(0.0, 0.0, 1.0, 1.0),  
    vec4(1.0, 0.0, 1.0, 1.0), 
    vec4(1.0, 1.0, 1.0, 1.0),  
    vec4(0.0, 1.0, 1.0, 1.0)   
];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;
var theta = [0, 0, 0];

var modelViewMatrixLoc;

function configureTexture(image) {
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,image);

    
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.uniform1i(gl.getUniformLocation(program,"texture"),0);

}

function quad(a, b, c, d) {
    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    texCoordsArray.push(texCoord[0]);

    pointsArray.push(vertices[b]);
    colorsArray.push(vertexColors[a]);
    texCoordsArray.push(texCoord[1]);

    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    texCoordsArray.push(texCoord[2]);

    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    texCoordsArray.push(texCoord[0]);

    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    texCoordsArray.push(texCoord[2]);

    pointsArray.push(vertices[d]);
    colorsArray.push(vertexColors[a]);
    texCoordsArray.push(texCoord[3]);
}

function colorCube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    //  Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.FRONT);

    //  Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    colorCube();

    // color array buffer
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    // vertex array buffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);

    var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);

    
    // var url = "https://cl.staticflickr.com/9/8873/18598400202_3af67ef38f_q.jpg";
    // var url = "data:image/jpeg;base64,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";
    // var image = new Image();
    // image.onload = function(){
    //     configureTexture(image);
    // }

    // image.crossOrigin="";
    // image.src=url;

    var image = document.getElementById("texImage");
    configureTexture(image);

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    //Button Event
    document.getElementById("ButtonX").onclick = function () {
        axis = xAxis;
        theta[axis] += 2.0;
    };
    document.getElementById("ButtonY").onclick = function () {
        axis = yAxis;
        theta[axis] += 2.0;
    };
    document.getElementById("ButtonZ").onclick = function () {
        axis = zAxis;
        theta[axis] += 2.0;
    };

    //call the function render
    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var ctm = mat4();
    ctm = mult(ctm, rotate(theta[zAxis], 0, 0, 1));   // rotateZ
    ctm = mult(ctm, rotate(theta[yAxis], 0, 1, 0));   // rotateY
    ctm = mult(ctm, rotate(theta[xAxis], 1, 0, 0));   // rotateX

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));
    gl.drawArrays(gl.TRIANGLES, 0, numVertices);
    requestAnimFrame(render);
}