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

describe("Test case #27. Update crypto token USDC price feed address", function () {

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

    //Deploy the USDC price data feed mock
    const UsdcPriceDataFeedMock = await ethers.getContractFactory('UsdcPriceDataFeedMock');

    //Deploy smart contract with established parameters
    const usdcPriceDataFeedMock = await UsdcPriceDataFeedMock.deploy();

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3, usdcPriceDataFeedMock };
  }


  it("27.1. Should revert transaction because of execution with address that's not the owner", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3, usdcPriceDataFeedMock } = await loadFixture(deployContractAndSetVariables);

    //This is the actual USDC price feed address on the local testnet
    await expect(hyax.connect(addr1).updatePriceFeedAddress(1, usdcPriceDataFeedMock.target))
      .to.be.revertedWith('Ownable: caller is not the owner');
  });

  it("27.2. Should revert transaction because of execution with invalid parameter", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(owner).updatePriceFeedAddress(1, ethers.ZeroAddress))
      .to.be.revertedWith('The price data feed address cannot be the zero address');
  });

  it("27.3. Should revert transaction because of execution with an address that's not a data feed", async function () {
    const { hyax, owner, deployer, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    expect(hyax.connect(owner).updatePriceFeedAddress(1, hyax.target))
      .to.be.revertedWith('The new address does not seem to belong to a USDC price data feed');
  });

  it("27.4. Should properly execute the function because it has a valid address and valid parameter", async function () {
    const { hyax, owner, deployer, addr1, addr2, addr3, usdcPriceDataFeedMock } = await loadFixture(deployContractAndSetVariables);

    //This is the actual USDC price feed address on the local testnet
    await hyax.connect(owner).updatePriceFeedAddress(1, usdcPriceDataFeedMock.target);

    expect(await hyax.usdcPriceFeedAddress()).to.equal(usdcPriceDataFeedMock.target);
  });

});