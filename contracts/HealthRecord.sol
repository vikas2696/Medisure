pragma solidity >=0.4.21 <0.7.0;

contract HealthRecord {
    // Model a record
    struct Record {
        string diagnos_with;
        uint priority;
        string doctor_id;
        string confirm_id;
    }

    mapping(uint => Record) public records;
   
    uint public recordCount;

    //voted event
    event votedEvent (
        uint indexed _candidateId
    );

    function addRecord (string memory _name, uint _priority, string memory _doctor_id, string memory _confirm_id) public {
        recordCount ++;
        records[recordCount] = Record(_name, _priority, _doctor_id, _confirm_id);

    }
}
