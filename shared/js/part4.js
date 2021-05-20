// register event listeners for user to choose app
function start()
{
  var measurementButton = document.getElementById('measurement');
  var mortgageButton = document.getElementById('mortgage');
  var retirementButton = document.getElementById('retirement');

  measurementButton.addEventListener('click', startMeasurementApp, false);
  mortgageButton.addEventListener('click', startMortgageApp, false);
  retirementButton.addEventListener('click', startRetirementApp, false);
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
      document.getElementById('appContainer').innerHTML = this.responseText;
      registerEvents();
    }
  }
  xhr.send();
}

/*
  Measurement Converter App
*/

var conversions;

// load the measurement converter div
function startMeasurementApp() 
{
  loadApp('measurement.html', registerMeasurementEvents);
}

// get the selected units of measure of the currently selected conversion type
function loadUnitConversions(fileName)
{
  var xhr = new XMLHttpRequest();

  xhr.open('GET', fileName, true);

  xhr.onerror = function()
  {
    console.log("An error occured getting file " + fileName);
  }

  xhr.onload = function()
  {
    if(this.status == 200) 
    {
      conversions = JSON.parse(this.responseText);
      populateOptions();
    } else if ( this.status >= 400) {
      console.log("Error " + this.status + " occured getting file " + fileName)
    }
  }
  xhr.send();
}

function registerMeasurementEvents()
{
  // register event listeners for the measurement converter controls
  document.getElementById('weightButton').addEventListener('click', function(e) {
    selectApp(e, loadUnitConversions, '/shared/js/weightConversion.json');
  });
  
  document.getElementById('lengthButton').addEventListener('click', function(e) {

    selectApp(e, loadUnitConversions, '/shared/js/lengthConversion.json');
  });
  
  document.getElementById('areaButton').addEventListener('click', function(e) {

    selectApp(e, loadUnitConversions, '/shared/js/areaConversion.json');
  });
  
  document.getElementById('volumeButton').addEventListener('click', function(e) {

    selectApp(e, loadUnitConversions, '/shared/js/volumeConversion.json');
  });

  document.getElementById('weightButton').click();

  // Listen for any change in number fields or a change in units for measurement app
  document.getElementById('convertLHS').addEventListener('input', function(e){
    var toConvert = e.target.value;
    document.getElementById('convertRHS').value = convert(toConvert, true);
  });

  document.getElementById('convertRHS').addEventListener('input', function(e){
    var toConvert = e.target.value;
    document.getElementById('convertLHS').value = convert(toConvert, false);
  });

  document.getElementById('unitsLHS').addEventListener('input', function(){
    var toConvert = document.getElementById('convertLHS').value;
    document.getElementById('convertRHS').value = convert(toConvert, true);
  });

  document.getElementById('unitsRHS').addEventListener('input', function(){
    var toConvert = document.getElementById('convertLHS').value;
    document.getElementById('convertRHS').value = convert(toConvert, true);
  });
}

// Choose the type of measurement conversion app based on which button was pressed
function selectApp(e, loadUnits, unitJSONFile)
{
  // make the currently selected button active and show the corresponding app units
  var buttons = document.getElementsByTagName('button');
  //var appDivs = document.getElementsByClassName('appDiv');
  for (var i = 0; i < buttons.length; i++)
  {
    buttons[i].classList.remove('active');
  }
  e.target.classList.add('active');

  // clear number fields
  document.getElementById('convertLHS').value = "";
  document.getElementById('convertRHS').value = "";

  loadUnitConversions(unitJSONFile);
}

function populateOptions()
{
  // add unit options from corresponding measurement unit array
  var selectLHS = document.getElementById('unitsLHS');
  selectLHS.options.length = 0;
  var selectRHS = document.getElementById('unitsRHS');
  selectRHS.options.length = 0;
  for (i = 0; i < conversions.length; i++)  
  {
    var option1 = document.createElement('option');
    var option2 = document.createElement('option');
    option1.text = conversions[i].unit;
    option2.text = conversions[i].unit;
    option1.id = conversions[i].abbr;
    option2.id = conversions[i].abbr;
    selectLHS.add(option1);
    selectRHS.add(option2);
  }
}

function convert(input, leftToRight) 
{
  // get the selected conversion unit for left hand side
  var indexLHS = document.getElementById('unitsLHS').selectedIndex;

  // get the selected conversion unit for right hand side
  var indexRHS = document.getElementById('unitsRHS').selectedIndex;
  
  var output;
  if (leftToRight) 
  {
    output = input * conversions[indexLHS].conv / conversions[indexRHS].conv;
  } else 
  {
    output = input * conversions[indexLHS].conv / conversions[indexLHS].conv;
  }
  
  // format the output to scientific notation if it is too small to display
  if (output < 0.000001) 
  {
    return output.toExponential(6);
  } else 
  {
    return output.toFixed(6);
  }
}

/*
  Mortgage App
*/

var price = 0;        // market value of the home
var downpayment = 0;  // total amount you pay towards market value of home
var amortization = 0; // number of years to repay the loan
var annualRate = 0;   // annual interest rate

// load the mortgage div
function startMortgageApp() 
{
  loadApp('mortgage.html', registerMortgageEvents);
}

function registerMortgageEvents() 
{
  // register event listeners for the input fields
  document.getElementById('homePrice').addEventListener('blur', function() { validatePrice(this.value);
  });
  document.getElementById('downpayment').addEventListener('blur', function() { validateDownpayment(this.value);
  });
  document.getElementById('amortization').addEventListener('blur', function() { validateAmortization(this.value);
  });
  document.getElementById('annualRate').addEventListener('blur', function() { validateRate(this.value);
  });
  
  // register event listener for calculating the payment
  document.getElementById('calculatePayment').addEventListener('click', calculatePayment, false);
}

function validatePrice(input) 
{
  if (input == "" || input < 0) 
  {
    document.getElementById('priceError').innerText = "Enter a home price";
    price = 0;
  } else 
  {
    document.getElementById('priceError').innerText = "";
    price = input;
  }
}

function validateDownpayment(input) 
{
  var outputMessage = "";
  if (price > 0) 
  {
    if (input == '')
    {
      outputMessage = "Enter down payment amount";
    } else 
    {
      downpayment = parseInt(input);
      var minDownPayment;
      if (price > 0 && price <= 500000) 
      {
        minDownPayment = price * 0.05;
        if (downpayment < minDownPayment)
        {
          outputMessage = "Down payment must be at least %5 or $" + minDownPayment;
          downpayment = 0;
        }
      } else if (price > 500000 && price < 1000000) 
      {
        minDownPayment = 25000 + ((price - 500000) * 0.1);
        if (downpayment < minDownPayment)
        {
          outputMessage = "Down payment must be at least 5% of first $500,000 plus %10 of the balance or $" + minDownPayment;
          downpayment = 0;
        }
      } else if (price >= 1000000) 
      {
        minDownPayment = price * 0.2;
        if (downpayment < minDownPayment)
        {
          outputMessage = "Down payment must be at least %20 or $" + minDownPayment;
          downpayment = 0;
        }
      }
    }
  }
 document.getElementById('dpError').innerText = outputMessage;
}

function validateAmortization(input) 
{
  var outputMessage = "";
  amortization = parseInt(input);
  if (amortization <= 0 || amortization > 30 || isNaN(amortization))
  {
    outputMessage = "Enter a amortization of 1 to 30 years";
    amortization = 0;
  } 
  document.getElementById('amortizationError').innerText = outputMessage;
}

function validateRate(input) 
{
  var outputMessage = "";
  annualRate = input;
  if (annualRate <= 0 )
  {
    outputMessage = "Enter an interest rate greater than 0%";
    annualRate = 0;
  }
  document.getElementById('rateError').innerText = outputMessage;
}

function calculatePayment() 
{
  var outputMessage = "";
  // check for valid input values
  if (price == 0 || downpayment == 0 || amortization == 0 || annualRate == 0) 
  {
    outputMessage = "Invalid Inputs";
  } else 
  {
    var index = document.getElementById('frequency').selectedIndex;
    var options = document.getElementById('frequency').options;
    var frequency = options[index].text;
    var numPayments = parseInt(document.getElementById('frequency').value); // number of payments per year, ie 12 for monthly payments
    annualRate = parseFloat(document.getElementById('annualRate').value) / 100;

    var principal = price - downpayment;  // total amount borrowed
    var rate = annualRate / numPayments;
    var totalNumPayments = amortization * numPayments;  // total number of payments over the length of the loan

    var payment = (principal * (rate * (1 + rate)**totalNumPayments)) / ((1+rate)**totalNumPayments - 1);
    outputMessage = frequency + " Payment: $" + payment.toFixed(2);
  }
  
  document.getElementById('payment').innerHTML = outputMessage;
}

/*
  Retirement App
*/

// variables in the annuity formula
var p = 0;  // annual payment
var pv = 0; // present value of savings
var r = 0.06;  // annual rate of return on investments
var n = 0;  // number of years money will last
var spending = 0; // current annual spending
var currentAge = 0; // current age of user
var lifeExpectency = 90;  // average life expectency

// load the retirement div
function startRetirementApp() 
{
  loadApp('retirement.html', registerRetirementEvents);
}

function registerRetirementEvents() 
{
  document.getElementById('calculateRetirement').addEventListener("click", computePayment, false);

  document.getElementById('savings').addEventListener('blur', function(){
    validateSavings(this.value);
  }, false);
  document.getElementById('spending').addEventListener('blur', function(){ 
    validateSpending(this.value);
  }, false);
  document.getElementById('returnRate').addEventListener('blur', function(){
    validateReturnRate(this.value);
  }, false);
  document.getElementById('currentAge').addEventListener('blur', function(){
    validateAge(this.value);
  }, false);
  document.getElementById('lifeExpectency').addEventListener('blur', function(){
    validateLifeExpectency(this.value);
  }, false);

  document.getElementById('futureSpending').style.display = "none";
}

function validateSavings(input) 
{
  document.getElementById('futureSpending').style.display = "none";
  var outputMessage = "";
  pv = parseInt(input);
  if (isNaN(pv))
  {
    outputMessage = "Enter current savings";
    pv = 0;
  } else if (pv <= 0) {
    pv = 0;
    outputMessage = "Current savings must be greater than 0"
  }
  document.getElementById('savingsError').innerText = outputMessage;
}

function validateSpending(input) 
{
  document.getElementById('futureSpending').style.display = "none";
  var outputMessage = "";
  spending = parseInt(input);
  if (isNaN(spending))
  {
    outputMessage = "Enter current annual spending";
    spending = 0;
  } else if (spending <= 0)
  {
    outputMessage = "Current annual spending must be greater than 0";
    spending = 0;
  }
  document.getElementById('spendingError').innerText = outputMessage;
}

function validateReturnRate(input) 
{
  document.getElementById('futureSpending').style.display = "none";
  var outputMessage = "";
  r = parseFloat(input) / 100;
  if (isNaN(r))
  {
    outputMessage = "Enter annual return on savings";
    r = 0;
  } else if (r <= 0)
  {
    outputMessage = "Annual return must be greater than 0%";
    r = 0;
  }
  document.getElementById('returnError').innerText = outputMessage;
}

function validateWithdrawlRate(input) 
{
  document.getElementById('futureSpending').style.display = "none";
  var outputMessage = "";
  withdrawl = parseFloat(input) / 100;
  if (isNaN(withdrawl))
  {
    outputMessage = "Enter percentage of saving to withdaw yearly";
    withdrawl = 0;
  } else if (withdrawl <= 0)
  {
    outputMessage = "Withdrawl rate must be greater than 0%";
    withdrawl = 0;
  }
  document.getElementById('withdrawlError').innerText = outputMessage;
}

function validateAge(input) 
{
  document.getElementById('futureSpending').style.display = "none";
  var outputMessage = "";
  currentAge = parseInt(input);
  if (isNaN(currentAge))
  {
    outputMessage = "Enter current age";
    currentAge = 0;
  } else if (currentAge < 0)
  {
    outputMessage = "Current age must be greater than 0";
    currentAge = 0;
  } else if (lifeExpectency && (currentAge > lifeExpectency))
  {
    outputMessage = "Current age must be less than life expectency";
    currentAge = 0;
  }
  document.getElementById('ageError').innerText = outputMessage;
}

function validateLifeExpectency(input) 
{
  document.getElementById('futureSpending').style.display = "none";
  var outputMessage = "";
  lifeExpectency = parseInt(input);
  if (lifeExpectency <= currentAge || isNaN(lifeExpectency))
  {
    outputMessage = "Life expectency must be greater than current age";
    lifeExpectency = 0;
  } 
  document.getElementById('expectencyError').innerText = outputMessage;
}

// compute the amount of money you can withdraw each year to have money last through retirement
function computePayment()
{
  var retirementResult = "";
  var outputMessage = "";
  // calculate yearly withdrawls using annuity due formula
  n = lifeExpectency - currentAge;
  p = pv / ( ((1-((1+r)**(-n)))/r) * (1+r) );

  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  outputMessage += "<p>You will have " + formatter.format(p) + " to spend each year in retirement.</p>"
  if (p > spending) {
    retirementResult += "<p>You can retire right now!</p>";   
  } else {
    var reduceExpenses = spending - p;
    var futureNetWorth = spending * ((1 - (1+r)**(-n)) / r);
    console.log(futureNetWorth);
    var shortfall = futureNetWorth - pv;
    retirementResult += "<p>You can't retire just yet.</p>";
    outputMessage += "<p>You can reduce yearly spending by " + formatter.format(reduceExpenses) + " </p>";
    outputMessage += "<p>Or increase savings by " + formatter.format(shortfall) + "</p>";
  }
  document.getElementById('retirementResult').innerHTML = retirementResult;
  document.getElementById('futureSpending').innerHTML = outputMessage;
  document.getElementById('futureSpending').style.display = "block";
}

window.addEventListener("load", start, false);