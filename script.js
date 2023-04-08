const scoreEl = document.getElementById('score');

let debugMode = false;
let mockMode = false;

console.log('FT Online!');

// Called to reset all the variables and set up the page
stopMyVideo();

function startMyVideo() {
    hideElement("startVideo");
    showElement("stopVideo");
    showElement("debug");
    startVideo();
}

function stopMyVideo() {
    showElement("startVideo");
    hideElement("stopVideo");
    hideElement("debug");
    stopVideo();
    mockMode = false;
}

registerVideoPlay(playMyVideo);

function playMyVideo(){
    console.log("Now playing webcam...");
    startFT();
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
      if(debugMode){
        drawMyFaceDots(positions);
      }
      drawBothMyEyes(positions)
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
  for(let i=0;i<positions.length;i++){
    const posX = positions[i][0];
    const posY = positions[i][1];
    drawCircle(posX, posY);
    if(debugMode){
        if(mockMode){
          drawText(i,posX, posY);                  
        }else{
          drawText(i,posX, posY,'white');
        }
    }
  }
}

/**
 * Draws the face line
 * @param positions - array of face positions
 */
function drawMyFaceLine(positions){
  const dots = getFTModelDotConnections()
  while(dots.length>0){
    const dotPosition = dots.pop();
    const dotStart = dotPosition[0];
    const dotEnd = dotPosition[1];
    const dotStartX = positions[dotStart][0];
    const dotStartY = positions[dotStart][1];
    const dotEndX = positions[dotEnd][0];
    const dotEndY = positions[dotEnd][1];
    drawLine(dotStartX, dotStartY, dotEndX, dotEndY);
  }
}

/**
 * Draws the face eyes
 * @param positions - array of face positions
 */
function drawBothMyEyes(positions){
  const leftEye = 27;
  const rightEye = 32;
  const growRatio = 4;
  let eyeSize = positions[rightEye][0]/growRatio - positions[leftEye][0]/growRatio;


  let posX = positions[leftEye][0];
  let posY = positions[leftEye][1];
  drawMyEye(posX, posY, eyeSize);

  posX = positions[rightEye][0];
  posY = positions[rightEye][1];
  drawMyEye(posX, posY, eyeSize);
}

function drawMyEye(x,y, eyeSize){
  drawCircle(x, y, 'white', eyeSize);
  drawCircle(x, y, 'brown', eyeSize/3);
  drawEyeLid(x, y+2, 'green', eyeSize, 0, Math.PI);
  drawEyeLid(x, y-2, 'green', eyeSize, Math.PI,0);

  // context.beginPath();
  // context.fillStyle = 'tan';
  // context.arc(x, y+2, eyeSize, 0, Math.PI );
  // context.fill();

  // context.beginPath();
  // context.fillStyle = 'tan';
  // context.arc(x, y-2, eyeSize, Math.PI, 0 );
  // context.fill();
}

function drawEyeLid(x, y, color, eyeSize, sAngle, eAngle){
  context.beginPath();
  context.fillStyle = color;
  context.arc(x, y, eyeSize, sAngle, eAngle);
  context.fill();
}