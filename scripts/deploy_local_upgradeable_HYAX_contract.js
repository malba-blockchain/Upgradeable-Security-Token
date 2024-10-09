const { ethers, upgrades } = require('hardhat');

async function main() {
    const HYAXUpgradeable = await ethers.getContractFactory('HYAXUpgradeable');
    console.log("Deploying upgradeable HYAX...");

    // Deploy proxy with 'initialize' function
    const hyaxUpgradeable = await upgrades.deployProxy(HYAXUpgradeable, { initializer: 'initialize' });

    await hyaxUpgradeable.waitForDeployment();
    console.log("\Upgradeable HYAX deployed to:", hyaxUpgradeable.target);
}

main();