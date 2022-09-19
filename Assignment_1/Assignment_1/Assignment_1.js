var gl;
var points;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    var backgroundV = [
        -1.0, 1.0, -1, -0.5, 1, 1,
        -1.0, -0.5, 1, 1, 1, -0.5]
    var vertices = new Float32Array([
        // background
        -1.0, 1.0, -1, -0.6, 1, 1,
        -1.0, -0.6, 1, 1, 1, -0.6,

         //ground
         -1.0, -0.6, -1.0, -1.0, 1.0, -0.6,
         -1.0, -1.0, 1.0, -0.6, 1.0, -1.0, 
        
         //house
        0.5, -0.6, 0.5, -0.1, 1.0, -0.1, 
        0.5, -0.6, 1.0, -0.6, 1.0, -0.1,
        
        0.6, -0.6, 0.75, -0.25, 0.6, -0.25, 
        0.6, -0.6, 0.75, -0.6, 0.75, -0.25,

        0.4, -0.1, 1.1, -0.1, 0.75, 0.3, 

        //large tree
        -0.75, 0.6, -0.65, 0.4, -0.85, 0.4,   
        -0.75, 0.4, -0.60, 0.2, -0.90, 0.2,     
        -0.75, 0.2, -0.55, -0.2, -0.95, -0.2,  
        -0.80, -0.2, -0.70, -0.2, -0.80, -0.6, 
        -0.80, -0.6, -0.70, -0.6, -0.70, -0.2,     
        
        //small tree
        
        -0.4, -0.15, -0.65, -0.4, -0.15, -0.4, 
        -0.4, 0, -0.6, -0.25, -0.2, -0.25, 
        -0.4, 0.15, -0.50, -0.1, -0.30, -0.1, 
        -0.45, -0.65, -0.35, -0.65, -0.35, -0.4, 
        -0.45, -0.4, -0.35, -0.4, -0.45, -0.65, 

        //star
        0.65, 0.7, 0.55, 0.6, 0.75, 0.6, 
        0.65, 0.57, 0.55, 0.66, 0.75, 0.66, 

        //snow
        0.65, 0.7, 0.55, 0.6, 0.75, 0.6, 
        0.65, 0.57, 0.55, 0.66, 0.75, 0.66 

         ,0.85, -0.35, 0.85, -0.2, 1.0, -0.2, 
         0.85, -0.35, 1.0, -0.35, 1.0, -0.2,
    ]);

    var colors = [
        //background
        vec4(1, 1, 1, 1),
        vec4(0, 0, 0, 1),
        vec4(1, 1, 1, 1),
        vec4(0, 0, 0, 1),
        vec4(1, 1, 1, 1),
        vec4(0, 0, 0, 1),

        //ground
        vec4(0.0, 0.3, 0.0, 0.5),
        vec4(1.0, 1.0, 1.0, 0.5),
        vec4(0.0, 0.3, 0.0, 0.3),
        vec4(1.0, 1.0, 1.0, 0.5),
        vec4(0.0, 0.3, 0.0, 0.3),
        vec4(0.0, 0.3, 0.0, 0.3),

        //house
        vec4(1, 204/255, 153/255, 1),
        vec4(1, 204/255, 153/255, 1),
        vec4(1, 204/255, 153/255, 1),
        vec4(1, 204/255, 153/255, 1),
        vec4(1, 204/255, 153/255, 1),
        vec4(1, 204/255, 153/255, 1),

        vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1),

        vec4(204/255, 1, 1, 1),
        vec4(1, 1, 1, 1),
        vec4(1, 1, 1, 1),

        //large tree
        vec4(1.0, 1.0, 1.0, 1.0),
        vec4(0.0, 1.0, 0.0, 1.0),
        vec4(0.0, 1.0, 0.0, 1.0),
        vec4(1.0, 1.0, 1.0, 1.0),
        vec4(0.0, 1.0, 0.0, 1.0),
        vec4(0.0, 1.0, 0.0, 1.0),
        vec4(1.0, 1.0, 1.0, 1.0),
        vec4(0.0, 1.0, 0.0, 1.0),
        vec4(0.0, 1.0, 0.0, 1.0),

        vec4(0.5, 0.25, 0, 1),
        vec4(0.5, 0.25, 0, 1),
        vec4(0.5, 0.25, 0, 1),
        vec4(0.5, 0.25, 0, 1),
        vec4(0.5, 0.25, 0, 1),
        vec4(0.5, 0.25, 0, 1),


        //small tree
        vec4(1, 1, 1, 1),
        vec4(0, 0.2, 0, 0.5),
        vec4(0, 0.2, 0, 0.5),
        vec4(1, 1, 1, 1),
        vec4(0, 0.2, 0, 0.5),
        vec4(0, 0.2, 0, 0.5),
        vec4(1, 1, 1, 1),
        vec4(0, 0.2, 0, 0.5),
        vec4(0, 0.2, 0, 0.5),

        vec4(0.5, 0.25, 0, 1),
        vec4(0.5, 0.25, 0, 1),
        vec4(0.5, 0.25, 0, 1),
        vec4(0.5, 0.25, 0, 1),
        vec4(0.5, 0.25, 0, 1),
        vec4(0.5, 0.25, 0, 1),


        //star
        vec4(1.0, 1.0, 102/255, 1.0),
        vec4(1.0, 1.0, 102/255, 1.0),
        vec4(1.0, 1.0, 102/255, 1.0),
        vec4(1.0, 1.0, 102/255, 1.0),
        vec4(1.0, 1.0, 102/255, 1.0),
        vec4(1.0, 1.0, 102/255, 1.0),

         //snow
         vec4(1.0, 1.0, 1.0, 1.0),
         vec4(1.0, 1.0, 1.0, 1.0),
         vec4(1.0, 1.0, 1.0, 1.0),
         vec4(1.0, 1.0, 1.0, 1.0),
         vec4(1.0, 1.0, 1.0, 1.0),
         vec4(1.0, 1.0, 1.0, 1.0),

         //window
         vec4(153.0/255, 102.0/255, 0.0, 1.0),
         vec4(153.0/255, 102.0/255, 0.0, 1.0),
         vec4(153.0/255, 102.0/255, 0.0, 1.0),
         vec4(153.0/255, 102.0/255, 0.0, 1.0),
         vec4(153.0/255, 102.0/255, 0.0, 1.0),
         vec4(153.0/255, 102.0/255, 0.0, 1.0),
    ];

    //Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 1.0, 1.0);

    //Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    //Load the data into the GPU
    var vertexPositionBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    //Associate vertex data buffer with shader variables
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var vertexColorBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    gl.clear(gl.COLOR_BUFFER_BIT);

    var offsetLoc = gl.getUniformLocation(program, "uOffset");

    var size = gl.getUniformLocation(program, "size");

    gl.uniform4fv(size, [1, 1, 1, 1]);

    //background
    gl.drawArrays(gl.TRIANGLES, 0, 12);

    //house
    gl.drawArrays(gl.TRIANGLES, 12, 6);
    gl.drawArrays(gl.TRIANGLES, 18, 6);
    gl.drawArrays(gl.TRIANGLES, 24, 3);
    gl.drawArrays(gl.TRIANGLES, 27, 9);

    gl.drawArrays(gl.TRIANGLES, 69, 6);
    //large tree
    gl.drawArrays(gl.TRIANGLES, 36, 6);

    //small tree
    gl.drawArrays(gl.TRIANGLES, 42, 9);
    gl.drawArrays(gl.TRIANGLES, 51, 6);
    
    //small tree
    gl.uniform4fv(offsetLoc, [0.2, -0.2, 0, 0]);
    gl.drawArrays(gl.TRIANGLES, 42, 9);
    gl.drawArrays(gl.TRIANGLES, 51, 6);
    
    //small tree
    gl.uniform4fv(offsetLoc, [0.6, 0, 0, 0]);
    gl.drawArrays(gl.TRIANGLES, 42, 9);
    gl.drawArrays(gl.TRIANGLES, 51, 6);

    //star
    gl.drawArrays(gl.TRIANGLES, 57, 6);
    gl.uniform4fv(offsetLoc, [-0.1, 0.2, 0, 0]);
    gl.drawArrays(gl.TRIANGLES, 57, 6);
    gl.uniform4fv(offsetLoc, [-1.4, 0.2, 0, 0]);
    gl.drawArrays(gl.TRIANGLES, 57, 6);
    gl.uniform4fv(offsetLoc, [-1.0, 0, 0, 0]);
    gl.drawArrays(gl.TRIANGLES, 57, 6);

    //star
    gl.uniform4fv(size, [0.6, 0.6, 1, 1]);
    gl.uniform4fv(offsetLoc, [-0.75, 0.4, 0, 0]);
    gl.drawArrays(gl.TRIANGLES, 57, 6);
    gl.uniform4fv(offsetLoc, [-0.8, -1.5, 0, 0]);
    gl.drawArrays(gl.TRIANGLES, 57, 6);
    gl.uniform4fv(offsetLoc, [-1.1, 0, 0, 0]);
    gl.drawArrays(gl.TRIANGLES, 57, 6);
    gl.uniform4fv(offsetLoc, [0, 0, 0, 0]);
    gl.drawArrays(gl.TRIANGLES, 57, 6);

    //change size 
    gl.uniform4fv(size, [0.4, 0.4, 1, 1]);
    //star
    gl.uniform4fv(offsetLoc, [-0.5, 0.3, 0, 0]);
    gl.drawArrays(gl.TRIANGLES, 57, 6);
    gl.uniform4fv(offsetLoc, [0.2, 0.3, 0, 0]);
    gl.drawArrays(gl.TRIANGLES, 57, 6);
    gl.uniform4fv(offsetLoc, [0.1, 0.4, 0, 0]);
    gl.drawArrays(gl.TRIANGLES, 57, 6);
    gl.uniform4fv(offsetLoc, [-0.1, 0.6, 0, 0]);
    gl.drawArrays(gl.TRIANGLES, 57, 6);
    gl.uniform4fv(offsetLoc, [-0.15, 0.55, 0, 0]);
    gl.drawArrays(gl.TRIANGLES, 57, 6);

    //snow
    gl.uniform4fv(offsetLoc, [-0.1, 0, 0, 0]);
    gl.drawArrays(gl.TRIANGLES, 63, 6);
    gl.uniform4fv(offsetLoc, [-1.2, 0.3, 0, 0]);
    gl.drawArrays(gl.TRIANGLES, 63, 6);
    gl.uniform4fv(offsetLoc, [0.1, -0.4, 0, 0]);
    gl.drawArrays(gl.TRIANGLES, 63, 6);
    gl.uniform4fv(offsetLoc, [-0.1, -0.6, 0, 0]);
    gl.drawArrays(gl.TRIANGLES, 63, 6);
    gl.uniform4fv(offsetLoc, [-1.15, -0.55, 0, 0]);
    gl.drawArrays(gl.TRIANGLES, 63, 6);
};

