const { assert } = require('chai');
const { default: Web3 } = require('web3');

const EthSwap = artifacts.require("EthSwap");
const Token = artifacts.require("Token");

require('chai')
.use(require('chai-as-promised'))
.should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether')
}

contract('EthSwap', (accounts) => {
    let token, ethSwap
    before(async() => {
        token = await Token.new()
        ethSwap = await EthSwap.new(token.address)
    })
    describe('Token deployment', async() => { 
        it('contract has a name', async() => {
            const name = await token.name()
            assert.equal(name, 'Sonic Token')
         })
     })
    describe('EthSwap deployment', async() => { 
        it('contract has a name', async() => {
            const name = await ethSwap.name()
            assert.equal(name, 'Eth Swap')
         })
         it('contract has tokens', async() => {
            await token.transfer(ethSwap.address, tokens('1000000'))
            let balance = await token.balanceOf(ethSwap.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
     })
    describe('buyTokens()', async() => {
        let result;
        before(async() => {
            result = await ethSwap.buyTokens({from: accounts[1], value: web3.utils.toWei('1', 'ether')})
        })
        it('Allows user to instantly purchase tokens for fixed price', async() => {
            let investorBalance = await token.balanceOf(accounts[1])
            assert.equal(investorBalance, tokens('100'))
        })
        it('checks if contract balance of tokens is correct', async() => {
            let ethSwapBalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapBalance, tokens('999900'))
        })
        it('checks if balance of contract is correct', async() => {
            let ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapBalance, web3.utils.toWei('1', 'ether'))
        })
        it('checks if event is correct', async() => {
            const event = result.logs[0].args
            assert.equal(event.account, accounts[1])
            assert.equal(event.token, token.address)
            assert.equal(event.amount, tokens('100'))
            assert.equal(event.rate, '100')
        })
    })

    describe('sellTokens()', async() => {
        let result;
        
        before(async() => {
            await token.approve(ethSwap.address, tokens('100'), {from: accounts[1]})
            result = await ethSwap.sellTokens(tokens('100'), {from: accounts[1]})
        })
        it('shouldnt allow to sell more tokens than user has', async() => {
            await ethSwap.sellTokens(tokens('100'), {from: accounts[1]}).should.be.rejected
        })
        it('Allows user to instantly sell tokens for fixed price', async() => {
            let investorBalance = await token.balanceOf(accounts[1])
            assert.equal(investorBalance, '0')
        })
        it('checks contract balance of tokens is correct', async() => {
            let ethSwapBalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapBalance, tokens('1000000'))
        })
        it('checks if balance of contract is correct', async() => {
            let ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapBalance, web3.utils.toWei('0', 'ether'))
        })
        it('checks if event is correct', async() => {
            const event = result.logs[0].args
            assert.equal(event.account, accounts[1])
            assert.equal(event.token, token.address)
            assert.equal(event.amount, tokens('100'))
            assert.equal(event.rate, '100')
        })
    })
}) 