var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const Nexmo = require('nexmo')
const Web3 = require('web3');
let fs = require("fs");
web3Provider = new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545');
web3 = new Web3(web3Provider);
const abi = require(path.join(__dirname + '/src/js/abi.json'));

// const contract = new web3.eth.Contract(abi);
//     contract.deploy({
//       data: [[web3.utils.asciiToHex('diseasenew')],[web3.utils.asciiToHex(1)],[web3.utils.asciiToHex('cinfirmnew')]],
//     })
//     .send({
//       from: "0x6121286c55C3A5e7836078e700F1B4D365A9c2a4",    gas: 1500000,
//         gasPrice: '30000000000000'
//     }).then(function(newContractInstance){
//         console.log(newContractInstance.options.address) // instance with the new contract address
//     });

const nexmo = new Nexmo({
  apiKey: 'f4bd061d',
  apiSecret: 'NpSYpofEcjx1qO3C',
});

const from = 'MEDISURE';
const to = '917065795486';
const text = 'Transaction done from MEDISURE';

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '1234',
	database : 'nodelogin'
});

//code for mail
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vkmehra0808@gmail.com',
    pass: 'Vikas@123'
  }
});
var id = null;
var otp = null;
var mail = null;
var fname = null;
var lname = null;
var mobileno = null;

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static('src'));
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/src/index.html'));
});
app.post('/auth', function(request, response) {
	
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.doctor_session = true;
				//request.session.username = username;
				response.redirect('/patient_login.html');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.post('/auth_login', function(request, response) {
	
	var auth_id = request.body.auth_id;
	var password = request.body.password;
	
	if (auth_id && password) {
		connection.query('SELECT * FROM auth WHERE auth_id = ? AND auth_pass = ?', [auth_id, password], function(error, results, fields) {
			if (results.length > 0) {
				//request.session.auth_session = true;
				request.session.insurer_session = true;
				response.redirect('auth_home');
			} else {
				response.send('Incorrect id and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter every detail.');
		response.end();
	}
});

app.post('/insurer_view', function(request, response) {
	
	var patient_id = request.body.patient_id;
	
	if (patient_id) {
		connection.query('SELECT email,patient_id,firstname,lastname FROM register WHERE patient_id = ?',
		 [patient_id], function(error, results, fields) {
			if (!error) {
				//response.sendFile(path.join(__dirname + '/src/registered.html'));
				mail = results[0].email;
				id = results[0].patient_id;
				fname = results[0].firstname;
				lname = results[0].lastname;
				mobileno = results[0].mobile;

				response.redirect('view_details');
			} else {
				response.send("THIS "+error);
			}			
			//response.end();
		});
	} else {
		response.send('Please enter mobile number');
		response.end();
	}
});

app.post('/reg', function(request, response) {
	
	var fname = request.body.first_name;
	var lname = request.body.last_name;
	var patient_address = request.body.address;
	var pin_id = request.body.in_agent_id;
	var p_email = request.body.email;
	var p_dob = request.body.dob;
	var p_phone = request.body.phone;
	var p_id = null;

	web3.eth.getAccounts(function(err,account){
		if(!err) {
		connection.query('SELECT count(*) AS acc FROM register;', function(error, results, fields) {
			if(!error) {
				var n = results[0].acc;
				console.log(account[n]);
				//p_id = account[n];

				if (fname && lname && patient_address && pin_id && p_email && p_dob && p_phone) {
		connection.query('INSERT INTO register (firstname, lastname, address, in_id, email, dob, mobile, patient_id) VALUES (?,?,?,?,?,?,?,?);',
		 [fname, lname, patient_address, pin_id, p_email, p_dob, p_phone, account[n]], function(error, results, fields) {
			if (!error) {

							var mailOptions1 = {
							  from: 'vikkubehra5@gmail.com',
							  to: p_email,
							  subject: 'Registered to MEDISURE',
							  text: 'Hi'+fname+' '+lname+'! You have been successfully registered for MEDISURE. Your generated id is '+account[n]+'.'
							};

							transporter.sendMail(mailOptions1, function(error, info){
							  if (error) {
							    console.log(error);
							  } else {
							  	response.sendFile(path.join(__dirname + '/src/patient_login.html'));
							    console.log('Email sent: ' + info.response);
							  }
							});
							//nexmo.message.sendSms(from, to, 'Hi'+fname+' '+lname+'! You have been successfully registered for MEDISURE. Your generated id is '+p_id+'.');

			} else {
				response.send('Registration failed! due to '+error);
			}			
			//response.end();
		});
	} else {
		response.send('Please fill all the details first!');
		response.end();
	}

			}
		});
	}
	});

	//response.send('check'+username+password);
	
});

app.post('/otp_action', function(request, response) {
	
	var mobile = request.body.mobile_number;
	
	if (mobile) {
		connection.query('SELECT email,patient_id,firstname,lastname FROM register WHERE mobile = ?',
		 [mobile], function(error, results, fields) {
			if (!error) {
				//response.sendFile(path.join(__dirname + '/src/registered.html'));
				mail = results[0].email;
				id = results[0].patient_id;
				fname = results[0].firstname;
				lname = results[0].lastname;
				mobileno = results[0].mobile;

				// otp =  Math.floor(1000 + Math.random() * 9000);
				// var mailOptions2 = {
				//   from: 'vikkubehra5@gmail.com',
				//   to: mail,
				//   subject: 'MEDISURE login',
				//   text: 'Hi '+fname+' ID '+id+'.Your otp for login is :'+otp
				// };

				// transporter.sendMail(mailOptions2, function(error, info){
				//   if (error) {
				//     console.log(error);
				//   } else {
				//   	//response.sendFile(path.join(__dirname + '/src/registered.html'));
				//     console.log('Email sent: ' + info.response);
				//   }
				// });
				//nexmo.message.sendSms(from, to, 'Hi '+fname+' ID '+id+'.Your otp for login is :'+otp);
				//response.send('Welcome back, ' + results[0].email + '!');
				//console.log(results[0].email);

			} else {
				response.send("THIS "+error);
			}			
			//response.end();
		});
	} else {
		response.send('Please enter mobile number');
		response.end();
	}
});

app.post('/login_action', function(request, response) {
	
	var entered_otp = request.body.entered_otp;
	
	if (entered_otp) {
		
		//if(entered_otp == otp){
			request.session.patient_session = true;
			response.redirect('view_details');
		//}
		// else {
		// 	response.send('Please enter the correct code.');
		// }

	} else {
		response.send('Please enter the code.');
		response.end();
	}

});

app.post('/send', function(request, response) {
							var mailOptions1 = {
							  from: 'vikkubehra5@gmail.com',
							  to: mail,
							  subject: 'Transaction done by MEDISURE',
							  text: 'Hey '+fname+'! A transaction has been done by Medisure for your id : '+id
							};

							transporter.sendMail(mailOptions1, function(error, info){
							  if (error) {
							    console.log(error);
							  } else {
							  	response.sendFile(path.join(__dirname + '/src/view_details.html'));
							    console.log('Transaction email sent for: ' + info.response);
							  }
							});
							//nexmo.message.sendSms(from, to, 'Hey'+fname+'! A transaction has been done by Medisure.');
});

app.post('/confirmation', function(request, response) {
							var mailOptions1 = {
							  from: 'vikkubehra5@gmail.com',
							  to: 'vkmehra0808@gmail.com',
							  subject: 'Confirmation mail by MEDISURE',
							  text: 'Please confirm the transaction for the account '+id
							};

							transporter.sendMail(mailOptions1, function(error, info){
							  if (error) {
							    console.log(error);
							  } else {
							  	//response.sendFile(path.join(__dirname + '/src/view_details.html'));
							    console.log('Confirmation email sent for: ' + info.response);
							    //response.end();
							  }
							});
							//nexmo.message.sendSms(from, to, 'Hey'+fname+'! A transaction has been done by Medisure.');
});

app.post('/logout', function(request, response) {
							request.session.patient_session = false;
							response.redirect('patient_login.html');
							response.end();
});

app.get('/auth_home', function(request, response) {

		//response.send('Welcome back, ' + request.session.username + '!');
		response.sendFile(path.join(__dirname + '/src/insurer_homepage.html'));
	
});


app.get('/patient_login.html', function(request, response) {
	if (request.session.doctor_session) {
		//response.send('Welcome back, ' + request.session.username + '!');
		response.sendFile(path.join(__dirname + '/src/patient_login.html'));
	} else {
		response.send('Please login with doctor to view this page!');
	}
	//response.end();
});

app.get('/view_details', function(request, response) {
	if (request.session.patient_session || request.session.insurer_session) {
		//console.log("ininin");
		//response.setHeader('Content-Type', 'text/html');
		//response.write('<head><title>medisure</title><link href="css/bootstrap.min.css" rel="stylesheet"><link rel="stylesheet" href="css/main.css"/></head><script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script><script src="js/bootstrap.min.js"></script><script src="js/web3.min.js"></script><script src="js/truffle-contract.js"></script><script src="js/bundle.js"></script><body><h2 id="accountAddress">Patient id : '+id+'</h2><div class="container-login100"><div class="wrap-login100"><hr/><br/><div id="loader"><p class="text-center">Refresh to see updated...</p></div><table class="table"><thead><tr><th scope="col">S. No.</th><th scope="col">Date & Time</th><th scope="col">diagnos_with</th><th scope="col">priority</th></tr></thead><tbody id="show_data"></tbody></table><hr/><form onSubmit="App.addRecord(); return false;"><div class="form-group"><label for="diagnos_with_write" id="label1">Diagnos_with</label><input class="input100" id="diagnos_with_write"></input></div><div class="form-group"><label for="priority_write" id="label2">Priority</label><input class="input100" id="priority_write"></input></div><button type="submit" class="btn btn-primary" id="save_button">Save Record</button><hr/></form></div></div></body>');
		//response.write('<h2>This is the response #: ' + id + '</h2>');
		//response.end();
		response.write('<head><link rel="stylesheet" href="css/main.css"/><script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script><script src="js/dyn.js"></script></head><body><div class="limiter"><div class="container-login100"><div class="wrap-login100"><form class="login100-form validate-form" text-align="center"><span class="login100-form-title">Welcome to MEDISURE : </span><span class="login100-form-title" id = "name_span">'+fname+' '+lname+'</span><span class="login100-form-title" id = "pass_id">'+id+'</span><span>A blockchain based medical record.</span></form><div style="text-align: center;"><a class="txt1" href="#" onclick="view_refer()">View records</a></div></form></div></div></div></div></body>');
		response.end();
		//response.sendFile(path.join(__dirname + '/src/view_details.html'));
	} else {
		response.send('Please login to view this page!');
	}
	//response.end();
});
app.listen(3000);