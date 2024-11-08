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

describe("Test case #40. Get current WBTC price", function () {

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

    //Line to transfer the HYAX tokens from the deployer to the smart contract
    var totalSupplyHex = await hyax.totalSupply();
    await hyax.transfer(hyax.target, totalSupplyHex.toString());

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Deploy the WBTC price data feed mock
    const WbtcPriceDataFeedMock = await ethers.getContractFactory('WbtcPriceDataFeedMock');

    //Deploy smart contract with established parameters
    const wbtcPriceDataFeedMock = await WbtcPriceDataFeedMock.deploy();

    //Update the address of the WBTC price data feed mock
    await hyax.connect(owner).updatePriceFeedAddress(3, wbtcPriceDataFeedMock.target);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3, wbtcPriceDataFeedMock };
  }

  it("40.1. Should properly execute the function because it's reading the value parameter of the WBTC data price mock", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);
    //Current Bitcoin price 5844229670000 = $58,442.29670000
    expect(await hyax.getCurrentTokenPrice(3)).to.equal(5844229670000);
  });

  it("40.2. Should throw an error because there is an invalid price", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3, wbtcPriceDataFeedMock } = await loadFixture(deployContractAndSetVariables);

    //Update the value of the MATIC price data feed mock
    await wbtcPriceDataFeedMock.setLatestRoundDataAnswer(-1);

    await expect(hyax.getCurrentTokenPrice(3)).to.be.revertedWith('Invalid price data from oracle');
  });

});
