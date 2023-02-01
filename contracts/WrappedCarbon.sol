// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./erc20/ERC20.sol";
import "./interface/IBridge.sol";

contract WrappedCarbon is ERC20 {

    uint constant _initialSupply = 0;       /// ERC20 Total Supply
    address public carbonWrapper;           /// CarbonWrapper contract on L1
    address public l2_Bridge;               /// L2 Bridge address (0xA59477f7742Ba7d51bb1E487a8540aB339d6801d)

    /// @dev Constructor info
    /// @param _l2Bridge L2 Bridge address (zkEVM testnet)
    /// @param _name ERC20 token name
    /// @param _symbol ERC20 token symbol
    constructor(address _l2Bridge, string memory _name, string memory _symbol) ERC20(_name, _symbol) {
        require(_l2Bridge != address(0), "L2 Bridge address cannot be zero!");
        l2_Bridge = _l2Bridge;
    }

    /// @dev Send To L1 
    /// @param recipient Recipient wallet address on L1
    /// @param _fee Fee required for the bridge (0.01 ETH - min _fee value = 10000000000000000 wei)
    /// @param _deadline Final processing time (min _deadline value = block.timestamp + 7 days)
    /// @param amount Number of Tokens to be sent that have been previously Approve    
    function sendToL1(address recipient, uint256 _fee, uint256 _deadline, uint256 amount) external payable {
        require(amount > 0, "L2 Bridge: Must transfer a non-zero amount");
        _burn(msg.sender, amount);
        uint256 _value = msg.value;
        (bool success,) = l2_Bridge.call{value: _value}(
            abi.encodeWithSignature("dispatchMessage(address,uint256,uint256,bytes)", carbonWrapper, _fee, _deadline, 
            abi.encodeWithSignature("transferFromBridge(address,uint256)", recipient, amount))
        );
        require(success,"Send to L1 Failed!");
    }

    /// @dev Bridge Transfer function used in <sendToL2> function in CarbonWrapper contract
    function receiveFromL1(address recipient, uint256 _amount) external payable {
        require(IBridge(l2_Bridge).sender() == carbonWrapper, "Unexpected token");
        require(msg.sender == l2_Bridge, "Unexpected sender");
        _mint(recipient, _amount);
    }

    /// @dev Update carbonWrapper (on L1) contract address
    function setCarbonWrapper(address _carbonWrapper) external onlyOwner {
        carbonWrapper = _carbonWrapper;
    }

    /// @dev Update L2 Bridge contract address    
    function setL2Bridge(address _bridge) external onlyOwner {
        l2_Bridge = _bridge;
    }
    
    /// @dev ERC20 decimals
    function decimals() public view virtual override returns (uint8) {
        return 6;
    }

    /// @dev Control Functions (from only test)
    function bridgeSender() public view returns(address) {
        return IBridge(l2_Bridge).sender();
    }

    function standartSender() public view returns(address) {
        return msg.sender;
    }
    /// @dev Control Functions end.

    fallback() external payable {
        require(false, "fallback");
    }

    receive() external payable {
        require(false, "receive");
    }
}
