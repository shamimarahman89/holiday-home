
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

const checkinDate = document.getElementById('checkin-date');
const checoutDate = document.getElementById('checkout-date');

checkinDate.addEventListener('change', (event) => {
  console.log("Checkin date: " + checkinDate.value);
  console.log("Checkout date" + checoutDate.value );
});

checoutDate.addEventListener('change', (event) => {
  console.log("Checkin date: " + checkinDate.value);
  console.log("Checkout date" + checoutDate.value );
});


// // calculate price
// function calculatePrice(startDate, endDate){
//   console.log(startDate , endDate);

// }
