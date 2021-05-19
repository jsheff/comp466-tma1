// will hold JSON array of image names and captions
var myImages;

// global slideshow variables
var timer;
var running = true;
var direction = 1;
var sequential = true;
var currentTransition = 'none';
var slideNumber = 0;
var numSlides = 0;
var border = 10;

// store canvas variable
var canvas = document.getElementById('slideshow');
var ctx = canvas.getContext('2d');

// register event listeners and start the slideshow
function start()
{
  var startButton = document.getElementById("startButton");
  var stopButton = document.getElementById("stopButton");
  var directionButton = document.getElementById("directionButton");
  var randomButton = document.getElementById("randomButton");
  var transitions = document.getElementById("transitions");

  startButton.addEventListener("click", startSlideShow, false);
  stopButton.addEventListener("click", stopSlideShow, false);
  directionButton.addEventListener("click", changeDirection, false);
  randomButton.addEventListener("click", changeSequence, false);
  transitions.addEventListener("change", (event) => {changeTransition(event.target.value);}, false);

  loadImages();
}

function loadImages()
{
  var xhr = new XMLHttpRequest();

  xhr.open('GET', '/shared/js/images.json', true);

  xhr.onload = function(){
    if(this.status == 200) {
      myImages = JSON.parse(this.responseText);
      numSlides = myImages.length;
    }
  }

  xhr.send();
}

// start the slideshow
function startSlideShow()
{
  running = true;
  document.getElementById('startButton').disabled = true;
  slideShow();
  timer = window.setInterval(slideShow, 3000);
}

// draw each frame of the slideshow and then advance to next slide
function slideShow()
{
  drawSlide(slideNumber);
  advanceSlide();
}

// draw selected image and caption
function drawSlide(index)
{
  loadImage(myImages[index].url);
  printCaption(myImages[index].caption);
}

function advanceSlide() {
  if (sequential) {
    slideNumber = (slideNumber + direction) % numSlides;
    if (slideNumber < 0)
    {
      slideNumber = numSlides - 1;
    }
  } else {
    slideNumber = Math.floor(Math.random() * numSlides);
  }
}

function loadImage(url)
{
  var image = new Image();
  image.onload = function()
  {
    
    setTimeout(function() {
      if(running) {
        canvas.classList.add(currentTransition);
      }
    }, 2000);
    
    canvas.width = image.naturalWidth+border;
    canvas.height = image.naturalHeight+border;
    ctx.drawImage(image, 0, 0);
    canvas.classList.remove(currentTransition);
    ctx.strokeStyle = '#7d8c99';
    ctx.lineWidth = 10;
    ctx.strokeRect(border/2, border/2, canvas.width-border, canvas.height-border);
  };
  image.src = url;
}

function printCaption(imgCaption)
{
  var caption = document.getElementById("caption");
  caption.innerHTML = imgCaption;
}

// stop the slideshow
function stopSlideShow()
{
  running = false;
  document.getElementById('startButton').disabled = false;
  clearInterval(timer);
}

// Toggle slideshow between forward and reverse
function changeDirection()
{
  if (direction == 1)
  {
    direction = -1;
    document.getElementById('directionButton').innerText = "Forward";
  } else {
    direction = 1;
    document.getElementById('directionButton').innerText = "Reverse";
  }
  // must advance slide to get to correct spot in images
  advanceSlide();
  advanceSlide();
}

// Toggle slideshow between random and sequential playback
function changeSequence()
{
  if (sequential)
  {
    document.getElementById("randomButton").innerText = "Sequential";
    sequential = false;
    document.getElementById("directionButton").disabled = true;
  } else {
    document.getElementById("randomButton").innerText = "Random";
    sequential = true;
    document.getElementById("directionButton").disabled = false;
  }
}

// apply selected css transition to slideshow
function changeTransition(transition)
{
  canvas.classList.remove(currentTransition, currentTransition+'-display');
  currentTransition = transition;
  canvas.classList.add(currentTransition+'-display');
}

window.addEventListener("load", start, false);