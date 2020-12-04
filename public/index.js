
// clickable dropdown
const dropdown = document.getElementById("myDropdown");
function myFunction() {
    dropdown.classList.toggle("show");
}
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn, .hamburger')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }


// login form pop up
function openForm() {
    document.getElementById("myForm").style.display = "block";
}
  
function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

// signup email validation
function InvalidMsg(textbox) { 
  
  if (textbox.value === '') { 
      textbox.setCustomValidity 
            ('Entering an email-id is necessary!'); 
  } else if (textbox.validity.typeMismatch) { 
      textbox.setCustomValidity 
            ('Please enter an email address which is valid!'); 
  } else { 
      textbox.setCustomValidity(''); 
  } 

  return true; 
} 

// signup birthdate validation
var minAge = 18;
function _calcAge() {
  var date = new Date(document.getElementById("birth-date").value);
  var today = new Date();

  var timeDiff = Math.abs(today.getTime() - date.getTime());
  var age1 = Math.ceil(timeDiff / (1000 * 3600 * 24)) / 365;
  return age1;
}

//Compares calculated age with minimum age and acts according to rules//
function _setAge(textbox) {
  var age = _calcAge();
  if (age < minAge) {
    textbox.setCustomValidity 
    ('Sorry! The age must be 18 or more.'); 
  } 
  else{
    textbox.setCustomValidity('');
  }
  return true;
}


// calculate price
function calculatePrice(pricePerDay) {
  const startDate = document.getElementById('checkin-date').value;
  const endDate = document.getElementById('checkout-date').value;
  if(startDate === undefined || startDate === "" ||
    endDate === undefined || endDate === "" || 
    pricePerDay === undefined || pricePerDay === "" ){
    document.getElementById('total-price').value = 0;
  }
  else{
    // difference in milisecond
    var timeDiff = new Date(endDate) - new Date(startDate);
    if(timeDiff < 0){
      document.getElementById('total-price').value = 0;
    }
    else {
      // convert milisecond difference to day
      var dayDiff = timeDiff / (24 * 3600 * 1000);
      var totalPrice = dayDiff * pricePerDay;
      document.getElementById('total-price').value = totalPrice;
    }
    
  }  
}

 // Login validation on form submit
function validateBooking(isLoggedIn){
  if(isLoggedIn === undefined || isLoggedIn === false ){
    alert("Please login");
    return false;
  }
  else{
    return true;
  }
}
