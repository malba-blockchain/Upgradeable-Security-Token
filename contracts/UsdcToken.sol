// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract UsdcToken is ERC20 {
    constructor( ) ERC20("UsdcToken", "USDC") {
        _mint(msg.sender, 10000000 * 10 ** decimals()); //Mint 10M USDC to the deployer
    }
}