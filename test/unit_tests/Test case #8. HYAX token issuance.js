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


describe("Test case #8. HYAX token issuance", function () {

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

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3 };
  }

  it("8.1. Should revert transaction because of execution with an address without permission", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);
    await expect(hyax.connect(addr1).tokenIssuance(ethers.parseUnits("500000000", 18)))
      .to.be.revertedWith('Ownable: caller is not the owner');
  });

  it("8.2. Should revert transaction because of execution with zero value as parameter", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(owner).tokenIssuance(0))
      .to.be.revertedWith('Amount of HYAX tokens to issue must be at least 1 token');
  });

  it("8.3. Should revert transaction because of execution with an overflow controlled by the 10,000 M tokens check", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(owner).tokenIssuance(ethers.parseUnits("100000000000000000000000000000000", 18)))
      .to.be.revertedWith('Amount of HYAX tokens to issue at a time must be maximum 1000 M');
  });

  it("8.4. Should revert the function because it surpases the cap limit of maximum 1000 M at a time", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //Issuance of  1000 000 001 surpases the cap limit of maximum 1000M at a time
    await expect(hyax.connect(owner).tokenIssuance(ethers.parseUnits("1000000001", 18)))
      .to.be.revertedWith('Amount of HYAX tokens to issue at a time must be maximum 1000 M');
  });

  it("8.5. Should revert the function because it surpases the 10,000 M tokens", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //Issue 1000 M tokens, now we have 1500 M tokens
    await hyax.connect(owner).tokenIssuance(ethers.parseUnits("1000000000", 18));

    //Issue 1000 M tokens, now we have 2500 M tokens
    await hyax.connect(owner).tokenIssuance(ethers.parseUnits("1000000000", 18));

    //Issue 1000 M tokens, now we have 3500 M tokens
    await hyax.connect(owner).tokenIssuance(ethers.parseUnits("1000000000", 18));

    //Issue 1000 M tokens, now we have 4500 M tokens
    await hyax.connect(owner).tokenIssuance(ethers.parseUnits("1000000000", 18));

    //Issue 1000 M tokens, now we have 5500 M tokens
    await hyax.connect(owner).tokenIssuance(ethers.parseUnits("1000000000", 18));

    //Issue 1000 M tokens, now we have 6500 M tokens
    await hyax.connect(owner).tokenIssuance(ethers.parseUnits("1000000000", 18));

    //Issue 1000 M tokens, now we have 7500 M tokens
    await hyax.connect(owner).tokenIssuance(ethers.parseUnits("1000000000", 18));

    //Issue 1000 M tokens, now we have 8500 M tokens
    await hyax.connect(owner).tokenIssuance(ethers.parseUnits("1000000000", 18));

    //Issue 1000 M tokens, now we have 9500 M tokens
    await hyax.connect(owner).tokenIssuance(ethers.parseUnits("1000000000", 18));

    //Issuance of 1000M tokens makes the total supply, creates 10500 M tokes which surpasses the maximum amount of tokens to create
    await expect(hyax.connect(owner).tokenIssuance(ethers.parseUnits("1000000000", 18)))
      .to.be.revertedWith('Amount of HYAX tokens to issue surpases the 10,000 M tokens');
  });

  it("8.6. Should properly execute the function because it's executed with the owner address and a valid amount as parameter", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //Issuance of 500 M tokens makes the total supply reach the 1,000 M HYAX
    await hyax.connect(owner).tokenIssuance(ethers.parseUnits("500000000", 18));

    expect(await hyax.totalSupply()).to.equal(ethers.parseUnits("1000000000", 18));
  });

});
