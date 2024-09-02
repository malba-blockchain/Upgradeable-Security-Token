// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @dev Implementation based on the ERC-20 standard
 * Developer: Carlos Mario Alba Rodriguez
 */

/**
 * @title UsdcTokenInterface
 * @dev Interface for interacting with the USDC (USD Coin) token.
 */
interface UsdcTokenInterface {
    function transfer(address dst, uint wad) external returns (bool);
    function transferFrom(address src, address dst, uint wad) external returns (bool);
    function balanceOf(address guy) external view returns (uint);
}

/**
 * @title UsdtTokenInterface
 * @dev Interface for interacting with the USDT (Tether) token.
 */
interface UsdtTokenInterface {
    function transfer(address dst, uint wad) external returns (bool);
    function transferFrom(address src, address dst, uint wad) external returns (bool);
    function balanceOf(address guy) external view returns (uint);
}

/**
 * @title WbtcTokenInterface
 * @dev Interface for interacting with the WBTC (Wrapped Bitcoin) token.
 */
interface WbtcTokenInterface {
    function transfer(address dst, uint wad) external returns (bool);
    function transferFrom(address src, address dst, uint wad) external returns (bool);
    function balanceOf(address guy) external view returns (uint);
}

/**
 * @title WethTokenInterface
 * @dev Interface for interacting with the WETH (Wrapped Ether) token.
 */
interface WethTokenInterface {
    function transfer(address dst, uint wad) external returns (bool);
    function transferFrom(address src, address dst, uint wad) external returns (bool);
    function balanceOf(address guy) external view returns (uint);
}

/**
 * @title HYAX token over the Mumbai Network
 * @dev ERC20Pausable token with additional functionality.
 */
contract HYAX is ERC20Pausable, Ownable, ReentrancyGuard {

    ////////////////// SMART CONTRACT EVENTS //////////////////

    /**
     * @dev Emitted when new HYAX tokens are issued.
     */
    event TokenIssuance(address sender, uint256 amount);

    /**
     * @dev Emitted when an investment is made using Matic.
     */
    event InvestFromMatic(address sender, uint256 maticAmount, uint256 totalInvestmentInUsd, uint256 hyaxAmount);

    /**
     * @dev Emitted when an investment is made using USDC.
     */
    event InvestFromUsdc(address sender, uint256 usdcAmount, uint256 totalInvestmentInUsd, uint256 hyaxAmount);

    /**
     * @dev Emitted when an investment is made using USDT.
     */
    event InvestFromUsdt(address sender, uint256 usdtAmount, uint256 totalInvestmentInUsd, uint256 hyaxAmount);

    /**
     * @dev Emitted when an investment is made using WETH.
     */
    event InvestFromWeth(address sender, uint256 wethAmount, uint256 totalInvestmentInUsd, uint256 hyaxAmount);

    /**
     * @dev Emitted when an investment is made using WBTC.
     */
    event InvestFromWbtc(address sender, uint256 wbtcAmount, uint256 totalInvestmentInUsd, uint256 hyaxAmount);

    /**
     * @dev Emitted when the HYAX price is updated.
     */
    event UpdatedHyaxPrice(uint256 _newHyaxPrice);

    /**
     * @dev Emitted when the minimum investment allowed in USD is updated.
     */
    event UpdatedMinimumInvestmentAllowedInUSD(uint256 _newMinimumInvestmentAllowedInUSD);

    /**
     * @dev Emitted when the maximum investment allowed in USD is updated.
     */
    event UpdatedMaximumInvestmentAllowedInUSD(uint256 _newMaximumInvestmentAllowedInUSD);

    /**
     * @dev Emitted when the whitelist address is updated.
     */
    event UpdatedWhiteListerAddress(address _newWhiteListerAddress);

    /**
     * @dev Emitted when the treasury address is updated.
     */
    event UpdatedTreasuryAddress(address _newTreasuryAddress);

    /**
     * @dev Emitted when an investor is added to the whitelist.
     */
    event InvestorAddedToWhiteList(address sender, address _investorAddress);

    /**
     * @dev Emitted when an investor is removed from the whitelist.
     */
    event InvestorRemovedFromWhiteList(address sender, address _investorAddress);

    /**
     * @dev Emitted when an investor is added to the qualified investor list.
     */
    event InvestorAddedToQualifiedInvestorList(address sender, address _QualifiedInvestorAddress);

    /**
     * @dev Emitted when an investor is removed from the qualified investor list.
     */
    event InvestorRemovedFromQualifiedInvestorList(address sender, address _QualifiedInvestorAddress);

    /**
     * @dev Emitted when the Matic price feed address is updated.
     */
    event UpdatedMaticPriceFeedAddress(address _newMaticPriceFeedAddress);

    /**
     * @dev Emitted when the USDC token address is updated.
     */
    event UpdatedUsdcTokenAddress(address _newUsdcTokenAddress);

    /**
     * @dev Emitted when the USDC price feed address is updated.
     */
    event UpdatedUsdcPriceFeedAddress(address _newUsdcPriceFeedAddress);

    /**
     * @dev Emitted when the USDT token address is updated.
     */
    event UpdatedUsdtTokenAddress(address _newUsdtTokenAddress);

    /**
     * @dev Emitted when the USDT price feed address is updated.
     */
    event UpdatedUsdtPriceFeedAddress(address _newUsdtPriceFeedAddress);

    /**
     * @dev Emitted when the WBTC token address is updated.
     */
    event UpdatedWbtcTokenAddress(address _newWbtcTokenAddress);

    /**
     * @dev Emitted when the WBTC price feed address is updated.
     */
    event UpdatedWbtcPriceFeedAddress(address _newWbtcPriceFeedAddress);

    /**
     * @dev Emitted when the WETH token address is updated.
     */
    event UpdatedWethTokenAddress(address _newWethTokenAddress);

    /**
     * @dev Emitted when the WETH price feed address is updated.
     */
    event UpdatedWethPriceFeedAddress(address _newWethPriceFeedAddress);

    ////////////////// SMART CONTRACT VARIABLES //////////////////

    /**
     * @dev Represents the current value of a HYAX token.
     */
    uint256 public hyaxPrice;

    /**
     * @dev Represents the minimum investment in USD required to buy HYAX.
     */
    uint256 public minimumInvestmentAllowedInUSD;

    /**
     * @dev Represents the maximum investment in USD that a non-qualified investor can make to buy HYAX.
     */
    uint256 public maximumInvestmentAllowedInUSD;

    /**
     * @dev Address of the whitelister who adds investor addresses to the whitelist after KYC.
     */
    address public whiteListerAddress;

    /**
     * @dev Address of the treasury that receives the investments made in the HYAX smart contract.
     */
    address public treasuryAddress;

    /**
     * @dev White list of investors approved after KYC.
     */
    mapping(address => bool) public investorsWhiteList;

    /**
     * @dev Mapping to track the total amount of HYAX bought by each investor.
     */
    mapping(address => uint256) public totalHyaxBoughtByInvestor;

    /**
     * @dev Mapping to track the total amount of USD an investor has deposited to buy the HYAX token.
     */
    mapping(address => uint256) public totalUsdDepositedByInvestor;

    /**
     * @dev Mapping to track qualified investors.
     */
    mapping(address => bool) public qualifiedInvestorList;

    //////////MATIC VARIABLES//////////

    /**
     * @dev There is no implementation of MATIC token address because it's the native token of the Polygon Blockchain.
     */

    /**
     * @dev Address of MATIC token price feed (Oracle) in the blockchain.
     */
    address public maticPriceFeedAddress;

    /**
     * @dev Aggregator that allows asking for the price of crypto tokens.
     */
    AggregatorV3Interface internal dataFeedMatic;

    /////////////USDC VARIABLES//////////

    /**
     * @dev Address of USDC token in the blockchain.
     */
    address public usdcTokenAddress;

    /**
     * @dev Address of USDC token price feed (Oracle) in the blockchain.
     */
    address public usdcPriceFeedAddress;

    /**
     * @dev Aggregator that allows asking for the price of crypto tokens.
     */
    AggregatorV3Interface internal dataFeedUsdc;

    /**
     * @dev Declaration of USDC token interface.
     */
    UsdcTokenInterface public usdcToken;

    /////////////USDT VARIABLES//////////

    /**
     * @dev Address of USDT token in the blockchain.
     */
    address public usdtTokenAddress;

    /**
     * @dev Address of USDT token price feed (Oracle) in the blockchain.
     */
    address public usdtPriceFeedAddress;

    /**
     * @dev Aggregator that allows asking for the price of crypto tokens.
     */
    AggregatorV3Interface internal dataFeedUsdt;

    /**
     * @dev Declaration of USDT token interface.
     */
    UsdtTokenInterface public usdtToken;

    /////////////WBTC VARIABLES//////////

    /**
     * @dev Address of WBTC token in the blockchain.
     */
    address public wbtcTokenAddress;

    /**
     * @dev Address of WBTC token price feed (Oracle) in the blockchain.
     */
    address public wbtcPriceFeedAddress;

    /**
     * @dev Aggregator that allows asking for the price of crypto tokens.
     */
    AggregatorV3Interface internal dataFeedWbtc;

    /**
     * @dev Declaration of WBTC token interface.
     */
    WbtcTokenInterface public wbtcToken;

    /////////////WETH VARIABLES//////////

    /**
     * @dev Address of WETH token in the blockchain.
     */
    address public wethTokenAddress;

    /**
     * @dev Address of WETH token price feed (Oracle) in the blockchain.
     */
    address public wethPriceFeedAddress;

    /**
     * @dev Aggregator that allows asking for the price of crypto tokens.
     */
    AggregatorV3Interface internal dataFeedWeth;

    /**
     * @dev Declaration of WETH token interface.
     */
    WethTokenInterface public wethToken;


    ////////////////// SMART CONTRACT CONSTRUCTOR /////////////////

    /**
     * @dev Constructor for the HYAX Token contract, initializing various parameters and settings.
     */
    constructor() ERC20("HYAXToken", "HYAX") Ownable() ReentrancyGuard() {

        // Minting 500,000,000 HYAX tokens to the contract deployer
        _mint(msg.sender, 500000000 * 10 ** decimals());

        // Setting the HYAX token price to 0.006 USD with 8 decimals 10**8 (600,000)
        hyaxPrice = 600000;

        // Setting the minimum investment allowed to buy HYAX to $1 USD
        minimumInvestmentAllowedInUSD = 1 * 10 ** decimals();

        // Setting the maximum investment allowed to buy HYAX to $10,000 USD
        maximumInvestmentAllowedInUSD = 10000 * 10 ** decimals();

        // Whitelister address
        whiteListerAddress = 0x01c2f012de19e6436744c3F81f56E9e70C93a8C3;

        // Treasury address
        treasuryAddress = 0x350441F8a82680a785FFA9d3EfEa60BB4cA417f8;

        // Address of MATIC token price feed (Oracle) on the blockchain
        maticPriceFeedAddress = 0x001382149eBa3441043c1c66972b4772963f5D43;

        // Oracle on Amoy network for MATIC/USD: https://amoy.polygonscan.com/address/0x001382149eBa3441043c1c66972b4772963f5D43#readContract
        dataFeedMatic = AggregatorV3Interface(maticPriceFeedAddress);

        // Address of USDC token on the blockchain
        usdcTokenAddress = 0xF68054bFe5D45432ffCA28fFA1F3D685d0456Ddc;

        // Address of USDC token price feed (Oracle) on the blockchain
        usdcPriceFeedAddress = 0x1b8739bB4CdF0089d07097A9Ae5Bd274b29C6F16;

        // Oracle on Amoy network for USDC/USD: https://amoy.polygonscan.com/address/0x1b8739bB4CdF0089d07097A9Ae5Bd274b29C6F16#code
        dataFeedUsdc = AggregatorV3Interface(usdcPriceFeedAddress);

        // Implementation of USDC token interface
        usdcToken = UsdcTokenInterface(usdcTokenAddress);

        // Address of USDT token on the blockchain
        usdtTokenAddress = 0x70e02Fb82B6BC04F64099689B0599e14B44D4fBb;

        // Address of USDT token price feed (Oracle) on the blockchain
        usdtPriceFeedAddress = 0x3aC23DcB4eCfcBd24579e1f34542524d0E4eDeA8;

        // Oracle on Amoy network for USDT/USD: https://amoy.polygonscan.com/address/0x3aC23DcB4eCfcBd24579e1f34542524d0E4eDeA8#readContract
        dataFeedUsdt = AggregatorV3Interface(usdtPriceFeedAddress);

        // Implementation of USDT token interface
        usdtToken = UsdtTokenInterface(usdtTokenAddress);

        // Address of WBTC token on the blockchain
        wbtcTokenAddress = 0x3C8df3C48B3884DA2ff25e17524282d60F9C3b93;

        // Address of WBTC token price feed (Oracle) on the blockchain
        wbtcPriceFeedAddress = 0xe7656e23fE8077D438aEfbec2fAbDf2D8e070C4f;

        // Oracle on Amoy network for WBTC/USD: https://amoy.polygonscan.com/address/0xe7656e23fE8077D438aEfbec2fAbDf2D8e070C4f#code
        dataFeedWbtc = AggregatorV3Interface(wbtcPriceFeedAddress);

        // Implementation of WBTC token interface
        wbtcToken = WbtcTokenInterface(wbtcTokenAddress);

        // Address of WETH token on the blockchain
        wethTokenAddress = 0x524a89ED77d5827320E35E12bCA96830C6b7960A;

        // Address of WETH token price feed (Oracle) on the blockchain
        wethPriceFeedAddress = 0xF0d50568e3A7e8259E16663972b11910F89BD8e7;

        // Oracle on Mumbai network for WETH/USD: https://amoy.polygonscan.com/address/0xF0d50568e3A7e8259E16663972b11910F89BD8e7#code
        dataFeedWeth = AggregatorV3Interface(wethPriceFeedAddress);

        // Implementation of WETH token interface
        wethToken = WethTokenInterface(wethTokenAddress);
    }

    ////////////////// SMART CONTRACT FUNCTIONS //////////////////

    /**
     * @dev Function to calculate the amount of HYAX tokens to return based on the current price of a currency for an investment.
     * @param _amount The amount of cryptocurrency invested.
     * @param _currentCryptocurrencyPrice The current price of the cryptocurrency in USD.
     * @return totalInvestmentInUsd The total investment in USD.
     * @return totalHyaxTokenToReturn The total amount of HYAX tokens to return.
     */
    function calculateTotalHyaxTokenToReturn(uint256 _amount, uint256 _currentCryptocurrencyPrice) public view returns (uint256 totalInvestmentInUsd, uint256 totalHyaxTokenToReturn) {
        
        //Decimals in math operation. Because the cryptocurrency price feed and hyaxPrice comes with 8 decimals
        uint256 decimalsInMathOperation = 10 ** 8;

        //Calculate the total investment in USD and divide by 10**8. 
        //totalInvestmentInUsd = SafeMath.div((SafeMath.mul(_amount, _currentCryptocurrencyPrice)), decimalsInMathOperation);
        totalInvestmentInUsd = (_amount* _currentCryptocurrencyPrice) / decimalsInMathOperation;
        //Calcuale the amount of tokens to return given the current token price and multiply it by 10**8
        //totalHyaxTokenToReturn = SafeMath.mul((SafeMath.div(totalInvestmentInUsd, hyaxPrice)), decimalsInMathOperation);
        totalHyaxTokenToReturn = (totalInvestmentInUsd / hyaxPrice) * decimalsInMathOperation;
        //Validate that the amount to invest is equal or greater than the minimum investment established in USD
        require(totalInvestmentInUsd >= minimumInvestmentAllowedInUSD, "The amount to invest must be greater than the minimum established");

        //Validate that the amount of HYAX tokens to offer to the investor is equal or less than the amount that's left in the smart contract
        require(totalHyaxTokenToReturn <= balanceOf(address(this)), "The investment made returns an amount of HYAX greater than the available");

        return (totalInvestmentInUsd, totalHyaxTokenToReturn);
    }

    /**
     * @dev Function to add an investor's address to the whitelist.
     * @param _investorAddress The address of the investor to be added to the whitelist.
     */
    function addToWhiteList(address _investorAddress) external onlyOwnerOrWhitelister {

        // Ensure that the investor address to add is not the zero address
        require(_investorAddress != address(0), "Investor address to add to the white list can not be the zero address");

        // Ensure that the investor address has not already been added to the white list
        require(investorsWhiteList[_investorAddress] != true, "That investor address has already been added to the white list");

        // Add the investor address to the white list
        investorsWhiteList[_investorAddress] = true;

        //Emit the event of investor added to the whitelist
        emit InvestorAddedToWhiteList(msg.sender, _investorAddress);
    }

    /**
     * @dev Function to remove an investor's address from the whitelist.
     * @param _investorAddress The address of the investor to be removed from the whitelist.
     */
    function removeFromWhiteList(address _investorAddress) external onlyOwnerOrWhitelister {

        // Ensure that the investor address to remove is not the zero address
        require(_investorAddress != address(0), "Investor address to remove from the white list can not be the zero address");

        // Ensure that the investor address is registered on the white list
        require(investorsWhiteList[_investorAddress] == true, "That investor address is not registered on the white list");

        // Remove the investor address from the white list
        investorsWhiteList[_investorAddress] = false;

        //Emit the event of investor added to the whitelist
        emit InvestorRemovedFromWhiteList(msg.sender, _investorAddress);
    }

    modifier investorIsOnWhiteList {
        // Ensure that the sender's address is on the white list
        require(investorsWhiteList[msg.sender] == true, "Investor address has not been added to the white list");
        _;
    }

    modifier onlyOwnerOrWhitelister {
        // Ensure that the sender is the owner or the white lister address
        require(msg.sender == owner() || msg.sender == whiteListerAddress, "Function reserved only for the white lister address or the owner");
        _;
    }

    /**
     * @dev Function to add an investor's address to the list of qualified investors.
     * @param _qualifiedInvestorAddress The address of the investor to be added to the qualified investor list.
     */
    function addToQualifiedInvestorList(address _qualifiedInvestorAddress) external onlyOwnerOrWhitelister {

        // Ensure that the investor address to add is not the zero address
        require(_qualifiedInvestorAddress != address(0), "Investor address to add to the qualified investor list can not be the zero address");

        // Ensure that the investor address to add is already in the white list of investors
        require(investorsWhiteList[_qualifiedInvestorAddress] == true, "Investor address must be first added to the investor white list");

        // Ensure that the investor address has not already been added to the qualified investor list
        require(qualifiedInvestorList[_qualifiedInvestorAddress] != true, "That investor address has already been added to the qualified investor list");

        // Add the investor address to the qualified investor list
        qualifiedInvestorList[_qualifiedInvestorAddress] = true;

        //Emit the event of investor added to the qualified investor list
        emit InvestorAddedToQualifiedInvestorList(msg.sender, _qualifiedInvestorAddress);
    }

    /**
     * @dev Function to remove an investor's address from the list of qualified investors.
     * @param _qualifiedInvestorAddress The address of the investor to be removed from the qualified investor list.
     */
    function removeFromQualifiedInvestorList(address _qualifiedInvestorAddress) external onlyOwnerOrWhitelister {

        // Ensure that the investor address to remove is not the zero address
        require(_qualifiedInvestorAddress != address(0), "Investor address to remove from the qualified investor list can not be the zero address");

        // Ensure that the investor address is registered on the qualified investor list
        require(qualifiedInvestorList[_qualifiedInvestorAddress] == true, "That investor address is not registered on the qualified investor list");

        // Remove the investor address from the qualified investor list
        qualifiedInvestorList[_qualifiedInvestorAddress] = false;

        //Emit the event of investor removed from the qualified investor list
        emit InvestorRemovedFromQualifiedInvestorList(msg.sender, _qualifiedInvestorAddress);
    }

    /**
     * @dev Function to issue HYAX tokens as required.
     * @param _amount The amount of HYAX tokens to issue.
     */
    function tokenIssuance(uint256 _amount) public onlyOwner nonReentrant {
        
        // Ensure that the amount to issue in this execution is at least 1 token
        require(_amount >= 1 * 10 ** decimals(), "Amount of HYAX tokens to issue must be at least 1 token");
        
        // Ensure that the amount to issue in this execution is maximum 1000 M tokens
        require(_amount <= 1000000000 * 10 ** decimals(), "Amount of HYAX tokens to issue at a time must be maximum 1000 M");
        
        // Validate the amount to issue doesn't go beyond the established total supply
        //uint256 newTotalSupply = SafeMath.add(totalSupply(),_amount);
        uint256 newTotalSupply = totalSupply()+_amount;
        
        require(newTotalSupply <= 10000000000 * 10 ** decimals(), "Amount of HYAX tokens to issue surpases the 10,000 M tokens");

        // Mint the specified amount of tokens to the owner
        _mint(owner(), _amount);

        // Emit the event of token issuance
        emit TokenIssuance(msg.sender, _amount);
    }

    /**
     * @dev Function to validate the maximum invested amount of an investor and the limit if it's not a qualified investor.
     * @param _totalInvestmentInUsd The total investment in USD for the current transaction.
     * @param _investorAddress The address of the investor making the investment.
     */
    function validateMaximumInvestedAmountAndInvestorLimit(uint256 _totalInvestmentInUsd, address _investorAddress) public view {

        // Calculate the new total amount invested in USD by adding the current transaction's investment to the investor's total
        uint256 newTotalAmountInvestedInUSD = _totalInvestmentInUsd + totalUsdDepositedByInvestor[_investorAddress];
        
        //If the amount to buy in USD is greater than the maximum established, then validate if the investor is qualified
        if(newTotalAmountInvestedInUSD > maximumInvestmentAllowedInUSD) {
            require(qualifiedInvestorList[_investorAddress] == true, "To buy that amount of HYAX its required to be a qualified investor");
        }
    }

    /////////////INVESTING FUNCTIONS//////////

    /**
     * @dev Function allowing an investor on the whitelist to invest using MATIC.
     * @notice The function is payable, and MATIC is automatically transferred to this contract with the payable tag.
     * @return A boolean indicating the success of the investment and HYAX token transfer.
    */
    function investFromMatic() external investorIsOnWhiteList payable nonReentrant returns (bool){

        //Transfer MATIC to this contract. Its automatically done with the payable tag

        //Calculate total HYAX to return while validating minimum investment and if there are HYAX tokens left to sell
        (uint256 totalInvestmentInUsd, uint256 totalHyaxTokenToReturn) = this.calculateTotalHyaxTokenToReturn(msg.value, this.getCurrentMaticPrice());

        //If the amount of HYAX to buy is greater than the maximum established, then validate if the investor is qualified
        this.validateMaximumInvestedAmountAndInvestorLimit(totalInvestmentInUsd, msg.sender);

        //Transfer MATIC to the treasury address
        bool successSendingMatic = payable(treasuryAddress).send(msg.value);
        require (successSendingMatic, "There was an error on sending the MATIC investment to the treasury");

        //Transfer HYAX token to the investor wallet
        bool successSendingHyaxToken = this.transfer(msg.sender, totalHyaxTokenToReturn);
        require (successSendingHyaxToken, "There was an error on sending back the HYAX Token to the investor");

        //Update the total amount of USD that a investor has deposited
        totalUsdDepositedByInvestor[msg.sender] += totalInvestmentInUsd;

        //Update the total amount of HYAX that a investor has bought
        totalHyaxBoughtByInvestor[msg.sender] += totalHyaxTokenToReturn;

        //Emit the event of successful investment
        emit InvestFromMatic(msg.sender, msg.value, totalInvestmentInUsd, totalHyaxTokenToReturn);

        return successSendingHyaxToken;
    }

    /**
     * @dev Function allowing an investor on the whitelist to invest using USDC.
     * @param _amount The amount of USDC to invest.
     * @return A boolean indicating the success of the investment and HYAX token transfer.
     */
    function investFromUsdc(uint256 _amount) external investorIsOnWhiteList nonReentrant returns (bool) {

        //Calculate total HYAX to return while validating minimum investment and if there are HYAX tokens left to sell
        (uint256 totalInvestmentInUsd, uint256 totalHyaxTokenToReturn) = this.calculateTotalHyaxTokenToReturn(_amount, this.getCurrentUsdcPrice());

        //If the amount of HYAX to buy is greater than the maximum established, then validate if the investor is qualified
        this.validateMaximumInvestedAmountAndInvestorLimit(totalInvestmentInUsd, msg.sender);

        //Transfer USDC to this contract
        bool successReceivingUsdc  = usdcToken.transferFrom(msg.sender, address(this), _amount);
        require (successReceivingUsdc, "There was an error on receiving the USDC investment");

        //Transfer USDC to the treasury address
        bool successSendingUsdc = usdcToken.transfer(payable(treasuryAddress), _amount);
        require (successSendingUsdc, "There was an error on sending the USDC investment to the treasury");

        //Transfer HYAX token to the investor wallet
        bool successSendingHyaxToken = this.transfer(msg.sender, totalHyaxTokenToReturn);
        require (successSendingHyaxToken, "There was an error on sending back the HYAX Token to the investor");

        //Update the total amount of USD that a investor has deposited
        totalUsdDepositedByInvestor[msg.sender] += totalInvestmentInUsd;

        //Update the total amount of HYAX that a investor has bought
        totalHyaxBoughtByInvestor[msg.sender] += totalHyaxTokenToReturn;

        //Emit the event of successful investment
        emit InvestFromUsdc(msg.sender, _amount, totalInvestmentInUsd, totalHyaxTokenToReturn);

        return successSendingHyaxToken;
    }

    /**
     * @dev Function allowing an investor on the whitelist to invest using USDT.
     * @param _amount The amount of USDT to invest.
     * @return A boolean indicating the success of the investment and HYAX token transfer.
     */
    function investFromUsdt(uint256 _amount) external investorIsOnWhiteList nonReentrant returns (bool) {

        //Calculate total HYAX to return while validating minimum investment and if there are HYAX tokens left to sell
        (uint256 totalInvestmentInUsd, uint256 totalHyaxTokenToReturn) = this.calculateTotalHyaxTokenToReturn(_amount, this.getCurrentUsdtPrice());

        //If the amount of HYAX to buy is greater than the maximum established, then validate if the investor is qualified
        this.validateMaximumInvestedAmountAndInvestorLimit(totalInvestmentInUsd, msg.sender);

        //Transfer USDT to this contract
        bool successReceivingUsdt  = usdtToken.transferFrom(msg.sender, address(this), _amount);
        require (successReceivingUsdt, "There was an error on receiving the USDT investment");

        //Transfer USDT to the treasury address
        bool successSendingUsdt = usdtToken.transfer(payable(treasuryAddress), _amount);
        require (successSendingUsdt, "There was an error on sending the USDT investment to the treasury");
        
        //Transfer HYAX token to the investor wallet
        bool successSendingHyaxToken = this.transfer(msg.sender, totalHyaxTokenToReturn);
        require (successSendingHyaxToken, "There was an error on sending back the HYAX Token to the investor");

        //Update the total amount of USD that a investor has deposited
        totalUsdDepositedByInvestor[msg.sender] += totalInvestmentInUsd;

        //Update the total amount of HYAX that a investor has bought
        totalHyaxBoughtByInvestor[msg.sender] += totalHyaxTokenToReturn;

        //Emit the event of successful investment
        emit InvestFromUsdt(msg.sender, _amount, totalInvestmentInUsd, totalHyaxTokenToReturn);
  
        return successSendingHyaxToken;
    }

    /**
     * @dev Function allowing an investor on the whitelist to invest using WBTC.
     * @param _amount The amount of WBTC to invest.
     * @return A boolean indicating the success of the investment and HYAX token transfer.
     */
    function investFromWbtc(uint256 _amount) external investorIsOnWhiteList nonReentrant returns (bool) {

        //Calculate total HYAX to return while validating minimum investment and if there are HYAX tokens left to sell
        (uint256 totalInvestmentInUsd, uint256 totalHyaxTokenToReturn) = this.calculateTotalHyaxTokenToReturn(_amount, this.getCurrentWbtcPrice());

        //If the amount of HYAX to buy is greater than the maximum established, then validate if the investor is qualified
        this.validateMaximumInvestedAmountAndInvestorLimit(totalInvestmentInUsd, msg.sender);

        //Transfer WBTC to this contract
        bool successReceivingWbtc  = wbtcToken.transferFrom(msg.sender, address(this), _amount);
        require (successReceivingWbtc, "There was an error on receiving the WBTC investment");

        //Transfer WBTC to the treasury address
        bool successSendingWbtc = wbtcToken.transfer(payable(treasuryAddress), _amount);
        require (successSendingWbtc, "There was an error on sending the WBTC investment to the treasury");
        
        //Transfer HYAX token to the investor wallet
        bool successSendingHyaxToken = this.transfer(msg.sender, totalHyaxTokenToReturn);
        require (successSendingHyaxToken, "There was an error on sending back the HYAX Token to the investor");

        //Update the total amount of USD that a investor has deposited
        totalUsdDepositedByInvestor[msg.sender] += totalInvestmentInUsd;

        //Update the total amount of HYAX that a investor has bought
        totalHyaxBoughtByInvestor[msg.sender] += totalHyaxTokenToReturn;

        //Emit the event of successful investment
        emit InvestFromWbtc(msg.sender, _amount, totalInvestmentInUsd, totalHyaxTokenToReturn);

        return successSendingHyaxToken;
    }

    /**
     * @dev Function allowing an investor on the whitelist to invest using WETH.
     * @param _amount The amount of WETH to invest.
     * @return A boolean indicating the success of the investment and HYAX token transfer.
     */
    function investFromWeth(uint256 _amount) external investorIsOnWhiteList nonReentrant returns (bool) {

        //Calculate total HYAX to return while validating minimum investment and if there are HYAX tokens left to sell
        (uint256 totalInvestmentInUsd, uint256 totalHyaxTokenToReturn) = this.calculateTotalHyaxTokenToReturn(_amount, this.getCurrentWethPrice());

        //If the amount of HYAX to buy is greater than the maximum established, then validate if the investor is qualified
        this.validateMaximumInvestedAmountAndInvestorLimit(totalInvestmentInUsd, msg.sender);

        //Transfer WETH to this contract
        bool successReceivingWeth  = wethToken.transferFrom(msg.sender, address(this), _amount);
        require (successReceivingWeth, "There was an error on receiving the WETH investment");

        //Transfer WETH to the treasury address
        bool successSendingWeth = wethToken.transfer(payable(treasuryAddress), _amount);
        require (successSendingWeth, "There was an error on sending the WETH investment to the treasury");

        //Transfer HYAX token to the investor wallet
        bool successSendingHyaxToken = this.transfer(msg.sender, totalHyaxTokenToReturn);
        require (successSendingHyaxToken, "There was an error on sending back the HYAX Token to the investor");

        //Update the total amount of USD that a investor has deposited
        totalUsdDepositedByInvestor[msg.sender] += totalInvestmentInUsd;

        //Update the total amount of HYAX that a investor has bought
        totalHyaxBoughtByInvestor[msg.sender] += totalHyaxTokenToReturn;

        //Emit the event of successful investment
        emit InvestFromWeth(msg.sender, _amount, totalInvestmentInUsd, totalHyaxTokenToReturn);

        return successSendingHyaxToken;
    }

    /////////////VARIABLE UPDATE FUNCTIONS ONLY OWNER//////////

    /**
     * @dev Function to update the price in USD of each HYAX token. Using 8 decimals.
     * @param _newHyaxPrice The new price of each HYAX token in USD.
     */
    function updateHyaxPrice(uint256 _newHyaxPrice) external onlyOwner {

        //Ensure that the update transaction is not repeated for the same parameter, just as a good practice
        require(_newHyaxPrice != hyaxPrice, "HYAX price has already been modified to that value");

        // Ensure that new HYAX token price is over a minimum of USD 0.005
        require(_newHyaxPrice >= 500000, "Price of HYAX token must be at least USD 0.005, that is 500000 with 8 decimals");
        
        // Ensure that new HYAX token price is under a maximum of USD 1000 
        require(_newHyaxPrice <= 100000000000, "Price of HYAX token must be at maximum USD 1000, that is 100000000000 with 8 decimals");
        
        // Update the HYAX price
        hyaxPrice = _newHyaxPrice;

        // Emit an event to signal the updated HYAX price
        emit UpdatedHyaxPrice(_newHyaxPrice);
    }

    /**
     * @dev Function to update the minimum investment allowed for an investor to make in USD.
     * @param _newMinimumInvestmentAllowedInUSD The new minimum amount allowed for investment in USD.
     */
    function updateMinimumInvestmentAllowedInUSD(uint256 _newMinimumInvestmentAllowedInUSD) external onlyOwner {
        
        // Ensure the new minimum investment is greater than zero
        require(_newMinimumInvestmentAllowedInUSD > 0, "New minimun amount to invest, must be greater than zero");
        
        //Ensure that the update transaction is not repeated for the same parameter, just as a good practice
        require(_newMinimumInvestmentAllowedInUSD != minimumInvestmentAllowedInUSD, "Minimum investment allowed in USD has already been modified to that value");

        // Ensure the new minimum investment is less or equal than the maximum
        require(_newMinimumInvestmentAllowedInUSD <= maximumInvestmentAllowedInUSD, "New minimun amount to invest, must be less than the maximum investment allowed");

        // Update the minimum investment allowed in USD
        minimumInvestmentAllowedInUSD = _newMinimumInvestmentAllowedInUSD;

        // Emit an event to signal the updated minimum investment allowed in USD
        emit UpdatedMinimumInvestmentAllowedInUSD(_newMinimumInvestmentAllowedInUSD);
    }

    /**
     * @dev Function to update the maximum investment allowed for an investor to make in USD, without being a qualified investor.
     * @param _newMaximumInvestmentAllowedInUSD The new maximum amount allowed for investment in USD.
     */
    function updateMaximumInvestmentAllowedInUSD(uint256 _newMaximumInvestmentAllowedInUSD) external onlyOwner {

        // Ensure the new maximum investment is greater than zero
        require(_newMaximumInvestmentAllowedInUSD > 0, "New maximum amount to invest, must be greater than zero");

        //Ensure that the update transaction is not repeated for the same parameter, just as a good practice
        require(_newMaximumInvestmentAllowedInUSD != maximumInvestmentAllowedInUSD, "New maximum amount to invest, has already been modified to that value");

        // Ensure the new maximum investment is greater or equal than the minimum
        require(_newMaximumInvestmentAllowedInUSD >= minimumInvestmentAllowedInUSD, "New maximum amount to invest, must be greater than the minimum investment allowed");

        // Update the maximum investment allowed in USD
        maximumInvestmentAllowedInUSD = _newMaximumInvestmentAllowedInUSD;

        // Emit an event to signal the updated maximum investment allowed in USD
        emit UpdatedMaximumInvestmentAllowedInUSD(_newMaximumInvestmentAllowedInUSD);
    }

    /**
     * @dev Function to update the address of the whitelister.
     * @param _newWhiteListerAddress The new address of the whitelister.
     */
    function updateWhiteListerAddress(address _newWhiteListerAddress) external onlyOwner {

        // Ensure the new whitelister address is not the zero address
        require(_newWhiteListerAddress != address(0), "The white lister address can not be the zero address");
        
        //Ensure that the update transaction is not repeated for the same parameter, just as a good practice
        require(_newWhiteListerAddress != whiteListerAddress, "White lister address has already been modified to that value");

        // Update the whitelister address
        whiteListerAddress = _newWhiteListerAddress;

        // Emit an event to signal the updated whitelister address
        emit UpdatedWhiteListerAddress(_newWhiteListerAddress);
    }

    /**
     * @dev Function to update the address of the treasury.
     * @param _newTreasuryAddress The new address of the treasury.
     */
    function updateTreasuryAddress(address _newTreasuryAddress) external onlyOwner {

        // Ensure the new treasury address is not the zero address
        require(_newTreasuryAddress != address(0), "The treasury address can not be the zero address");

        //Ensure that the update transaction is not repeated for the same parameter, just as a good practice
        require(_newTreasuryAddress != treasuryAddress, "Treasury address has already been modified to that value");

        // Update the treasury address
        treasuryAddress = _newTreasuryAddress;

        // Emit an event to signal the updated treasury address
        emit UpdatedTreasuryAddress(_newTreasuryAddress);
    }

    /**
     * @dev Function to update the address of the oracle that provides the MATIC price feed.
     * @param _newMaticPriceFeedAddress The new address of the MATIC price feed oracle.
     */
    function updateMaticPriceFeedAddress(address _newMaticPriceFeedAddress) external onlyOwner {
        
        // Ensure the new MATIC price feed address is not the zero address
        require(_newMaticPriceFeedAddress != address(0), "The price data feed address can not be the zero address");
        
        //Ensure that the update transaction is not repeated for the same parameter, just as a good practice
        require(_newMaticPriceFeedAddress != maticPriceFeedAddress, "MATIC price feed address has already been modified to that value");
        
        //Temporary data feed to perform the validation of the data feed descriptions
        AggregatorV3Interface tempDataFeedMatic = AggregatorV3Interface(_newMaticPriceFeedAddress);

        //Validate if the new address is actually a price feed address. Attempt to call the description function 
        try tempDataFeedMatic.description() returns (string memory descriptionValue) {

            //Get the hash value of the MATIC/USD string
            bytes32 hashOfExpectedMaticFeedDescription = keccak256(abi.encodePacked('MATIC / USD'));

            //Get the hash value of the description of the price data feed
            bytes32 hashOfCurrentMaticFeedDescription = keccak256(abi.encodePacked(descriptionValue));
            
            //Validate the data feed is actually the address of a MATIC/USD oracle by comparing the hashes of the expected description and temporal description
            require(hashOfExpectedMaticFeedDescription == hashOfCurrentMaticFeedDescription, "The new address does not seem to belong to a MATIC price data feed");
        
        } catch  {
            //In case there is an error obtaining the description of the data feed, revert the transaction
            revert("The new address does not seem to belong to a MATIC price data feed");
        }

        // Update the MATIC price feed address
        maticPriceFeedAddress = _newMaticPriceFeedAddress;

        // Update the MATIC price feed interface
        dataFeedMatic = AggregatorV3Interface(maticPriceFeedAddress);

        // Emit an event to signal the updated MATIC price feed address
        emit UpdatedMaticPriceFeedAddress(_newMaticPriceFeedAddress);
    }

    /**
     * @dev Function to update the address of the USDC token on the Polygon blockchain.
     * @param _newUsdcTokenAddress The new address of the USDC token on Polygon.
     */
    function updateUsdcTokenAddress(address _newUsdcTokenAddress) external onlyOwner {
        
        // Ensure the new USDC token address is not the zero address
        require(_newUsdcTokenAddress != address(0), "The token address can not be the zero address");

        //Ensure that the update transaction is not repeated for the same parameter, just as a good practice
        require(_newUsdcTokenAddress != usdcTokenAddress, "USDC token address has already been modified to that value");

        // Update the USDC token address
        usdcTokenAddress = _newUsdcTokenAddress;

        // Update the USDC token interface
        usdcToken = UsdcTokenInterface(usdcTokenAddress);

        // Emit an event to signal the updated USDC token address
        emit UpdatedUsdcTokenAddress(_newUsdcTokenAddress);
    }

    /**
     * @dev Function to update the address of the oracle that provides the USDC price feed.
     * @param _newUsdcPriceFeedAddress The new address of the USDC price feed oracle.
     */
    function updateUsdcPriceFeedAddress(address _newUsdcPriceFeedAddress) external onlyOwner {

        // Ensure the new USDC price feed address is not the zero address
        require(_newUsdcPriceFeedAddress != address(0), "The price data feed address can not be the zero address");
        
        //Ensure that the update transaction is not repeated for the same parameter, just as a good practice
        require(_newUsdcPriceFeedAddress != usdcPriceFeedAddress, "USDC price feed address has already been modified to that value");

        //Temporary data feed to perform the validation of the data feed descriptions
        AggregatorV3Interface tempDataFeedUsdc = AggregatorV3Interface(_newUsdcPriceFeedAddress);

        //Validate if the new address is actually a price feed address. Attempt to call the description function 
        try tempDataFeedUsdc.description() returns (string memory descriptionValue) {

            //Get the hash value of the USDC/USD string
            bytes32 hashOfExpectedUsdcFeedDescription = keccak256(abi.encodePacked('USDC / USD'));

            //Get the hash value of the description of the price data feed
            bytes32 hashOfCurrentUsdcFeedDescription = keccak256(abi.encodePacked(descriptionValue));
            
            //Validate the data feed is actually the address of a USDC/USD oracle by comparing the hashes of the expected description and temporal description
            require(hashOfExpectedUsdcFeedDescription == hashOfCurrentUsdcFeedDescription, "The new address does not seem to belong to a USDC price data feed");
        
        } catch  {
            //In case there is an error obtaining the description of the data feed, revert the transaction
            revert("The new address does not seem to belong to a USDC price data feed");
        }

        // Update the USDC price feed address
        usdcPriceFeedAddress = _newUsdcPriceFeedAddress;

        // Update the USDC price feed interface
        dataFeedUsdc = AggregatorV3Interface(usdcPriceFeedAddress);

        // Emit an event to signal the updated USDC price feed address
        emit UpdatedUsdcPriceFeedAddress(_newUsdcPriceFeedAddress);
    }

    /**
     * @dev Function to update the address of the USDT token on the Polygon blockchain.
     * @param _newUsdtTokenAddress The new address of the USDT token on Polygon.
     */
    function updateUsdtTokenAddress(address _newUsdtTokenAddress) external onlyOwner {

        // Ensure the new USDT token address is not the zero address
        require(_newUsdtTokenAddress != address(0), "The token address can not be the zero address");

        //Ensure that the update transaction is not repeated for the same parameter, just as a good practice
        require(_newUsdtTokenAddress != usdtTokenAddress, "USDT token address has already been modified to that value");

        // Update the USDT token address
        usdtTokenAddress = _newUsdtTokenAddress;

        // Update the USDT token interface
        usdtToken = UsdtTokenInterface(usdtTokenAddress);

        // Emit an event to signal the updated USDT token address
        emit UpdatedUsdtTokenAddress(_newUsdtTokenAddress);
    }

    /**
     * @dev Function to update the address of the oracle that provides the USDT price feed.
     * @param _newUsdtPriceFeedAddress The new address of the USDT price feed oracle.
     */
    function updateUsdtPriceFeedAddress(address _newUsdtPriceFeedAddress) external onlyOwner {

        // Ensure the new USDT price feed address is not the zero address
        require(_newUsdtPriceFeedAddress != address(0), "The price data feed address can not be the zero address");

        //Ensure that the update transaction is not repeated for the same parameter, just as a good practice
        require(_newUsdtPriceFeedAddress != usdtPriceFeedAddress, "USDT price feed address has already been modified to that value");

        //Temporary data feed to perform the validation of the data feed descriptions
        AggregatorV3Interface tempDataFeedUsdt = AggregatorV3Interface(_newUsdtPriceFeedAddress);

        //Validate if the new address is actually a price feed address. Attempt to call the description function 
        try tempDataFeedUsdt.description() returns (string memory descriptionValue) {

            //Get the hash value of the USDT/USD string
            bytes32 hashOfExpectedUsdtFeedDescription = keccak256(abi.encodePacked('USDT / USD'));

            //Get the hash value of the description of the price data feed
            bytes32 hashOfCurrentUsdtFeedDescription = keccak256(abi.encodePacked(descriptionValue));
            
            //Validate the data feed is actually the address of a USDT/USD oracle by comparing the hashes of the expected description and temporal description
            require(hashOfExpectedUsdtFeedDescription == hashOfCurrentUsdtFeedDescription, "The new address does not seem to belong to a USDT price data feed");
        
        } catch  {
            //In case there is an error obtaining the description of the data feed, revert the transaction
            revert("The new address does not seem to belong to a USDT price data feed");
        }

        // Update the USDT price feed address
        usdtPriceFeedAddress = _newUsdtPriceFeedAddress;

        // Update the USDT price feed interface
        dataFeedUsdt = AggregatorV3Interface(usdtPriceFeedAddress);

        // Emit an event to signal the updated USDT price feed address
        emit UpdatedUsdtPriceFeedAddress(_newUsdtPriceFeedAddress);
    }

    /**
     * @dev Function to update the address of the WBTC token on the Polygon blockchain.
     * @param _newWbtcTokenAddress The new address of the WBTC token on Polygon.
     */
    function updateWbtcTokenAddress(address _newWbtcTokenAddress) external onlyOwner {

        // Ensure the new WBTC token address is not the zero address
        require(_newWbtcTokenAddress != address(0), "The token address can not be the zero address");

        //Ensure that the update transaction is not repeated for the same parameter, just as a good practice
        require(_newWbtcTokenAddress != wbtcTokenAddress, "WBTC token address has already been modified to that value");

        // Update the WBTC token address
        wbtcTokenAddress = _newWbtcTokenAddress;

        // Update the WBTC token interface
        wbtcToken = WbtcTokenInterface(wbtcTokenAddress);

        // Emit an event to signal the updated WBTC token address
        emit UpdatedWbtcTokenAddress(_newWbtcTokenAddress);
    }

    /**
     * @dev Function to update the address of the oracle that provides the WBTC price feed.
     * @param _newWbtcPriceFeedAddress The new address of the WBTC price feed oracle.
     */
    function updateWbtcPriceFeedAddress(address _newWbtcPriceFeedAddress) external onlyOwner {

        // Ensure the new WBTC price feed address is not the zero address
        require(_newWbtcPriceFeedAddress != address(0), "The price data feed address can not be the zero address");
        
        //Ensure that the update transaction is not repeated for the same parameter, just as a good practice
        require(_newWbtcPriceFeedAddress != wbtcPriceFeedAddress, "WBTC price feed address has already been modified to that value");

        //Temporary data feed to perform the validation of the data feed descriptions
        AggregatorV3Interface tempDataFeedWbtc = AggregatorV3Interface(_newWbtcPriceFeedAddress);

        //Validate if the new address is actually a price feed address. Attempt to call the description function 
        try tempDataFeedWbtc.description() returns (string memory descriptionValue) {

            //Get the hash value of the WBTC/USD string
            bytes32 hashOfExpectedWbtcFeedDescription = keccak256(abi.encodePacked('WBTC / USD'));

            //Get the hash value of the description of the price data feed
            bytes32 hashOfCurrentWbtcFeedDescription = keccak256(abi.encodePacked(descriptionValue));
            
            //Validate the data feed is actually the address of a WBTC/USD oracle by comparing the hashes of the expected description and temporal description
            require(hashOfExpectedWbtcFeedDescription == hashOfCurrentWbtcFeedDescription, "The new address does not seem to belong to a WBTC price data feed");
        
        } catch  {
            //In case there is an error obtaining the description of the data feed, revert the transaction
            revert("The new address does not seem to belong to a WBTC price data feed");
        }

        // Update the WBTC price feed address
        wbtcPriceFeedAddress = _newWbtcPriceFeedAddress;

        // Update the WBTC price feed interface
        dataFeedWbtc = AggregatorV3Interface(wbtcPriceFeedAddress);

        // Emit an event to signal the updated WBTC price feed address
        emit UpdatedWbtcPriceFeedAddress(_newWbtcPriceFeedAddress);
    }

    /**
     * @dev Function to update the address of the WETH token on the Polygon blockchain.
     * @param _newWethTokenAddress The new address of the WETH token on Polygon.
     */
    function updateWethTokenAddress(address _newWethTokenAddress) external onlyOwner {

        // Ensure the new WETH token address is not the zero address
        require(_newWethTokenAddress != address(0), "The token address can not be the zero address");

        //Ensure that the update transaction is not repeated for the same parameter, just as a good practice
        require(_newWethTokenAddress != wethTokenAddress, "WETH token address has already been modified to that value");

        // Update the WETH token address
        wethTokenAddress = _newWethTokenAddress;

        // Update the WETH token interface
        wethToken = WethTokenInterface(wethTokenAddress);

        // Emit an event to signal the updated WETH token address
        emit UpdatedWethTokenAddress(_newWethTokenAddress);
    }

    /**
     * @dev Function to update the address of the oracle that provides the WETH price feed.
     * @param _newWethPriceFeedAddress The new address of the WETH price feed oracle.
     */
    function updateWethPriceFeedAddress(address _newWethPriceFeedAddress) external onlyOwner {

        // Ensure the new WETH price feed address is not the zero address
        require(_newWethPriceFeedAddress != address(0), "The price data feed address can not be the zero address");

        //Ensure that the update transaction is not repeated for the same parameter, just as a good practice
        require(_newWethPriceFeedAddress != wethPriceFeedAddress, "WETH price feed address has already been modified to that value");

        //Temporary data feed to perform the validation of the data feed descriptions
        AggregatorV3Interface tempDataFeedWeth = AggregatorV3Interface(_newWethPriceFeedAddress);

        //Validate if the new address is actually a price feed address. Attempt to call the description function 
        try tempDataFeedWeth.description() returns (string memory descriptionValue) {

            //Get the hash value of the ETH/USD string
            bytes32 hashOfExpectedWethFeedDescription = keccak256(abi.encodePacked('ETH / USD'));

            //Get the hash value of the description of the price data feed
            bytes32 hashOfCurrentWethFeedDescription = keccak256(abi.encodePacked(descriptionValue));
            
            //Validate the data feed is actually the address of a ETH/USD oracle by comparing the hashes of the expected description and temporal description
            require(hashOfExpectedWethFeedDescription == hashOfCurrentWethFeedDescription, "The new address does not seem to belong to a ETH price data feed");
        
        } catch  {
            //In case there is an error obtaining the description of the data feed, revert the transaction
            revert("The new address does not seem to belong to a ETH price data feed");
        }

        // Update the WETH price feed address
        wethPriceFeedAddress = _newWethPriceFeedAddress;

        // Update the WETH price feed interface
        dataFeedWeth = AggregatorV3Interface(wethPriceFeedAddress);

        // Emit an event to signal the updated WETH price feed address
        emit UpdatedWethPriceFeedAddress(_newWethPriceFeedAddress);
    }


    /////////////ORACLE PRICE FEED FUNCTIONS//////////

    /**
     * @dev Function to get the current price of MATIC in USD.
     * @return The current price of MATIC in USD with 8 decimals.
     */
    function getCurrentMaticPrice() public view returns (uint256) {

        try dataFeedMatic.latestRoundData() returns (
            uint80 /*roundID*/, 
            int256 answer,
            uint /*startedAt*/,
            uint /*timeStamp*/,
            uint80 /*answeredInRound*/
        ) 
        {
            return uint256(answer);

        } catch  {
            revert("There was an error obtaining the MATIC price from the oracle");
        }
        
    }

    /**
     * @dev Function to get the current price of USDC in USD.
     * @return The current price of USDC in USD with 8 decimals.
     */
    function getCurrentUsdcPrice() public view returns (uint256) {

        try dataFeedUsdc.latestRoundData() returns (
            uint80 /*roundID*/, 
            int256 answer,
            uint /*startedAt*/,
            uint /*timeStamp*/,
            uint80 /*answeredInRound*/
        ) 
        {
            return uint256(answer);

        } catch  {
            revert("There was an error obtaining the USDC price from the oracle");
        }
    }

    /**
     * @dev Function to get the current price of USDT in USD.
     * @return The current price of USDT in USD with 8 decimals.
     */
    function getCurrentUsdtPrice() public view returns (uint256) {

        try dataFeedUsdt.latestRoundData() returns (
            uint80 /*roundID*/, 
            int256 answer,
            uint /*startedAt*/,
            uint /*timeStamp*/,
            uint80 /*answeredInRound*/
        ) 
        {
            return uint256(answer);

        } catch  {
            revert("There was an error obtaining the USDT price from the oracle");
        }
    }

    /**
     * @dev Function to get the current price of WBTC in USD.
     * @return The current price of WBTC in USD with 8 decimals.
     */
    function getCurrentWbtcPrice() public view returns (uint256) {
        
        try dataFeedWbtc.latestRoundData() returns (
            uint80 /*roundID*/, 
            int256 answer,
            uint /*startedAt*/,
            uint /*timeStamp*/,
            uint80 /*answeredInRound*/
        ) 
        {
            return uint256(answer);

        } catch  {
            revert("There was an error obtaining the WBTC price from the oracle");
        }
    }

    /**
     * @dev Function to get the current price of WETH in USD.
     * @return The current price of WETH in USD with 8 decimals.
     */
    function getCurrentWethPrice() public view returns (uint256) {

        try dataFeedWeth.latestRoundData() returns (
            uint80 /*roundID*/, 
            int256 answer,
            uint /*startedAt*/,
            uint /*timeStamp*/,
            uint80 /*answeredInRound*/
        ) 
        {
            return uint256(answer);

        } catch  {
            revert("There was an error obtaining the WETH price from the oracle");
        }
    }

    ////////////////// SMART REQUIRED FUNCTIONS //////////////////

    /**
     * @dev Pauses all functionalities of the contract.
     * Can only be called by the owner.
     */
    function pause() public onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpauses all functionalities of the contract.
     * Can only be called by the owner.
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     * @param newOwner The address of the new owner.
     */
    function transferOwnership(address newOwner) public virtual override onlyOwner {

        //Validate the new owner is not the zero address
        require(newOwner != address(0), "Ownable: new owner is the zero address");

        //Validate the new owner is not the same contract address, otherwise management of the smart contract will be lost
        require(newOwner != address(this), "Ownable: new owner can not be the same contract address");
        
        _transferOwnership(newOwner);
    }

    /**
     * @dev Receive function to be able to receive MATIC to pay for possible transaction gas in the future.
     */
    receive() external payable nonReentrant {
    }

}