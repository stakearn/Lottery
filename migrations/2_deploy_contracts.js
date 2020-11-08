const Lottery = artifacts.require("Lottery");
const MockBEP20 = artifacts.require("MockBEP20");
const LotteryNFT = artifacts.require("LotteryNFT");
const LotteryUpgradeProxy = artifacts.require("LotteryUpgradeProxy");

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545'));

module.exports = async function(deployer) {
    await deployer.deploy(LotteryNFT);
    const cake = await MockBEP20.at('0x43acC9A5E94905c7D31415EB410F3E666e5F1e9A');
    await deployer.deploy(Lottery);

    proxyAdmin= '0x1fefa92854872dd9408efd448a4bc6da3495c42b';
    lotteryOwner= 'Update'
    lotteryAdmin= 'Update';

    const abiEncodeData = web3.eth.abi.encodeFunctionCall({
        "inputs": [
            {
                "internalType": "contract IERC20",
                "name": "_cake",
                "type": "address"
            },
            {
                "internalType": "contract LotteryNFT",
                "name": "_lottery",
                "type": "address"
            },
            {
                "internalType": "uint8",
                "name": "_maxNumber",
                "type": "uint8"
            },
            {
                "internalType": "address",
                "name": "_owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_adminAddress",
                "type": "address"
            }
        ],
        "name": "initialize",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, [cake.address, LotteryNFT.address, '5', lotteryOwner, lotteryAdmin]);

    await deployer.deploy(LotteryUpgradeProxy, Lottery.address, proxyAdmin, abiEncodeData);

    const lotteryNft = await LotteryNFT.deployed();
    await lotteryNft.transferOwnership(LotteryUpgradeProxy.address);
};



