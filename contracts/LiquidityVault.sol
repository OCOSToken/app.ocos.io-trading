// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/// @title OCOS Liquidity Vault
/// @notice Allows users to stake OCOS tokens and earn reward over time

contract LiquidityVault {
    IERC20 public ocosToken;
    address public owner;
    uint256 public rewardRatePerSecond; // in OCOS wei per second
    uint256 public minLockPeriod = 7 days;

    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
        uint256 claimedReward;
    }

    mapping(address => StakeInfo) public stakes;

    event Staked(address indexed user, uint256 amount, uint256 time);
    event Withdrawn(address indexed user, uint256 amount, uint256 reward);
    event RewardRateUpdated(uint256 newRate);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(address _ocosToken, uint256 _rewardRatePerSecond) {
        ocosToken = IERC20(_ocosToken);
        owner = msg.sender;
        rewardRatePerSecond = _rewardRatePerSecond;
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        require(ocosToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        StakeInfo storage userStake = stakes[msg.sender];
        if (userStake.amount > 0) {
            uint256 reward = getPendingReward(msg.sender);
            userStake.claimedReward += reward;
        }

        userStake.amount += amount;
        userStake.startTime = block.timestamp;

        emit Staked(msg.sender, amount, block.timestamp);
    }

    function withdraw() external {
        StakeInfo storage userStake = stakes[msg.sender];
        require(userStake.amount > 0, "Nothing to withdraw");
        require(block.timestamp >= userStake.startTime + minLockPeriod, "Tokens are still locked");

        uint256 reward = getPendingReward(msg.sender);
        uint256 totalReward = reward + userStake.claimedReward;
        uint256 principal = userStake.amount;

        userStake.amount = 0;
        userStake.claimedReward = 0;

        require(ocosToken.transfer(msg.sender, principal + totalReward), "Transfer failed");
        emit Withdrawn(msg.sender, principal, totalReward);
    }

    function getPendingReward(address user) public view returns (uint256) {
        StakeInfo storage s = stakes[user];
        if (s.amount == 0) return 0;
        uint256 duration = block.timestamp - s.startTime;
        return (s.amount * rewardRatePerSecond * duration) / 1e18;
    }

    function updateRewardRate(uint256 newRate) external onlyOwner {
        rewardRatePerSecond = newRate;
        emit RewardRateUpdated(newRate);
    }

    function updateLockPeriod(uint256 newPeriod) external onlyOwner {
        minLockPeriod = newPeriod;
    }

    function recoverTokens(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner, amount);
    }
}
