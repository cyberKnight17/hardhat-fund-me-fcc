const { network, ethers } = require('hardhat');
const {
    networkConfig,
    developmentChains,
} = require('../helper-hardhat-config');

require('dotenv').config();

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    await deploy('PriceConverter', {
        contract: 'PriceConverter',
        from: deployer,
        log: true,
    });
    // const contractPriceConverter = await ethers.getContract(
    //     'PriceConverter',
    //     deployer
    // );
    // console.log(
    //     'contractPriceConverter.getPrice()',
    //     await contractPriceConverter.getPrice()
    // );
    log('----------------------------------------------------------------');
};

module.exports.tags = ['all', 'priceConverter'];
