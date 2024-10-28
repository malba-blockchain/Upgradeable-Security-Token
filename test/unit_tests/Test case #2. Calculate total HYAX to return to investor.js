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

describe("Test case #2. Calculate total HYAX to return to investor", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAXUpgradeable = await ethers.getContractFactory('HYAXUpgradeable');
    console.log("\n   [Log]: Deploying upgradeable HYAX...");

    // Deploy proxy with 'initialize' function
    const hyax = await upgrades.deployProxy(HYAXUpgradeable, { initializer: 'initialize' });
    
    await hyax.waitForDeployment();

    //Line to transfer the HYAX tokens from the deployer to the smart contract
    var totalSupplyHex = await hyax.totalSupply();
    await hyax.transfer(hyax.target, totalSupplyHex.toString());
    console.log("\n   [Log]: Smart contract balance is: ", (await hyax.balanceOf(hyax.target)).toString());

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2 };
  }

  it("2.1. Should revert transaction because of execution with zero in first parameter", async function () {
    // Load the fixture to deploy the contract and set initial variables
    const { hyax } = await loadFixture(deployContractAndSetVariables);

    // Attempt to calculate total HYAX tokens to return with a zero investment amount and a non-zero price
    await expect(hyax.calculateTotalHyaxTokenToReturn(0, ethers.parseUnits("30000", 8)))
      .to.be.revertedWith('The amount to invest must be greater than the minimum established');
  });

  it("2.2. Should revert transaction because of execution with zero in second parameter", async function () {
    // Load the fixture to deploy the contract and set initial variables
    const { hyax } = await loadFixture(deployContractAndSetVariables);

    // Attempt to calculate total HYAX tokens to return with a non-zero investment amount and a zero price
    await expect(hyax.calculateTotalHyaxTokenToReturn(ethers.parseUnits("10", 18), 0))
      .to.be.revertedWith('The amount to invest must be greater than the minimum established');
  });

  it("2.3. Should revert transaction because of execution with zero in both parameters", async function () {
    // Load the fixture to deploy the contract and set initial variables
    const { hyax } = await loadFixture(deployContractAndSetVariables);

    // Attempt to calculate total HYAX tokens to return with both investment amount and price set to zero
    await expect(hyax.calculateTotalHyaxTokenToReturn(0, 0))
      .to.be.revertedWith('The amount to invest must be greater than the minimum established');
  });

  it("2.4. Should revert transaction because it asks for an amount just below the minimum established", async function () {
    const { hyax } = await loadFixture(deployContractAndSetVariables);
    //Trying to invest 0.999 USD at a price of 1 USD each one
    await expect(hyax.calculateTotalHyaxTokenToReturn(ethers.parseUnits("0.999", 18), ethers.parseUnits("1", 8)))
      .to.be.revertedWith('The amount to invest must be greater than the minimum established');
  });

  it("2.5. Should revert transaction because it asks for an amount just over the maximum current supply", async function () {
    const { hyax } = await loadFixture(deployContractAndSetVariables);
    //Trying to invest 100 BTC at a price of 30121 USD each BTC
    await expect(hyax.calculateTotalHyaxTokenToReturn(ethers.parseUnits("100", 18), ethers.parseUnits("30001", 8)))
      .to.be.revertedWith('The investment made returns an amount of HYAX greater than the available');
  });

  it("2.6. Should properly execute the function because it asks for an amount just in the minimum to invest", async function () {
    const { hyax } = await loadFixture(deployContractAndSetVariables);
    //Trying to invest 1 USD at a price of 1 USD each one
    var [totalInvestmentInUsd, totalHyaxTokenToReturn] = await hyax.calculateTotalHyaxTokenToReturn(ethers.parseUnits("1", 18), ethers.parseUnits("1", 8));

    expect(totalHyaxTokenToReturn).to.equal(ethers.parseUnits("166666666666666666666", 0));
  });

  it("2.7. Should properly execute the function because it asks for an amount just in the maximum available to invest", async function () {
    const { hyax } = await loadFixture(deployContractAndSetVariables);

    //Trying to invest 100 BTC at a price of 30000 USD each one
    var [totalInvestmentInUsd, totalHyaxTokenToReturn] = await hyax.calculateTotalHyaxTokenToReturn(ethers.parseUnits("100", 18), ethers.parseUnits("30000", 8));

    expect(totalHyaxTokenToReturn).to.equal(ethers.parseUnits("500000000", 18));
  });

  it("2.8. Should properly execute the function because it asks for an amount just in the middle of the total available to invest", async function () {
    const { hyax } = await loadFixture(deployContractAndSetVariables);

    //Trying to invest 50 BTC at a price of 30000 USD each one
    var [totalInvestmentInUsd, totalHyaxTokenToReturn] = await hyax.calculateTotalHyaxTokenToReturn(ethers.parseUnits("50", 18), ethers.parseUnits("30000", 8));

    expect(totalHyaxTokenToReturn).to.equal(ethers.parseUnits("250000000", 18));
  });
});