/*
  The following test cases were built around accounting-related consistency and specific user flows
  As secondary goal the tests are made to validate gas efficiency.

  Scope: The scope of the following test cases is the HYAX smart contract functions
  Approach: The tests to be performed will be Unit tests (for trivial functions) and Integration tests (for complex functions)
  Resources: The tool to use for the following tests is the Hardhat specialized test runner based on ethers.js
*/
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers, upgrades } = require('hardhat');
const { expect } = require("chai");
const { ZeroAddress } = require("ethers");


describe("Test case #28. Update USDT token address in the polygon network", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAXUpgradeableToken = await ethers.getContractFactory('HYAXUpgradeableToken');
    console.log("\n   [Log]: Deploying upgradeable HYAX...");

    // Deploy proxy with 'initialize' function
    const hyax = await upgrades.deployProxy(HYAXUpgradeableToken, { initializer: 'initialize' });
    
    await hyax.waitForDeployment();

    //Transfer all HYAX tokens from the deployer to the smart contract
    var totalSupplyHex = await hyax.totalSupply();
    await hyax.transfer(hyax.target, totalSupplyHex.toString());

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3 };
  }


  it("28.1. Should revert transaction because of execution with address that's not the owner", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //This is the actual USDT token address on the polygon mainnet
    await expect(hyax.connect(addr1).updateTokenAddress(2, '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'))
      .to.be.revertedWith('Ownable: caller is not the owner');
  });

  it("28.2. Should revert transaction because of execution with invalid parameter", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(owner).updateTokenAddress(2, ethers.ZeroAddress))
      .to.be.revertedWith('The token address cannot be the zero address');
  });

  it("28.3. Should properly execute the function because it has a valid address and valid parameter", async function () {
    const { hyax, owner, deployer, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //This is the actual USDT token address on the polygon mainnet
    await hyax.connect(owner).updateTokenAddress(2, '0xc2132D05D31c914a87C6611C10748AEb04B58e8F');

    expect(await hyax.usdtTokenAddress()).to.equal('0xc2132D05D31c914a87C6611C10748AEb04B58e8F');
  });

});
