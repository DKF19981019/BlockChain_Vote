pragma solidity ^0.4.2;

contract Election {
        
    //标题
    string public title;
    //结构体
    struct Candidate {
        uint id;
        bytes32 name;
        uint voteCount;
    }
    

    //存储结构体(id,候选人)
    mapping (uint => Candidate) public candidates;
    //是否已经投票了
    mapping (address=>bool) public voters;
    //总数量
    uint public candidateCount;

    //构造函数
    constructor (string name,bytes32[] _proposals) public {
        title=name;

        for(uint i = 0; i < _proposals.length; i++) {
            candidateCount ++;
            candidates[candidateCount] = Candidate(candidateCount, _proposals[i], 0);
        }
}
    //投票
    function vote(uint _candidateId) public {
        require(_candidateId > 0 && _candidateId <= candidateCount);
        if(voters[msg.sender]==true){
        }else
        //记录用户已经投票了
        voters[msg.sender] = true;
        candidates[_candidateId].voteCount ++;
    }

    function info() public view returns(string _title,string voter,bytes32 winner) {
        _title = title;
        voter = "Kendy";
        winner = getWinner();
    }

    function getWinner() public view returns(bytes32) {
        uint  count=0;
        bytes32  winner;
        for(uint i=1;i<=candidateCount;i++){
            if(candidates[i].voteCount>count){
                count = candidates[i].voteCount;
                winner = candidates[i].name;
            }
        }
        if(count==0){
            return 0;
        }
        return winner;  
    }
}
