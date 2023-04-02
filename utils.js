/**
 * @author Mohammed Meah
 * @version 1.0.0
 * 
 * Helper utility to show face tracking 
 * 
 * The most important functions to call are:
 *  startVideo() - start the video stream and if successful will fire a 'play' event
 *  stopVideo() - stops the video stream
 *  registerVideoPlay(fn) - tells your app the video has started to 'play', fn is your function to be called on 'play'
 *  startFT() - start the face tracking library
 */
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext("2d");
//const _mockFacePositions //not included here. See mock-face.js



// =================== Video Helper ===================
/**
 * Starts the video, if the video cannot start then an error is logged
 */
function startVideo() {
    if(navigator && typeof navigator.getUserMedia === 'function'){
        navigator.getUserMedia(
            { video: {} },
            stream => video.srcObject = stream,
            err => console.error(err)
        );
    }else{
        console.error('Failed to start video :(')
    }
}

/**
 * Stops the video
 */
function stopVideo() {
    if(isVideoStarted()){
        const tracks = video.srcObject.getTracks();
        if(tracks){
            tracks.forEach(track => track.stop());
        }
        video.srcObject = null;
        faceTracker.stop();
    }
    _clearCanvasDelay200();
}

/**
 * Checks if the video source is started. It will return true or false
 * @returns boolean
 */
function isVideoStarted() {
    if(video.srcObject){
        return true;
    }else{
        return false;
    }
}

/**
 * Registers to the video for a play event
 * @param function - what function is called when 'play' event is fired
 */
function registerVideoPlay(fn){
    video.addEventListener('play', () => {
        fn()
    });
}

// =================== Face Tracker Helper ===================

let faceTracker; // Face Tracking
// See https://www.auduno.com/clmtrackr/docs/reference.html for function documentation

/**
 * Registers to the video for a play event
 */
function startFT(){
    if(!_initOnce){
        _initSetup();
    }
    faceTracker.start(video);
}

/**
 * Gets the Face Tracker Positions
 * @returns array of positions
 */
function getFTPositions(){
    return faceTracker.getCurrentPosition();
}

/**
 * Gets the Face Tracker Positions
 * @returns number - score of face detection from 0 - 100
 */
function getFTScore(){
    return faceTracker.getScore() * 100;
}

// Face Tracker Internals
let _initOnce = false;

/**
 * Internal
 * Initial facetracker setup
 */
function _initSetup(){
    _initOnce = true;
    faceTracker = new clm.tracker();
    faceTracker.init();
}

const Direction = {
    Up: 'Up',
    Down: 'Down',
    Left: 'Left',
    Right: 'Right'
  };

// =================== Canvas Helper ===================
/**
 * Draw a tiny circle at x,y of some color and size
 * @param x - X coordinate of the circle
 * @param y - Y coordinate of the circle
 * @param color - (optional) color of the circle, default 'red'
 * @param size - (optional) size of the circle, default 2
 */
function drawCircle(x, y, color, size){
    if(!color) color = 'red';
    if(!size) size = 2;
    context.fillStyle = color;
    context.fillRect(x, y, size, size);
}


/**
 * Write text at x,y of some color and size
 * @param text - text to write
 * @param x - X coordinate of the text
 * @param y - Y coordinate of the text
 * @param color - (optional) color of the text, default 'blue'
 * @param size - (optional) size of the circle, default 12
 */
function drawText(text, x, y, color, size){
    if(!color) color = 'blue';
    if(!size) size = 12;
    context.fillStyle = color;
    context.font = size+"px Arial";
    context.fillText(text, x, y);
}

/**
 * Clear the canvas
 */
function clearCanvas(){
    context.clearRect(0, 0, canvas.width, canvas.height);
}


// Canvas Internals
/**
 * Internal
 * clears the canvas after 200ms
 */
function _clearCanvasDelay200(){
    setTimeout(clearCanvas, 200);
}

// =================== Show/Hide Element Helper ===================

/**
 * Shows an element on the page
 * @param elementId - html id
 */
function showElement(elementId){
    var element = document.getElementById(elementId);
    element.style.display = "block";
}


/**
 * Hides an element on the page
 * @param elementId - html id
 */
function hideElement(elementId){
    var element = document.getElementById(elementId);
    element.style.display = "none";
}