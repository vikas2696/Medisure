// function register_patient(){

// var fname = document.getElementById("fname").value;
// var lname = document.getElementById("lname").value;
// var patient_address = document.getElementById("patient_address").value;
// var pin_id = document.getElementById("pin_id").value;
// var p_email = document.getElementById("p_email").value;
// var p_dob = document.getElementById("p_dob").value;
// var p_phone = document.getElementById("p_phone").value;



// $.ajax({  
//          type:"POST",  
//          url:"ajax.php",  
//          data: "action=registerUser"+"&fname="+fname+"&lname="+lname+"&patient_address="
//          +patient_address+"&pin_id="+pin_id+"&p_email="+p_email+"&p_dob="+p_dob+"&p_phone="+p_phone,  
//          success:function(data){
//             alert("Registered Successfully!");
// 				window.location = "patient_login.html"; // Redirecting to other page.
// 				return false;
//            }
//         });  
// }
Patient = { accounts : null,

    init: function() {
    return Patient.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      Patient.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      Patient.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(Patient.web3Provider);
    }
    return Patient.render();
  },

  render: function() {

    web3.eth.getAccounts(function(err,a) {
        Patient.accounts = a;
        console.log("accounts",a);
    });

  },

  addAccount: function() {
    var fname = $('#diagnos_with_write').val();
    var lname = $('#lname').val();
    var patient_address = $('#patient_address').val();
    var pin_id = $('#pin_id').val();
    var p_email = $('#p_email').val();
    var p_dob = $('#p_dob').val();
    var p_phone = $('#p_phone').val();
    var check = $('#check').val();

    $("#check").html(Patient.accounts);
    console.log("check",Patient.accounts);
  }
};
$(function() {
  $(window).load(function() {
    Patient.init();
  });
});