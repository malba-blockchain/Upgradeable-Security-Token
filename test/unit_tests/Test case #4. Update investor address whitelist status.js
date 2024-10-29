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

describe("Test case #4. Update investor address whitelist status", function () {

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

  it("4.1. Should revert transaction because of execution with an address without permission", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    // Attempt to update whitelist status with addr1, which should fail due to permission
    await expect(hyax.connect(addr1).updateWhitelistStatus(addr2.address, true))
      .to.be.revertedWith('Function reserved only for the whitelister address or the owner');
  });

  it("4.2. Should revert transaction because of execution with zero address as parameter", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);
    // Attempt to update whitelist status with the zero address, which should fail
    await expect(hyax.connect(owner).updateWhitelistStatus(ethers.ZeroAddress, false))
      .to.be.revertedWith('Investor address to update whitelist status cannot be the zero address');
  });

  it("4.3. Should properly execute the function because it's executed with the owner address and a valid address as parameter", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //Add investor address to the whitelist using the owner address
    await hyax.connect(owner).addToWhiteList(addr2.address);

    //Remove investor address to the whitelist using the owner address
    await hyax.connect(owner).updateWhitelistStatus(addr2.address, false);

    const [isWhiteListed, isQualifiedInvestor, totalHyaxBoughtByInvestor, totalUsdDepositedByInvestor] = await hyax.investorData(addr2.address);

    expect(isWhiteListed).to.equal(false);
  });

  it("4.4. Should properly execute the function because it's executed with the whitelister address and a valid address as parameter", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //Define the new whitelister address
    await hyax.connect(owner).updateWhiteListerAddress(addr1.address);

    //Add investor address to the whitelist using the whitelister address
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    //Remove investor address to the whitelist using the whitelister address
    await hyax.connect(addr1).updateWhitelistStatus(addr2.address, false);

    const [isWhiteListed, isQualifiedInvestor, totalHyaxBoughtByInvestor, totalUsdDepositedByInvestor] = await hyax.investorData(addr2.address);

    expect(isWhiteListed).to.equal(false);
  });

  it("4.5. Should revert transaction because of execution with address already removed from the whitelist as parameter", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //Define the new whitelister address
    await hyax.connect(owner).updateWhiteListerAddress(addr1.address);

    //Add investor address to the whitelist using the whitelister address
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    //Remove investor address to the whitelist using the whitelister address
    await hyax.connect(addr1).updateWhitelistStatus(addr2.address, false);

    //Remove investor address again to the whitelist using the whitelister address
    await expect(hyax.connect(addr1).updateWhitelistStatus(addr2.address, false))
      .to.be.revertedWith('Investor address has already been updated to that status');
  });

});