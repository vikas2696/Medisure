

function validate(){
 var id = document.getElementById("id").value;
	  var password = document.getElementById("password").value;

     if(id == "d1" && password == "123") {

         window.location = "patient_login.html"; // Redirecting to other page.
            return false;
     }

    //   $.ajax({  
    //      type:"POST",  
    //      url:"ajax.php",  
    //      data: "action=validateDoctor"+"&user_id="+username+"&password="+password+"&user_type=doctor",  
    //      success:function(data){  
            
    //         data = JSON.parse(data);
    //         console.log(data);
    //         if(data.status == true) {
    //         	console.log(data.data[0]);
    //        localStorage.setItem("objDoctor", JSON.stringify(data.data[0]));
				// window.location = "patient_login.html"; // Redirecting to other page.
				// return false;
    //         }
    //         else {
    //         	alert("Wrong credentials!");
    //      	}  
    //         }
    //   });  
   
}