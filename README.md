# zkEVMBridge
ERC20 Token Transfer using zkEVM Bridge from L1 to L2 and L2 to L1

**English:**

Step 1: Deploy the **ERC20** contract and run the "mint" function. *(example: 10000000000000000000000 wei = 1,000,000 tokens)*<br/>
    **Constructor parameters;**<br/>
    _name: ERC20 token name *(example = CarbonToken)*<br/>
    _symbol: ERC20 token symbol *(example = CARBON)*<br/>

Step 2: The **CarbonWrapper** contract is deployed. <br/>
    **Constructor parameters;**<br/>
    _token: ERC20 contract address *(deployed in step 1)*<br/>
    _l1Bridge: Goerli L1 Bridge Address (0xE87d317eB8dcc9afE24d9f63D6C760e52Bc18A40)<br/>

The above operations should be done on the **Goerli testnet**

Step 3: The WrappedCarbon contract is deployed on the **zkEVM testnet**<br/>
    **Constructor parameters;**<br/>
    _l2Bridge : ZkEVM L2 Bridge Address (0xA59477f7742Ba7d51bb1E487a8540aB339d6801d)<br/>
    _name : ERC20 Token name *(example = wCarbonToken)*<br/>
    _symbol: ERC20 Token symbol *(example = wCARBON)*<br/>
setCarbonWrapper function is executed and **carbonWrapper** *(step 2 contract address)* contract address is defined.

Step 4: The contract address of the **WrappedCarbon**  *(in step 3)* is defined by running the *setL2TokenPair* function in the **CarbonWrapper** contract. *(on Goerli testnet)*

Step 5: Approve is given from the **ERC20** token contract to the **CarbonWrapper** contract. *(example: 10000000000000000000000 wei = 10,000 tokens)*

Step 6: To transfer tokens from **Goerli** to **zkEVM**, run the *sendToL2* function in the **CarbonWrapper** contract.<br/>
    @param1 recipient: Recipient wallet address on L2 *(same wallet address)*<br/>
    @param2 _fee: Fee required for the bridge *(0.01 ETH - min _fee value = 10000000000000000 wei)*<br/>
    @param3 _deadline: Final processing time *(min _deadline value = block.timestamp + 7 days)*<br/>
    @param4 amount: Number of Tokens to be sent that have been previously Approve<br/>

Transaction example list on testnet:Test : <br/>
**Goerli** = https://goerli.etherscan.io/tx/0xbec7af98b38368743b70aff64a903ec3ee32719958fc75caed1cf2b26be60827<br/>
**zkEVM**  = https://explorer.goerli.zkevm.consensys.net/tx/0xf2de33a1b4dc6f94c03fd6cbf66b53d1f2cea9b4ca1e76429f0a1c33b985ad8e


**T??rk??e:**

Ad??m 1: **ERC20** s??zle??mesini Deploy edin. Sonras??nda "mint" fonksiyonunu ??al????t??r??n. *(??rnek: 10000000000000000000000 wei = 1,000,000 token)*<br/>
    **Constructor parametreleri;**<br/>
    _name: ERC20 token ad?? *(??rnek = CarbonToken)*<br/>
    _symbol: ERC20 token sembol *(??rnek = CARBON)*<br/>

Ad??m 2: **CarbonWrapper** s??zle??mesini deploy edin. <br/>
    **Constructor parametreleri;**<br/>
    _token: ERC20 s??zle??me adresi *(ad??m 1'de deploy etti??imiz s??zle??me)*<br/>
    _l1Bridge: Goerli L1 Bridge adresi (0xE87d317eB8dcc9afE24d9f63D6C760e52Bc18A40)<br/>

Ad??m 1 ve Ad??m 2 'deki i??lemler **Goerli testnet** ??zerinde yap??lacakt??r.

Ad??m 3: **WrappedCarbon** s??zle??mesini **zkEVM testnet** ??zerinde deploy edin.<br/>
    **Constructor parametreleri;**<br/>
    _l2Bridge : ZkEVM L2 Bridge adresi (0xA59477f7742Ba7d51bb1E487a8540aB339d6801d)<br/>
    _name : ERC20 Token ad?? *(??rnek = wCarbonToken)*<br/>
    _symbol: ERC20 Token symbol *(??rnek = wCARBON)*<br/>
**WrappedCarbon** s??zle??mesinde "setCarbonWrapper" fonksiyonuna **carbonWrapper** *(Ad??m 2 s??zle??me adresi)* s??zle??me adresini tan??mlay??n.

Ad??m 4: **CarbonWrapper** s??zle??mesinde *setL2TokenPair* fonksiyonuna **WrappedCarbon**  *(Ad??m 3)* s??zle??me adresini tan??mlay??n. *(Goerli ??zerinde)*

Ad??m 5: **ERC20** token s??zle??mesi **CarbonWrapper** s??zle??me adresi i??in "Approve" verin *(??rnek: 10000000000000000000000 wei = 10,000 token)*

Ad??m 6: **Goerli** 'den **zkEVM** 'e transfer ger??ekle??tirmek i??in **CarbonWrapper** s??zle??mesinde *sendToL2* fonksiyonunu ??al????t??r??n.<br/>
    @parametre1 recipient: L2 ??zerindeki al??c?? adresi *(kulland??????n??z wallet adresi olabilir)*<br/>
    @parametre2 _fee: K??pr?? i??in Fee de??eri *(0.01 ETH - minimum _fee de??eri = 10000000000000000 wei)*<br/>
    @parametre3 _deadline: Son i??lem s??resi *(minimum _deadline de??eri = block.timestamp + 7 days)*<br/>
    @parametre4 amount: Daha ??nce Approve verdi??iniz token miktar??<br/>