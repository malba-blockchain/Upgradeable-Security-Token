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


describe("Test case #11. Transfer HYAX tokens from an address to another", function () {

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

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3 };
  }

  it("11.1. Should revert transaction because of execution with zero balance", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);
    
    await expect(hyax.connect(owner).transfer(addr1.address, ethers.parseUnits("100", 18)))
      .to.be.revertedWith("ERC20: transfer amount exceeds balance");
  });

  it("11.2. Should properly execute the function because the balance of the sender is positive", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await hyax.connect(deployer).transfer(owner.address, ethers.parseUnits("1000", 18));

    expect(await hyax.balanceOf(owner.address)).to.equal(ethers.parseUnits("1000", 18));
  });
});