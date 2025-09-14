// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MiniWallet {
    mapping(address => uint) public balances; 

    event Deposit(address indexed from, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

   function deposit() external payable {
    balances[msg.sender] += msg.value;
    emit Deposit(msg.sender, msg.value);
   }

   function withdraw(uint amount) external {
    require(balances[msg.sender] >= amount, "Insufficient balance");
    balances[msg.sender] -= amount;

    (bool sent,) = payable(msg.sender).call{value: amount}("");
    require(sent, "Failed to send");
   }

   function getBalance() public view returns(uint){
    return balances[msg.sender];
   }
}
