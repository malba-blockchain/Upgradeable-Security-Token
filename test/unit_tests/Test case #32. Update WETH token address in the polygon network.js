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

describe("Test case #32. Update WETH token address in the polygon network", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAXUpgradeable = await ethers.getContractFactory('HYAXUpgradeable');
    console.log("\n   [Log]: Deploying upgradeable HYAX...");

    // Deploy proxy with 'initialize' function
    const hyax = await upgrades.deployProxy(HYAXUpgradeable, { initializer: 'initialize' });
    
    await hyax.waitForDeployment();

    //Line to transfer the HYAX tokens from the deployer to the smart contract
    var totalSupplyHex = await hyax.totalSupply();
    await hyax.transfer(hyax.target, totalSupplyHex.toString());

    //Deploy the WETH price data feed mock
    const WethPriceDataFeedMock = await ethers.getContractFactory('WethPriceDataFeedMock');

    //Deploy smart contract with established parameters
    const wethPriceDataFeedMock = await WethPriceDataFeedMock.deploy();

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3, wethPriceDataFeedMock };
  }


  it("32.1. Should revert transaction because of execution with address that's not the owner", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //This is the actual WETH token address on the polygon mainnet
    await expect(hyax.connect(addr1).updateTokenAddress(4, '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'))
      .to.be.revertedWith('Ownable: caller is not the owner');
  });

  it("32.2. Should revert transaction because of execution with invalid parameter", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(owner).updateTokenAddress(4, ethers.ZeroAddress))
      .to.be.revertedWith('The token address cannot be the zero address');
  });

  it("32.3. Should properly execute the function because it has a valid address and valid parameter", async function () {
    const { hyax, owner, deployer, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //This is the actual WETH token address on the polygon mainnet
    await hyax.connect(owner).updateTokenAddress(4, '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619');

    expect(await hyax.wethTokenAddress()).to.equal('0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619');
  });

});