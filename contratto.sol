// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.7;

contract DCMS_POC {

    address owner;
    string[] public events;
    
    constructor() {
        owner = msg.sender;
    }

    function addEvent(string memory newEvent) public {
        require(msg.sender == owner);
        events.push(newEvent);
    }

    function getEvent(uint n) public view returns (string memory) {
        require(n < events.length);
        return events[n];
    }

    function getLastEvent() public view returns (string memory) {
        return events[events.length - 1];
    }


    function getEvents() view public returns(string[] memory){
        return events;
    }
}

//0xD35d02CF903D351bDb54583578a80d42f60d6129