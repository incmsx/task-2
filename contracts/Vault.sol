// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";


contract Vault is Ownable{
    mapping (address => uint) donates;

    address private ownerAddress;

    constructor(address initialAddress) Ownable(initialAddress){
        ownerAddress = initialAddress;
    }

    receive() external payable{
        donates[msg.sender] = msg.value;
    }

    function donate() payable public {
        donates[msg.sender] = msg.value;
    }

    function refund() external{
        (bool success, ) = msg.sender.call{value: donates[msg.sender]}("");
        require(success, "refund failed!");
    }

    function withdraw() external onlyOwner{
        (bool success, ) = ownerAddress.call{value: getBalance()}("");
        require(success, "Withdrawal failed!");
    }

    function getBalance() public view returns(uint){
        return address(this).balance;
    }

    function getDonationByAddress(address donateSender) external view onlySender(donateSender) returns(uint){
        return donates[donateSender];
    }

    modifier onlySender(address donateSender) {
        require(msg.sender == donateSender, "You haven't got access");
        _;
    }

}