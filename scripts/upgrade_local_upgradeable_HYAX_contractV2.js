const {ethers, upgrades} = require('hardhat');

async function main () {
    // Get the contract factory for the new version of the smart contract
    const HYAXLocalUpgradeableV2 = await ethers.getContractFactory("HYAXUpgradeableV2"); 
    console.log("Upgrading HYAX Local with V2..."); // Log that the upgrade process is starting

    // Upgrade the proxy smart contract to the new version
    await upgrades.upgradeProxy("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", HYAXLocalUpgradeableV2); 

    // Log that the upgrade process is complete
    console.log("HYAX Local upgraded to V2"); 
}

main();