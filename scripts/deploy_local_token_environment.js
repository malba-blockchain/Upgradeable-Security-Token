//Import the fs and path modules to write the HYAX smart contract address to a file
const fs = require('fs');
const path = require('path');

const { ethers, upgrades } = require('hardhat');
const { mine } = require("@nomicfoundation/hardhat-network-helpers");

//Global variables of signers
let deployer, owner, whiteListerAddress, rewardsUpdaterAddress, treasuryAddress;
let addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8, addr9, addr10;
let addr11, addr12, addr13, addr14, addr15, addr16, addr17, addr18, addr19, addr20;
let addr21, addr22, addr23, addr24, addr25, addr26, addr27, addr28, addr29, addr30;
let addr31, addr32, addr33, addr34, addr35, addr36, addr37, addr38, addr39, addr40;
let addr41, addr42, addr43, addr44, addr45, addr46, addr47, addr48, addr49, addr50;
let addr51, taddr1, taddr2, taddr3, taddr4, taddr5, taddr6, taddr7, taddr8, taddr9, taddr10;

//Get the signers of the wallets
async function getTheSigners() { 

    const [_deployer, _owner, _whiteListerAddress, _rewardsUpdaterAddress, _treasuryAddress, 
        _addr1, _addr2, _addr3, _addr4, _addr5, _addr6, _addr7, _addr8, _addr9, _addr10, _addr11,
        _addr12, _addr13, _addr14, _addr15, _addr16, _addr17, _addr18, _addr19, _addr20, _addr21, 
        _addr22, _addr23, _addr24, _addr25, _addr26, _addr27, _addr28, _addr29, _addr30, _addr31,
        _addr32, _addr33, _addr34, _addr35, _addr36, _addr37, _addr38, _addr39, _addr40, _addr41,
        _addr42, _addr43, _addr44, _addr45, _addr46, _addr47, _addr48, _addr49, _addr50, _addr51,
        _taddr1, _taddr2, _taddr3, _taddr4, _taddr5, _taddr6, _taddr7, _taddr8, _taddr9, _taddr10 ] = await ethers.getSigners();

    deployer = _deployer; owner = _owner; whiteListerAddress = _whiteListerAddress; rewardsUpdaterAddress = _rewardsUpdaterAddress; treasuryAddress = _treasuryAddress;
    addr1 = _addr1; addr2 = _addr2; addr3 = _addr3; addr4 = _addr4; addr5 = _addr5; addr6 = _addr6; addr7 = _addr7; addr8 = _addr8; addr9 = _addr9; addr10 = _addr10;
    addr11 = _addr11; addr12 = _addr12; addr13 = _addr13; addr14 = _addr14; addr15 = _addr15; addr16 = _addr16; addr17 = _addr17; addr18 = _addr18; addr19 = _addr19; addr20 = _addr20;
    addr21 = _addr21; addr22 = _addr22; addr23 = _addr23; addr24 = _addr24; addr25 = _addr25; addr26 = _addr26; addr27 = _addr27; addr28 = _addr28; addr29 = _addr29; addr30 = _addr30;
    addr31 = _addr31; addr32 = _addr32; addr33 = _addr33; addr34 = _addr34; addr35 = _addr35; addr36 = _addr36; addr37 = _addr37; addr38 = _addr38; addr39 = _addr39; addr40 = _addr40;
    addr41 = _addr41; addr42 = _addr42; addr43 = _addr43; addr44 = _addr44; addr45 = _addr45; addr46 = _addr46; addr47 = _addr47; addr48 = _addr48; addr49 = _addr49; addr50 = _addr50;
    addr51 = _addr51; taddr1 = _taddr1; taddr2 = _taddr2; taddr3 = _taddr3; taddr4 = _taddr4; taddr5 = _taddr5; taddr6 = _taddr6; taddr7 = _taddr7; taddr8 = _taddr8; taddr9 = _taddr9; 
    taddr10 = _taddr10;
}



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
    await usdcToken.transfer(addr6.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr7.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr8.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr9.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr10.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr11.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr12.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr13.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr14.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr15.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr16.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr17.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr18.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr19.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr20.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr21.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr22.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr23.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr24.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr25.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr26.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr27.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr28.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr29.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr30.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr31.address, ethers.parseUnits("100000", 18)); 
    await usdcToken.transfer(addr32.address, ethers.parseUnits("100000", 18)); 
    await usdcToken.transfer(addr33.address, ethers.parseUnits("100000", 18)); 
    await usdcToken.transfer(addr34.address, ethers.parseUnits("100000", 18)); 
    await usdcToken.transfer(addr35.address, ethers.parseUnits("100000", 18)); 
    await usdcToken.transfer(addr36.address, ethers.parseUnits("100000", 18)); 
    await usdcToken.transfer(addr37.address, ethers.parseUnits("100000", 18)); 
    await usdcToken.transfer(addr38.address, ethers.parseUnits("100000", 18)); 
    await usdcToken.transfer(addr39.address, ethers.parseUnits("100000", 18)); 
    await usdcToken.transfer(addr40.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr41.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr42.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr43.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr44.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr45.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr46.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr47.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr48.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr49.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr50.address, ethers.parseUnits("100000", 18));
    await usdcToken.transfer(addr51.address, ethers.parseUnits("100000", 18));

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
    await usdtToken.transfer(addr6.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr7.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr8.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr9.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr10.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr11.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr12.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr13.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr14.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr15.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr16.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr17.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr18.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr19.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr20.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr21.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr22.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr23.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr24.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr25.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr26.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr27.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr28.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr29.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr30.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr31.address, ethers.parseUnits("100000", 18)); 
    await usdtToken.transfer(addr32.address, ethers.parseUnits("100000", 18)); 
    await usdtToken.transfer(addr33.address, ethers.parseUnits("100000", 18)); 
    await usdtToken.transfer(addr34.address, ethers.parseUnits("100000", 18)); 
    await usdtToken.transfer(addr35.address, ethers.parseUnits("100000", 18)); 
    await usdtToken.transfer(addr36.address, ethers.parseUnits("100000", 18)); 
    await usdtToken.transfer(addr37.address, ethers.parseUnits("100000", 18)); 
    await usdtToken.transfer(addr38.address, ethers.parseUnits("100000", 18)); 
    await usdtToken.transfer(addr39.address, ethers.parseUnits("100000", 18)); 
    await usdtToken.transfer(addr40.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr41.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr42.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr43.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr44.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr45.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr46.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr47.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr48.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr49.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr50.address, ethers.parseUnits("100000", 18));
    await usdtToken.transfer(addr51.address, ethers.parseUnits("100000", 18));  

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
    await wbtcToken.transfer(addr6.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr7.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr8.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr9.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr10.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr11.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr12.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr13.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr14.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr15.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr16.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr17.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr18.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr19.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr20.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr21.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr22.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr23.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr24.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr25.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr26.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr27.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr28.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr29.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr30.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr31.address, ethers.parseUnits("100000", 18)); 
    await wbtcToken.transfer(addr32.address, ethers.parseUnits("100000", 18)); 
    await wbtcToken.transfer(addr33.address, ethers.parseUnits("100000", 18)); 
    await wbtcToken.transfer(addr34.address, ethers.parseUnits("100000", 18)); 
    await wbtcToken.transfer(addr35.address, ethers.parseUnits("100000", 18)); 
    await wbtcToken.transfer(addr36.address, ethers.parseUnits("100000", 18)); 
    await wbtcToken.transfer(addr37.address, ethers.parseUnits("100000", 18)); 
    await wbtcToken.transfer(addr38.address, ethers.parseUnits("100000", 18)); 
    await wbtcToken.transfer(addr39.address, ethers.parseUnits("100000", 18)); 
    await wbtcToken.transfer(addr40.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr41.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr42.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr43.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr44.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr45.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr46.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr47.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr48.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr49.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr50.address, ethers.parseUnits("100000", 18));
    await wbtcToken.transfer(addr51.address, ethers.parseUnits("100000", 18));  

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
    await wethToken.transfer(addr6.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr7.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr8.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr9.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr10.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr11.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr12.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr13.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr14.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr15.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr16.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr17.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr18.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr19.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr20.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr21.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr22.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr23.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr24.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr25.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr26.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr27.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr28.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr29.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr30.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr31.address, ethers.parseUnits("100000", 18)); 
    await wethToken.transfer(addr32.address, ethers.parseUnits("100000", 18)); 
    await wethToken.transfer(addr33.address, ethers.parseUnits("100000", 18)); 
    await wethToken.transfer(addr34.address, ethers.parseUnits("100000", 18)); 
    await wethToken.transfer(addr35.address, ethers.parseUnits("100000", 18)); 
    await wethToken.transfer(addr36.address, ethers.parseUnits("100000", 18)); 
    await wethToken.transfer(addr37.address, ethers.parseUnits("100000", 18)); 
    await wethToken.transfer(addr38.address, ethers.parseUnits("100000", 18)); 
    await wethToken.transfer(addr39.address, ethers.parseUnits("100000", 18)); 
    await wethToken.transfer(addr40.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr41.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr42.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr43.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr44.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr45.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr46.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr47.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr48.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr49.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr50.address, ethers.parseUnits("100000", 18));
    await wethToken.transfer(addr51.address, ethers.parseUnits("100000", 18));  

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

  async function deployHYAXTokenContract() {

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


async function updatePriceFeedsAndTokenAddresses(hyaxUpgradeableToken, maticPriceDataFeedMock, usdcPriceDataFeedMock, 
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


async function addInvestorToWhitelistAndQualifiedInvestorList(hyaxUpgradeableToken) {

    /////////////ADD THE 50 INVESTORS TO THE WHITELIST/////////////
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr1.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr2.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr3.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr4.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr5.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr6.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr7.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr8.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr9.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr10.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr11.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr12.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr13.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr14.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr15.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr16.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr17.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr18.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr19.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr20.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr21.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr22.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr23.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr24.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr25.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr26.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr27.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr28.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr29.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr30.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr31.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr32.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr33.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr34.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr35.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr36.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr37.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr38.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr39.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr40.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr41.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr42.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr43.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr44.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr45.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr46.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr47.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr48.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr49.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr50.address);
    await hyaxUpgradeableToken.connect(owner).addToWhiteList(addr51.address); 

    /////////////QUALIFIED INVESTOR STATUS UPDATE/////////////
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr1.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr2.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr3.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr4.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr5.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr6.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr7.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr8.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr9.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr10.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr11.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr12.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr13.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr14.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr15.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr16.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr17.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr18.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr19.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr20.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr21.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr22.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr23.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr24.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr25.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr26.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr27.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr28.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr29.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr30.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr31.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr32.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr33.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr34.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr35.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr36.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr37.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr38.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr39.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr40.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr41.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr42.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr43.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr44.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr45.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr46.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr47.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr48.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr49.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr50.address, true);
    await hyaxUpgradeableToken.connect(owner).updateQualifiedInvestorStatus(addr51.address, true);
  }

async function approveHyaxContractToSpendCryptoTokens(hyaxUpgradeableToken, usdcToken, usdtToken, wbtcToken, wethToken) {

    /////////////APPROVE THE HYAX SMART CONTRACT TO SPEND USDC TOKENS/////////////
    await usdcToken.connect(addr1).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr2).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr3).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr4).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr5).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr6).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr7).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr8).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr9).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr10).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr11).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr12).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr13).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr14).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr15).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr16).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr17).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr18).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr19).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr20).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr21).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));  
    await usdcToken.connect(addr22).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr23).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr24).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr25).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr26).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr27).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr28).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr29).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr30).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr31).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr32).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr33).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr34).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr35).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr36).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr37).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr38).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr39).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr40).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr41).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18)); 
    await usdcToken.connect(addr42).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));  
    await usdcToken.connect(addr43).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr44).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr45).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr46).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr47).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr48).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr49).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr50).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr51).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));

    /////////////APPROVE THE HYAX SMART CONTRACT TO SPEND USDT TOKENS/////////////
    await usdtToken.connect(addr1).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr2).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr3).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr4).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr5).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr6).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr7).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr8).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr9).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr10).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr11).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr12).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr13).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr14).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr15).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr16).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr17).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr18).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr19).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr20).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr21).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));  
    await usdtToken.connect(addr22).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr23).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr24).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr25).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr26).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr27).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr28).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr29).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr30).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr31).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr32).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr33).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr34).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr35).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr36).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr37).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr38).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr39).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr40).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr41).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18)); 
    await usdtToken.connect(addr42).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));  
    await usdtToken.connect(addr43).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr44).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr45).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr46).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr47).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr48).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr49).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr50).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr51).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));

    /////////////APPROVE THE HYAX SMART CONTRACT TO SPEND WBTC TOKENS/////////////
    await wbtcToken.connect(addr1).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr2).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr3).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr4).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr5).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr6).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr7).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr8).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr9).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr10).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr11).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr12).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr13).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr14).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr15).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr16).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr17).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr18).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr19).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr20).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr21).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));  
    await wbtcToken.connect(addr22).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr23).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr24).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr25).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr26).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr27).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr28).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr29).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr30).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr31).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr32).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr33).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr34).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr35).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr36).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr37).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr38).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr39).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr40).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr41).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18)); 
    await wbtcToken.connect(addr42).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));  
    await wbtcToken.connect(addr43).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr44).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr45).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr46).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr47).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr48).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr49).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr50).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr51).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));

    /////////////APPROVE THE HYAX SMART CONTRACT TO SPEND WETH TOKENS/////////////
    await wethToken.connect(addr1).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr2).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr3).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr4).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr5).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr6).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr7).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr8).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr9).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr10).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr11).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr12).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr13).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr14).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr15).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr16).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr17).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr18).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr19).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr20).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr21).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));  
    await wethToken.connect(addr22).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr23).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr24).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr25).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr26).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr27).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr28).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr29).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr30).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr31).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr32).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr33).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr34).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr35).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr36).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr37).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr38).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr39).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr40).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr41).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18)); 
    await wethToken.connect(addr42).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));  
    await wethToken.connect(addr43).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr44).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr45).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr46).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr47).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr48).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr49).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr50).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr51).approve(hyaxUpgradeableToken.target, ethers.parseUnits("100000", 18));
  }

  async function investorsInvestFromCryptoTokens(hyaxUpgradeableToken) {

    /////////////THE 5 INVESTORS INVEST FROM CRYPTO TOKENS/////////////
    await hyaxUpgradeableToken.connect(addr1).investFromMatic({ value: ethers.parseUnits("5000", 18) });
    await hyaxUpgradeableToken.connect(addr2).investFromCryptoToken(1, ethers.parseUnits("5000", 18));
    await hyaxUpgradeableToken.connect(addr3).investFromCryptoToken(2, ethers.parseUnits("5000", 18));
    await hyaxUpgradeableToken.connect(addr4).investFromCryptoToken(3, ethers.parseUnits("1", 18));
    await hyaxUpgradeableToken.connect(addr5).investFromCryptoToken(4, ethers.parseUnits("2", 18));

    await hyaxUpgradeableToken.connect(addr6).investFromMatic({ value: ethers.parseUnits("6000", 18) });
    await hyaxUpgradeableToken.connect(addr7).investFromCryptoToken(1, ethers.parseUnits("6000", 18));
    await hyaxUpgradeableToken.connect(addr8).investFromCryptoToken(2, ethers.parseUnits("6000", 18));
    await hyaxUpgradeableToken.connect(addr9).investFromCryptoToken(3, ethers.parseUnits("2", 18));
    await hyaxUpgradeableToken.connect(addr10).investFromCryptoToken(4, ethers.parseUnits("3", 18));

    await hyaxUpgradeableToken.connect(addr11).investFromMatic({ value: ethers.parseUnits("7000", 18) });
    await hyaxUpgradeableToken.connect(addr12).investFromCryptoToken(1, ethers.parseUnits("7000", 18));
    await hyaxUpgradeableToken.connect(addr13).investFromCryptoToken(2, ethers.parseUnits("7000", 18));
    await hyaxUpgradeableToken.connect(addr14).investFromCryptoToken(3, ethers.parseUnits("3", 18));
    await hyaxUpgradeableToken.connect(addr15).investFromCryptoToken(4, ethers.parseUnits("4", 18));

    await hyaxUpgradeableToken.connect(addr16).investFromMatic({ value: ethers.parseUnits("8000", 18) });
    await hyaxUpgradeableToken.connect(addr17).investFromCryptoToken(1, ethers.parseUnits("8000", 18));
    await hyaxUpgradeableToken.connect(addr18).investFromCryptoToken(2, ethers.parseUnits("8000", 18));
    await hyaxUpgradeableToken.connect(addr19).investFromCryptoToken(3, ethers.parseUnits("4", 18));
    await hyaxUpgradeableToken.connect(addr20).investFromCryptoToken(4, ethers.parseUnits("5", 18));

    await hyaxUpgradeableToken.connect(addr21).investFromMatic({ value: ethers.parseUnits("9000", 18) });
    await hyaxUpgradeableToken.connect(addr22).investFromCryptoToken(1, ethers.parseUnits("9000", 18));
    await hyaxUpgradeableToken.connect(addr23).investFromCryptoToken(2, ethers.parseUnits("9000", 18));
    await hyaxUpgradeableToken.connect(addr24).investFromCryptoToken(3, ethers.parseUnits("5", 18));
    await hyaxUpgradeableToken.connect(addr25).investFromCryptoToken(4, ethers.parseUnits("6", 18));

    await hyaxUpgradeableToken.connect(addr26).investFromMatic({ value: ethers.parseUnits("60000", 18) });
    await hyaxUpgradeableToken.connect(addr27).investFromCryptoToken(1, ethers.parseUnits("60000", 18));
    await hyaxUpgradeableToken.connect(addr28).investFromCryptoToken(2, ethers.parseUnits("60000", 18));
    await hyaxUpgradeableToken.connect(addr29).investFromCryptoToken(3, ethers.parseUnits("6", 18));
    await hyaxUpgradeableToken.connect(addr30).investFromCryptoToken(4, ethers.parseUnits("7", 18));

    await hyaxUpgradeableToken.connect(addr31).investFromMatic({ value: ethers.parseUnits("10000", 18) });
    await hyaxUpgradeableToken.connect(addr32).investFromCryptoToken(1, ethers.parseUnits("10000", 18));
    await hyaxUpgradeableToken.connect(addr33).investFromCryptoToken(2, ethers.parseUnits("10000", 18));
    await hyaxUpgradeableToken.connect(addr34).investFromCryptoToken(3, ethers.parseUnits("7", 18));
    await hyaxUpgradeableToken.connect(addr35).investFromCryptoToken(4, ethers.parseUnits("8", 18));

    await hyaxUpgradeableToken.connect(addr36).investFromMatic({ value: ethers.parseUnits("11000", 18) });
    await hyaxUpgradeableToken.connect(addr37).investFromCryptoToken(1, ethers.parseUnits("11000", 18));
    await hyaxUpgradeableToken.connect(addr38).investFromCryptoToken(2, ethers.parseUnits("11000", 18));
    await hyaxUpgradeableToken.connect(addr39).investFromCryptoToken(3, ethers.parseUnits("1.5", 18));
    await hyaxUpgradeableToken.connect(addr40).investFromCryptoToken(4, ethers.parseUnits("2.5", 18));

    await hyaxUpgradeableToken.connect(addr41).investFromMatic({ value: ethers.parseUnits("1000", 18) });
    await hyaxUpgradeableToken.connect(addr42).investFromCryptoToken(1, ethers.parseUnits("1000", 18));
    await hyaxUpgradeableToken.connect(addr43).investFromCryptoToken(2, ethers.parseUnits("1000", 18));
    await hyaxUpgradeableToken.connect(addr44).investFromCryptoToken(3, ethers.parseUnits("0.5", 18));
    await hyaxUpgradeableToken.connect(addr45).investFromCryptoToken(4, ethers.parseUnits("1.5", 18));

    await hyaxUpgradeableToken.connect(addr46).investFromMatic({ value: ethers.parseUnits("2000", 18) });
    await hyaxUpgradeableToken.connect(addr47).investFromCryptoToken(1, ethers.parseUnits("2000", 18));
    await hyaxUpgradeableToken.connect(addr48).investFromCryptoToken(2, ethers.parseUnits("2000", 18));
    await hyaxUpgradeableToken.connect(addr49).investFromCryptoToken(3, ethers.parseUnits("0.2", 18));
    await hyaxUpgradeableToken.connect(addr50).investFromCryptoToken(4, ethers.parseUnits("0.5", 18));
    
    await hyaxUpgradeableToken.connect(addr51).investFromCryptoToken(3, ethers.parseUnits("0.1", 18));

    /////////////GET INVESTORS HYAX BALANCES/////////////
    console.log("\nInvestor 1 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr1.address))));
    console.log("Investor 2 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr2.address))));
    console.log("Investor 3 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr3.address))));
    console.log("Investor 4 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr4.address))));
    console.log("Investor 5 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr5.address))));
    console.log("Investor 6 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr6.address))));
    console.log("Investor 7 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr7.address))));
    console.log("Investor 8 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr8.address))));
    console.log("Investor 9 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr9.address))));
    console.log("Investor 10 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr10.address))));
    console.log("Investor 11 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr11.address))));
    console.log("Investor 12 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr12.address))));
    console.log("Investor 13 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr13.address))));
    console.log("Investor 14 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr14.address))));
    console.log("Investor 15 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr15.address))));
    console.log("Investor 16 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr16.address))));
    console.log("Investor 17 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr17.address))));
    console.log("Investor 18 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr18.address))));
    console.log("Investor 19 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr19.address))));
    console.log("Investor 20 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr20.address))));
    console.log("Investor 21 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr21.address))));
    console.log("Investor 22 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr22.address))));
    console.log("Investor 23 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr23.address))));
    console.log("Investor 24 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr24.address))));
    console.log("Investor 25 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr25.address))));
    console.log("Investor 26 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr26.address))));
    console.log("Investor 27 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr27.address))));
    console.log("Investor 28 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr28.address))));
    console.log("Investor 29 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr29.address))));
    console.log("Investor 30 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr30.address))));
    console.log("Investor 31 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr31.address))));
    console.log("Investor 32 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr32.address))));
    console.log("Investor 33 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr33.address))));
    console.log("Investor 34 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr34.address))));
    console.log("Investor 35 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr35.address))));
    console.log("Investor 36 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr36.address))));
    console.log("Investor 37 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr37.address))));
    console.log("Investor 38 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr38.address))));
    console.log("Investor 39 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr39.address))));
    console.log("Investor 40 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr40.address))));
    console.log("Investor 41 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr41.address))));
    console.log("Investor 42 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr42.address))));
    console.log("Investor 43 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr43.address))));
    console.log("Investor 44 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr44.address))));
    console.log("Investor 45 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr45.address))));
    console.log("Investor 46 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr46.address))));
    console.log("Investor 47 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr47.address))));
    console.log("Investor 48 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr48.address))));
    console.log("Investor 49 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr49.address))));
    console.log("Investor 50 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr50.address))));
    console.log("Investor 51 HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(addr51.address))));
    
    /////////////GET SMART CONTRACT HYAX BALANCE/////////////
    console.log("\nSmart contract HYAX balance: ", Number(ethers.formatEther(await hyaxUpgradeableToken.balanceOf(hyaxUpgradeableToken.target))));
  }


async function main() {

    /////////////GET THE SIGNERS/////////////
    await getTheSigners();
      
    /////////////DEPLOY THE PRICE FEEDS/////////////
    const { maticPriceDataFeedMock, usdcPriceDataFeedMock, usdtPriceDataFeedMock, wbtcPriceDataFeedMock, wethPriceDataFeedMock} 
        = await deployCryptoPriceFeedMocks();

    /////////////DEPLOY THE CRYPTO TOKENS/////////////
    const { usdcToken, usdtToken, wbtcToken, wethToken} = await deployCryptoTokensMocks();

    /////////////HYAX TOKEN SMART CONTRACT DEPLOYMENT/////////////
    const hyaxUpgradeableToken = await deployHYAXTokenContract();

    /////////////UPDATE THE PRICE FEEDS AND TOKEN ADDRESSES/////////////
    await updatePriceFeedsAndTokenAddresses(hyaxUpgradeableToken, maticPriceDataFeedMock, usdcPriceDataFeedMock, 
        usdtPriceDataFeedMock, wbtcPriceDataFeedMock, wethPriceDataFeedMock, usdcToken, usdtToken, wbtcToken, wethToken);
    
    /////////////ADD THE INVESTORS TO THE WHITELIST AND QUALIFIED INVESTOR LIST/////////////
    await addInvestorToWhitelistAndQualifiedInvestorList(hyaxUpgradeableToken);

    /////////////APPROVE THE HYAX SMART CONTRACT TO SPEND CRYPTO TOKENS/////////////
    await approveHyaxContractToSpendCryptoTokens(hyaxUpgradeableToken, usdcToken, usdtToken, wbtcToken, wethToken);

    /////////////THE 51 INVESTORS INVEST FROM CRYPTO TOKENS/////////////
    await investorsInvestFromCryptoTokens(hyaxUpgradeableToken);
}

main();