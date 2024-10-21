// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WethToken is ERC20 {
    constructor( ) ERC20("WethToken", "WETH") {
        _mint(msg.sender, 10000000 * 10 ** decimals()); //Mint 10M WETH to the deployer
    }
    
}