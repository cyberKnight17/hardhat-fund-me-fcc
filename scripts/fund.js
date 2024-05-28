const { getNamedAccounts } = require('hardhat');

async function main() {
    const { deployer } = await getNamedAccounts();
    const fundMe = await ethers.getContract('FundMe', deployer);
    console.log(`got contract FundMe at ${await fundMe.getAddress()}`);
    console.log('funding contract');
    const transactionResponse = await fundMe.fund({
        value: ethers.parseEther('3'),
    });
    await transactionResponse.wait(1);
    console.log('funded');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
    });
