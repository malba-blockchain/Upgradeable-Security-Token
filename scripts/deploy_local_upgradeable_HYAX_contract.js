const { ethers, upgrades } = require('hardhat');

async function main() {
    const HYAXLocalUpgradeable = await ethers.getContractFactory('HYAXLocalUpgradeable');
    console.log("Deploying upgradeable HYAX Local...");

    // Deploy proxy with 'initialize' function
    const hyaxLocalUpgradeable = await upgrades.deployProxy(HYAXLocalUpgradeable, { initializer: 'initialize' });

    await hyaxLocalUpgradeable.waitForDeployment();
    console.log("\Upgradeable HYAX Local deployed to:", hyaxLocalUpgradeable.target);
}

main();