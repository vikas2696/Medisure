
// const Nexmo = require('nexmo');
 
// const nexmo = new Nexmo({
//   apiKey: 'f4bd061d',
//   apiSecret: 'NpSYpofEcjx1qO3C',
// });

//view_details code

var type = localStorage.getItem("type");
console.log('type : '+type);
var patient_id = localStorage.getItem("patient_id");
console.log('patient id : '+patient_id);

var patient_name = localStorage.getItem("patient_name");
console.log('patient name : '+patient_name);

$("#view_name").text(patient_name);
$("#view_id").text(patient_id);

const InputDataDecoder = require('ethereum-input-data-decoder');
const abi = require('./abi.json');
const decoder = new InputDataDecoder(abi);
console.log("event0");
$("#notify_button").hide();
$("#confirm_button").hide();
$("#confirm_id").hide();
$("#save_button").hide();
$("#label3").hide();

var last_priority = null;
App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  blockNumber: 0,
  hasVoted: false,

  init: function() {
    console.log("event1");
    return App.initWeb3();
  },

  initWeb3: function() {
    console.log("event2");
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
       App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    console.log("event3");
    $.getJSON("HealthRecord.json", function(healthRecord) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.HealthRecord = TruffleContract(healthRecord);
      // Connect provider to interact with contract
      App.contracts.HealthRecord.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    console.log("event4");
    App.contracts.HealthRecord.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function() {
    var healthRecordInstance;
    var loader = $("#loader");
    var content = $("#content");

    //to decode input data

    loader.show();
    content.hide();

    if(type == "Patient" || type == "auth") {
    $("#diagnos_with_write").hide();
    $("#priority_write").hide();
    $("#label1").hide();
    $("#label2").hide();
    $("#save_button").hide();
    $("#notify_button").hide();
    $("#confirm_button").hide();
    $("#confirm_id").hide();
    $("#label3").hide();
    $("#check_button").hide();

    if(type == "auth") $("#logout_button").hide();
}

  // Load account data
  web3.eth.getCoinbase(function(err, account) {
    console.log("d1",err,account); 
    if (err === null) {
      App.account = account;
      // get block number
      web3.eth.getBlockNumber(function (error, block_count) {
        if(!error) {
          console.log(block_count);

          var show_data = $("#show_data");
          show_data.empty();
          var diagnos_with_write = $('#diagnos_with_write');
          diagnos_with_write.empty();
          var priority_write = $('#priority_write');
          priority_write.empty();
          var count = 0;
          for (var i = 1; i <= block_count; i++) {
            web3.eth.getBlock(i, function (error, block) {
              if(!error) {
                if (block != null && block.transactions != null) {
                  block.transactions.forEach( function(transaction) {
                    web3.eth.getTransaction(transaction, function(error, current_transaction) {
                        console.log(patient_id.toLowerCase()+' '+account);
                      if(current_transaction.from == patient_id.toLowerCase() && current_transaction.input != null) {
                        count++;

                        console.log("Transaction details : ",block);

                        const result = decoder.decodeData(current_transaction.input);
                        console.log(result);
                       
                        last_priority = result.inputs[1];
                        
                        console.log(last_priority);
                        var data_template = "<tr><th>" + count 
                        + "</th><td>"  + new Date(block.timestamp * 1000).toGMTString() 
                        + "</th><td>" + result.inputs[0]+ "</th><td>" + result.inputs[1] + "</th><td>" + result.inputs[3] + "</th><td>" 
                        + result.inputs[2] + "</td><tr>"; 
                        show_data.append(data_template);
                        loader.hide();
                        content.show();
                      }
                    });
                  });
                }
              }
            });
          }
        }
      });
    }
  });
  },

  check: function() {
  var priority = $('#priority_write').val();
  if(1) {
    $("#confirm_button").show();
    $("#confirm_id").show();
    $("#save_button").show();
    $("#label3").show();
  }
  else {
     alert('Current disease priority is lower than the last one.');
  }

  },

  addRecord: function() {
    $("#save_button").hide();
    $("#confirm_button").show();
    var diagnos_with = $('#diagnos_with_write').val();
    var priority = $('#priority_write').val();
    var confirmation = $('#confirm_id').val();
    var account_id = patient_id.toLowerCase();
    var doctor = type;
   if(diagnos_with != "" && priority != "" && confirmation != "" && patient_id.toLowerCase() == App.account) {
    App.contracts.HealthRecord.deployed().then(function(instance) {
        return instance.addRecord(diagnos_with,priority,confirmation,doctor,{ from: account_id});
      }).then(function(result) {
        $("#notify_button").show();
        //window.location.reload();
      }).catch(function(err) {
        console.error(err);
      });
    }
    else {
      alert('Fill all details or check the metamask account');
    }
  }
};

$(function() {
  $(window).load(function() {
    App.init(); 
  });
});
