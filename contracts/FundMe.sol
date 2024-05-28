// SPDX-License-Identifier: MIT

// 1. Pragma
pragma solidity ^0.8.8;

// 2. Import Statements
import '@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol';
import './PriceConverter.sol';

// 3. Events

// 4. Errors
error FundMe__NotOwner();

// 5. Interfaces

// 6. Libraries

// 7. Contracts

/// @title A contract for crowd funding
/// @author Cyberlaw
/// @notice This contract is to demo a sample funding contract
/// @dev This implements price feeds as our library
contract FundMe {
    // Order in Contract
    // 1. Type declarations
    // 2. State variables
    // 3. Events
    // 4. Errors
    // 5. Modifiers
    // 6. Functions

    // 1. Type declarations
    using PriceConverter for uint256;

    // 2. State variables
    mapping(address => uint256) private s_addressToAmountFunded;
    address[] private s_funders;
    // Could we make this constant?  /* hint: no! We should make it immutable! */
    address private immutable i_owner;
    uint256 public constant MINIMUM_USD = 3600 * 10 ** 18; //1 ETH = 3672 USD 05-24-2024
    uint256 public s_lastFund;
    AggregatorV3Interface private s_priceFeed;

    // 3. Events

    // 4. Errors

    // 5. Modifiers
    modifier onlyOwner() {
        // require(msg.sender == owner);
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }

    // Functions

    // Order of Functions
    // 1. constructor
    // 2. receive function
    // 3. fallback function
    // 4. external function
    // 5. public function
    // 6. internal function
    // 7. private function

    // 1. constructor
    constructor(address ethUsdPriceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(ethUsdPriceFeedAddress);
    }

    // 2. receive function
    receive() external payable {
        fund();
    }

    // 3. fallback function
    fallback() external payable {
        fund();
    }

    // 4. external function

    // 5. public function
    function hello() public pure returns (string memory) {
        return 'hello world';
    }

    function fund() public payable {
        require(
            PriceConverter.getConversionRate(msg.value, s_priceFeed) >=
                MINIMUM_USD,
            'You need to spend more ETH!'
        );
        s_addressToAmountFunded[msg.sender] += msg.value;
        s_funders.push(msg.sender);
        s_lastFund = msg.value;
    }

    function withdraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        // // transfer
        // payable(msg.sender).transfer(address(this).balance);
        // // send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed");
        // call
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }('');
        require(callSuccess, 'Call failed');
    }

    function cheaperWithdraw() public onlyOwner {
        address[] memory funders = s_funders;
        // mappings can't be in memory, sorry!
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        // what does this line mean?
        (bool success, ) = i_owner.call{value: address(this).balance}('');
        require(success);
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }

    function fundByAddress(
        address senderAddress
    ) public view returns (uint256) {
        return s_addressToAmountFunded[senderAddress];
    }

    function getLastFund() public view returns (uint256) {
        return s_lastFund;
    }

    function getEthPrice() public view returns (uint256) {
        return PriceConverter.getPrice(s_priceFeed);
    }

    function getFunders() public view returns (address[] memory) {
        return s_funders;
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFundByAddress(
        address funderAddress
    ) public view returns (uint256) {
        return s_addressToAmountFunded[funderAddress];
    }

    // 7. internal function

    // 8. private function
}

// Solidity Style Guide
// Order of Layout
// 1. Pragma Statements
// 2. Import Statements
// 3. Events
// 4. Errors
// 5. Interfaces
// 6. Libraries
// 7. Contracts
