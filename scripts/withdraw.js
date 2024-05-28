const { getNamedAccounts } = require('hardhat');

async function main() {
    const { deployer } = await getNamedAccounts();
    const fundMe = await ethers.getContract('FundMe', deployer);
    console.log(`got contract FundMe at ${await fundMe.getAddress()}`);
    console.log('withdrawing from contract');
    const transactionResponse = await fundMe.withdraw();
    await transactionResponse.wait(1);
    console.log('got it back');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
    });
