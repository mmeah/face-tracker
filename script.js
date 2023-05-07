const scoreEl = document.getElementById('score');

let debugMode = false;
let mockMode = false;

console.log('FT Online!');

// Called to reset all the variables and set up the page
stopMyVideo();

function startMyVideo() {
    // Setup element show hide states
    hideElement("startVideo");
    showElement("stopVideo");
    showElement("debug");
    // Call helper library to start webcam
    startVideo();
}

function stopMyVideo() {
    // Setup element show hide states
    showElement("startVideo");
    hideElement("stopVideo");
    hideElement("debug");
    // Call helper library to stop webcam
    stopVideo();
    mockMode = false;
}
registerVideoPlay(playMyVideo);

function playMyVideo(){
    console.log("Now playing webcam...");

    // Start Facetracker
    startFT();

    // Draw my face
    drawMyFace();
}

function debugMyApp(){
  debugMode = !debugMode;
  if(!isVideoStarted()){
      console.log("no signal :(");
      mockMode = true;
      console.log("Starting mock mode...");
      drawMyFace();
  }
  if(!debugMode){
    mockMode = false;
  }
}

function drawMyFace(){
    clearCanvas();
    let positions = [];
    if(mockMode){
      positions = mockFacePositions;
    }else{
      positions = getFTPositions();
    }
    setMyFaceScore();
    
    if(positions.length>0){
      drawMyFaceLine(positions);
      drawMyFaceDots(positions);
      drawMyEyes(positions);
    }

    if(isVideoStarted() || mockMode){
        setTimeout(drawMyFace, 100);
    }
}

function setMyFaceScore(){
  const score = getFTScore();
  scoreEl.innerText = Math.round(score);
}

/**
 * Draws the face dots
 * @param positions - array of face positions
 */
function drawMyFaceDots(positions){
  // loop through all dots to draw the face
  for(let i=0;i<positions.length;i++){
    const posX = positions[i][0];
    const posY = positions[i][1];
    drawCircle(posX,posY,'#0000FF');
    if(debugMode){
        // write the dot label on the screen with drawText
        drawText(i,posX,posY);
    }
  }
}

/**
 * Draws the face line
 * @param positions - array of face positions
 */
function drawMyFaceLine(positions){
  // for(let i =0;i<positions.length-1;i++){
  //   const x1=positions[i][0];
  //   const y1=positions[i][1];
  //   const x2=positions[i+1][0];
  //   const y2=positions[i+1][1];
  //   drawLine(x1,y1,x2,y2,'green');
  // }

  const dots = getFTModelDotConnections();
  while(dots.length>0){
    const myDot = dots.pop();
    const myDotStart = myDot[0];
    const myDotEnd = myDot[1];

    const x1=positions[myDotStart][0];
    const y1=positions[myDotStart][1];
    const x2=positions[myDotEnd][0];
    const y2=positions[myDotEnd][1];
    drawLine(x1,y1,x2,y2,'green');
    // connect the dots positions with drawLine
  }

}

function drawMyEyes(positions){

  const leftEye=27;
  const rightEye=32;
  const eyeSize=10;
  const leftEyeX=positions[leftEye][0];
  const leftEyeY=positions[leftEye][1];
  const rightEyeX=positions[rightEye][0];
  const rightEyeY=positions[rightEye][1];
  drawMyEye(leftEyeX,leftEyeY,eyeSize);
  drawMyEye(rightEyeX,rightEyeY,eyeSize);
  
  
}

function drawMyEye(x,y,eyeSize){
  drawCircle(x,y,'white',eyeSize);
  drawCircle(x,y,'red',eyeSize/3);
  drawMyEyeLid(x,y+2,'green',eyeSize,0,Math.PI);
  drawMyEyeLid(x,y-2,'green',eyeSize,Math.PI,0);
}

function drawMyEyeLid(x,y,color,eyeSize,sAngle,eAngle){
  context.beginPath();
  context.fillStyle = color;
  context.arc(x, y, eyeSize,sAngle,eAngle);
  context.fill();
}