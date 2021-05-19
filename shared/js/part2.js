// register event listeners for user to choose app
function start()
{
  var ch2Button = document.getElementById('chapter2');
  var ch3Button = document.getElementById('chapter3');
  var ch4Button = document.getElementById('chapter4');
  var ch5Button = document.getElementById('chapter5');

  ch2Button.addEventListener('click', startCh2Tutorial, false);
}

function startCh2Tutorial()
{
  loadApp('html5-fundamentals.html', registerCh2Events);
}

function registerCh2Events()
{
  
}

// get the html content of the selected app
function loadApp(appUrl, registerEvents)
{
  var xhr = new XMLHttpRequest();

  xhr.open('GET', appUrl, true);

  xhr.onload = function()
  {
    if(this.status == 200) 
    {
      document.getElementById('tutorialContainer').innerHTML = this.responseText;
      registerEvents();
    }
  }
  xhr.send();
}

window.addEventListener("load", start, false);