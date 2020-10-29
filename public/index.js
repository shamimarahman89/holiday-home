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

function openForm() {
    document.getElementById("myForm").style.display = "block";
}
  
function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

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


