pragma solidity ^0.4.2;

import "./Election.sol";

contract Collection {
    address[] public ballots;
    address owner ;
        function addBallot(string name,bytes32[] _proposals) public  returns(address address_) {
        owner = msg.sender;
        Election election = new Election(name,_proposals);
        address_ = address(election);
        ballots.push(address_);
    }

    function getAllBallots() public view returns (address[] ballots_) {
        ballots_ = ballots;
    }
    function delBallot(address address_) public  {
        if(msg.sender==owner){
            for(uint i=0;i<ballots.length;i++){
                if(ballots[i]==address_){
                    updateArrays(i);
                }
            }
                
}
    }
    
    function updateArrays(uint i) private{
        if(i!=ballots.length-1){
            for(i;i<ballots.length;i++){
                ballots[i] = ballots[i+1];
            }
        }
        ballots.length = ballots.length-1;
    }
}