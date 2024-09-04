// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

/**
 * @dev Implementation based on the ERC-20 standard
 * Developer: Carlos Mario Alba Rodriguez
 */

 /**
 * @title ERC20TokenInterface
 * @dev Interface for interacting with the different tokens: USDC, USDT, WBTC and WETH
 */
interface ERC20TokenInterface {
    function transfer(address dst, uint wad) external returns (bool);
    function transferFrom(address src, address dst, uint wad) external returns (bool);
    function balanceOf(address guy) external view returns (uint);
}

/**
 * @title HYAX token over the Mumbai Network
 * @dev ERC20Pausable token with additional functionality.
 */
contract HYAXLocalUpgradeable is ERC20PausableUpgradeable, OwnableUpgradeable, ReentrancyGuardUpgradeable {

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
     * @dev Emitted when an investment is made using a crypto token.
     */
    event InvestFromCryptoToken(TokenType tokenType, address sender, uint256 tokenAmount, uint256 totalInvestmentInUsd, uint256 hyaxAmount);

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
     * @dev Mapping to store the data of the investors
     */
    struct InvestorData {
        bool isWhiteListed; // Whited investors approved after KYC.
        bool isQualifiedInvestor; //Track qualified investors.
        uint256 totalHyaxBoughtByInvestor; //Track the total amount of HYAX bought by each investor.
        uint256 totalUsdDepositedByInvestor; //Track the total amount of USD an investor has deposited to buy the HYAX token.
    }

    // Mapping to store investor data, indexed by their address 
    mapping(address => InvestorData) public investorData;

    // Enum defining the supported token types
    enum TokenType { MATIC, USDC, USDT, WBTC, WETH }

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
    ERC20TokenInterface public usdcToken;

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
    ERC20TokenInterface public usdtToken;

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
    ERC20TokenInterface public wbtcToken;

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
    ERC20TokenInterface public wethToken;


    ////////////////// SMART CONTRACT CONSTRUCTOR /////////////////

    /**
     * @dev Initializer function instead of constructor.
     * This function will initialize the contract's state variables and call initializers for inherited contracts.
     */
    function initialize() public initializer {
        // Initialize inherited contracts
        __ERC20_init("HYAXToken", "HYAX");
        __Ownable_init();
        __ReentrancyGuard_init();
        __Pausable_init();

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
        usdcToken = ERC20TokenInterface(usdcTokenAddress);

        // Address of USDT token on the blockchain
        usdtTokenAddress = 0x70e02Fb82B6BC04F64099689B0599e14B44D4fBb;

        // Address of USDT token price feed (Oracle) on the blockchain
        usdtPriceFeedAddress = 0x3aC23DcB4eCfcBd24579e1f34542524d0E4eDeA8;

        // Oracle on Amoy network for USDT/USD: https://amoy.polygonscan.com/address/0x3aC23DcB4eCfcBd24579e1f34542524d0E4eDeA8#readContract
        dataFeedUsdt = AggregatorV3Interface(usdtPriceFeedAddress);

        // Implementation of USDT token interface
        usdtToken = ERC20TokenInterface(usdtTokenAddress);

        // Address of WBTC token on the blockchain
        wbtcTokenAddress = 0x3C8df3C48B3884DA2ff25e17524282d60F9C3b93;

        // Address of WBTC token price feed (Oracle) on the blockchain
        wbtcPriceFeedAddress = 0xe7656e23fE8077D438aEfbec2fAbDf2D8e070C4f;

        // Oracle on Amoy network for WBTC/USD: https://amoy.polygonscan.com/address/0xe7656e23fE8077D438aEfbec2fAbDf2D8e070C4f#code
        dataFeedWbtc = AggregatorV3Interface(wbtcPriceFeedAddress);

        // Implementation of WBTC token interface
        wbtcToken = ERC20TokenInterface(wbtcTokenAddress);

        // Address of WETH token on the blockchain
        wethTokenAddress = 0x524a89ED77d5827320E35E12bCA96830C6b7960A;

        // Address of WETH token price feed (Oracle) on the blockchain
        wethPriceFeedAddress = 0xF0d50568e3A7e8259E16663972b11910F89BD8e7;

        // Oracle on Mumbai network for WETH/USD: https://amoy.polygonscan.com/address/0xF0d50568e3A7e8259E16663972b11910F89BD8e7#code
        dataFeedWeth = AggregatorV3Interface(wethPriceFeedAddress);

        // Implementation of WETH token interface
        wethToken = ERC20TokenInterface(wethTokenAddress);
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
        // Calculate the total investment in USD and divide by 10**8 (decimals in price feeds).
        totalInvestmentInUsd = (_amount * _currentCryptocurrencyPrice) / 10**8;
        
        // Calculate the amount of tokens to return given the current token price and multiply by 10**8 (same as dividing by hyaxPrice).
        totalHyaxTokenToReturn = (totalInvestmentInUsd * 10**8) / hyaxPrice;
        
        // Validate that the amount to invest is equal or greater than the minimum investment established in USD.
        require(totalInvestmentInUsd >= minimumInvestmentAllowedInUSD, "The amount to invest must be greater than the minimum established");

        // Validate that the amount of HYAX tokens to offer to the investor is equal or less than the amount available in the smart contract.
        require(totalHyaxTokenToReturn <= balanceOf(address(this)), "The investment made returns an amount of HYAX greater than the available");

        return (totalInvestmentInUsd, totalHyaxTokenToReturn);
    }

    /**
     * @dev Function to add an investor's address to the whitelist.
     * @param _investorAddress The address of the investor to be added to the whitelist.
     */
    function addToWhiteList(address _investorAddress) external onlyOwnerOrWhitelister {

        // Ensure that the investor address to add is not the zero address
        require(_investorAddress != address(0), "Investor address to add to the white list cannot be the zero address");
        
        // Ensure that the investor address has not already been added to the white list
        require(!investorData[_investorAddress].isWhiteListed, "That investor address has already been added to the white list");
        
        // Create a new InvestorData struct
        InvestorData memory newInvestorData;

        newInvestorData.isWhiteListed = true; // Mark the investor as whitelisted
        newInvestorData.isQualifiedInvestor = false; // Initially, the investor is not a qualified investor
        newInvestorData.totalHyaxBoughtByInvestor = 0; // Initialize the total HYAX bought to zero
        newInvestorData.totalUsdDepositedByInvestor = 0; // Initialize the total USD deposited to zero

        // Add the investor data to the mapping using the investor's address as the key
        investorData[_investorAddress] = newInvestorData;
        
        emit InvestorAddedToWhiteList(msg.sender, _investorAddress);
    }

    /**
     * @dev Function to remove an investor's address from the whitelist.
     * @param _investorAddress The address of the investor to be removed from the whitelist.
     */
    function removeFromWhiteList(address _investorAddress) external onlyOwnerOrWhitelister {

        // Ensure that the investor address to remove is not the zero address
        require(_investorAddress != address(0), "Investor address to remove from the white list cannot be the zero address");

        // Ensure that the investor address is registered on the white list
        require(investorData[_investorAddress].isWhiteListed, "That investor address is not registered on the white list");

        // Remove the investor address from the white list and emit the event
        investorData[_investorAddress].isWhiteListed = false;
      
        emit InvestorRemovedFromWhiteList(msg.sender, _investorAddress);
    }

    modifier investorIsOnWhiteList {

        // Ensure that the sender's address is on the white list
        require(investorData[msg.sender].isWhiteListed, "Investor address has not been added to the white list");
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
        require(_qualifiedInvestorAddress != address(0), "Investor address to add to the qualified investor list cannot be the zero address");

        // Ensure that the investor address to add is already in the white list of investors
        require(investorData[_qualifiedInvestorAddress].isWhiteListed, "Investor address must be first added to the investor white list");
   
        // Ensure that the investor address has not already been added to the qualified investor list
        require(!investorData[_qualifiedInvestorAddress].isQualifiedInvestor, "That investor address has already been added to the qualified investor list");
        
        // Add the investor address to the qualified investor list
        investorData[_qualifiedInvestorAddress].isQualifiedInvestor = true;
       
        // Emit the event of investor added to the qualified investor list
        emit InvestorAddedToQualifiedInvestorList(msg.sender, _qualifiedInvestorAddress);
    }

    /**
     * @dev Function to remove an investor's address from the list of qualified investors.
     * @param _qualifiedInvestorAddress The address of the investor to be removed from the qualified investor list.
     */
    function removeFromQualifiedInvestorList(address _qualifiedInvestorAddress) external onlyOwnerOrWhitelister {

        // Ensure that the investor address to remove is not the zero address
        require(_qualifiedInvestorAddress != address(0), "Investor address to remove from the qualified investor list cannot be the zero address");

        // Ensure that the investor address is registered on the qualified investor list
        require(investorData[_qualifiedInvestorAddress].isQualifiedInvestor, "That investor address is not registered on the qualified investor list");

        // Remove the investor address from the qualified investor list
        investorData[_qualifiedInvestorAddress].isQualifiedInvestor = false; 
        
        // Emit the event of investor removed from the qualified investor list
        emit InvestorRemovedFromQualifiedInvestorList(msg.sender, _qualifiedInvestorAddress);
    }

    /**
     * @dev Function to issue HYAX tokens as required.
     * @param _amount The amount of HYAX tokens to issue.
     */
    function tokenIssuance(uint256 _amount) public onlyOwner nonReentrant {
            
        // Ensure that the amount to issue in this execution is at least 1 token
        require(_amount >= 10 ** decimals(), "Amount of HYAX tokens to issue must be at least 1 token");
            
        // Ensure that the amount to issue in this execution is maximum 1000 M tokens
        require(_amount <= 1000000000 * 10 ** decimals(), "Amount of HYAX tokens to issue at a time must be maximum 1000 M");
            
        // Validate the amount to issue doesn't go beyond the established total supply
        require(totalSupply() + _amount <= 10000000000 * 10 ** decimals(), "Amount of HYAX tokens to issue surpases the 10,000 M tokens");

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
        uint256 newTotalAmountInvestedInUSD = _totalInvestmentInUsd + investorData[_investorAddress].totalUsdDepositedByInvestor;
       
        // If the amount to buy in USD is greater than the maximum established, then validate if the investor is qualified
        if (newTotalAmountInvestedInUSD > maximumInvestmentAllowedInUSD) {

            require(investorData[_investorAddress].isQualifiedInvestor, "To buy that amount of HYAX its required to be a qualified investor");
        }
    }

    /////////////INVESTING FUNCTIONS//////////

    /**
     * @dev Function allowing an investor on the whitelist to invest using MATIC.
     * @notice The function is payable, and MATIC is automatically transferred to this contract with the payable tag.
     * @return A boolean indicating the success of the investment and HYAX token transfer.
    */
    function investFromMatic() external investorIsOnWhiteList payable nonReentrant returns (bool){

        // Transfer MATIC to this contract. Its automatically done with the payable tag

        // Calculate total HYAX to return while validating minimum investment and if there are HYAX tokens left to sell
        (uint256 totalInvestmentInUsd, uint256 totalHyaxTokenToReturn) = calculateTotalHyaxTokenToReturn(msg.value, this.getCurrentTokenPrice(TokenType.MATIC));

        // If the amount of HYAX to buy is greater than the maximum established, then validate if the investor is qualified
        validateMaximumInvestedAmountAndInvestorLimit(totalInvestmentInUsd, msg.sender);

        // Transfer MATIC to the treasury address
        require(payable(treasuryAddress).send(msg.value), "There was an error on sending the MATIC investment to the treasury");

        // Transfer HYAX token to the investor wallet
        require(this.transfer(msg.sender, totalHyaxTokenToReturn), "There was an error on sending back the HYAX Token to the investor");

        // Update the total amount of USD that an investor has deposited
        investorData[msg.sender].totalUsdDepositedByInvestor += totalInvestmentInUsd;
        
        // Update the total amount of HYAX that an investor has bought
        investorData[msg.sender].totalHyaxBoughtByInvestor += totalHyaxTokenToReturn;

        // Emit the event of successful investment
        emit InvestFromMatic(msg.sender, msg.value, totalInvestmentInUsd, totalHyaxTokenToReturn);

        return true;
    }

    /**
    * @dev Function to allow an investor on the whitelist to invest using a specified cryptocurrency.
    *
    * @param tokenType The type of cryptocurrency to invest with.
    * @param _amount The amount of the cryptocurrency to invest.
    * @return A boolean indicating the success of the investment and HYAX token transfer.
    */
    function investFromCryptoToken(TokenType tokenType, uint256 _amount) external investorIsOnWhiteList nonReentrant returns (bool) {
        // Get the token contract and price function based on the token type
        ERC20TokenInterface token;
        uint256 currentTokenPrice;

        if (tokenType == TokenType.USDC) {
            token = usdcToken;
            currentTokenPrice = this.getCurrentTokenPrice(tokenType);
        } else if (tokenType == TokenType.USDT) {
            token = usdtToken;
            currentTokenPrice = this.getCurrentTokenPrice(tokenType);
        } else if (tokenType == TokenType.WBTC) {
            token = wbtcToken;
            currentTokenPrice = this.getCurrentTokenPrice(tokenType);
        } else if (tokenType == TokenType.WETH) {
            token = wethToken;
            currentTokenPrice = this.getCurrentTokenPrice(tokenType);
        } else {
            revert("Invalid token type");
        }

        // Calculate total HYAX to return while validating minimum investment and if there are HYAX tokens left to sell
        (uint256 totalInvestmentInUsd, uint256 totalHyaxTokenToReturn) = calculateTotalHyaxTokenToReturn(_amount, currentTokenPrice);

        // If the amount of HYAX to buy is greater than the maximum established, then validate if the investor is qualified
        validateMaximumInvestedAmountAndInvestorLimit(totalInvestmentInUsd, msg.sender);

        // Transfer the specified token to this contract
        require(token.transferFrom(msg.sender, address(this), _amount), "There was an error on receiving the token investment");

        // Transfer the token to the treasury address
        require(token.transfer(payable(treasuryAddress), _amount), "There was an error on sending the token investment to the treasury");

        // Transfer HYAX token to the investor wallet
        require(this.transfer(msg.sender, totalHyaxTokenToReturn), "There was an error on sending back the HYAX Token to the investor");

        // Update the total amount of USD that an investor has deposited
        investorData[msg.sender].totalUsdDepositedByInvestor += totalInvestmentInUsd;

        // Update the total amount of HYAX that an investor has bought
        investorData[msg.sender].totalHyaxBoughtByInvestor += totalHyaxTokenToReturn;

        // Emit the event of successful investment
        emit InvestFromCryptoToken(tokenType, msg.sender, _amount, totalInvestmentInUsd, totalHyaxTokenToReturn);

        return true;
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
        require(_newWhiteListerAddress != address(0), "The white lister address cannot be the zero address");
        
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
        require(_newTreasuryAddress != address(0), "The treasury address cannot be the zero address");

        //Ensure that the update transaction is not repeated for the same parameter, just as a good practice
        require(_newTreasuryAddress != treasuryAddress, "Treasury address has already been modified to that value");

        // Update the treasury address
        treasuryAddress = _newTreasuryAddress;

        // Emit an event to signal the updated treasury address
        emit UpdatedTreasuryAddress(_newTreasuryAddress);
    }

    /**
     * @dev Function to update the address of the crypto token on the blockchain.
     * @param newTokenAddress The new address of the token on the blockchain.
     */
    function updateTokenAddress(TokenType tokenType, address newTokenAddress) external onlyOwner {
        // Ensure the new token address is not the zero address
        require(newTokenAddress != address(0), "The token address cannot be the zero address");

        // Check and update addresses based on token type
        if (tokenType == TokenType.USDC) {
            require(newTokenAddress != usdcTokenAddress, "USDC token address has already been modified to that value");
            usdcTokenAddress = newTokenAddress;
            usdcToken = ERC20TokenInterface(newTokenAddress);
            emit UpdatedUsdcTokenAddress(newTokenAddress);
        } else if (tokenType == TokenType.USDT) {
            require(newTokenAddress != usdtTokenAddress, "USDT token address has already been modified to that value");
            usdtTokenAddress = newTokenAddress;
            usdtToken = ERC20TokenInterface(newTokenAddress);
            emit UpdatedUsdtTokenAddress(newTokenAddress);
        } else if (tokenType == TokenType.WBTC) {
            require(newTokenAddress != wbtcTokenAddress, "WBTC token address has already been modified to that value");
            wbtcTokenAddress = newTokenAddress;
            wbtcToken = ERC20TokenInterface(newTokenAddress);
            emit UpdatedWbtcTokenAddress(newTokenAddress);
        } else if (tokenType == TokenType.WETH) {
            require(newTokenAddress != wethTokenAddress, "WETH token address has already been modified to that value");
            wethTokenAddress = newTokenAddress;
            wethToken = ERC20TokenInterface(newTokenAddress);
            emit UpdatedWethTokenAddress(newTokenAddress);
        } else {
            revert("Invalid token type");
        }
    }

    /*
     * @dev Function to update the address of the oracle that provides the Token price feed.
     * @param newPriceFeedAddress The new address of the Token price feed oracle.
     */
    function updatePriceFeedAddress(TokenType tokenType, address newPriceFeedAddress) external onlyOwner {
        // Ensure the new price feed address is not the zero address
        require(newPriceFeedAddress != address(0), "The price data feed address cannot be the zero address");

        //Temporary data feed to perform the validation of the data feed descriptions
        AggregatorV3Interface tempDataFeed = AggregatorV3Interface(newPriceFeedAddress);
   
        //Store the hash value of the expected TOKEN/USD string
        bytes32 hashOfExpectedDescription;

        //Store the hash value of the current TOKEN/USD string
        bytes32 hashOfCurrentDescription;

        //Ensure that the update transaction is not repeated for the same parameter, just as a good practice
        if (tokenType == TokenType.MATIC) {
            require(newPriceFeedAddress != maticPriceFeedAddress, "MATIC price feed address has already been modified to that value");
            hashOfExpectedDescription = keccak256(abi.encodePacked('MATIC / USD'));
        } else if (tokenType == TokenType.USDC) {
            require(newPriceFeedAddress != usdcPriceFeedAddress, "USDC price feed address has already been modified to that value");
            hashOfExpectedDescription = keccak256(abi.encodePacked('USDC / USD'));
        } else if (tokenType == TokenType.USDT) {
            require(newPriceFeedAddress != usdtPriceFeedAddress, "USDT price feed address has already been modified to that value");
            hashOfExpectedDescription = keccak256(abi.encodePacked('USDT / USD'));
        } else if (tokenType == TokenType.WBTC) {
            require(newPriceFeedAddress != wbtcPriceFeedAddress, "WBTC price feed address has already been modified to that value");
            hashOfExpectedDescription = keccak256(abi.encodePacked('WBTC / USD'));
        } else if (tokenType == TokenType.WETH) {
            require(newPriceFeedAddress != wethPriceFeedAddress, "WETH price feed address has already been modified to that value");
            hashOfExpectedDescription = keccak256(abi.encodePacked('ETH / USD'));
        } else {
            revert("Invalid token type");
        }

        //Validate the data feed is actually the address of a TOKEN/USD oracle by comparing the hashes of the expected description and temporal description
        try tempDataFeed.description() returns (string memory descriptionValue) {
            hashOfCurrentDescription = keccak256(abi.encodePacked(descriptionValue));
            require(hashOfExpectedDescription == hashOfCurrentDescription, "The new address does not seem to belong to the correct price data feed");
        } catch {
            revert("The new address does not seem to belong to the correct price data feed");
        }

        // Update the price feed address and interface based on the token type
        if (tokenType == TokenType.MATIC) {
            maticPriceFeedAddress = newPriceFeedAddress;
            dataFeedMatic = AggregatorV3Interface(maticPriceFeedAddress);
            emit UpdatedMaticPriceFeedAddress(newPriceFeedAddress);
        } else if (tokenType == TokenType.USDC) {
            usdcPriceFeedAddress = newPriceFeedAddress;
            dataFeedUsdc = AggregatorV3Interface(usdcPriceFeedAddress);
            emit UpdatedUsdcPriceFeedAddress(newPriceFeedAddress);
        } else if (tokenType == TokenType.USDT) {
            usdtPriceFeedAddress = newPriceFeedAddress;
            dataFeedUsdt = AggregatorV3Interface(usdtPriceFeedAddress);
            emit UpdatedUsdtPriceFeedAddress(newPriceFeedAddress);
        } else if (tokenType == TokenType.WBTC) {
            wbtcPriceFeedAddress = newPriceFeedAddress;
            dataFeedWbtc = AggregatorV3Interface(wbtcPriceFeedAddress);
            emit UpdatedWbtcPriceFeedAddress(newPriceFeedAddress);
        } else if (tokenType == TokenType.WETH) {
            wethPriceFeedAddress = newPriceFeedAddress;
            dataFeedWeth = AggregatorV3Interface(wethPriceFeedAddress);
            emit UpdatedWethPriceFeedAddress(newPriceFeedAddress);
        }
    }

    /////////////ORACLE PRICE FEED FUNCTIONS//////////
    /**
     * @dev Function to get the current price of the token in USD.
     * @return The current price of the token in USD with 8 decimals.
     */
    function getCurrentTokenPrice(TokenType tokenType) public view returns (uint256) {

        AggregatorV3Interface dataFeed;

        if (tokenType == TokenType.MATIC) {
            dataFeed = dataFeedMatic;
        } else if (tokenType == TokenType.USDC) {
            dataFeed = dataFeedUsdc;
        } else if (tokenType == TokenType.USDT) {
            dataFeed = dataFeedUsdt;
        } else if (tokenType == TokenType.WBTC) {
            dataFeed = dataFeedWbtc;
        } else if (tokenType == TokenType.WETH) {
            dataFeed = dataFeedWeth;
        } else {
            revert("Invalid token type");
        }

        try dataFeed.latestRoundData() returns (
            uint80 /*roundID*/,
            int256 answer,
            uint /*startedAt*/,
            uint /*timeStamp*/,
            uint80 /*answeredInRound*/
        ) {
            return uint256(answer);
        } catch {
            revert("There was an error obtaining the price from the oracle");
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
        require(newOwner != address(this), "Ownable: new owner cannot be the same contract address");
        
        _transferOwnership(newOwner);
    }

    /**
     * @dev Receive function to be able to receive MATIC to pay for possible transaction gas in the future.
     */
    receive() external payable nonReentrant {
    }
}