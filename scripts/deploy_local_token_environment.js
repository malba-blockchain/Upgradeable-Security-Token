const { ethers, upgrades } = require('hardhat');

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


async function main() {

    /////////////GET THE SIGNERS/////////////
    const [deployer, owner, addr1, addr2, addr3, addr4, addr5, whiteListerAddress, treasuryAddress] = await ethers.getSigners();

    /////////////DEPLOY THE PRICE FEEDS/////////////
    const { maticPriceDataFeedMock, usdcPriceDataFeedMock, usdtPriceDataFeedMock, wbtcPriceDataFeedMock, wethPriceDataFeedMock} = await deployCryptoPriceFeedMocks();

    /////////////DEPLOY THE CRYPTO TOKENS/////////////
    const { usdcToken, usdtToken, wbtcToken, wethToken} = await deployCryptoTokensMocks();

    /////////////HYAX TOKEN SMART CONTRACT DEPLOYMENT/////////////
    const HYAXUpgradeable = await ethers.getContractFactory('HYAXUpgradeable');
    console.log("Deploying upgradeable HYAX...");

    // Deploy proxy with 'initialize' function
    const hyaxUpgradeable = await upgrades.deployProxy(HYAXUpgradeable, { initializer: 'initialize' });

    await hyaxUpgradeable.waitForDeployment();
    console.log("\Upgradeable HYAX deployed to:", hyaxUpgradeable.target);

    // Transfer ownership to the owner
    await hyaxUpgradeable.connect(deployer).transferOwnership(owner.address);

    // Transfer 500 M of current HYAX supply to the owner
    var totalSupply = await hyaxUpgradeable.totalSupply();

    await hyaxUpgradeable.transfer(hyaxUpgradeable.target, totalSupply.toString());

    //Balance of the smart contract
    console.log("Smart contract balance: ", await hyaxUpgradeable.balanceOf(hyaxUpgradeable.target));

    /////////////UPDATE THE HYAX SMART CONTRACT/////////////
    //Update the whitelister address
    await hyaxUpgradeable.connect(owner).updateWhiteListerAddress(whiteListerAddress.address);

    //Update the treasury address
    await hyaxUpgradeable.connect(owner).updateTreasuryAddress(treasuryAddress.address);

    //Update the addresses of the price data feeds
    await hyaxUpgradeable.connect(owner).updatePriceFeedAddress(0, maticPriceDataFeedMock.target);
    await hyaxUpgradeable.connect(owner).updatePriceFeedAddress(1, usdcPriceDataFeedMock.target);
    await hyaxUpgradeable.connect(owner).updatePriceFeedAddress(2, usdtPriceDataFeedMock.target);
    await hyaxUpgradeable.connect(owner).updatePriceFeedAddress(3, wbtcPriceDataFeedMock.target);
    await hyaxUpgradeable.connect(owner).updatePriceFeedAddress(4, wethPriceDataFeedMock.target);

    /////////////UPDATE THE CRYPTO TOKENS/////////////
    await hyaxUpgradeable.connect(owner).updateTokenAddress(1, usdcToken.target);
    await hyaxUpgradeable.connect(owner).updateTokenAddress(2, usdtToken.target);
    await hyaxUpgradeable.connect(owner).updateTokenAddress(3, wbtcToken.target);
    await hyaxUpgradeable.connect(owner).updateTokenAddress(4, wethToken.target);

    /////////////ADD THE 5 INVESTORS TO THE WHITELIST/////////////
    await hyaxUpgradeable.connect(owner).addToWhiteList(addr1.address);
    await hyaxUpgradeable.connect(owner).addToWhiteList(addr2.address);
    await hyaxUpgradeable.connect(owner).addToWhiteList(addr3.address);
    await hyaxUpgradeable.connect(owner).addToWhiteList(addr4.address);
    await hyaxUpgradeable.connect(owner).addToWhiteList(addr5.address);

    /////////////QUALIFIED INVESTOR STATUS UPDATE/////////////
    await hyaxUpgradeable.connect(owner).updateQualifiedInvestorStatus(addr1.address, true);
    await hyaxUpgradeable.connect(owner).updateQualifiedInvestorStatus(addr2.address, true);
    await hyaxUpgradeable.connect(owner).updateQualifiedInvestorStatus(addr3.address, true);
    await hyaxUpgradeable.connect(owner).updateQualifiedInvestorStatus(addr4.address, true);
    await hyaxUpgradeable.connect(owner).updateQualifiedInvestorStatus(addr5.address, true);

    /////////////APPROVE THE HYAX SMART CONTRACT TO SPEND USDC TOKENS/////////////
    await usdcToken.connect(addr1).approve(hyaxUpgradeable.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr2).approve(hyaxUpgradeable.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr3).approve(hyaxUpgradeable.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr4).approve(hyaxUpgradeable.target, ethers.parseUnits("100000", 18));
    await usdcToken.connect(addr5).approve(hyaxUpgradeable.target, ethers.parseUnits("100000", 18));

    /////////////APPROVE THE HYAX SMART CONTRACT TO SPEND USDT TOKENS/////////////
    await usdtToken.connect(addr1).approve(hyaxUpgradeable.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr2).approve(hyaxUpgradeable.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr3).approve(hyaxUpgradeable.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr4).approve(hyaxUpgradeable.target, ethers.parseUnits("100000", 18));
    await usdtToken.connect(addr5).approve(hyaxUpgradeable.target, ethers.parseUnits("100000", 18));

    /////////////APPROVE THE HYAX SMART CONTRACT TO SPEND WBTC TOKENS/////////////
    await wbtcToken.connect(addr1).approve(hyaxUpgradeable.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr2).approve(hyaxUpgradeable.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr3).approve(hyaxUpgradeable.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr4).approve(hyaxUpgradeable.target, ethers.parseUnits("100000", 18));
    await wbtcToken.connect(addr5).approve(hyaxUpgradeable.target, ethers.parseUnits("100000", 18));

    /////////////APPROVE THE HYAX SMART CONTRACT TO SPEND WETH TOKENS/////////////
    await wethToken.connect(addr1).approve(hyaxUpgradeable.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr2).approve(hyaxUpgradeable.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr3).approve(hyaxUpgradeable.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr4).approve(hyaxUpgradeable.target, ethers.parseUnits("100000", 18));
    await wethToken.connect(addr5).approve(hyaxUpgradeable.target, ethers.parseUnits("100000", 18));

    /////////////ALL INVESTORS INVEST FROM CRYPTO TOKENS/////////////

    const investor1MaticBalance = await ethers.provider.getBalance(addr1.address);
    console.log("Investor 1 matic balance: ", investor1MaticBalance);

    await hyaxUpgradeable.connect(addr1).investFromMatic({ value: ethers.parseUnits("1000", 18) });
    await hyaxUpgradeable.connect(addr2).investFromCryptoToken(1, ethers.parseUnits("10000", 18));
    await hyaxUpgradeable.connect(addr3).investFromCryptoToken(2, ethers.parseUnits("15000", 18));
    await hyaxUpgradeable.connect(addr4).investFromCryptoToken(3, ethers.parseUnits("10", 18));
    await hyaxUpgradeable.connect(addr5).investFromCryptoToken(4, ethers.parseUnits("50", 18));

    console.log("Smart contract HYAX balance: ", await hyaxUpgradeable.balanceOf(hyaxUpgradeable.target));
    console.log("Investor 1 HYAX balance: ", await hyaxUpgradeable.balanceOf(addr1.address));
    console.log("Investor 2 HYAX balance: ", await hyaxUpgradeable.balanceOf(addr2.address));
    console.log("Investor 3 HYAX balance: ", await hyaxUpgradeable.balanceOf(addr3.address));
    console.log("Investor 4 HYAX balance: ", await hyaxUpgradeable.balanceOf(addr4.address));
    console.log("Investor 5 HYAX balance: ", await hyaxUpgradeable.balanceOf(addr5.address));

}

main();