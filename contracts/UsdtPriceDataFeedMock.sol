// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract UsdtPriceDataFeedMock {

  uint80 roundID;
  int256 answer;
  uint startedAt;
  uint timeStamp;
  uint80 answeredInRound;
    
  constructor( ) {
      roundID = 36893488147419112426;
      answer = 100006000;
      startedAt = 1700083629;
      timeStamp = 1700083629;
      answeredInRound = 36893488147419112426;
  }

  function latestRoundData() public view
    returns (
      uint80 _roundId,
      int256 _answer,
      uint256 _startedAt,
      uint _updatedAt,
      uint80 _answeredInRound
    )
  {
    return (roundID, answer, startedAt, timeStamp, answeredInRound);
  }

  function setLatestRoundDataAnswer(int256 _answer) public {
    answer = _answer;
  }

  function description() external pure returns (string memory) {
    return 'USDT / USD';
  }
    
}