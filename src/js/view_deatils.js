
$(document).ready(function(){

var type = localStorage.getItem("type");

console.log(type);
if(type == "Patient") {
   document.getElementById("heading").textContent = "Patient View";
    document.getElementById("diagnos_with_write").style.display = "none";
    document.getElementById("priority_write").style.display = "none";
    document.getElementById("label1").style.display = "none";
    document.getElementById("label2").style.display = "none";
    document.getElementById("save_button").style.display = "none";
}

else {
   document.getElementById("heading").textContent = "Logged in as : "+type;
}

});