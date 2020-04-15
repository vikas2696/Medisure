$(document).ready(function(){

var objDoctor = localStorage.getItem("objDoctor");

objDoctor = JSON.parse(objDoctor);
console.log(objDoctor.id);
document.getElementById("doc_id").textContent = "Logged in as : "+objDoctor.id;  
});

function generate(){


if ( username == "123") {
   alert ("OTP sent");
}

else{
   alert("Not a registered mobile number");
}

}

function validate(){
var username = document.getElementById("mob_no").value;
var password = document.getElementById("otp").value;

$.ajax({  
         type:"POST",  
         url:"ajax.php",  
         data: "action=validatePatient"+"&user_id="+username+"&password="+password,  
         success:function(data){  
            
            data = JSON.parse(data);
            console.log(data);
            if(data.status == true) {
               console.log(data.data[0]);
               localStorage.setItem("objDoctor", JSON.stringify(data.data[0]));
            window.location = "view_details.html"; // Redirecting to other page.
            return false;
            }
            else {
               alert("Wrong credentials!");
            }  
            }
      }); 
}

function register_refer(){

window.location = "patient_register.html"; // Redirecting to other page.
return false;

}




