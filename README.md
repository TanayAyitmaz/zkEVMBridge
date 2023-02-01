# zkEVMBridge
ERC20 Token Transfer using zkEVM Bridge from L1 to L2 and L2 to L1

English: 

/1/
Step 1: Deploy the "ERC20" contract and run the "mint" function. (example: 10000000000000000000000 wei = 1,000,000 tokens)
Constructor parameters
_name: ERC20 token name (example = CarbonToken)
_symbol: ERC20 token symbol (example = CARBON)

/2/
Step 2: The "CarbonWrapper" contract is deployed. 
Constructor parameters;
_token: ERC20 contract address (deployed in step 1)
_l1Bridge: Goerli L1 Bridge Address (0xE87d317eB8dcc9afE24d9f63D6C760e52Bc18A40)

The above operations should be done on the "Goerli testnet".

/3/
Step 3: The WrappedCarbon contract is deployed on the "zkEVM testnet".

Constructor parameters;
_l2Bridge : ZkEVM L2 Bridge Address (0xA59477f7742Ba7d51bb1E487a8540aB339d6801d)
_name : ERC20 Token name (example = wCarbonToken)
_symbol: ERC20 Token symbol (example = wCARBON)
setCarbonWrapper function is executed and "carbonWrapper" (step 2 contract address) contract address is defined.

/4/
Step 4: The contract address of the WrappedCarbon (in step 3) is defined by running the "setL2TokenPair" function in the "CarbonWrapper" contract.

/5/
Step 5: Approve is given from the "ERC20" token contract to the "CarbonWrapper" contract. (example: 10000000000000000000000 wei = 10,000 tokens)

/6/ 
Step 6: To transfer tokens from "Goerli" to "zkEVM", run the "sendToL2" function in the "CarbonWrapper" contract.
    @param1 recipient: Recipient wallet address on L2 (same wallet address)
    @param2 _fee: Fee required for the bridge (0.01 ETH - min _fee value = 10000000000000000 wei)
    @param3 _deadline: Final processing time (min _deadline value = block.timestamp + 7 days)
    @param4 amount: Number of Tokens to be sent that have been previously Approve

