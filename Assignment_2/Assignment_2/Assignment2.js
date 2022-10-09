var gl;
var points;
var direction = true;
var direction2 = true;
var program;
var uOffset;
var maxNumTriangles = 200;
var maxNumVertices = 3 * maxNumTriangles;
var moveX = 0;
var moveY = 0;
var moveXx = 0;
var moveYy = 0;

var star = [];
var max = 15;
var x = 0;
var y = 0;
var theta = 0.0;
var thetaLoc;


window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );

    canvas.addEventListener("mousedown", function(event){
        var vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

        x = 2 * event.clientX / canvas.width - 1;
        y = 2 * (canvas.height - event.clientY) / canvas.height - 1;

        if(y > -0.8){
           if (star.length >= max) {
            star.reverse().pop();
            star.reverse();
          }

          star.push(vec2(x, y));
        }


    });

    if ( !gl ) { alert( "WebGL isn't available" ); }

    // Add direction event listener
    var dirButton = document.getElementById("Direction");

    dirButton.addEventListener("click", function(){
      direction =! direction;
      direction2 =! direction2;
    });

    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor(0.0, 0.0, 0.0, 1.0);


    //  Load shaders

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // uniform variable
    uOffset = gl.getUniformLocation(program, "uOffset");

    render();


};

function render() {
  setTimeout(function () {
      // clear buffer bit
      gl.clear(gl.COLOR_BUFFER_BIT);

      drawBackground()
      gl.clearColor(0.3, 0.6, 0.1, 1 ); //ground color
      drawMountain();
      drawTree();

      
      if(direction == true)
      {
        if(moveX > 0.1)
         {
           direction =! direction
         }
         moveX += 0.01
         moveY += 0.008

         drawMoon(moveX, moveY);

      }
      else if(direction == false)
      {
        if(moveX < -0.1)
         {
           direction =! direction
         }

         moveX -= 0.01
         moveY -= 0.008

         drawMoon(moveX, moveY);

      }


      if(direction2 == true)
      {
        if(moveXx > 0.1)
         {
           direction2 =! direction2
         }
         moveXx += 0.01
         moveYy -= 0.008

         drawRotationStar(moveXx, moveYy);

      }
      else if(direction2 == false)
      {
        if(moveXx < -0.1)
         {
           direction2 =! direction2
         }

         moveXx -= 0.01
         moveYy += 0.008

         drawRotationStar(moveXx, moveYy);

         
      }

      for (var i = 0; i < star.length; i++) {
         drawStar(star[i][0], star[i][1]);
         console.log(star[i][0]);
      }

      requestAnimFrame(render);
   }, 100);
}



function drawBackground(){
    // Background vertices
     var bgVertices = [ vec2(-1.0, 1.0),
                        vec2(-1, -0.5), 
                        vec2(1, 1),
                        vec2(-1.0, -0.5), 
                        vec2(1, 1), 
                        vec2(1, -0.5),
                     ];

    var bgColors = [
      vec4(0.3, 0.2, 1, 1),
      vec4(0.5, 1, 1, 1),
      vec4(0.3, 0.2, 1, 1),
      vec4(0.5, 1, 1, 1),
      vec4(0.3, 0.2, 1, 1),
      vec4(0.5, 1, 1, 1),
    ];

    var bgBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bgBufferId );
    gl.bufferData( gl.ARRAY_BUFFER,flatten(bgVertices), gl.STATIC_DRAW );

    var bgColorBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bgColorBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(bgColors), gl.STATIC_DRAW );

    gl.bindBuffer( gl.ARRAY_BUFFER, bgBufferId );
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER, bgColorBufferId );

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );

    var size = gl.getUniformLocation(program, "size");
    gl.uniform4fv(size, [1, 1, 1, 1]);

    gl.enableVertexAttribArray( vPosition );
    gl.enableVertexAttribArray( vColor );
    gl.uniform4fv(uOffset, [0, 0, 0, 0]);

    // Render background
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 6);
}

function drawMountain(){
   // Mountain vertices
     var mountainVertices = [ 
                            vec2(-0.8, -0.5),
                            vec2(-0.4, 0.6),
                            vec2(0, -0.5),
                            vec2(0, -0.5), 
                            vec2(0.2, 0.2), 
                            vec2(0.4, -0.5),
                           ];

    var mountainBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, mountainBufferId );
    gl.bufferData( gl.ARRAY_BUFFER,flatten(mountainVertices), gl.STATIC_DRAW );

    gl.bindBuffer( gl.ARRAY_BUFFER, mountainBufferId );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.disableVertexAttribArray(vColor);
    gl.vertexAttrib4f(vColor, 0, 0.8, 0, 1); // green

    var size = gl.getUniformLocation(program, "size");
    gl.uniform4fv(size, [1, 1, 1, 1]);

    gl.enableVertexAttribArray( vPosition );
    gl.uniform4fv(uOffset, [0, 0, 0, 0]);
    // Render mountain
    gl.drawArrays( gl.TRIANGLES, 0, 3);
    gl.drawArrays( gl.TRIANGLES, 3, 6);

}

function drawTree(){
  // Tree vertices
    var treeVertices = [ 
                           vec2(0.1, 0),
                           vec2(-0.1, -0.25),
                           vec2(0.3, -0.25),
                           vec2(0.1, -0.15), 
                           vec2(-0.15, -0.4), 
                           vec2(0.35, -0.4),
                          ];

   var treeBufferId = gl.createBuffer();
   gl.bindBuffer( gl.ARRAY_BUFFER, treeBufferId );
   gl.bufferData( gl.ARRAY_BUFFER,flatten(treeVertices), gl.STATIC_DRAW );

   gl.bindBuffer( gl.ARRAY_BUFFER, treeBufferId );

   var vPosition = gl.getAttribLocation( program, "vPosition" );
   gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );

   var vColor = gl.getAttribLocation(program, "vColor");
   gl.disableVertexAttribArray(vColor);
   gl.vertexAttrib4f(vColor, 0, 0.2, 0, 0.5); // green

   gl.enableVertexAttribArray( vPosition );
   gl.uniform4fv(uOffset, [0.6, 0.05, 0, 0]);
   // Render tree
   gl.drawArrays( gl.TRIANGLES, 0, 3);
   gl.drawArrays( gl.TRIANGLES, 3, 6);


   // Tree vertices
   var treeVertices2 = [ 
    vec2(0.05, -0.4),
    vec2(0.15, -0.4),
    vec2(0.05, -0.65),
    vec2(0.05, -0.65), 
    vec2(0.15, -0.65), 
    vec2(0.15, -0.4),
   ];

  var treeBufferId2 = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, treeBufferId2 );
  gl.bufferData( gl.ARRAY_BUFFER,flatten(treeVertices2), gl.STATIC_DRAW );

  gl.bindBuffer( gl.ARRAY_BUFFER, treeBufferId2 );

  var vPosition = gl.getAttribLocation( program, "vPosition" );
  gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );

  var vColor = gl.getAttribLocation(program, "vColor");
  gl.disableVertexAttribArray(vColor);
  gl.vertexAttrib4f(vColor, 0.5, 0.25, 0, 1); // green

  gl.enableVertexAttribArray( vPosition );
  gl.uniform4fv(uOffset, [0.6, 0.05, 0, 0]);
  // Render tree
  gl.drawArrays( gl.TRIANGLES, 0, 3);
  gl.drawArrays( gl.TRIANGLES, 3, 6);

}


// Generate a polygon at the canvas location where you click the mouse
function drawStar(x, y){
   var star = [
    vec2(x, y + 0.05), 
    vec2(x - 0.1, y - 0.05),
    vec2(x + 0.1, y - 0.05),
    vec2(x, y - 0.08),
    vec2(x - 0.1, y + 0.01),
    vec2(x + 0.1, y + 0.01)
   ];

   var vertexPositionBufferId = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBufferId);
   gl.bufferData(gl.ARRAY_BUFFER, flatten(star), gl.STATIC_DRAW);

   var vPosition = gl.getAttribLocation(program, "vPosition");
   gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(vPosition);

   var vColor = gl.getAttribLocation(program, "vColor");
   gl.disableVertexAttribArray(vColor);
   gl.vertexAttrib4f(vColor, 1.0, 1.0, 1.0, 1.0);
   gl.uniform4fv(uOffset, [0, 0, 0, 0]);

   gl.drawArrays( gl.TRIANGLES, 0, 6);
}


// Animation
function drawMoon(transf_x, transf_y){
    // moon vertices
     var moonVertices = [
                      vec2(-0.65, 0.6),
                      vec2(-0.8, 0.78),
                      vec2(-0.79, 0.6),
                      vec2(-0.7, 0.5),
                      vec2(-0.55, 0.5),
                      vec2(-0.45, 0.6)
                           ];

    var moonBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, moonBufferId );
    gl.bufferData( gl.ARRAY_BUFFER,flatten(moonVertices), gl.STATIC_DRAW );

    gl.bindBuffer( gl.ARRAY_BUFFER, moonBufferId );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.disableVertexAttribArray(vColor);
    gl.vertexAttrib4f(vColor, 1.0, 1.0, 0.0, 1.0);

    var size = gl.getUniformLocation(program, "size");
    gl.uniform4fv(size, [1, 1, 1, 1]);

    gl.enableVertexAttribArray( vPosition );
    gl.uniform4fv(uOffset, [transf_x, transf_y, 0, 0]);
    // Render moon
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 6);

}


// Animation
function drawRotationStar(transf_x, transf_y){

  // line star vertices
  var starVertices = [
                      vec2(0.65, 0.7),
                      vec2(0.52, 0.6),
                      vec2(0.68, 0.6),
                      vec2(0.55, 0.7),
                      vec2(0.6, 0.54)
                    ];
  
  var starBufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, starBufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(starVertices), gl.STATIC_DRAW);
                

  var vPosition = gl.getAttribLocation( program, "vPosition" );
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  var vColor = gl.getAttribLocation(program, "vColor");
  thetaLoc = gl.getUniformLocation( program, "theta" );

  
  gl.uniform4fv(uOffset, [transf_x, transf_y, 0, 0]);
  gl.vertexAttrib4f(vColor, 1.0, 1.0, 1.0, 1.0);

  gl.enableVertexAttribArray( vPosition );
  
  gl.uniform1f( thetaLoc, theta );
  gl.drawArrays(gl.LINE_LOOP, 0, 5);


  var lineVertices = [
    vec2(0.3, 0.8),
    vec2(0.5, 0.7),
    
  ];

  var lineBufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, lineBufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(lineVertices), gl.STATIC_DRAW);
                
  

  var vPosition = gl.getAttribLocation( program, "vPosition" );
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  var vColor = gl.getAttribLocation(program, "vColor");
  thetaLoc = gl.getUniformLocation( program, "theta" );


  gl.uniform4fv(uOffset, [transf_x, transf_y, 0, 0]);
  gl.vertexAttrib4f(vColor, 1.0, 1.0, 1.0, 1.0);

  gl.enableVertexAttribArray( vPosition );
  
  gl.uniform1f( thetaLoc, theta );
  gl.drawArrays(gl.LINES, 0, 2);




  var lineVertices2 = [
    vec2(0.3, 0.75),
    vec2(0.5, 0.65),
    
  ];

  var line2BufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, line2BufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(lineVertices2), gl.STATIC_DRAW);
                
  
  var vPosition = gl.getAttribLocation( program, "vPosition" );
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  var vColor = gl.getAttribLocation(program, "vColor");
  thetaLoc = gl.getUniformLocation( program, "theta" );

  
  gl.uniform4fv(uOffset, [transf_x, transf_y, 0, 0]);
  gl.vertexAttrib4f(vColor, 1.0, 1.0, 1.0, 1.0);

  gl.enableVertexAttribArray( vPosition );
  
  gl.uniform1f( thetaLoc, theta );
  gl.drawArrays(gl.LINES, 0, 2);

}