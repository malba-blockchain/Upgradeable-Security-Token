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

describe("Test case #15. Invest from MATIC", function () {

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

    //Deploy the MATIC price data feed mock
    const MaticPriceDataFeedMock = await ethers.getContractFactory('MaticPriceDataFeedMock');

    //Deploy smart contract with established parameters
    const maticPriceDataFeedMock = await MaticPriceDataFeedMock.deploy();

    //Update the address of the MATIC price data feed mock
    await hyax.connect(owner).updatePriceFeedAddress(0, maticPriceDataFeedMock.target);

    //Update the whitelister address
    await hyax.connect(owner).updateWhiteListerAddress(addr1.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3 };
  }

  it("15.1. Should revert transaction because of execution with address that's not on the whitelist", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(addr2).investFromMatic({ value: ethers.parseEther("100") }))
      .to.be.revertedWith('Investor address has not been added to the whitelist');
  });


  it("15.2. Should revert transaction because of execution with no MATIC", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await hyax.connect(addr1).addToWhiteList(addr2.address);

    await expect(hyax.connect(addr2).investFromMatic({ value: ethers.parseEther("0") }))
      .to.be.revertedWith('The amount to invest must be greater than the minimum established');
  });


  it("15.3. Should revert transaction because it doesn't meet the minimum investment requirement", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await hyax.connect(addr1).addToWhiteList(addr2.address);

    await expect(hyax.connect(addr2).investFromMatic({ value: ethers.parseEther("1") }))
      .to.be.revertedWith('The amount to invest must be greater than the minimum established');
  });


  it("15.4. Should revert transaction because the amount exceeds the maximum non qualified investor limit", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //Add investor address to the whitelist
    await hyax.connect(addr1).addToWhiteList(addr2.address);
    
    //Investing 9500 MATIC tokens at a price of $0.411374 per token equals $3,908
    //Sending 9500 because you need to also account for the gas
    await hyax.connect(addr2).investFromMatic({ value: ethers.parseEther("9500") });

    //Sending testing address more local testnet native tokens because it only gets 10000 by default. 
    await addr3.sendTransaction({ to: addr2.address, value: ethers.parseEther("9500"), });
    await owner.sendTransaction({ to: addr2.address, value: ethers.parseEther("9500"), });
    await deployer.sendTransaction({ to: addr2.address, value: ethers.parseEther("9500"), });

    //Investing 25000 MORE MATIC tokens at a price of $0.411374 makes the total investment go above the $10K limit
    await expect(hyax.connect(addr2).investFromMatic({ value: ethers.parseEther("25000") }))
      .to.be.revertedWith('To buy that amount of HYAX its required to be a qualified investor');
  });

  it("15.5. Should properly execute the function because now the investor is registered as qualified investor", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //Add investor address to the whitelist
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    await hyax.connect(addr2).investFromMatic({ value: ethers.parseEther("9000") });

    await addr3.sendTransaction({
      to: addr2.address,
      value: ethers.parseEther("5000"),
    });

    await hyax.connect(addr1).updateQualifiedInvestorStatus(addr2.address, true);

    var booleanAnswerFromTransaction = await hyax.connect(addr2).investFromMatic.staticCall({ value: ethers.parseEther("3000") });

    expect(await booleanAnswerFromTransaction).to.equal(true);
  });


  it("15.6. Should properly execute the function because it sends exactly the amount minus the gas to pay", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    // Add investor address to the whitelist
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    // Estimate the gas that's required to execute the transactions
    const gasEstimation = await hyax.connect(addr2).investFromMatic.estimateGas({ value: ethers.parseEther("10000") });
    console.log("\n   [Log]: gasEstimation", gasEstimation.toString());

    // Obtain the approximate gas price
    const gasPrice = (await ethers.provider.getFeeData()).gasPrice;
    console.log("\n   [Log]: gasPrice", gasPrice.toString());

    // Convert 1000 to BigInt and calculate the gas fee in Wei
    const gasFeeInWei = gasPrice * gasEstimation * 1000n;
    console.log("\n   [Log]: gasFeeInWei", gasFeeInWei.toString());

    // Calculate the actual value to invest, subtracting the gas fee from the total that the account has
    const valueToInvest = ethers.parseEther("10000") - gasFeeInWei;
    console.log("\n   [Log]: valueToInvest", valueToInvest.toString());

    // Calculate the total HYAX to return in the MATIC investment
    var [totalInvestmentInUsd, totalHyaxTokenToReturn] = await hyax.calculateTotalHyaxTokenToReturn(valueToInvest, await hyax.getCurrentTokenPrice(0));

    // Send the investment in MATIC to the smart contract to receive HYAX tokens in return
    await hyax.connect(addr2).investFromMatic({ value: valueToInvest });

    expect(await hyax.balanceOf(addr2.address)).to.equal(totalHyaxTokenToReturn);
  });
});
