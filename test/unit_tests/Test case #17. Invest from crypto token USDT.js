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

describe("Test case #17. Invest from crypto token USDT", function () {

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

    //Deploy the USDT price data feed mock
    const UsdtPriceDataFeedMock = await ethers.getContractFactory('UsdtPriceDataFeedMock');

    //Deploy smart contract with established parameters
    const usdtPriceDataFeedMock = await UsdtPriceDataFeedMock.deploy();

    //Update the address of the USDT price data feed mock
    await hyax.connect(owner).updatePriceFeedAddress(2, usdtPriceDataFeedMock.target);


    //Deploy the USDT token mock
    const UsdtToken = await ethers.getContractFactory('UsdtToken');

    //Deploy smart contract with established parameters
    const usdtToken = await UsdtToken.deploy();

    //Send 100K USDT to the investor address
    await usdtToken.transfer(
      addr2.address, ethers.parseUnits("100000", 18)
    );

    //Update the address of the USDT token mock
    await hyax.connect(owner).updateTokenAddress(2, usdtToken.target);


    //Update the whitelister address
    await hyax.connect(owner).updateWhiteListerAddress(addr1.address);


    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3, usdtToken };
  }

  it("17.1. Should revert transaction because of execution with address that's not on the whitelist", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3, usdtToken } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(addr2).investFromCryptoToken(2, ethers.parseEther("1000")))
      .to.be.revertedWith('Investor address has not been added to the whitelist');
  });

  it("17.2. Should revert transaction because it has not been approved in the USDT smart contract", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3, usdtToken } = await loadFixture(deployContractAndSetVariables);

    //Add investor address to the whitelist
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    await expect(hyax.connect(addr2).investFromCryptoToken(2, ethers.parseEther("1000")))
      .to.be.revertedWithCustomError(usdtToken, 'ERC20InsufficientAllowance');
  });

  it("17.3. Should revert transaction because it doesn't meet the minimum investment requirement", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3, usdtToken } = await loadFixture(deployContractAndSetVariables);

    //Add investor address to the whitelist
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    //Approve the spending of the crypto in the USDT smart contract
    await usdtToken.connect(addr2).approve(hyax.target, ethers.parseEther("0.5"));

    await expect(hyax.connect(addr2).investFromCryptoToken(2, ethers.parseEther("0.5")))
      .to.be.revertedWith('The amount to invest must be greater than the minimum established');
  });

  it("17.4. Should revert transaction because the amount exceeds the maximum non qualified investor limit", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3, usdtToken } = await loadFixture(deployContractAndSetVariables);

    //Add investor address to the whitelist
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    //Approve the spending of the crypto in the USDT smart contract
    await usdtToken.connect(addr2).approve(hyax.target, ethers.parseEther("11000"));

    await expect(hyax.connect(addr2).investFromCryptoToken(2, ethers.parseEther("11000")))
      .to.be.revertedWith('To buy that amount of HYAX its required to be a qualified investor');
  });

  it("17.5. Should properly execute the function because it sends an amount below the qualified investor limit", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3, usdtToken } = await loadFixture(deployContractAndSetVariables);

    //Add investor address to the whitelist
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    //Approve the spending of the crypto in the USDT smart contract
    await usdtToken.connect(addr2).approve(hyax.target, ethers.parseEther("9000"));

    var booleanAnswerFromTransaction = await hyax.connect(addr2).investFromCryptoToken.staticCall(2, ethers.parseEther("9000"));

    expect(await booleanAnswerFromTransaction).to.equal(true);
  });

  it("17.6. Should properly execute the function because now the investor is registered as qualified investor", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3, usdtToken } = await loadFixture(deployContractAndSetVariables);

    //Add investor address to the whitelist
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    //Update qualified investor status
    await hyax.connect(addr1).updateQualifiedInvestorStatus(addr2.address, true);

    //Approve the spending of the crypto in the USDT smart contract
    await usdtToken.connect(addr2).approve(hyax.target, ethers.parseEther("20000"));

    var booleanAnswerFromTransaction = await hyax.connect(addr2).investFromCryptoToken.staticCall(2, ethers.parseEther("20000"));

    expect(await booleanAnswerFromTransaction).to.equal(true);
  });

});