const { ethers, upgrades } = require('hardhat');

async function main() {
    const HYAXUpgradeableToken = await ethers.getContractFactory('HYAXUpgradeableToken');
    console.log("Deploying upgradeable HYAX...");

    // Deploy proxy with 'initialize' function
    const hyaxUpgradeable = await upgrades.deployProxy(HYAXUpgradeableToken, { initializer: 'initialize' });

    await hyaxUpgradeable.waitForDeployment();
    console.log("\Upgradeable HYAX deployed to:", hyaxUpgradeable.target);
}

main();