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

describe("Test case #42. Upgradeable functionalities", function () {
  // Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {
    const [deployer, owner, addr1, addr2, addr3] = await ethers.getSigners();

    const HYAXUpgradeable = await ethers.getContractFactory('HYAXUpgradeable');
    const hyax = await upgrades.deployProxy(HYAXUpgradeable, { initializer: 'initialize' });
    
    await hyax.waitForDeployment();
    var totalSupplyHex = await hyax.totalSupply();
    await hyax.transfer(hyax.target, totalSupplyHex.toString());
    return { hyax, deployer, owner, addr1, addr2, addr3 };
  }
  it("42.1. Should deploy the proxy contract successfully", async function () {
    const { hyax } = await deployContractAndSetVariables();

    // Expect the proxy contract to have a valid address
    expect(await hyax.getAddress()).to.properAddress;
  });

  it("42.2. Should initialize with the correct total supply", async function () {
    const { hyax } = await deployContractAndSetVariables();
    const totalSupply = await hyax.totalSupply();

    // Expect the total supply to be 500,000,000 HYAX tokens
    expect(totalSupply).to.equal(ethers.parseEther("500000000"));
  });

  it("42.3. Should transfer total supply to the contract address", async function () {
    const { hyax } = await deployContractAndSetVariables();
    const contractBalance = await hyax.balanceOf(hyax.target);
    const totalSupply = await hyax.totalSupply();

    // Expect the contract balance to equal the total supply
    expect(contractBalance).to.equal(totalSupply);
  });

  it("42.4. Should allow upgrading the contract", async function () {
    const { hyax, deployer } = await deployContractAndSetVariables();
    const HYAXUpgradeableV2 = await ethers.getContractFactory('HYAXUpgradeableV2');
    const upgradedHyax = await upgrades.upgradeProxy(hyax.target, HYAXUpgradeableV2);

    // Expect the upgraded contract to have the same address as the original
    expect(await upgradedHyax.getAddress()).to.equal(await hyax.getAddress());
  });

  it("42.5. Should maintain state after upgrade", async function () {
    const { hyax, deployer } = await deployContractAndSetVariables();
    const HYAXUpgradeableV2 = await ethers.getContractFactory('HYAXUpgradeableV2');
    const upgradedHyax = await upgrades.upgradeProxy(hyax.target, HYAXUpgradeableV2);
    const totalSupplyAfterUpgrade = await upgradedHyax.totalSupply();

    // Expect the total supply to remain unchanged after the upgrade
    expect(totalSupplyAfterUpgrade).to.equal(ethers.parseEther("500000000"));
  });

  it("42.6. Should allow calling new functions after upgrade", async function () {
    const { hyax, deployer } = await deployContractAndSetVariables();
    const HYAXUpgradeableV2 = await ethers.getContractFactory('HYAXUpgradeableV2');
    const upgradedHyax = await upgrades.upgradeProxy(hyax.target, HYAXUpgradeableV2);

    // Expect the new function to return the expected string
    expect(await upgradedHyax.newFunction()).to.equal("New function in V2");
  });

  it("42.7. Should not allow initialization after deployment", async function () {
    const { hyax } = await deployContractAndSetVariables();

    // Attempt to initialize the contract again and expect it to revert
    await expect(hyax.initialize()).to.be.revertedWith("Initializable: contract is already initialized");
  });

  it("42.8. Should have different state in implementation contract", async function () {
    const { hyax, owner } = await deployContractAndSetVariables();
    const implementationAddress = await upgrades.erc1967.getImplementationAddress(hyax.target);
    const HYAXUpgradeable = await ethers.getContractFactory('HYAXUpgradeable');
    const implementationContract = HYAXUpgradeable.attach(implementationAddress);

    // The implementation contract should have a different state than the proxy
    const implTotalSupply = await implementationContract.totalSupply();
    const proxyTotalSupply = await hyax.totalSupply();
    
    // Expect the implementation contract to have an uninitialized state
    expect(implTotalSupply).to.not.equal(proxyTotalSupply);
    expect(implTotalSupply).to.equal(0); // Implementation contract should have uninitialized state
  });

  it("42.9. Should allow admin to upgrade the contract", async function () {
    const { hyax, deployer } = await deployContractAndSetVariables();
    const HYAXUpgradeableV2 = await ethers.getContractFactory('HYAXUpgradeableV2');

    // Attempt to upgrade the contract as the admin and expect it to not revert
    await expect(upgrades.upgradeProxy(hyax.target, HYAXUpgradeableV2)).to.not.be.reverted;
  });

  it("42.10. Should not allow non-admin to upgrade the contract", async function () {
    const { hyax, addr1 } = await deployContractAndSetVariables();
    const HYAXUpgradeableV2 = await ethers.getContractFactory('HYAXUpgradeableV2', addr1);

    // Attempt to upgrade the contract as a non-admin and expect it to revert
    await expect(upgrades.upgradeProxy(hyax.target, HYAXUpgradeableV2)).to.be.reverted;
  });
});