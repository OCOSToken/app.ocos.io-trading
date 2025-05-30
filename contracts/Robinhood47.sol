// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Robinhood47 – BTC-backed OCOS Token Trade Contract
/// @notice Allows secure and transparent OCOS token swaps backed by real BTC reserves

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

interface IChainlinkOracle {
    function latestAnswer() external view returns (int256);
}

contract Robinhood47 {
    address public owner;
    IERC20 public wbtc;
    IERC20 public btcb;
    IERC20 public ocosToken;
    IChainlinkOracle public btcUsdOracle;

    string public constant btcReserveAddress = "bc1ql49ydapnjafl5t2cp9zqpjwe6pdgmxy98859v2";
    uint256 public totalOCOSDistributed;
    uint256 public ocosPriceInUSD = 25 * 1e18; // 1 OCOS = 25 USD

    event Swapped(
        address indexed user,
        string asset,
        uint256 btcAmount,
        uint256 ocosAmount,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(
        address _wbtc,
        address _btcb,
        address _ocosToken,
        address _btcUsdOracle
    ) {
        owner = msg.sender;
        wbtc = IERC20(_wbtc);
        btcb = IERC20(_btcb);
        ocosToken = IERC20(_ocosToken);
        btcUsdOracle = IChainlinkOracle(_btcUsdOracle);
    }

    function getBTCUSD() public view returns (uint256) {
        return uint256(btcUsdOracle.latestAnswer()); // 8 decimals
    }

    function calculateOCOS(uint256 btcAmount) public view returns (uint256) {
        uint256 price = getBTCUSD(); // USD per 1 BTC (8 decimals)
        uint256 usdValue = btcAmount * price / 1e8;
        uint256 ocosAmount = (usdValue * 1e18) / ocosPriceInUSD;
        return ocosAmount;
    }

    function swapWithWBTC(uint256 amount) external {
        require(wbtc.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        uint256 ocosAmount = calculateOCOS(amount);
        require(ocosToken.transfer(msg.sender, ocosAmount), "OCOS transfer failed");

        totalOCOSDistributed += ocosAmount;

        emit Swapped(msg.sender, "WBTC", amount, ocosAmount, block.timestamp);
    }

    function swapWithBTCB(uint256 amount) external {
        require(btcb.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        uint256 ocosAmount = calculateOCOS(amount);
        require(ocosToken.transfer(msg.sender, ocosAmount), "OCOS transfer failed");

        totalOCOSDistributed += ocosAmount;

        emit Swapped(msg.sender, "BTCB", amount, ocosAmount, block.timestamp);
    }

    function updatePrice(uint256 newPriceInUSD) external onlyOwner {
        ocosPriceInUSD = newPriceInUSD;
    }

    function updateOracle(address newOracle) external onlyOwner {
        btcUsdOracle = IChainlinkOracle(newOracle);
    }

    function recoverToken(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner, amount);
    }
}
