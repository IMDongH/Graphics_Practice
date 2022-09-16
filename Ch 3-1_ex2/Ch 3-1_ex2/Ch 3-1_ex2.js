
var gl;
var points;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    // hexagon vertices
	var triangleVertices = [
        vec2(0.0,  1), //v0
        vec2(0.6,  0.5), //v1
        vec2(-0.6,  0.5), //v2

        vec2(0.0,  0.5), //v3
        vec2(0.6,  0.0), //v4
        vec2(-0.6,  0.0), //v5

        vec2(0.0,  0.0), //v3
        vec2(0.6,  -0.5), //v4
        vec2(-0.6,  -0.5), //v5
    ];


	// triangle vertices
    var squareVertices = [
        vec2(-0.2,  -0.5), //v3
        vec2(0.2,  -0.5), //v4
        vec2(-0.2,  -1.0), //v5

        vec2(0.2,  -1.0), //v3
        vec2(0.2,  -0.5), //v4
        vec2(-0.2,  -1.0), //v5
    ];

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vPosition = gl.getAttribLocation(program,"vPosition");
    var vColor = gl.getAttribLocation(program,"vColor");
  

    var treeTriangleBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, treeTriangleBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(triangleVertices), gl.STATIC_DRAW);

    gl.vertexAttribPointer(vPosition, 2 ,gl.FLOAT, false, 0,0);
    gl.enableVertexAttribArray(vPosition);
    gl.vertexAttrib4f(vColor, 0.0, 1.0, 0.0, 1.0);

    gl.drawArrays(gl.TRIANGLES,0,9);

    var treeSquareBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, treeSquareBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(squareVertices), gl.STATIC_DRAW);

    gl.vertexAttribPointer(vPosition, 2 ,gl.FLOAT, false, 0,0);
    gl.enableVertexAttribArray(vPosition);

    gl.vertexAttrib4f(vColor, 0.5, 0.4, 0.3, 1.0);
    gl.drawArrays(gl.TRIANGLES,0,6);



};

