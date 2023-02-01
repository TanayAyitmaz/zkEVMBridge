import moment from "moment"
import { expect } from "chai"
import hre, { ethers, waffle } from 'hardhat'
import { formatUnits, parseEther, parseUnits, formatEther } from "ethers/lib/utils"
import "@nomiclabs/hardhat-waffle"

import { addComma, strDisplay } from "../scripts/requirement"

import { ERC20__factory, ERC20} from "../typechain-types"

let erc20Factory:ERC20__factory
let erc20Contract:ERC20

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
        console.log("\tUser Address: ", user.address)
    })

    // Deploy ERC20
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
        console.log("\tToken Total Supply: ", addComma(formatEther(tx)))
    })
})