var gl;
var points;
var program;
var stars=[];
var x = 0;
var y = 0;
var fallSnowX = new Array(100).fill(0);;
var fallSnowY = new Array(100).fill(0);;
var direction = true;
var theta = new Array(100).fill(0.0);


window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }
    canvas.addEventListener("mousedown", function(event){
 
        x = 2 * event.clientX / canvas.width - 1;
        y = 2 * (canvas.height - event.clientY) / canvas.height - 1;
        
        stars.push(vec2(x, y));
        } );
   
    var button = document.getElementById("direction");

    button.addEventListener("click", function(){
          direction =! direction;
        });

    //Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 1.0, 1.0);

    //Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    render();
   
   };

function render(){
    setTimeout(function () {
        // clear buffer bit
        gl.clear(gl.COLOR_BUFFER_BIT);
  
        drawBackground();
        drawHouse();
        drawLargeTree();
        drawSmallTree();        
        
        
        for (var i = 0; i < stars.length; i++) {
            theta[i] += (direction ? 0.1 : -0.1);    
            fallSnowX[i] += (direction ? 0.01 : -0.01);
            fallSnowY[i] +=  -0.01 ;
            drawStars(stars[i][0], stars[i][1],fallSnowX[i],fallSnowY[i],theta[i]);         
           
        }
  
        requestAnimFrame(render);
        
     }, 100);
}
function drawStars(x,y,fallSnowX,fallSnowY,theta)
{
    
    
    var vertices = [  
    x+0,y+0.8*0.05, 
    x+-0.5*0.05,y-0.8*0.05,
    x+0.3*0.05,y-0.3*0.05,

    x-0.8*0.05,y+0.1*0.05, 
    x+0.2*0.05,y+0.1*0.05,
    x+0.5*0.05,y-0.8*0.05, 

    x-0.2*0.05,y+0.1*0.05, 
    x-0.5*0.05,y-0.8*0.05,
    x+0.8*0.05,y+0.1*0.05, 
];
    var starBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, starBufferId );
    gl.bufferData( gl.ARRAY_BUFFER,flatten(vertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.disableVertexAttribArray(vColor);
    gl.vertexAttrib4f(vColor, 1, 1, 1, 1); // green

    var thetaLoc = gl.getUniformLocation( program, "theta" );
    gl.uniform1f( thetaLoc, theta );
    console.log(theta)
    var offsetLoc = gl.getUniformLocation(program, "uOffset");
    gl.uniform4fv(offsetLoc, [fallSnowX, fallSnowY, 0, 0]);

    gl.drawArrays(gl.TRIANGLES, 0, 9);

}


function drawLargeTree(){
    var thetaLoc = gl.getUniformLocation( program, "theta" );
    gl.uniform1f( thetaLoc, 0);
    var treeVertices = [ 
        -0.75, 0.6, -0.65, 0.4, -0.85, 0.4,
        -0.75, 0.4, -0.60, 0.2, -0.90, 0.2,
        -0.75, 0.2, -0.55, -0.10, -0.95, -0.10,
        -0.80, -0.1, -0.70, -0.1, -0.80, -0.45,
        -0.80, -0.45, -0.70, -0.45, -0.70, -0.1,
       ];
    var treeColors =[

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
    ]

    var treeBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, treeBufferId );
    gl.bufferData( gl.ARRAY_BUFFER,flatten(treeVertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var vertexColorBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(treeColors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var offsetLoc = gl.getUniformLocation(program, "uOffset");

    gl.uniform4fv(offsetLoc, [0, -0.3, 0, 0]);
    //large tree
    gl.drawArrays(gl.TRIANGLES, 0, 9);
    gl.drawArrays(gl.TRIANGLES, 9, 6);

    gl.uniform4fv(offsetLoc, [0.3, -0.3, 0, 0]);
    //large tree
    gl.drawArrays(gl.TRIANGLES, 0, 9);
    gl.drawArrays(gl.TRIANGLES, 9, 6);

    gl.uniform4fv(offsetLoc, [0.6, -0.3, 0, 0]);
    //large tree
    gl.drawArrays(gl.TRIANGLES, 0, 9);
    gl.drawArrays(gl.TRIANGLES, 9, 6);

}
function drawSmallTree(){
    var thetaLoc = gl.getUniformLocation( program, "theta" );
    gl.uniform1f( thetaLoc, 0);
    var treeVertices = [
         
        //small tree

        -0.4, -0.15, -0.65, -0.4, -0.15, -0.4,
        -0.4, 0, -0.6, -0.25, -0.2, -0.25,
        -0.4, 0.15, -0.50, -0.1, -0.30, -0.1,
        -0.45, -0.65, -0.35, -0.65, -0.35, -0.4,
        -0.45, -0.4, -0.35, -0.4, -0.45, -0.65,
    ]

    var treeColors = [

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
    ]
    var streeBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, streeBufferId );
    gl.bufferData( gl.ARRAY_BUFFER,flatten(treeVertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var vertexColorBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(treeColors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var offsetLoc = gl.getUniformLocation(program, "uOffset");


    //small tree

    gl.uniform4fv(offsetLoc, [0.1, -0.2, 0, 0]);
    gl.drawArrays(gl.TRIANGLES, 0, 9);
    gl.drawArrays(gl.TRIANGLES, 9, 6);

    //small tree
    gl.uniform4fv(offsetLoc, [-0.2, -0.2, 0, 0]);
    gl.drawArrays(gl.TRIANGLES, 0, 9);
    gl.drawArrays(gl.TRIANGLES, 9, 6);

    //small tree
    gl.uniform4fv(offsetLoc, [-0.5, -0.2, 0, 0]);
    gl.drawArrays(gl.TRIANGLES, 0, 9);
    gl.drawArrays(gl.TRIANGLES, 9, 6);
}

function drawHouse(){
    var thetaLoc = gl.getUniformLocation( program, "theta" );
    gl.uniform1f( thetaLoc, 0);
    var houseVertices = [

        0.5, -0.6, 0.5, -0.1, 1.0, -0.1,
        0.5, -0.6, 1.0, -0.6, 1.0, -0.1,

        0.6, -0.6, 0.75, -0.25, 0.6, -0.25,
        0.6, -0.6, 0.75, -0.6, 0.75, -0.25,

        0.4, -0.1, 1.1, -0.1, 0.75, 0.3,

        //window
        0.85, -0.35, 0.85, -0.2, 1.0, -0.2,
        0.85, -0.35, 1.0, -0.35, 1.0, -0.2,
    ]

    var houseColors = [

        vec4(1, 204 / 255, 153 / 255, 1),
        vec4(1, 204 / 255, 153 / 255, 1),
        vec4(1, 204 / 255, 153 / 255, 1),
        vec4(1, 204 / 255, 153 / 255, 1),
        vec4(1, 204 / 255, 153 / 255, 1),
        vec4(1, 204 / 255, 153 / 255, 1),

        vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1),

        vec4(204 / 255, 1, 1, 1),
        vec4(1, 1, 1, 1),
        vec4(1, 1, 1, 1),


        //window
        vec4(153.0 / 255, 102.0 / 255, 0.0, 1.0),
        vec4(153.0 / 255, 102.0 / 255, 0.0, 1.0),
        vec4(153.0 / 255, 102.0 / 255, 0.0, 1.0),
        vec4(153.0 / 255, 102.0 / 255, 0.0, 1.0),
        vec4(153.0 / 255, 102.0 / 255, 0.0, 1.0),
        vec4(153.0 / 255, 102.0 / 255, 0.0, 1.0),
    ]

    var offsetLoc = gl.getUniformLocation(program, "uOffset");
    gl.uniform4fv(offsetLoc, [0, 0, 0, 0]);

    var houseBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, houseBufferId );
    gl.bufferData( gl.ARRAY_BUFFER,flatten(houseVertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var vertexColorBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(houseColors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    gl.drawArrays(gl.TRIANGLES, 0, 21);
}

function drawBackground(){
    var thetaLoc = gl.getUniformLocation( program, "theta" );
    gl.uniform1f( thetaLoc, 0);
    var backgroundVertices  = [

        // background
        -1.0, 1.0, -1, -0.6, 1, 1,
        -1.0, -0.6, 1, 1, 1, -0.6,

        //ground
        -1.0, -0.6, -1.0, -1.0, 1.0, -0.6,
        -1.0, -1.0, 1.0, -0.6, 1.0, -1.0,
    ]

    var backgroundColors = [
        //background
        vec4(1, 1, 1, 1),
        vec4(0, 0, 0, 1),
        vec4(1, 1, 1, 1),
        vec4(0, 0, 0, 1),
        vec4(1, 1, 1, 1),
        vec4(0, 0, 0, 1),

        //ground
        vec4(0.0, 0.3, 0.0, 0.5),
        vec4(0.0, 0.3, 0.0, 0.5),
        vec4(0.0, 0.3, 0.0, 0.3),
        vec4(0.0, 0.3, 0.0, 0.5),
        vec4(0.0, 0.3, 0.0, 0.3),
        vec4(0.0, 0.3, 0.0, 0.3),]
        
        var offsetLoc = gl.getUniformLocation(program, "uOffset");
        gl.uniform4fv(offsetLoc, [0, 0, 0, 0]);

        var backgroundBufferId = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, backgroundBufferId );
        gl.bufferData( gl.ARRAY_BUFFER,flatten(backgroundVertices), gl.STATIC_DRAW );
    
        var vPosition = gl.getAttribLocation(program, "vPosition");
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);
    
        var vertexColorBufferId = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBufferId);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(backgroundColors), gl.STATIC_DRAW);
    
        var vColor = gl.getAttribLocation(program, "vColor");
        gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);


        gl.drawArrays(gl.TRIANGLES, 0, 12);
}

