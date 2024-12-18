/*
  The following test cases were built around accounting-related consistency and specific user flows
  As secondary goal the tests are made to validate gas efficiency.

  Scope: The scope of the following test cases is the HYAX smart contract functions
  Approach: The tests to be performed will be Unit tests (for trivial functions) and Integration tests (for complex functions)
  Resources: The tool to use for the following tests is the Hardhat specialized test runner based on ethers.js
*/
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");
const { ZeroAddress } = require("ethers");

describe("Test case #1. Deployment of HYAX smart contract", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2 };
  }

  it("1.1. Should have the right smart contract name", async function () {
    const { hyax } = await loadFixture(deployContractAndSetVariables);
    expect(await hyax.name()).to.equal("HYAXToken");
  });

  it("1.2. Should have the right smart contract symbol", async function () {
    const { hyax } = await loadFixture(deployContractAndSetVariables);
    expect(await hyax.symbol()).to.equal("HYAX");
  });

  it("1.3. Should have the right total supply", async function () {
    const { hyax } = await loadFixture(deployContractAndSetVariables);
    expect(await hyax.totalSupply()).to.equal(ethers.parseUnits("500000000", 18));
  });

  it("1.4. Should have the right HYAX price", async function () {
    const { hyax } = await loadFixture(deployContractAndSetVariables);
    expect(await hyax.hyaxPrice()).to.equal(ethers.parseUnits("0.006", 8));
  });

  it("1.5. Should have the right minimum investment allowed in USD", async function () {
    const { hyax } = await loadFixture(deployContractAndSetVariables);
    expect(await hyax.minimumInvestmentAllowedInUSD()).to.equal(ethers.parseUnits("1", 18));
  });

  it("1.6. Should have the right maximum investment allowed in USD", async function () {
    const { hyax } = await loadFixture(deployContractAndSetVariables);
    expect(await hyax.maximumInvestmentAllowedInUSD()).to.equal(ethers.parseUnits("10000", 18));
  });

  it("1.7. Should have the right whitelister address", async function () {
    const { hyax } = await loadFixture(deployContractAndSetVariables);
    expect(await hyax.whiteListerAddress()).to.equal('0x01c2f012de19e6436744c3F81f56E9e70C93a8C3');
  });

  it("1.8. Smart contract should have all the total supply in it's balance", async function () {
    const { hyax } = await loadFixture(deployContractAndSetVariables);
    var totalSupplyHex = await hyax.totalSupply();

    await hyax.transfer(hyax.target, totalSupplyHex.toString());  //Line to transfer the HYAX tokens from the deployer to the smart contract

    //The smart contract HYAX balance must be of 500 M HYAX
    expect(await hyax.balanceOf(hyax.target)).to.equal(ethers.parseUnits("500000000", 18));
  });

  it("1.9. Smart contract owner should be the new admin address", async function () {
    const { hyax, deployer, owner } = await loadFixture(deployContractAndSetVariables);
    console.log("\n   [Log]: Deployer address: ", deployer.address);
    await hyax.transferOwnership(owner.address);
    console.log("\n   [Log]: Owner address: ", owner.address);
    console.log("\n   [Log]: New owner address: ", await hyax.owner());
    expect(await hyax.owner()).to.equal(owner.address);
  });
});


describe("Test case #2. Calculate total HYAX to return to investor", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2] = await ethers.getSigners();
    ethers.get
    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Line to transfer the HYAX tokens from the deployer to the smart contract
    var totalSupplyHex = await hyax.totalSupply();
    await hyax.transfer(hyax.target, totalSupplyHex.toString());
    console.log("\n   [Log]: Smart contract balance is: ", (await hyax.balanceOf(hyax.target)).toString());

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2 };
  }

  it("2.1. Should revert transaction because of execution with zero in first paratemer", async function () {
    const { hyax } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.calculateTotalHyaxTokenToReturn(0, ethers.parseUnits("30000", 8)))
      .to.be.revertedWith('The amount to invest must be greater than the minimum established');
  });

  it("2.2. Should revert transaction because of execution with zero in second parameter", async function () {
    const { hyax } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.calculateTotalHyaxTokenToReturn(ethers.parseUnits("10", 18), 0))
      .to.be.revertedWith('The amount to invest must be greater than the minimum established');
  });

  it("2.3. Should revert transaction because of execution with zero in both parameters", async function () {
    const { hyax } = await loadFixture(deployContractAndSetVariables);

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


describe("Test case #3. Add investor address to whitelist", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Line to transfer the HYAX tokens from the deployer to the smart contract
    var totalSupplyHex = await hyax.totalSupply();
    await hyax.transfer(hyax.target, totalSupplyHex.toString());

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3 };
  }

  it("3.1. Should revert transaction because of execution with an address without permission", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(addr1).addToWhiteList(addr2.address))
      .to.be.revertedWith('Function reserved only for the whitelister address or the owner');
  });

  it("3.2. Should revert transaction because of execution with zero address as parameter", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

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


describe("Test case #4. Update investor address whitelist status", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

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

    await expect(hyax.connect(addr1).updateWhitelistStatus(addr2.address, true))
      .to.be.revertedWith('Function reserved only for the whitelister address or the owner');
  });

  it("4.2. Should revert transaction because of execution with zero address as parameter", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

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


describe("Test case #5. Update investor address blacklist status", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Line to transfer the HYAX tokens from the deployer to the smart contract
    var totalSupplyHex = await hyax.totalSupply();
    await hyax.transfer(hyax.target, totalSupplyHex.toString());

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3 };
  }

  it("5.1. Should revert transaction because of execution with an address without permission", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(addr1).updateBlacklistStatus(addr2.address, true))
      .to.be.revertedWith('Function reserved only for the whitelister address or the owner');
  });

  it("5.2. Should revert transaction because of execution with zero address as parameter", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(owner).updateBlacklistStatus(ethers.ZeroAddress, false))
      .to.be.revertedWith('Investor address to update blacklist status cannot be the zero address');
  });

  it("5.3. Should properly execute the function because it's executed with the owner address and a valid address as parameter", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //Add investor address to the whitelist using the owner address
    await hyax.connect(owner).addToWhiteList(addr2.address);

    //Add investor address to the blacklist using the owner address
    await hyax.connect(owner).updateBlacklistStatus(addr2.address, true);

    const [isWhiteListed, isBlacklisted, isQualifiedInvestor, totalHyaxBoughtByInvestor, totalUsdDepositedByInvestor] = await hyax.investorData(addr2.address);

    expect(isBlacklisted).to.equal(true);
  });

  it("5.4. Should properly execute the function because it's executed with the whitelister address and a valid address as parameter", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //Define the new whitelister address
    await hyax.connect(owner).updateWhiteListerAddress(addr1.address);

    //Add investor address to the whitelist using the whitelister address
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    //Add investor address to the blacklist using the whitelister address
    await hyax.connect(addr1).updateBlacklistStatus(addr2.address, true);

    const [isWhiteListed, isBlacklisted, isQualifiedInvestor, totalHyaxBoughtByInvestor, totalUsdDepositedByInvestor] = await hyax.investorData(addr2.address);

    expect(isBlacklisted).to.equal(true);
  });

  it("5.5. Should revert transaction because of execution with address already added to the blacklist as parameter", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //Define the new whitelister address
    await hyax.connect(owner).updateWhiteListerAddress(addr1.address);

    //Add investor address to the whitelist using the whitelister address
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    //Add investor address to the blacklist using the whitelister address
    await hyax.connect(addr1).updateBlacklistStatus(addr2.address, true);

    //Remove investor address again to the blacklist using the whitelister address
    await expect(hyax.connect(addr1).updateBlacklistStatus(addr2.address, true))
      .to.be.revertedWith('Investor address has already been updated to that status');
  });

});


describe("Test case #6. Add investor address to qualified investor status", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Line to transfer the HYAX tokens from the deployer to the smart contract
    var totalSupplyHex = await hyax.totalSupply();
    await hyax.transfer(hyax.target, totalSupplyHex.toString());

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3 };
  }

  it("6.1. Should revert transaction because of execution with an address without permission", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(addr1).updateQualifiedInvestorStatus(addr2.address, true))
      .to.be.revertedWith('Function reserved only for the whitelister address or the owner');
  });

  it("6.2. Should revert transaction because of execution with zero address as parameter", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //Define the new whitelister address
    await hyax.connect(owner).updateWhiteListerAddress(addr1.address);

    await expect(hyax.connect(addr1).updateQualifiedInvestorStatus(ethers.ZeroAddress, true))
      .to.be.revertedWith('Investor address to update qualified investor status cannot be the zero address');
  });

  it("6.3. Should revert the function becase the address has not been added yet to the investors whitelist", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //Add investor address to the qualified investor list using the owner address
    await expect(hyax.connect(owner).updateQualifiedInvestorStatus(addr2.address, true))
      .to.be.revertedWith('Investor address must be first added to the investor whitelist');
  });

  it("6.4. Should properly execute the function because it's executed with the owner address and a valid address as parameter", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //Add investor address to the whitelist using the owner address
    await hyax.connect(owner).addToWhiteList(addr2.address);

    //Update qualified investor status using the owner address
    await hyax.connect(owner).updateQualifiedInvestorStatus(addr2.address, true);

    const [isWhiteListed, isBlacklisted, isQualifiedInvestor, totalHyaxBoughtByInvestor, totalUsdDepositedByInvestor] = await hyax.investorData(addr2.address);

    expect(isQualifiedInvestor).to.equal(true);
  });

  it("6.5. Should properly execute the function because it's executed with the whitelister address and a valid address as parameter", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //Define the new whitelister address
    await hyax.connect(owner).updateWhiteListerAddress(addr1.address);

    //Add investor address to the whitelist using the whitelister address
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    //Add investor address to the qualified investor list using the whitelister address
    await hyax.connect(addr1).updateQualifiedInvestorStatus(addr2.address, true);

    const [isWhiteListed, isBlacklisted, isQualifiedInvestor, totalHyaxBoughtByInvestor, totalUsdDepositedByInvestor] = await hyax.investorData(addr2.address);

    expect(isQualifiedInvestor).to.equal(true);
  });

  it("6.6. Should revert transaction because of execution with address already added to the whitelist as parameter", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //Define the new whitelister address
    await hyax.connect(owner).updateWhiteListerAddress(addr1.address);

    //Add investor address to the whitelist using the whitelister address
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    //Update qualified investor status using the whitelister address
    await hyax.connect(addr1).updateQualifiedInvestorStatus(addr2.address, true);

    //Update qualified investor status again using the whitelister address
    await expect(hyax.connect(addr1).updateQualifiedInvestorStatus(addr2.address, true))
      .to.be.revertedWith('That investor address has already been updated to that status');
  });
});


describe("Test case #7. Remove investor address from qualified investor status", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

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

    //Remove investor address to the whitelist using the whitelister address
    await hyax.connect(addr1).updateQualifiedInvestorStatus(addr2.address, false);

    //Remove investor address again to the qualified investor list using the whitelister address
    await expect(hyax.connect(addr1).updateQualifiedInvestorStatus(addr2.address, false))
      .to.be.revertedWith('That investor address has already been updated to that status');
  });
});


describe("Test case #8. HYAX token issuance", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

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
    //await hyax.connect(addr1).tokenIssuance(ethers.parseUnits("500000000", 18));
    await expect(hyax.connect(addr1).tokenIssuance(ethers.parseUnits("500000000", 18)))
      .to.be.revertedWithCustomError(hyax, 'OwnableUnauthorizedAccount');
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

describe("Test case #9. Get total supply", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Line to transfer the HYAX tokens from the deployer to the smart contract
    var totalSupplyHex = await hyax.totalSupply();
    await hyax.transfer(hyax.target, totalSupplyHex.toString());

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3 };
  }

  it("9.1. Should properly execute the function and get the initial total supply", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    expect(await hyax.totalSupply()).to.equal(ethers.parseUnits("500000000", 18));
  });

  it("9.2. Should properly execute the function and get the new total supply", async function () {
    const { hyax, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //Issuance of 500 M tokens makes the total supply reach the 1,000 M HYAX
    await hyax.connect(owner).tokenIssuance(ethers.parseUnits("500000000", 18));

    expect(await hyax.totalSupply()).to.equal(ethers.parseUnits("1000000000", 18));
  });

});


describe("Test case #10. Get address balance", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Line to transfer the HYAX tokens from the deployer to the smart contract
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

describe("Test case #11. Transfer HYAX tokens from an address to another", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3 };
  }

  it("11.1. Should revert transaction because of execution with zero balance", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //await hyax.connect(owner).transfer(addr1.address, ethers.parseUnits("100", 18));
    await expect(hyax.connect(owner).transfer(addr1.address, ethers.parseUnits("100", 18)))
      .to.be.revertedWithCustomError(hyax, 'ERC20InsufficientBalance');
  });

  it("11.2. Should properly execute the function because the balance of the sender is positive", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await hyax.connect(deployer).transfer(owner.address, ethers.parseUnits("1000", 18));

    expect(await hyax.balanceOf(owner.address)).to.equal(ethers.parseUnits("1000", 18));
  });
});



describe("Test case #12. Get value of allowance", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3 };
  }

  it("12.1. Should properly execute the function and get a zero balance from an address with no allowance", async function () {
    const { hyax, owner, deployer, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    expect(await hyax.allowance(deployer.address, owner.address)).to.equal(ethers.parseUnits("0", 18));
  });

  it("12.2. Should properly execute the function and get the allowance of the address", async function () {
    const { hyax, owner, deployer, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await hyax.approve(owner.address, ethers.parseUnits("1000", 18));

    expect(await hyax.allowance(deployer.address, owner.address)).to.equal(ethers.parseUnits("1000", 18));
  });

});


describe("Test case #13. Approve HYAX tokens", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3 };
  }

  it("13.1. Should properly execute the function and approve the amount, approve function does not require balance", async function () {
    const { hyax, owner, deployer, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await hyax.approve(owner.address, ethers.parseUnits("1000", 18));

    expect(await hyax.allowance(deployer.address, owner.address)).to.equal(ethers.parseUnits("1000", 18));
  });

});


describe("Test case #14. Transfer from HYAX tokens", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3 };
  }


  it("14.1. Should revert transaction because of execution with no approved allowance", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(owner).transferFrom(deployer.address, addr1.address, ethers.parseUnits("100", 18)))
      .to.be.revertedWithCustomError(hyax, 'ERC20InsufficientAllowance');
  });

  it("14.2. Should revert transaction because of execution with an amount greater than the allowance", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await hyax.approve(owner.address, ethers.parseUnits("1000", 18));

    await expect(hyax.connect(owner).transferFrom(deployer.address, addr1.address, ethers.parseUnits("1001", 18)))
      .to.be.revertedWithCustomError(hyax, 'ERC20InsufficientAllowance');
  });

  it("14.3. Should properly execute the function because it has a valid address and allowed amount", async function () {
    const { hyax, owner, deployer, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await hyax.approve(owner.address, ethers.parseUnits("1000", 18));

    await hyax.connect(owner).transferFrom(deployer.address, addr1.address, ethers.parseUnits("1000", 18))

    expect(await hyax.balanceOf(addr1.address)).to.equal(ethers.parseUnits("1000", 18));
  });

});


describe("Test case #15. Invest from MATIC", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

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



describe("Test case #16. Invest from crypto token USDC", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Line to transfer the HYAX tokens from the deployer to the smart contract
    var totalSupplyHex = await hyax.totalSupply();
    await hyax.transfer(hyax.target, totalSupplyHex.toString());

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);


    //Deploy the USDC price data feed mock
    const UsdcPriceDataFeedMock = await ethers.getContractFactory('UsdcPriceDataFeedMock');

    //Deploy smart contract with established parameters
    const usdcPriceDataFeedMock = await UsdcPriceDataFeedMock.deploy();

    //Update the address of the USDC price data feed mock
    await hyax.connect(owner).updatePriceFeedAddress(1, usdcPriceDataFeedMock.target);


    //Deploy the USDC token mock
    const UsdcToken = await ethers.getContractFactory('UsdcToken');

    //Deploy smart contract with established parameters
    const usdcToken = await UsdcToken.deploy();

    //Send 100K USDC to the investor address
    await usdcToken.transfer(
      addr2.address, ethers.parseUnits("100000", 18)
    );

    //Update the address of the USDC token mock
    await hyax.connect(owner).updateTokenAddress(1, usdcToken.target);

    //Update the whitelister address
    await hyax.connect(owner).updateWhiteListerAddress(addr1.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3, usdcToken };
  }

  it("16.1. Should revert transaction because of execution with address that's not on the whitelist", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3, usdcToken } = await loadFixture(deployContractAndSetVariables);

    //The value 1 represents USDC in the enum list for crypto tokens.
    //enum TokenType { MATIC, USDC, USDT, WBTC, WETH }
    await expect(hyax.connect(addr2).investFromCryptoToken(1, ethers.parseEther("1000")))
      .to.be.revertedWith('Investor address has not been added to the whitelist');
  });

  it("16.2. Should revert transaction because it has not been approved in the USDC smart contract", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3, usdcToken } = await loadFixture(deployContractAndSetVariables);

    //Add investor address to the whitelist
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    await expect(hyax.connect(addr2).investFromCryptoToken(1, ethers.parseEther("1000")))
      .to.be.revertedWithCustomError(hyax, 'ERC20InsufficientAllowance');
  });

  it("16.3. Should revert transaction because it doesn't meet the minimum investment requirement", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3, usdcToken } = await loadFixture(deployContractAndSetVariables);

    //Add investor address to the whitelist
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    //Approve the spending of the crypto in the USDC smart contract
    await usdcToken.connect(addr2).approve(hyax.target, ethers.parseEther("0.5"));

    await expect(hyax.connect(addr2).investFromCryptoToken(1, ethers.parseEther("0.5")))
      .to.be.revertedWith('The amount to invest must be greater than the minimum established');
  });

  it("16.4. Should revert transaction because the amount exceeds the maximum non qualified investor limit", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3, usdcToken } = await loadFixture(deployContractAndSetVariables);

    //Add investor address to the whitelist
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    //Approve the spending of the crypto in the USDC smart contract
    await usdcToken.connect(addr2).approve(hyax.target, ethers.parseEther("11000"));

    await expect(hyax.connect(addr2).investFromCryptoToken(1, ethers.parseEther("11000")))
      .to.be.revertedWith('To buy that amount of HYAX its required to be a qualified investor');
  });

  it("16.5. Should properly execute the function because it sends an amount below the qualified investor limit", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3, usdcToken } = await loadFixture(deployContractAndSetVariables);

    //Add investor address to the whitelist
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    //Approve the spending of the crypto in the USDC smart contract
    await usdcToken.connect(addr2).approve(hyax.target, ethers.parseEther("9000"));

    var booleanAnswerFromTransaction = await hyax.connect(addr2).investFromCryptoToken.staticCall(1, ethers.parseEther("9000"));

    expect(await booleanAnswerFromTransaction).to.equal(true);
  });

  it("16.6. Should properly execute the function because now the investor is registered as qualified investor", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3, usdcToken } = await loadFixture(deployContractAndSetVariables);

    //Add investor address to the whitelist
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    //Update qualified investor status
    await hyax.connect(addr1).updateQualifiedInvestorStatus(addr2.address, true);

    //Approve the spending of the crypto in the USDC smart contract
    await usdcToken.connect(addr2).approve(hyax.target, ethers.parseEther("20000"));

    var booleanAnswerFromTransaction = await hyax.connect(addr2).investFromCryptoToken.staticCall(1, ethers.parseEther("20000"));

    expect(await booleanAnswerFromTransaction).to.equal(true);
  });

});



describe("Test case #17. Invest from crypto token USDT", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

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
      .to.be.revertedWithCustomError(hyax, 'ERC20InsufficientAllowance');
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


describe("Test case #18. Invest from crypto token WBTC", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Line to transfer the HYAX tokens from the deployer to the smart contract
    var totalSupplyHex = await hyax.totalSupply();
    await hyax.transfer(hyax.target, totalSupplyHex.toString());

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);


    //Deploy the WBTC price data feed mock
    const WbtcPriceDataFeedMock = await ethers.getContractFactory('WbtcPriceDataFeedMock');

    //Deploy smart contract with established parameters
    const wbtcPriceDataFeedMock = await WbtcPriceDataFeedMock.deploy();

    //Update the address of the WBTC price data feed mock
    await hyax.connect(owner).updatePriceFeedAddress(3, wbtcPriceDataFeedMock.target);


    //Deploy the WBTC token mock
    const WbtcToken = await ethers.getContractFactory('WbtcToken');

    //Deploy smart contract with established parameters
    const wbtcToken = await WbtcToken.deploy();

    //Send 100K WBTC to the investor address
    await wbtcToken.transfer(
      addr2.address, ethers.parseUnits("100000", 18)
    );

    //Update the address of the WBTC token mock
    await hyax.connect(owner).updateTokenAddress(3, wbtcToken.target);


    //Update the whitelister address
    await hyax.connect(owner).updateWhiteListerAddress(addr1.address);


    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3, wbtcToken };
  }

  it("18.1. Should revert transaction because of execution with address that's not on the whitelist", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3, wbtcToken } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(addr2).investFromCryptoToken(3, ethers.parseEther("0.25")))
      .to.be.revertedWith('Investor address has not been added to the whitelist');
  });

  it("18.2. Should revert transaction because it has not been approved in the WBTC smart contract", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3, wbtcToken } = await loadFixture(deployContractAndSetVariables);

    //Add investor address to the whitelist
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    await expect(hyax.connect(addr2).investFromCryptoToken(3, ethers.parseEther("0.17")))
      .to.be.revertedWithCustomError(hyax, 'ERC20InsufficientAllowance');
  });

  it("18.3. Should revert transaction because it doesn't meet the minimum investment requirement", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3, wbtcToken } = await loadFixture(deployContractAndSetVariables);

    //Add investor address to the whitelist
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    //Approve the spending of the crypto in the wbtc smart contract
    await wbtcToken.connect(addr2).approve(hyax.target, ethers.parseEther("0.0000001"));

    await expect(hyax.connect(addr2).investFromCryptoToken(3, ethers.parseEther("0.0000001")))
      .to.be.revertedWith('The amount to invest must be greater than the minimum established');
  });

  it("18.4. Should revert transaction because the amount exceeds the maximum non qualified investor limit", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3, wbtcToken } = await loadFixture(deployContractAndSetVariables);

    //Add investor address to the whitelist
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    //Approve the spending of the crypto in the WBTC smart contract
    await wbtcToken.connect(addr2).approve(hyax.target, ethers.parseEther("1"));

    await expect(hyax.connect(addr2).investFromCryptoToken(3, ethers.parseEther("1")))
      .to.be.revertedWith('To buy that amount of HYAX its required to be a qualified investor');
  });

  it("18.5. Should properly execute the function because it sends an amount below the qualified investor limit", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3, wbtcToken } = await loadFixture(deployContractAndSetVariables);

    //Add investor address to the whitelist
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    //Approve the spending of the crypto in the WBTC smart contract
    await wbtcToken.connect(addr2).approve(hyax.target, ethers.parseEther("0.17"));

    var booleanAnswerFromTransaction = await hyax.connect(addr2).investFromCryptoToken.staticCall(3, ethers.parseEther("0.17"));

    expect(await booleanAnswerFromTransaction).to.equal(true);
  });

  it("18.6. Should properly execute the function because now the investor is registered as qualified investor", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3, wbtcToken } = await loadFixture(deployContractAndSetVariables);

    //Add investor address to the whitelist
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    //Update qualified investor status
    await hyax.connect(addr1).updateQualifiedInvestorStatus(addr2.address, true);

    //Approve the spending of the crypto in the WBTC smart contract
    await wbtcToken.connect(addr2).approve(hyax.target, ethers.parseEther("1"));

    var booleanAnswerFromTransaction = await hyax.connect(addr2).investFromCryptoToken.staticCall(3, ethers.parseEther("1"));

    expect(await booleanAnswerFromTransaction).to.equal(true);
  });

});


describe("Test case #19. Invest from crypto token WETH", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Line to transfer the HYAX tokens from the deployer to the smart contract
    var totalSupplyHex = await hyax.totalSupply();
    await hyax.transfer(hyax.target, totalSupplyHex.toString());

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);


    //Deploy the WETH price data feed mock
    const WethPriceDataFeedMock = await ethers.getContractFactory('WethPriceDataFeedMock');

    //Deploy smart contract with established parameters
    const wethPriceDataFeedMock = await WethPriceDataFeedMock.deploy();

    //Update the address of the WETH price data feed mock
    await hyax.connect(owner).updatePriceFeedAddress(4, wethPriceDataFeedMock.target);


    //Deploy the WETH token mock
    const WethToken = await ethers.getContractFactory('WethToken');

    //Deploy smart contract with established parameters
    const wethToken = await WethToken.deploy();

    //Send 100K WETH to the investor address
    await wethToken.transfer(
      addr2.address, ethers.parseUnits("100000", 18)
    );

    //Update the address of the WETH token mock
    await hyax.connect(owner).updateTokenAddress(4, wethToken.target);


    //Update the whitelister address
    await hyax.connect(owner).updateWhiteListerAddress(addr1.address);


    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3, wethToken };
  }

  it("19.1. Should revert transaction because of execution with address that's not on the whitelist", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3, wethToken } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(addr2).investFromCryptoToken(4, ethers.parseEther("1")))
      .to.be.revertedWith('Investor address has not been added to the whitelist');
  });

  it("19.2. Should revert transaction because it has not been approved in the WETH smart contract", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3, wethToken } = await loadFixture(deployContractAndSetVariables);

    //Add investor address to the whitelist
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    await expect(hyax.connect(addr2).investFromCryptoToken(4, ethers.parseEther("1")))
      .to.be.revertedWithCustomError(hyax, 'ERC20InsufficientAllowance');
  });

  it("19.3. Should revert transaction because it doesn't meet the minimum investment requirement", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3, wethToken } = await loadFixture(deployContractAndSetVariables);

    //Add investor address to the whitelist
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    //Approve the spending of the crypto in the weth smart contract
    await wethToken.connect(addr2).approve(hyax.target, ethers.parseEther("0.00001"));

    await expect(hyax.connect(addr2).investFromCryptoToken(4, ethers.parseEther("0.00001")))
      .to.be.revertedWith('The amount to invest must be greater than the minimum established');
  });

  it("19.4. Should revert transaction because the amount exceeds the maximum non qualified investor limit", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3, wethToken } = await loadFixture(deployContractAndSetVariables);

    //Add investor address to the whitelist
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    //Approve the spending of the crypto in the WETH smart contract
    await wethToken.connect(addr2).approve(hyax.target, ethers.parseEther("10"));

    await expect(hyax.connect(addr2).investFromCryptoToken(4, ethers.parseEther("10")))
      .to.be.revertedWith('To buy that amount of HYAX its required to be a qualified investor');
  });

  it("19.5. Should properly execute the function because it sends an amount below the qualified investor limit", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3, wethToken } = await loadFixture(deployContractAndSetVariables);

    //Add investor address to the whitelist
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    //Approve the spending of the crypto in the WETH smart contract
    await wethToken.connect(addr2).approve(hyax.target, ethers.parseEther("3.7"));

    var booleanAnswerFromTransaction = await hyax.connect(addr2).investFromCryptoToken.staticCall(4, ethers.parseEther("3.7"));

    expect(await booleanAnswerFromTransaction).to.equal(true);
  });

  it("19.6. Should properly execute the function because now the investor is registered as qualified investor", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3, wethToken } = await loadFixture(deployContractAndSetVariables);

    //Add investor address to the whitelist
    await hyax.connect(addr1).addToWhiteList(addr2.address);

    //Update qualified investor status
    await hyax.connect(addr1).updateQualifiedInvestorStatus(addr2.address, true);

    //Approve the spending of the crypto in the WETH smart contract
    await wethToken.connect(addr2).approve(hyax.target, ethers.parseEther("20"));

    var booleanAnswerFromTransaction = await hyax.connect(addr2).investFromCryptoToken.staticCall(4, ethers.parseEther("20"));

    expect(await booleanAnswerFromTransaction).to.equal(true);
  });

});


describe("Test case #20. Update HYAX price in USD", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Line to transfer the HYAX tokens from the deployer to the smart contract
    var totalSupplyHex = await hyax.totalSupply();
    await hyax.transfer(hyax.target, totalSupplyHex.toString());

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3 };
  }


  it("20.1. Should revert transaction because of execution with no address that's not the owner", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(addr1).updateHyaxPrice(600000))
      .to.be.revertedWithCustomError(hyax, 'OwnableUnauthorizedAccount');
  });

  it("20.2. Should revert transaction because of execution with invalid parameter", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(owner).updateHyaxPrice(0))
      .to.be.revertedWith('Price of HYAX token must be at least USD 0.005, that is 500000 with 8 decimals');
  });


  it("20.3. Should properly execute the function because it has a valid address and valid amount", async function () {
    const { hyax, owner, deployer, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await hyax.connect(owner).updateHyaxPrice(700000);

    expect(await hyax.hyaxPrice()).to.equal(ethers.parseUnits("0.007", 8));
  });

});



describe("Test case #21. Update minimum investment allowed in USD", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Line to transfer the HYAX tokens from the deployer to the smart contract
    var totalSupplyHex = await hyax.totalSupply();
    await hyax.transfer(hyax.target, totalSupplyHex.toString());

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3 };
  }


  it("21.1. Should revert transaction because of execution with address that's not the owners", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(addr1).updateMinimumInvestmentAllowedInUSD(ethers.parseUnits("1", 18)))
      .to.be.revertedWithCustomError(hyax, 'OwnableUnauthorizedAccount');
  });

  it("21.2. Should revert transaction because of execution with invalid parameter", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(owner).updateMinimumInvestmentAllowedInUSD(0))
      .to.be.revertedWith('New minimun amount to invest, must be greater than zero');
  });

  it("21.3. Should properly execute the function because it has a valid address and valid amount", async function () {
    const { hyax, owner, deployer, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await hyax.connect(owner).updateMinimumInvestmentAllowedInUSD(ethers.parseUnits("2", 18));

    expect(await hyax.minimumInvestmentAllowedInUSD()).to.equal(ethers.parseUnits("2", 18));
  });

});


describe("Test case #22. Update maximum investment allowed in USD for non qualified investor", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Line to transfer the HYAX tokens from the deployer to the smart contract
    var totalSupplyHex = await hyax.totalSupply();
    await hyax.transfer(hyax.target, totalSupplyHex.toString());

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3 };
  }


  it("22.1. Should revert transaction because of execution with address that's not the owner", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(addr1).updateMaximumInvestmentAllowedInUSD(ethers.parseUnits("20000", 18)))
      .to.be.revertedWithCustomError(hyax, 'OwnableUnauthorizedAccount');
  });

  it("22.2. Should revert transaction because of execution with invalid parameter", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(owner).updateMaximumInvestmentAllowedInUSD(0))
      .to.be.revertedWith('New maximum amount to invest, must be greater than zero');
  });

  it("22.3. Should properly execute the function because it has a valid address and valid amount", async function () {
    const { hyax, owner, deployer, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await hyax.connect(owner).updateMaximumInvestmentAllowedInUSD(ethers.parseUnits("20000", 18));

    expect(await hyax.maximumInvestmentAllowedInUSD()).to.equal(ethers.parseUnits("20000", 18));
  });

});


describe("Test case #23. Update whitelister address", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Line to transfer the HYAX tokens from the deployer to the smart contract
    var totalSupplyHex = await hyax.totalSupply();
    await hyax.transfer(hyax.target, totalSupplyHex.toString());

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3 };
  }


  it("23.1. Should revert transaction because of execution with address that's not the owner", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(addr1).updateWhiteListerAddress('0x90F79bf6EB2c4f870365E785982E1f101E93b906'))
      .to.be.revertedWithCustomError(hyax, 'OwnableUnauthorizedAccount');
  });

  it("23.2. Should revert transaction because of execution with invalid parameter", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(owner).updateWhiteListerAddress(ethers.ZeroAddress))
      .to.be.revertedWith('The whitelister address cannot be the zero address');
  });

  it("23.3. Should properly execute the function because it has a valid address and valid parameter", async function () {
    const { hyax, owner, deployer, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await hyax.connect(owner).updateWhiteListerAddress('0x90F79bf6EB2c4f870365E785982E1f101E93b906');

    expect(await hyax.whiteListerAddress()).to.equal('0x90F79bf6EB2c4f870365E785982E1f101E93b906');
  });

});



describe("Test case #24. Update treasury address", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Line to transfer the HYAX tokens from the deployer to the smart contract
    var totalSupplyHex = await hyax.totalSupply();
    await hyax.transfer(hyax.target, totalSupplyHex.toString());

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3 };
  }


  it("24.1. Should revert transaction because of execution with address that's not the owner", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(addr1).updateTreasuryAddress('0x90F79bf6EB2c4f870365E785982E1f101E93b906'))
      .to.be.revertedWithCustomError(hyax, 'OwnableUnauthorizedAccount');
  });

  it("24.2. Should revert transaction because of execution with invalid parameter", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(owner).updateTreasuryAddress(ethers.ZeroAddress))
      .to.be.revertedWith('The treasury address cannot be the zero address');
  });

  it("24.3. Should properly execute the function because it has a valid address and valid parameter", async function () {
    const { hyax, owner, deployer, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await hyax.connect(owner).updateTreasuryAddress('0x90F79bf6EB2c4f870365E785982E1f101E93b906');

    expect(await hyax.treasuryAddress()).to.equal('0x90F79bf6EB2c4f870365E785982E1f101E93b906');
  });

});

describe("Test case #25. Update crypto token MATIC price feed address", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Line to transfer the HYAX tokens from the deployer to the smart contract
    var totalSupplyHex = await hyax.totalSupply();
    await hyax.transfer(hyax.target, totalSupplyHex.toString());

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Deploy the MATIC price data feed mock
    const MaticPriceDataFeedMock = await ethers.getContractFactory('MaticPriceDataFeedMock');

    //Deploy smart contract with established parameters
    const maticPriceDataFeedMock = await MaticPriceDataFeedMock.deploy();

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3, maticPriceDataFeedMock };
  }


  it("25.1. Should revert transaction because of execution with no address that's not the owner", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3, maticPriceDataFeedMock } = await loadFixture(deployContractAndSetVariables);

    //This is the actual MATIC price feed address on the local testnet
    await expect(hyax.connect(addr1).updatePriceFeedAddress(0, maticPriceDataFeedMock.target))
      .to.be.revertedWithCustomError(hyax, 'OwnableUnauthorizedAccount');
  });

  it("25.2. Should revert transaction because of execution with invalid parameter", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(owner).updatePriceFeedAddress(0, ethers.ZeroAddress))
      .to.be.revertedWith('The price data feed address cannot be the zero address');
  });

  it("25.3. Should revert transaction because of execution with an address that's not a data feed", async function () {
    const { hyax, owner, deployer, addr1, addr2, addr3, maticPriceDataFeedMock } = await loadFixture(deployContractAndSetVariables);

    expect(hyax.connect(owner).updatePriceFeedAddress(0, hyax.target))
      .to.be.revertedWith('The new address does not seem to belong to a MATIC price data feed');
  });

  it("25.4. Should properly execute the function because it has a valid address and valid parameter", async function () {
    const { hyax, owner, deployer, addr1, addr2, addr3, maticPriceDataFeedMock } = await loadFixture(deployContractAndSetVariables);

    //This is the actual MATIC price feed address on the local testnet
    await hyax.connect(owner).updatePriceFeedAddress(0, maticPriceDataFeedMock.target);

    expect(await hyax.maticPriceFeedAddress()).to.equal(maticPriceDataFeedMock.target);
  });

});


describe("Test case #26. Update USDC token address in the polygon network", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Line to transfer the HYAX tokens from the deployer to the smart contract
    var totalSupplyHex = await hyax.totalSupply();
    await hyax.transfer(hyax.target, totalSupplyHex.toString());

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3 };
  }


  it("26.1. Should revert transaction because of execution with address that's not the owner", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //This is the actual USDC token address on the polygon mainnet
    await expect(hyax.connect(addr1).updateTokenAddress(1, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'))
      .to.be.revertedWithCustomError(hyax, 'OwnableUnauthorizedAccount');
  });

  it("26.2. Should revert transaction because of execution with invalid parameter", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(owner).updateTokenAddress(1, ethers.ZeroAddress))
      .to.be.revertedWith('The token address cannot be the zero address');
  });

  it("26.3. Should properly execute the function because it has a valid address and valid parameter", async function () {
    const { hyax, owner, deployer, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //This is the actual USDC token address on the polygon mainnet
    await hyax.connect(owner).updateTokenAddress(1, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174');

    expect(await hyax.usdcTokenAddress()).to.equal('0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174');
  });

});


describe("Test case #27. Update crypto token USDC price feed address", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

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
      .to.be.revertedWithCustomError(hyax, 'OwnableUnauthorizedAccount');
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


describe("Test case #28. Update USDT token address in the polygon network", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Line to transfer the HYAX tokens from the deployer to the smart contract
    var totalSupplyHex = await hyax.totalSupply();
    await hyax.transfer(hyax.target, totalSupplyHex.toString());

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3 };
  }


  it("28.1. Should revert transaction because of execution with address that's not the owner", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //This is the actual USDT token address on the polygon mainnet
    await expect(hyax.connect(addr1).updateTokenAddress(2, '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'))
      .to.be.revertedWithCustomError(hyax, 'OwnableUnauthorizedAccount');
  });

  it("28.2. Should revert transaction because of execution with invalid parameter", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(owner).updateTokenAddress(2, ethers.ZeroAddress))
      .to.be.revertedWith('The token address cannot be the zero address');
  });

  it("28.3. Should properly execute the function because it has a valid address and valid parameter", async function () {
    const { hyax, owner, deployer, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //This is the actual USDT token address on the polygon mainnet
    await hyax.connect(owner).updateTokenAddress(2, '0xc2132D05D31c914a87C6611C10748AEb04B58e8F');

    expect(await hyax.usdtTokenAddress()).to.equal('0xc2132D05D31c914a87C6611C10748AEb04B58e8F');
  });

});


describe("Test case #29. Update crypto token USDT price feed address", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Line to transfer the HYAX tokens from the deployer to the smart contract
    var totalSupplyHex = await hyax.totalSupply();
    await hyax.transfer(hyax.target, totalSupplyHex.toString());

    //Deploy the USDT price data feed mock
    const UsdtPriceDataFeedMock = await ethers.getContractFactory('UsdtPriceDataFeedMock');

    //Deploy smart contract with established parameters
    const usdtPriceDataFeedMock = await UsdtPriceDataFeedMock.deploy();

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3, usdtPriceDataFeedMock };
  }


  it("29.1. Should revert transaction because of execution with address that's not the owner", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3, usdtPriceDataFeedMock } = await loadFixture(deployContractAndSetVariables);

    //This is the actual USDT price feed address on the local testnet
    await expect(hyax.connect(addr1).updatePriceFeedAddress(2, usdtPriceDataFeedMock.target))
      .to.be.revertedWithCustomError(hyax, 'OwnableUnauthorizedAccount');
  });

  it("29.2. Should revert transaction because of execution with invalid parameter", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(owner).updatePriceFeedAddress(2, ethers.ZeroAddress))
      .to.be.revertedWith('The price data feed address cannot be the zero address');
  });

  it("29.3. Should revert transaction because of execution with an address that's not a data feed", async function () {
    const { hyax, owner, deployer, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    expect(hyax.connect(owner).updatePriceFeedAddress(2, hyax.target))
      .to.be.revertedWith('The new address does not seem to belong to a USDT price data feed');
  });

  it("29.4. Should properly execute the function because it has a valid address and valid parameter", async function () {
    const { hyax, owner, deployer, addr1, addr2, addr3, usdtPriceDataFeedMock } = await loadFixture(deployContractAndSetVariables);

    //This is the actual USDC price feed address on the local testnet
    await hyax.connect(owner).updatePriceFeedAddress(2, usdtPriceDataFeedMock.target);

    expect(await hyax.usdtPriceFeedAddress()).to.equal(usdtPriceDataFeedMock.target);
  });

});


describe("Test case #30. Update WBTC token address in the polygon network", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Line to transfer the HYAX tokens from the deployer to the smart contract
    var totalSupplyHex = await hyax.totalSupply();
    await hyax.transfer(hyax.target, totalSupplyHex.toString());

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3 };
  }


  it("30.1. Should revert transaction because of execution with address that's not the owner", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //This is the actual WBTC token address on the polygon mainnet
    await expect(hyax.connect(addr1).updateTokenAddress(3, '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6'))
      .to.be.revertedWithCustomError(hyax, 'OwnableUnauthorizedAccount');
  });

  it("30.2. Should revert transaction because of execution with invalid parameter", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(owner).updateTokenAddress(3, ethers.ZeroAddress))
      .to.be.revertedWith('The token address cannot be the zero address');
  });

  it("230.3. Should properly execute the function because it has a valid address and valid parameter", async function () {
    const { hyax, owner, deployer, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //This is the actual WBTC token address on the polygon mainnet
    await hyax.connect(owner).updateTokenAddress(3, '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6');

    expect(await hyax.wbtcTokenAddress()).to.equal('0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6');
  });

});



describe("Test case #31. Update crypto token WBTC price feed address", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Line to transfer the HYAX tokens from the deployer to the smart contract
    var totalSupplyHex = await hyax.totalSupply();
    await hyax.transfer(hyax.target, totalSupplyHex.toString());

    //Deploy the WBTC price data feed mock
    const WbtcPriceDataFeedMock = await ethers.getContractFactory('WbtcPriceDataFeedMock');

    //Deploy smart contract with established parameters
    const wbtcPriceDataFeedMock = await WbtcPriceDataFeedMock.deploy();

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3, wbtcPriceDataFeedMock };
  }


  it("31.1. Should revert transaction because of execution with address that's not the owner", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3, wbtcPriceDataFeedMock } = await loadFixture(deployContractAndSetVariables);

    //This is the actual WBTC price feed address on the local testnet
    await expect(hyax.connect(addr1).updatePriceFeedAddress(3, wbtcPriceDataFeedMock.target))
      .to.be.revertedWithCustomError(hyax, 'OwnableUnauthorizedAccount');
  });

  it("31.2. Should revert transaction because of execution with invalid parameter", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(owner).updatePriceFeedAddress(3, ethers.ZeroAddress))
      .to.be.revertedWith('The price data feed address cannot be the zero address');
  });

  it("31.3. Should revert transaction because of execution with an address that's not a data feed", async function () {
    const { hyax, owner, deployer, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    expect(hyax.connect(owner).updatePriceFeedAddress(3, hyax.target))
      .to.be.revertedWith('The new address does not seem to belong to a WBTC price data feed');
  });

  it("31.4. Should properly execute the function because it has a valid address and valid parameter", async function () {
    const { hyax, owner, deployer, addr1, addr2, addr3, wbtcPriceDataFeedMock } = await loadFixture(deployContractAndSetVariables);

    //This is the actual WBTC price feed address on the local testnet
    await hyax.connect(owner).updatePriceFeedAddress(3, wbtcPriceDataFeedMock.target);

    expect(await hyax.wbtcPriceFeedAddress()).to.equal(wbtcPriceDataFeedMock.target);
  });

});


describe("Test case #32. Update WETH token address in the polygon network", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Line to transfer the HYAX tokens from the deployer to the smart contract
    var totalSupplyHex = await hyax.totalSupply();
    await hyax.transfer(hyax.target, totalSupplyHex.toString());

    //Deploy the WETH price data feed mock
    const WethPriceDataFeedMock = await ethers.getContractFactory('WethPriceDataFeedMock');

    //Deploy smart contract with established parameters
    const wethPriceDataFeedMock = await WethPriceDataFeedMock.deploy();

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3, wethPriceDataFeedMock };
  }


  it("32.1. Should revert transaction because of execution with address that's not the owner", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //This is the actual WETH token address on the polygon mainnet
    await expect(hyax.connect(addr1).updateTokenAddress(4, '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'))
      .to.be.revertedWithCustomError(hyax, 'OwnableUnauthorizedAccount');
  });

  it("32.2. Should revert transaction because of execution with invalid parameter", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(owner).updateTokenAddress(4, ethers.ZeroAddress))
      .to.be.revertedWith('The token address cannot be the zero address');
  });

  it("32.3. Should properly execute the function because it has a valid address and valid parameter", async function () {
    const { hyax, owner, deployer, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //This is the actual WETH token address on the polygon mainnet
    await hyax.connect(owner).updateTokenAddress(4, '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619');

    expect(await hyax.wethTokenAddress()).to.equal('0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619');
  });

});


describe("Test case #33. Update crypto token WETH price feed address", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Line to transfer the HYAX tokens from the deployer to the smart contract
    var totalSupplyHex = await hyax.totalSupply();
    await hyax.transfer(hyax.target, totalSupplyHex.toString());

    //Deploy the WETH price data feed mock
    const WethPriceDataFeedMock = await ethers.getContractFactory('WethPriceDataFeedMock');

    //Deploy smart contract with established parameters
    const wethPriceDataFeedMock = await WethPriceDataFeedMock.deploy();

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3, wethPriceDataFeedMock };
  }


  it("33.1. Should revert transaction because of execution with address that's not the owner", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3, wethPriceDataFeedMock } = await loadFixture(deployContractAndSetVariables);

    //This is the actual WETH price feed address on the local testnet
    await expect(hyax.connect(addr1).updatePriceFeedAddress(4, wethPriceDataFeedMock.target))
      .to.be.revertedWithCustomError(hyax, 'OwnableUnauthorizedAccount');
  });

  it("33.2. Should revert transaction because of execution with invalid parameter", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(owner).updatePriceFeedAddress(4, ethers.ZeroAddress))
      .to.be.revertedWith('The price data feed address cannot be the zero address');
  });

  it("33.3. Should revert transaction because of execution with an address that's not a data feed", async function () {
    const { hyax, owner, deployer, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    expect(hyax.connect(owner).updatePriceFeedAddress(4, hyax.target))
      .to.be.revertedWith('The new address does not seem to belong to a ETH price data feed');
  });

  it("33.4. Should properly execute the function because it has a valid address and valid parameter", async function () {
    const { hyax, owner, deployer, addr1, addr2, addr3, wethPriceDataFeedMock } = await loadFixture(deployContractAndSetVariables);

    //This is the actual WETH price feed address on the local testnet
    await hyax.connect(owner).updatePriceFeedAddress(4, wethPriceDataFeedMock.target);

    expect(await hyax.wethPriceFeedAddress()).to.equal(wethPriceDataFeedMock.target);
  });

});


describe("Test case #34. Pause smart contract", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3 };
  }


  it("34.1. Should revert transaction because of execution with address that's not the owner", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(addr1).pause())
      .to.be.revertedWithCustomError(hyax, 'OwnableUnauthorizedAccount');
  });

  it("34.2. Should properly execute the function because it's done from the owner address", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await hyax.connect(owner).pause();

    await expect(hyax.connect(owner).transfer(hyax.target, ethers.parseUnits("1000", 18)))
      .to.be.revertedWithCustomError(hyax, 'EnforcedPause');
  });

  it("34.3. Should properly execute the function because it's done from the owner address", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await hyax.connect(owner).pause();

    await expect(hyax.connect(owner).tokenIssuance(ethers.parseUnits("1000", 18)))
      .to.be.revertedWithCustomError(hyax, 'EnforcedPause()');
  });

});


describe("Test case #35. Unpause smart contract", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3 };
  }


  it("35.1. Should revert transaction because of execution with address that's not the owner", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await hyax.connect(owner).pause();

    await expect(hyax.connect(addr1).unpause())
      .to.be.revertedWithCustomError(hyax, 'OwnableUnauthorizedAccount');
  });

  it("35.2. Should properly execute the function because it's done from the owner address", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await hyax.connect(owner).pause();

    await hyax.connect(owner).unpause();

    await hyax.transfer(addr1.address, ethers.parseUnits("1000", 18));

    expect(await hyax.balanceOf(addr1.address)).to.equal(ethers.parseUnits("1000", 18));
  });

  it("35.3. Should properly execute the function because it's done from the owner address", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await hyax.connect(owner).pause();

    await hyax.connect(owner).unpause();

    await hyax.connect(owner).tokenIssuance(ethers.parseUnits("1000", 18));

    expect(await hyax.totalSupply()).to.equal(ethers.parseUnits("500001000", 18));
  });

});



describe("Test case #36. Transfer ownership", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Line to transfer the HYAX tokens from the deployer to the smart contract
    var totalSupplyHex = await hyax.totalSupply();
    await hyax.transfer(hyax.target, totalSupplyHex.toString());

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3 };
  }


  it("36.1. Should revert transaction because of execution with address that's not the owner", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.connect(addr1).transferOwnership(addr1.address))
      .to.be.revertedWithCustomError(hyax, 'OwnableUnauthorizedAccount');
  });

  it("36.2. Should revert transaction because of execution with invalid address parameter", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.transferOwnership(ethers.ZeroAddress))
      .to.be.revertedWith('Ownable: new owner is the zero address');
  });

  it("36.3. Should revert transaction because of execution with smart contract address parameter", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await expect(hyax.transferOwnership(hyax.target))
      .to.be.revertedWith('Ownable: new owner cannot be the same contract address');
  });

  it("36.4. Should properly execute the function because it's done from the owner address", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    await hyax.transferOwnership(owner.address);

    expect(await hyax.owner()).to.equal(owner.address);
  });

});


describe("Test case #37. Get current MATIC price", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

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
    await hyax.connect(owner).updatePriceFeedAddress(0,maticPriceDataFeedMock.target);


    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3 };
  }

  it("37.1. Should properly execute the function because it's reading the value parameter of the MATIC data price mock", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //Current MATIC price 41137400 = $0.41137400
    expect(await hyax.getCurrentTokenPrice(0)).to.equal(41137400);
  });

});


describe("Test case #38. Get current USDC price", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Line to transfer the HYAX tokens from the deployer to the smart contract
    var totalSupplyHex = await hyax.totalSupply();
    await hyax.transfer(hyax.target, totalSupplyHex.toString());

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Deploy the USDC price data feed mock
    const UsdcPriceDataFeedMock = await ethers.getContractFactory('UsdcPriceDataFeedMock');

    //Deploy smart contract with established parameters
    const usdcPriceDataFeedMock = await UsdcPriceDataFeedMock.deploy();

    //Update the address of the USDC price data feed mock
    await hyax.connect(owner).updatePriceFeedAddress(1, usdcPriceDataFeedMock.target);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3 };
  }

  it("38.1. Should properly execute the function because it's reading the value parameter of the USDC data price mock", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //Current USDC price 99992042 = $0.99992042
    expect(await hyax.getCurrentTokenPrice(1)).to.equal(99992042);
  });

});


describe("Test case #39. Get current USDT price", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

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

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3 };
  }

  it("39.1. Should properly execute the function because it's reading the value parameter of the USDT data price mock", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);
    //Current USDT price 100006000 = $1.00006000
    expect(await hyax.getCurrentTokenPrice(2)).to.equal(100006000);
  });

});


describe("Test case #40. Get current WBTC price", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Line to transfer the HYAX tokens from the deployer to the smart contract
    var totalSupplyHex = await hyax.totalSupply();
    await hyax.transfer(hyax.target, totalSupplyHex.toString());

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Deploy the WBTC price data feed mock
    const WbtcPriceDataFeedMock = await ethers.getContractFactory('WbtcPriceDataFeedMock');

    //Deploy smart contract with established parameters
    const wbtcPriceDataFeedMock = await WbtcPriceDataFeedMock.deploy();

    //Update the address of the WBTC price data feed mock
    await hyax.connect(owner).updatePriceFeedAddress(3, wbtcPriceDataFeedMock.target);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3 };
  }

  it("40.1. Should properly execute the function because it's reading the value parameter of the WBTC data price mock", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);
    //Current Bitcoin price 5844229670000 = $58,442.29670000
    expect(await hyax.getCurrentTokenPrice(3)).to.equal(5844229670000);
  });

});


describe("Test case #41. Get current WETH price", function () {

  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    //Asociate the smart contract with its name in the context
    const HYAX = await ethers.getContractFactory('HYAXLocal');

    //Deploy smart contract with established parameters
    const hyax = await HYAX.deploy();

    //Line to transfer the HYAX tokens from the deployer to the smart contract
    var totalSupplyHex = await hyax.totalSupply();
    await hyax.transfer(hyax.target, totalSupplyHex.toString());

    //Transfer ownership of the HYAX smart contract from the deployer to the owner
    await hyax.transferOwnership(owner.address);

    //Deploy the WETH price data feed mock
    const WethPriceDataFeedMock = await ethers.getContractFactory('WethPriceDataFeedMock');

    //Deploy smart contract with established parameters
    const wethPriceDataFeedMock = await WethPriceDataFeedMock.deploy();

    //Update the address of the WETH price data feed mock
    await hyax.connect(owner).updatePriceFeedAddress(4, wethPriceDataFeedMock.target);

    //Return values as fixture for the testing cases
    return { hyax, deployer, owner, addr1, addr2, addr3 };
  }

  it("41.1. Should properly execute the function because it's reading the value parameter of the WETH data price mock", async function () {
    const { hyax, deployer, owner, addr1, addr2, addr3 } = await loadFixture(deployContractAndSetVariables);

    //Current WETH price 261484866809 = 2,614.84866809
    expect(await hyax.getCurrentTokenPrice(4)).to.equal(261484866809);
  });

});