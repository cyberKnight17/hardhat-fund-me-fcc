require('@nomicfoundation/hardhat-toolbox');
require('hardhat-deploy');
require('dotenv').config();
require('hardhat-gui');
require('@nomiclabs/hardhat-ethers');
require('hardhat-ethernal');

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const SEPOLIA_ACCOUNT_1 = process.env.SEPOLIA_ACCOUNT_1;
const SEPOLIA_ACCOUNT_2 = process.env.SEPOLIA_ACCOUNT_2;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const { ProxyAgent, setGlobalDispatcher } = require('undici');
const proxyAgent = new ProxyAgent('http://127.0.0.1:7890');
setGlobalDispatcher(proxyAgent);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: '0.8.8',
    defaultNetwork: 'ganache',
    networks: {
        ganache: {
            url: 'http://127.0.0.1:7545',
            chainId: 1337,
            accounts: [
                '0xbad3877b63f70c6f200c954dd6331fb035571ee213d37bc94d38f1d3c6a07dca',
                '0x05ae44b7527d463873a2cce06c28683e508c65c78ab6f432a76362e274de5aa7',
                '0xe75a3b763cfb1f860cfba2dd6ffc60ec25b4cb2015d63c44ea1a16680b52fad3',
            ],
            gasPrice: 900000000000,
        },
        sepolia: {
            chainId: 11155111,
            url: SEPOLIA_RPC_URL,
            accounts: [SEPOLIA_ACCOUNT_1, SEPOLIA_ACCOUNT_2],
            blockConfirmations: 6,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        outputFile: 'gas-report.txt',
        // currency: 'CNY',
        // coinmarketcap:
        // token: 'BNB',
    },
    ethernal: {
        apiToken: process.env.ETHERNAL_API_TOKEN,
    },
};
