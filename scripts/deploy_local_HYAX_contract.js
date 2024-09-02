async function main() {

    const HYAXLocal = await ethers.getContractFactory('HYAXLocal');
    console.log("Deploying HYAX Local...");
    const hyaxLocal = await HYAXLocal.deploy();
    await hyaxLocal.waitForDeployment();
    console.log("Hyax Local deployed to:", await hyaxLocal.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });