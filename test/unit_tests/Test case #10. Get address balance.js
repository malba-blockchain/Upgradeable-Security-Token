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


describe("Test case #10. Get address balance", function () {

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

  it("10.1. Should properly execute the function and get a zero balance of an address without tokens", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    expect(await hyax.balanceOf(owner.address)).to.equal(ethers.parseUnits("0", 18));
  });

  it("10.2. Should properly execute the function and get the balance of an address with tokens", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    expect(await hyax.balanceOf(hyax.target)).to.equal(ethers.parseUnits("500000000", 18));
  });

  it("10.3. Should properly execute the function and get the new balance of the owner address after token issuance", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await hyax.connect(owner).tokenIssuance(ethers.parseUnits("500000000", 18));

    expect(await hyax.balanceOf(owner.address)).to.equal(ethers.parseUnits("500000000", 18));
  });

});
