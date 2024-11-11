// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MaticToken is ERC20 {
    constructor( ) ERC20("MaticToken", "MATIC") {
        _mint(msg.sender, 10000000 * 10 ** decimals()); //Mint 10M MATIC to the deployer
    }
    
}