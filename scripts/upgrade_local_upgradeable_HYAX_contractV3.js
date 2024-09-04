const {ethers, upgrades} = require('hardhat');

async function main () {
    const HYAXLocalUpgradeableV3 = await ethers.getContractFactory("HYAXLocalUpgradeable");
    console.log("Upgrading HYAX Local with V3...");

    await upgrades.upgradeProxy("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", HYAXLocalUpgradeableV3);

    console.log("HYAX Local upgraded to V3");
}

main();