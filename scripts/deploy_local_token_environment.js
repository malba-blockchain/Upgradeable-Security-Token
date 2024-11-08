//Import the fs and path modules to write the HYAX smart contract address to a file
const fs = require('fs');
const path = require('path');

const { ethers, upgrades } = require('hardhat');
const { mine } = require("@nomicfoundation/hardhat-network-helpers");


// Function to update the LOCAL_TOKEN_SMART_CONTRACT_ADDRESS in addresses.ts
async function updateLocalTokenAddress(newAddress) {
  const addressesFilePath = path.join(__dirname, '../utils/addresses.ts');

  // Read the addresses.ts file
  fs.readFile(addressesFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading addresses.ts file:", err);
      return;
    }

    // Find the existing LOCAL_TOKEN_SMART_CONTRACT_ADDRESS line and replace it with the new address
    const updatedFile = data.replace(
      /const LOCAL_TOKEN_SMART_CONTRACT_ADDRESS = ".*";/,
      `const LOCAL_TOKEN_SMART_CONTRACT_ADDRESS = "${newAddress}";`
    );

    // Write the updated content back to the file
    fs.writeFile(addressesFilePath, updatedFile, 'utf8', (err) => {
      if (err) {
        console.error("Error writing to addresses.ts file:", err);
        return;
      }

      console.log("LOCAL_TOKEN_SMART_CONTRACT_ADDRESS updated successfully in addresses.ts file.");
    });
  });
}

// Function to update the TOKEN_SMART_CONTRACT_ABI in the abi.ts file
async function updateAbiFile(abi) {
  // Path to the abi.ts file
  const abiFilePath = path.join(__dirname, '../utils/abi.ts');

  // Read the existing abi.ts file content
  let abiFileContent = fs.readFileSync(abiFilePath, 'utf8');

  // Find the TOKEN_SMART_CONTRACT_ABI constant
  const abiRegex = /const TOKEN_SMART_CONTRACT_ABI = \[\];/;

  // Replace the empty array with the new ABI
  const newAbiContent = `const TOKEN_SMART_CONTRACT_ABI = ${JSON.stringify(abi, null, 2)};`;

  // Replace the old constant with the updated one in the file content
  abiFileContent = abiFileContent.replace(abiRegex, newAbiContent);

  // Write the updated content back to the abi.ts file
  fs.writeFileSync(abiFilePath, abiFileContent);

  console.log("TOKEN_SMART_CONTRACT_ABI updated successfully in abi.ts file.");
}

async function deployCryptoTokensMocks() {

    const [deployer, owner, addr1, addr2, addr3, addr4, addr5, whiteListerAddress, treasuryAddress] = await ethers.getSigners();

    //DEPLOY THE USDC TOKEN MOCK
    const UsdcToken = await ethers.getContractFactory('UsdcToken');
    const usdcToken = await UsdcToken.deploy();

    //Send 100K USDC to each of the investors
    await usdcToken.transfer(owner.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr1.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr2.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr3.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr4.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr5.address, ethers.parseUnits("100000", 18));

    //DEPLOY THE USDT TOKEN MOCK
    const UsdtToken = await ethers.getContractFactory('UsdtToken'); 
    const usdtToken = await UsdtToken.deploy();
    
    //Send 100K USDT to each of the investors
    await usdtToken.transfer(owner.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr1.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr2.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr3.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr4.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr5.address, ethers.parseUnits("100000", 18));

    //DEPLOY THE WBTC TOKEN MOCK
    const WbtcToken = await ethers.getContractFactory('WbtcToken'); 
    const wbtcToken = await WbtcToken.deploy();
    
    //Send 100K WBTC to each of the investors
    await wbtcToken.transfer(owner.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr1.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr2.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr3.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr4.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr5.address, ethers.parseUnits("100000", 18));

    //DEPLOY THE WETH TOKEN MOCK
    const WethToken = await ethers.getContractFactory('WethToken'); 
    const wethToken = await WethToken.deploy();
    
    //Send 100K WETH to each of the investors
    await wethToken.transfer(owner.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr1.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr2.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr3.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr4.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr5.address, ethers.parseUnits("100000", 18));

    return { usdcToken, usdtToken, wbtcToken, wethToken};
}


async function deployCryptoPriceFeedMocks() {

    //Deploy the MATIC price data feed mock
    const MaticPriceDataFeedMock = await ethers.getContractFactory('MaticPriceDataFeedMock');
    const maticPriceDataFeedMock = await MaticPriceDataFeedMock.deploy();

    //Deploy the USDC price data feed mock
    const UsdcPriceDataFeedMock = await ethers.getContractFactory('UsdcPriceDataFeedMock');
    const usdcPriceDataFeedMock = await UsdcPriceDataFeedMock.deploy();

    //Deploy the USDT price data feed mock
    const UsdtPriceDataFeedMock = await ethers.getContractFactory('UsdtPriceDataFeedMock');
    const usdtPriceDataFeedMock = await UsdtPriceDataFeedMock.deploy();

    //Deploy the WBTC price data feed mock
    const WbtcPriceDataFeedMock = await ethers.getContractFactory('WbtcPriceDataFeedMock');
    const wbtcPriceDataFeedMock = await WbtcPriceDataFeedMock.deploy();

    //Deploy the WETH price data feed mock
    const WethPriceDataFeedMock = await ethers.getContractFactory('WethPriceDataFeedMock');
    const wethPriceDataFeedMock = await WethPriceDataFeedMock.deploy();

    //Return values as fixture for the testing cases
    return { maticPriceDataFeedMock, usdcPriceDataFeedMock, usdtPriceDataFeedMock, wbtcPriceDataFeedMock, wethPriceDataFeedMock};
  }

  async function deployHYAXTokenContract(owner, deployer, whiteListerAddress, treasuryAddress) {

    console.log("\nDeploying upgradeable HYAX...");

    const HYAXUpgradeableToken = await ethers.getContractFactory('HYAXUpgradeableToken');

    // Deploy proxy with 'initialize' function
    const hyaxUpgradeableToken = await upgrades.deployProxy(HYAXUpgradeableToken, { initializer: 'initialize' });

    await hyaxUpgradeableToken.waitForDeployment();

    // Transfer ownership to the owner
    await hyaxUpgradeableToken.connect(deployer).transferOwnership(owner.address);

    // Transfer 500 M of current HYAX supply to the owner
    var totalSupply = await hyaxUpgradeableToken.totalSupply();

    await hyaxUpgradeableToken.transfer(hyaxUpgradeableToken.target, totalSupply.toString());


    /////////////UPDATE THE HYAX SMART CONTRACT/////////////
    //Update the whitelister address
    await hyaxUpgradeableToken.connect(owner).updateWhiteListerAddress(whiteListerAddress.address);

    //Update the treasury address
    await hyaxUpgradeableToken.connect(owner).updateTreasuryAddress(treasuryAddress.address);

    console.log("\nUpgradeable HYAX smart contract address: ", hyaxUpgradeableToken.target);

    console.log("\nDeployer address: ", deployer.address);

    console.log("Owner address: ", owner.address);

    console.log("WhiteLister address: ", whiteListerAddress.address);

    console.log("Treasury address: ", treasuryAddress.address);

    //Balance of the smart contract
    console.log("\nSmart contract HYAX initial balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(hyaxUpgradeableToken.target))));
    
    // Update the addresses.ts file with the new LOCAL_TOKEN_SMART_CONTRACT_ADDRESS
    await updateLocalTokenAddress(hyaxUpgradeableToken.target);

    // Get the bytecode and ABI of the deployed contract
    const {bytecode, abi} = await hre.artifacts.readArtifact('HYAXUpgradeableToken');

    // Call the function to update the abi.ts file
    await updateAbiFile(abi);
    
    return hyaxUpgradeableToken;
  }


async function updatePriceFeedsAndTokenAddresses(hyaxUpgradeableToken, owner, maticPriceDataFeedMock, usdcPriceDataFeedMock, 
    usdtPriceDataFeedMock, wbtcPriceDataFeedMock, wethPriceDataFeedMock, usdcToken, usdtToken, wbtcToken, wethToken) {

    //Update the addresses of the price data feeds
    await hyaxUpgradeableToken.connect(owner).updatePriceFeedAddress(0, maticPriceDataFeedMock.target);
    await hyaxUpgradeableToken.connect(owner).updatePriceFeedAddress(1, usdcPriceDataFeedMock.target);
    await hyaxUpgradeableToken.connect(owner).updatePriceFeedAddress(2, usdtPriceDataFeedMock.target);
    await hyaxUpgradeableToken.connect(owner).updatePriceFeedAddress(3, wbtcPriceDataFeedMock.target);
    await hyaxUpgradeableToken.connect(owner).updatePriceFeedAddress(4, wethPriceDataFeedMock.target);

    /////////////UPDATE THE CRYPTO TOKENS/////////////
    await hyaxUpgradeableToken.connect(owner).updateTokenAddress(1, usdcToken.target);
    await hyaxUpgradeableToken.connect(owner).updateTokenAddress(2, usdtToken.target);
    await hyaxUpgradeableToken.connect(owner).updateTokenAddress(3, wbtcToken.target);
    await hyaxUpgradeableToken.connect(owner).updateTokenAddress(4, wethToken.target);
  }


async function addInvestorToWhitelistAndQualifiedInvestorList(hyaxUpgradeableToken, owner, addr1, addr2, addr3, addr4, addr5) {

    /////////////ADD THE 5 INVESTORS TO THE WHITELIST/////////////
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr1.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr2.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr3.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr4.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr5.address);

    /////////////QUALIFIED INVESTOR STATUS UPDATE/////////////
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr1.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr2.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr3.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr4.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr5.address, true);
  }

async function approveHyaxContractToSpendCryptoTokens(hyaxUpgradeableToken, addr1, addr2, addr3, addr4, addr5, usdcToken, usdtToken, wbtcToken, wethToken) {

    /////////////APPROVE THE HYAX SMART CONTRACT TO SPEND USDC TOKENS/////////////
    await usdcToken.connect(addr1).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr2).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr3).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr4).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr5).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));

    /////////////APPROVE THE HYAX SMART CONTRACT TO SPEND USDT TOKENS/////////////
    await usdtToken.connect(addr1).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr2).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr3).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr4).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr5).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));

    /////////////APPROVE THE HYAX SMART CONTRACT TO SPEND WBTC TOKENS/////////////
    await wbtcToken.connect(addr1).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr2).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr3).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr4).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr5).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));

    /////////////APPROVE THE HYAX SMART CONTRACT TO SPEND WETH TOKENS/////////////
    await wethToken.connect(addr1).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr2).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr3).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr4).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr5).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
  }

  async function investorsInvestFromCryptoTokens(hyaxUpgradeableToken, addr1, addr2, addr3, addr4, addr5) {

    /////////////THE 5 INVESTORS INVEST FROM CRYPTO TOKENS/////////////
    await hyaxUpgradeableToken.connect(addr1).investFromMatic({ value: ethers.parseUnits("10000", 18) });
    await hyaxUpgradeableToken.connect(addr2).investFromCryptoToken(1, ethers.parseUnits("10000", 18));
    await hyaxUpgradeableToken.connect(addr3).investFromCryptoToken(2, ethers.parseUnits("15000", 18));
    await hyaxUpgradeableToken.connect(addr4).investFromCryptoToken(3, ethers.parseUnits("10", 18));
    await hyaxUpgradeableToken.connect(addr5).investFromCryptoToken(4, ethers.parseUnits("50", 18));

    /////////////GET INVESTORS HYAX BALANCES/////////////
    console.log("\nInvestor 1 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr1.address))));
    console.log("Investor 2 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr2.address))));
    console.log("Investor 3 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr3.address))));
    console.log("Investor 4 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr4.address))));
    console.log("Investor 5 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr5.address))));
    
    /////////////GET SMART CONTRACT HYAX BALANCE/////////////
    console.log("\nSmart contract HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(hyaxUpgradeableToken.target))));
  }


async function main() {

    /////////////GET THE SIGNERS/////////////
    const [deployer, owner, addr1, addr2, addr3, addr4, addr5, whiteListerAddress, treasuryAddress] 
        = await ethers.getSigners();

    /////////////DEPLOY THE PRICE FEEDS/////////////
    const { maticPriceDataFeedMock, usdcPriceDataFeedMock, usdtPriceDataFeedMock, wbtcPriceDataFeedMock, wethPriceDataFeedMock} 
        = await deployCryptoPriceFeedMocks();

    /////////////DEPLOY THE CRYPTO TOKENS/////////////
    const { usdcToken, usdtToken, wbtcToken, wethToken} = await deployCryptoTokensMocks();

    /////////////HYAX TOKEN SMART CONTRACT DEPLOYMENT/////////////
    const hyaxUpgradeableToken = await deployHYAXTokenContract(owner, deployer, whiteListerAddress, treasuryAddress);

    /////////////UPDATE THE PRICE FEEDS AND TOKEN ADDRESSES/////////////
    await updatePriceFeedsAndTokenAddresses(hyaxUpgradeableToken, owner, maticPriceDataFeedMock, usdcPriceDataFeedMock, 
        usdtPriceDataFeedMock, wbtcPriceDataFeedMock, wethPriceDataFeedMock, usdcToken, usdtToken, wbtcToken, wethToken);
    
    /////////////ADD THE INVESTORS TO THE WHITELIST AND QUALIFIED INVESTOR LIST/////////////
    await addInvestorToWhitelistAndQualifiedInvestorList(hyaxUpgradeableToken, owner, addr1, addr2, addr3, addr4, addr5);

    /////////////APPROVE THE HYAX SMART CONTRACT TO SPEND CRYPTO TOKENS/////////////
    await approveHyaxContractToSpendCryptoTokens(hyaxUpgradeableToken, addr1, addr2, addr3, addr4, addr5, usdcToken,
        usdtToken, wbtcToken, wethToken);

    /////////////THE 5 INVESTORS INVEST FROM CRYPTO TOKENS/////////////
    await investorsInvestFromCryptoTokens(hyaxUpgradeableToken, addr1, addr2, addr3, addr4, addr5);

}

main();