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

describe("Test case #1. Deployment of HYAX smart contract", function () {
  
  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAXUpgradeable = await ethers.getContractFactory('HYAXUpgradeable');
    console.log("\n   [Log]: Deploying upgradeable HYAX...");

    // Deploy proxy with 'initialize' function
    const hyax = await upgrades.deployProxy(HYAXUpgradeable,{ initializer: 'initialize'}); 

    await hyax.waitForDeployment();

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2 };
  }
  it("1.1. Should have the right smart contract name", async function () {
    // Load the fixture to deploy the contract and set initial variables
    const { hyax } = await loadFixture(deployContractAndSetVariables);
    // Assert that the name of the deployed contract is "HYAXToken"
    expect(await hyax.name()).to.equal("HYAXToken");
  });

  it("1.2. Should have the right smart contract symbol", async function () {
    // Load the fixture to deploy the contract and set initial variables
    const { hyax } = await loadFixture(deployContractAndSetVariables);
    // Assert that the symbol of the deployed contract is "HYAX"
    expect(await hyax.symbol()).to.equal("HYAX");
  });

  it("1.3. Should have the right total supply", async function () {
    // Load the fixture to deploy the contract and set initial variables
    const { hyax } = await loadFixture(deployContractAndSetVariables);
    // Assert that the total supply of the deployed contract is 500,000,000 HYAX
    expect(await hyax.totalSupply()).to.equal(ethers.parseUnits("500000000", 18));
  });

  it("1.4. Should have the right HYAX price", async function () {
    // Load the fixture to deploy the contract and set initial variables
    const { hyax } = await loadFixture(deployContractAndSetVariables);
    // Assert that the price of HYAX is 0.006
    expect(await hyax.hyaxPrice()).to.equal(ethers.parseUnits("0.006", 8));
  });

  it("1.5. Should have the right minimum investment allowed in USD", async function () {
    // Load the fixture to deploy the contract and set initial variables
    const { hyax } = await loadFixture(deployContractAndSetVariables);
    // Assert that the minimum investment allowed in USD is 1 USD
    expect(await hyax.minimumInvestmentAllowedInUSD()).to.equal(ethers.parseUnits("1", 18));
  });

  it("1.6. Should have the right maximum investment allowed in USD", async function () {
    // Load the fixture to deploy the contract and set initial variables
    const { hyax } = await loadFixture(deployContractAndSetVariables);
    // Assert that the maximum investment allowed in USD is 10,000 USD
    expect(await hyax.maximumInvestmentAllowedInUSD()).to.equal(ethers.parseUnits("10000", 18));
  });

  it("1.7. Should have the right whitelister address", async function () {
    // Load the fixture to deploy the contract and set initial variables
    const { hyax } = await loadFixture(deployContractAndSetVariables);
    // Assert that the whitelister address is as expected
    expect(await hyax.whiteListerAddress()).to.equal('0x01c2f012de19e6436744c3F81f56E9e70C93a8C3');
  });

  it("1.8. Smart contract should have all the total supply in it's balance", async function () {
    // Load the fixture to deploy the contract and set initial variables
    const { hyax } = await loadFixture(deployContractAndSetVariables);
    // Get the total supply of HYAX
    var totalSupplyHex = await hyax.totalSupply();
    // Transfer the total supply of HYAX from the deployer to the smart contract
    await hyax.transfer(hyax.target, totalSupplyHex.toString());  
    // Assert that the smart contract HYAX balance is of 500 M HYAX
    expect(await hyax.balanceOf(hyax.target)).to.equal(ethers.parseUnits("500000000", 18));
  });

  it("1.9. Smart contract owner should be the new admin address", async function () {
    // Load the fixture to deploy the contract and set initial variables
    const { hyax, deployer, owner } = await loadFixture(deployContractAndSetVariables);
    // Log the deployer address
    console.log("\n   [Log]: Deployer address: ", deployer.address);
    // Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);
    // Log the owner address
    console.log("\n   [Log]: Owner address: ", owner.address);
    // Log the new owner address
    console.log("\n   [Log]: New owner address: ", await hyax.owner());
    // Assert that the owner of the smart contract is the new admin address
    expect(await hyax.owner()).to.equal(owner.address);
  });
});
