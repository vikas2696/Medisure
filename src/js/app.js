//let http = require('C:/Users/Vikas Mehra/HealthRecord/node_modules/http/package.json');
//import http from http;
//console.log(__filename);
//console.log(InputDataDecoder);
//console.log(decoder);

// const Nexmo = require('nexmo');
 
// const nexmo = new Nexmo({
//   apiKey: 'f4bd061d',
//   apiSecret: 'NpSYpofEcjx1qO3C',
// });

const InputDataDecoder = require('ethereum-input-data-decoder');
const abi = require('./abi.json');
const decoder = new InputDataDecoder(abi);

App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  blockNumber: 0,
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
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
    //const InputDataDecoder = require('ethereum-input-data-decoder');
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
                      if(current_transaction.from == account && current_transaction.input != null) {
                        //console.log("Account1 data",current_transaction.input);
                        //var data = web3.toAscii(current_transaction.input);
                        count++;
                        const result = decoder.decodeData(current_transaction.input);
                        console.log(result);
                        //console.log("Account1: ",current_transaction.input);
                        //$("#accountAddress").html(current_transaction.input);
                        var data_template = "<tr><th>" + count 
                        + "</th><td>"  + new Date(block.timestamp * 1000).toGMTString() 
                        + "</th><td>" + result.inputs[0] + "</th><td>" + result.inputs[1] + "</td><tr>"; 
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

   

    //show txn details
 

     // Load txn data
    // web3.eth.getTransactionCount("0x6121286c55c3a5e7836078e700f1b4d365a9c2a4", function(err,txncount) {
    // console.log("count1",err,txncount, App.account); 
    //   if (err === null) {
    //     $("#t_count").html("Txn Count: " + txncount);
    //   }
    // });

    // Load contract data
    // App.contracts.Election.deployed().then(function(instance) {
    //   electionInstance = instance;
    //   console.log("c2",electionInstance);
    //   return electionInstance.recordCount();
    // }).then(function(recordCount) {
    //   console.log("c1",recordCount);
    //   var candidatesResults = $("#candidatesResults");
    //   candidatesResults.empty();

    //   var candidatesSelect = $('#diagnos_with_write');
    //   candidatesSelect.empty();

    //   for (var i = 1; i <= recordCount; i++) {
    //     electionInstance.records(i).then(function(record) {
    //       console.log("c3",record);
    //       var id = record[0];
    //       var diagnos_with = record[1];
    //       var priority = record[2];

    //       // Render candidate Result
    //       var candidateTemplate = "<tr><th>" + id + "</th><td>" + diagnos_with + "</td><td>" 
    //       + priority+ "</td></tr>"
    //       candidatesResults.append(candidateTemplate);

    //       // Render candidate ballot option
    //       // var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
    //       // candidatesSelect.append(candidateOption);
    //     });
    //   }
    //   console.log("c6",electionInstance,App.account);

    //   return electionInstance.voters(App.account);
    // }).then(function(hasVoted) {
    //  // console.log("c5",hasVoted);
    //   // Do not allow a user to vote
    //   if(hasVoted) {
    //     $('form').hide();
    //   }
    //   loader.hide();
    //   content.show();
    // //  console.log("c4",hasVoted);
    // }).catch(function(error) {
    //   console.warn(error);
    // });
  },

  addRecord: function() {
    $("#save_button").hide();
    var diagnos_with = $('#diagnos_with_write').val();
    var priority = $('#priority_write').val();

    App.contracts.HealthRecord.deployed().then(function(instance) {
      return instance.addRecord(diagnos_with,priority, { from: App.account});
    }).then(function(result) {
      // Wait for votes to update
      // $("#content").hide();
      // $("#loader").show();

      // const from = 'MEDISURE';
      // const to = '917065795486';
      // const text = 'Transaction done! '+ 'Details : diagnos_with:'+diagnos_with+' priority:'+priority;

      // nexmo.message.sendSms(from, to, text);

      window.location.reload();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init(); 
  });
});
