const {ethers, upgrades} = require('hardhat');

async function main () {
    const HYAXLocalUpgradeableV2 = await ethers.getContractFactory("HYAXLocalUpgradeableV2");
    console.log("Upgrading HYAX Local with V2...");

    await upgrades.upgradeProxy("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", HYAXLocalUpgradeableV2);

    console.log("HYAX Local upgraded to V2");
}

main();