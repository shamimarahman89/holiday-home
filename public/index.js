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


