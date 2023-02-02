import moment from "moment"
import { expect } from "chai"
import hre, { ethers, waffle } from 'hardhat'
import { formatUnits, parseEther, parseUnits, formatEther } from "ethers/lib/utils"
import "@nomiclabs/hardhat-waffle"

import { addComma, strDisplay } from "../scripts/requirement"

import { ERC20__factory, ERC20} from "../typechain-types"
import { CarbonWrapper__factory, CarbonWrapper} from "../typechain-types"
import { WrappedCarbon__factory, WrappedCarbon} from "../typechain-types"


let erc20Factory:ERC20__factory
let erc20Contract:ERC20
let wrapperFactory:CarbonWrapper__factory
let wrapperContract:CarbonWrapper
let wrappedFactory:WrappedCarbon__factory
let wrappedContract:WrappedCarbon

let tx:any
let receipt:any
let owner:any
let user:any

let totalGas = ethers.BigNumber.from("0")

describe("ERC20 Contract Test", function() {

    // Signers Set
    it("Signers Set", async function () {
        [owner, user] = await ethers.getSigners()        
        console.log("\tOwner Address: ", owner.address)
        console.log("\tUser Address: ", user.address,"\n")
    })

    // Deploy ERC20 (on Ethereum Goerli testnet)
    it("Deploy ERC20 Contract", async function () {
        erc20Factory = await ethers.getContractFactory("ERC20")
        erc20Contract = await erc20Factory.deploy("CarbonToken", "CARBON")
        await erc20Contract.deployed()
        tx = erc20Contract.deployTransaction
        receipt = await tx.wait()
        console.log("\tERC20 Address: ",erc20Contract.address)
        console.log("\tERC20 Deploy Gas: ",strDisplay(receipt.gasUsed),"\n")
        totalGas = totalGas.add(receipt.gasUsed)        
        expect(await erc20Contract.name()).to.equal("CarbonToken");        
    })

    // Mint
    it("Mint", async function () {
        async function mint(_amount:any) {
            try {
                tx = await erc20Contract.mint(_amount)
                receipt = await tx.wait()
                if (receipt.status) {
                console.log("\tMint Gas: ",strDisplay(receipt.gasUsed))
                console.log("\tMint Done...\n")
                totalGas = totalGas.add(receipt.gasUsed)
                }
            } catch (error) {
                console.log(error)
            }  
        }
        const totalSupply = ethers.BigNumber.from("1000000000000000000000000");
        await mint(totalSupply)   //1.000.000 token minted
    })

    // Control
    it("ERC20 Controls", async function () {
        tx = await erc20Contract.name()
        console.log("\tToken Name: ", tx)
        tx = await erc20Contract.symbol()
        console.log("\tToken Symbol: ", tx)
        tx = await erc20Contract.decimals()
        console.log("\tToken Decimals: ", tx)
        tx = await erc20Contract.totalSupply()
        console.log("\tToken Total Supply: ", addComma(formatEther(tx)),"\n")
    })


    // Deploy CarbonWrapper (on Ethereum Goerli testnet)
    it("Deploy Wrapper Contract", async function () {
        wrapperFactory = await ethers.getContractFactory("CarbonWrapper")
        wrapperContract = await wrapperFactory.deploy(erc20Contract.address, "0xE87d317eB8dcc9afE24d9f63D6C760e52Bc18A40")
        await wrapperContract.deployed()
        tx = wrapperContract.deployTransaction
        receipt = await tx.wait()
        console.log("\tWrapper Address: ",wrapperContract.address)
        console.log("\tWrapper Deploy Gas: ",strDisplay(receipt.gasUsed),"\n")
        totalGas = totalGas.add(receipt.gasUsed)        
    })


    // Deploy WrappedCarbon (on zkEVN testnet)
    it("Deploy Wrapped Contract", async function () {
        wrappedFactory = await ethers.getContractFactory("WrappedCarbon")
        wrappedContract = await wrappedFactory.deploy("0xA59477f7742Ba7d51bb1E487a8540aB339d6801d", "wCarbonToken", "wCARBON")
        await wrappedContract.deployed()
        tx = wrappedContract.deployTransaction
        receipt = await tx.wait()
        console.log("\tWrapped Address: ",wrappedContract.address)
        console.log("\tWrapped Deploy Gas: ",strDisplay(receipt.gasUsed),"\n")
        totalGas = totalGas.add(receipt.gasUsed)    
        expect(await wrappedContract.name()).to.equal("wCarbonToken");        
    })

    // Control Wrapped ERC20
    it("Wrapped ERC20 Controls", async function () {
        tx = await wrappedContract.name()
        console.log("\tWrapped Token Name: ", tx)
        tx = await wrappedContract.symbol()
        console.log("\tWrapped Token Symbol: ", tx)
        tx = await wrappedContract.decimals()
        console.log("\tWrapped Token Decimals: ", tx)
        tx = await wrappedContract.totalSupply()
        console.log("\tWrapped Token Total Supply: ", addComma(formatEther(tx)),"\n")
    })

    // setCarbonWrapper (on zkEVM testnet)
    it("setCarbonWrapper", async function () {
        async function setCarbonWrapper(address:any) {
            try {
                tx = await wrappedContract.setCarbonWrapper(address)
                receipt = await tx.wait()
                if (receipt.status) {
                console.log("\tWrapped Carbon Gas: ",strDisplay(receipt.gasUsed))
                console.log("\tWrapped Carbon Address Set Done...\n")
                totalGas = totalGas.add(receipt.gasUsed)
                }
            } catch (error) {
                console.log(error)
            }  
        }
        await setCarbonWrapper(wrapperContract.address)
    })

    // setL2TokenPair (on Ethereum Goerli testnet)
    it("setL2TokenPair", async function () {
        async function setL2TokenPair(address:any) {
            try {
                tx = await wrapperContract.setL2TokenPair(address)
                receipt = await tx.wait()
                if (receipt.status) {
                console.log("\tCarbon Wrapper Gas: ",strDisplay(receipt.gasUsed))
                console.log("\tCarbon Wrapper Address Done...\n")
                totalGas = totalGas.add(receipt.gasUsed)
                }
            } catch (error) {
                console.log(error)
            }  
        }
        await setL2TokenPair(wrappedContract.address)
    })

    // Approve ERC20 (on Ethereum Goerli testnet)
    it("Approve ERC20", async function () {
        async function approveERC20(address:any, amount:any) {
            try {
                tx = await erc20Contract.approve(address, amount)
                receipt = await tx.wait()
                if (receipt.status) {
                console.log("\tApprove Gas: ",strDisplay(receipt.gasUsed))
                console.log("\tApprove Done...\n")
                totalGas = totalGas.add(receipt.gasUsed)
                }
            } catch (error) {
                console.log(error)
            }  
        }
        const approveAmount = ethers.BigNumber.from("10000000000000000000000"); //10.000 tokens
        await approveERC20(wrapperContract.address, approveAmount)
    })

    // sendToL2 (on Ethereum Goerli testnet)
    it("Send To L2 Wrap Token", async function () {
        async function sendToL2(address:any, fee:any, deadline:any, amount:any) {
            try {
                let _value = {value: ethers.utils.parseEther("0.01")}
                tx = await wrapperContract.sendToL2(address, fee, deadline, amount, _value)
                receipt = await tx.wait()
                if (receipt.status) {
                console.log("\tSend To L2 Gas: ",strDisplay(receipt.gasUsed))
                console.log("\tSend To L2 Transfer Done...\n")
                totalGas = totalGas.add(receipt.gasUsed)
                }
            } catch (error) {
                console.log(error)
            }  
        }
        // Current Time
        const blockNumBefore = await ethers.provider.getBlockNumber()
        const blockBefore = await ethers.provider.getBlock(blockNumBefore)
        const timestampBefore = blockBefore.timestamp
        const currentDate = new Date(timestampBefore * 1000)
        console.log("\tCurrent Time : ",timestampBefore," - ",currentDate.toLocaleDateString("en-US"))
        // Time Operations
        const time = moment().utc().unix() + 604800
        await ethers.provider.send("evm_setNextBlockTimestamp", [time])
        await ethers.provider.send("evm_mine", [time]);
        // Next Time
        const blockNumAfter = await ethers.provider.getBlockNumber() 
        const blockAfter = await ethers.provider.getBlock(blockNumAfter) 
        const timestampAfter = blockAfter.timestamp 
        const NextDate = new Date(timestampAfter * 1000);
        console.log("\tSkipped Time : ",timestampAfter," - ",NextDate.toLocaleDateString("en-US"),"\n")
        
        const _fee = ethers.BigNumber.from("10000000000000000"); // 0.01 ETH
        const _deadline = timestampAfter
        const _amount = ethers.BigNumber.from("10000000000000000000000"); //10.000 tokens
        await sendToL2(owner.address, _fee, _deadline, _amount)
    })

})