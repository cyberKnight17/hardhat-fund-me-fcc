const { network } = require('hardhat');

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const chainId = network.config.chainId;

    const greeterContract = await ethers.getContract('Greeter', deployer);
    console.log(await greeterContract.greet());

    const greeterContractAddress = greeterContract.target;
    console.log('greeterContractAddress', greeterContractAddress);
};

module.exports.tags = ['all', 'greeter'];
