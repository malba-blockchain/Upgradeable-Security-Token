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

describe("Test case #3. Add investor address to whitelist", function () {

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

  it("3.1. Should revert transaction because of execution with an address without permission", async function () {
    // Load the fixture to deploy the contract and set initial variables
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    // Attempt to add addr2 to the whitelist using addr1, which should fail due to permission
    await expect(hyax.connect(addr1).addToWhiteList(addr2.address))
      .to.be.revertedWith('Function reserved only for the whitelister address or the owner');
  });

  it("3.2. Should revert transaction because of execution with zero address as parameter", async function () {
    // Load the fixture to deploy the contract and set initial variables
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    // Attempt to add the zero address to the whitelist using the owner, which should fail
    await expect(hyax.connect(owner).addToWhiteList(ethers.ZeroAddress))
      .to.be.revertedWith('Investor address to add to the whitelist cannot be the zero address');
  });

  it("3.3. Should properly execute the function because it's executed with the owner address and a valid address as parameter", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //Add investor address to the whitelist using the owner address
    await hyax.connect(owner).addToWhiteList(addr2.address);

    const [isWhiteListed, isQualifiedInvestor, totalHyaxBoughtByInvestor, totalUsdDepositedByInvestor] = await hyax.investorData(addr2.address);

    expect(isWhiteListed).to.equal(true);
  });

  it("3.4. Should properly execute the function because it's executed with the whitelister address and a valid address as parameter", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //Define the new whitelister address
    await hyax.connect(owner).updateWhiteListerAddress(addr1.address);

    //Add investor address to the whitelist using the whitelister address
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    const [isWhiteListed, isQualifiedInvestor, totalHyaxBoughtByInvestor, totalUsdDepositedByInvestor] = await hyax.investorData(addr2.address);

    expect(isWhiteListed).to.equal(true);
  });

  it("3.5. Should revert transaction because of execution with address already added to the whitelist as parameter", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //Define the new whitelister address
    await hyax.connect(owner).updateWhiteListerAddress(addr1.address);

    //Add investor address to the whitelist using the whitelister address
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    //Add investor address again to the whitelist using the whitelister address
    await expect(hyax.connect(addr1).addToWhiteList(addr2.address))
      .to.be.revertedWith('That investor address has already been added to the whitelist');
  });

});