// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./erc20/SafeERC20.sol";
import "./access/Ownable.sol";
import "./interface/IERC20.sol";
import "./interface/IBridge.sol";

contract CarbonWrapper is Ownable {

    using SafeERC20 for IERC20;

    address public l1_Token;            /// L1 Token address 
    address public l1_Bridge;           /// L1 Bridge address (0xE87d317eB8dcc9afE24d9f63D6C760e52Bc18A40)
    address public l2_TokenPair;        /// L2 WrappedCarbon contract address deployed on L1

    /// @dev Constructor info
    /// @param _token L1 Token address
    /// @param _l1Bridge L1 Bridge address (Goerli testnet)
    constructor(address _token, address payable _l1Bridge) {
        require(_token != address(0), "Token address cannot be zero!");
        require(_l1Bridge != address(0), "L1 Bridge address cannot be zero!");
        l1_Token = _token;
        l1_Bridge = _l1Bridge;
    }

    /// @dev Send To L2 
    /// @param recipient Recipient wallet address on L2
    /// @param _fee Fee required for the bridge (0.01 ETH - min _fee value = 10000000000000000 wei)
    /// @param _deadline Final processing time (min _deadline value = block.timestamp + 7 days)
    /// @param amount Number of Tokens to be sent that have been previously Approve
    function sendToL2(address recipient, uint256 _fee, uint256 _deadline, uint256 amount) external payable {
        require(amount > 0, "L1 Bridge: Must transfer a non-zero amount");
        _transferToBridge(msg.sender, amount);
        uint256 _value = msg.value;
        (bool success, ) = l1_Bridge.call{value: _value}(
            abi.encodeWithSignature("dispatchMessage(address,uint256,uint256,bytes)", l2_TokenPair, _fee, _deadline, 
            abi.encodeWithSignature("receiveFromL1(address,uint256)", recipient, amount))
        );
        require(success,"Send to L2 Failed!");
    }

    /// @dev sendToL2 internal function
    function _transferToBridge(address from, uint256 amount) internal {
        IERC20(l1_Token).safeTransferFrom(from, address(this), amount);
    }

    /// @dev Bridge Transfer function used in <sendToL1> function in WrappedCarbon contract
    function transferFromBridge(address recipient, uint256 amount) external payable {
        require(IBridge(l1_Bridge).sender() == l2_TokenPair, "Unexpected token");
        require(msg.sender == l1_Bridge, "Unexpected sender");
        IERC20(l1_Token).safeTransfer(recipient, amount);
    }

    /// @dev Update L1 ERC20 token address
    function setPeggedToken(address _token) external onlyOwner {    
        l1_Token = _token;
    }

    /// @dev Update L2 WrappedCarbon contract address
    function setL2TokenPair(address _token) external onlyOwner {
        l2_TokenPair = _token;
    }

    /// @dev Update L1 Bridge contract address
    function setL1Bridge(address payable _bridge) external onlyOwner {
        l1_Bridge = _bridge;
    }

    /// @dev External Functions
    /// @notice This is important functions
    function Withdraw(uint256 amount) public onlyOwner {
        safeTransferCurrency(owner(), amount);
    }

    /// @dev Contract Balance
    function getContractBalance() public view returns(uint256) {
        return address(this).balance;
    }    

    /// @dev Transfer balance
    function TransferERC20(address tokenAddress, uint256 amount) external onlyOwner returns(bool) {
        return IERC20(tokenAddress).transfer(owner(), amount);
    }   

    /// @dev Currency Transfer
    function safeTransferCurrency(address to, uint256 value) internal {
        require(to != address(0), "Address cannot be Zero!");
        require(value > 0, "Amount cannot be Zero!");
        (bool success, ) = to.call{value: value}(new bytes(0));
        require(success);
    }    
    
    fallback() external payable {}

    receive() external payable {}
}
