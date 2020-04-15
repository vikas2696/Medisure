pragma solidity ^0.4.25;

contract Election {
    // Model a record
    struct Record {
        string diagnos_with;
        string priority;
    }

    // Store accounts that have voted
    mapping(address => bool) public voters;
    // Store Candidates
    // Fetch Candidate
    mapping(uint => Record) public records;
    // Store Candidates Count
    uint public recordCount;

    //voted event
    event votedEvent (
        uint indexed _candidateId
    );

    function addRecord (string _name, string _priority) public {
        recordCount ++;
        records[recordCount] = Record(_name, _priority);

    }
}
