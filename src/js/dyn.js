
function view_refer() {
	// if($("#currid").text() == $("#pass_id").text()) {
		localStorage.setItem("patient_id",$("#pass_id").text());
    localStorage.setItem("patient_name",$("#name_span").text());
		window.location = "view_details.html";
	// }
	// else{
	// 	console.log($("#currid").text()+''+$("#pass_id").text())
	//  // Redirecting to other page.
	// }
	return false;

}
// Patient = { accounts : null,

//     init: function() {
//     return Patient.initWeb3();
//   },

//   initWeb3: function() {
//     // TODO: refactor conditional
//     if (typeof web3 !== 'undefined') {
//       // If a web3 instance is already provided by Meta Mask.
//       Patient.web3Provider = web3.currentProvider;
//       web3 = new Web3(web3.currentProvider);
//     } else {
//       // Specify default instance if no web3 instance provided
//       Patient.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
//       web3 = new Web3(Patient.web3Provider);
//     }
//     return Patient.render();
//   },

//   render: function() {

//     web3.eth.getCoinbase(function(err,a) {
//         Patient.accounts = a;
//         console.log("accounts",a);
//         $("#currid").text(a);
//     });
//   },
// };
// $(function() {
//   $(window).load(function() {
//     Patient.init();
//   });
// });