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

describe("Test case #7. Remove investor address from qualified investor status", function () {

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

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3 };
  }

  it("7.1. Should revert transaction because of execution with an address without permission", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(addr1).updateQualifiedInvestorStatus(addr2.address, false))
      .to.be.revertedWith('Function reserved only for the whitelister address or the owner');
  });

  it("7.2. Should revert transaction because of execution with zero address as parameter", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(owner).updateQualifiedInvestorStatus(ethers.ZeroAddress, false))
      .to.be.revertedWith('Investor address to update qualified investor status cannot be the zero address');
  });
  
  it("7.3. Should properly execute the function because it's executed with the owner address and a valid address as parameter", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //Add investor address to the whitelist using the owner address
    await hyax.connect(owner).addToWhiteList(addr2.address);

    //Update qualified investor status using the owner address
    await hyax.connect(owner).updateQualifiedInvestorStatus(addr2.address, true);

    //Remove investor address from the qualified investor list using the owner address
    await hyax.connect(owner).updateQualifiedInvestorStatus(addr2.address, false);

    const [isWhiteListed, isBlacklisted, isQualifiedInvestor, totalHyaxBoughtByInvestor, totalUsdDepositedByInvestor] = await hyax.investorData(addr2.address);

    expect(isQualifiedInvestor).to.equal(false);
  });

  it("7.4. Should properly execute the function because it's executed with the whitelister address and a valid address as parameter", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //Define the new whitelister address
    await hyax.connect(owner).updateWhiteListerAddress(addr1.address);

    //Add investor address to the whitelist using the owner address
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    //Update qualified investor status using the whitelister address
    await hyax.connect(addr1).updateQualifiedInvestorStatus(addr2.address, true);

    //Remove investor address from the qualified investor list using the whitelister address
    await hyax.connect(addr1).updateQualifiedInvestorStatus(addr2.address, false);

    const [isWhiteListed, isBlacklisted, isQualifiedInvestor, totalHyaxBoughtByInvestor, totalUsdDepositedByInvestor] = await hyax.investorData(addr2.address);

    expect(isQualifiedInvestor).to.equal(false);
  });

  it("7.5. Should revert transaction because of execution because address already removed from the qualified investor list as parameter", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //Define the new whitelister address
    await hyax.connect(owner).updateWhiteListerAddress(addr1.address);

    //Add investor address to the whitelist using the whitelister address
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    //Update qualified investor status using the whitelister address
    await hyax.connect(addr1).updateQualifiedInvestorStatus(addr2.address, true);

    //Remove investor address from the qualified investor list using the whitelister address
    await hyax.connect(addr1).updateQualifiedInvestorStatus(addr2.address, false);

    //Remove investor address again to the qualified investor list using the whitelister address
    await expect(hyax.connect(addr1).updateQualifiedInvestorStatus(addr2.address, false))
      .to.be.revertedWith('That investor address has already been updated to that status');
  });
});