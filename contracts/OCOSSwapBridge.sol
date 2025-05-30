// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title OCOSSwapBridge
/// @notice Enables BTC-backed swap for OCOS using WBTC and BTCB reserves

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address owner) external view returns (uint256);
}

interface IChainlinkOracle {
    function latestAnswer() external view returns (int256);
}

contract OCOSSwapBridge {
    address public owner;
    IERC20 public wbtc;
    IERC20 public btcb;
    IERC20 public ocosToken;

    IChainlinkOracle public btcUsdPriceFeed;

    uint8 public decimals = 8;
    uint256 public totalSwapped;

    event OCOSSwapped(address indexed user, uint256 btcAmount, uint256 ocosAmount, string asset, uint256 timestamp);

    constructor(
        address _wbtc,
        address _btcb,
        address _ocosToken,
        address _btcUsdPriceFeed
    ) {
        owner = msg.sender;
        wbtc = IERC20(_wbtc);
        btcb = IERC20(_btcb);
        ocosToken = IERC20(_ocosToken);
        btcUsdPriceFeed = IChainlinkOracle(_btcUsdPriceFeed);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    function getBTCUSDPrice() public view returns (uint256) {
        return uint256(btcUsdPriceFeed.latestAnswer()); // Price in 8 decimals
    }

    function swapWithWBTC(uint256 amount) external {
        require(wbtc.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        uint256 ocosAmount = calculateOCOSAmount(amount);
        require(ocosToken.transfer(msg.sender, ocosAmount), "OCOS transfer failed");
        totalSwapped += ocosAmount;
        emit OCOSSwapped(msg.sender, amount, ocosAmount, "WBTC", block.timestamp);
    }

    function swapWithBTCB(uint256 amount) external {
        require(btcb.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        uint256 ocosAmount = calculateOCOSAmount(amount);
        require(ocosToken.transfer(msg.sender, ocosAmount), "OCOS transfer failed");
        totalSwapped += ocosAmount;
        emit OCOSSwapped(msg.sender, amount, ocosAmount, "BTCB", block.timestamp);
    }

    function calculateOCOSAmount(uint256 btcAmount) public view returns (uint256) {
        uint256 btcPrice = getBTCUSDPrice(); // returns in 8 decimals
        uint256 ocosPerUSD = 25 * 10 ** 18; // Example fixed price: 1 OCOS = $25
        uint256 usdValue = btcAmount * btcPrice / 1e8;
        return usdValue * 1e18 / ocosPerUSD;
    }

    function recoverTokens(address tokenAddress, uint256 amount) external onlyOwner {
        IERC20(tokenAddress).transfer(owner, amount);
    }

    function updatePriceFeed(address newFeed) external onlyOwner {
        btcUsdPriceFeed = IChainlinkOracle(newFeed);
    }
}
