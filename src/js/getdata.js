const InputDataDecoder = require('ethereum-input-data-decoder');
const decoder1 = new InputDataDecoder('abi.json');
function functionName(hexdata) {
   // function body
   const result = decoder.decodeData(hexdata);
   return result;
   // optional return; 
} 
