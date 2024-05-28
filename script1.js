const hre = require('hardhat');
const { ethers } = require('hardhat');

async function main() {
    const contractFundMeAddress = '0x0B7F115B9a3C67726775d73b73B55bBda3a2E96C';
    const contractFundMe = await hre.ethers.getContractAt(
        'FundMe',
        contractFundMeAddress
    );
    const sentValue = ethers.parseEther('3');
    await contractFundMe.fund({ value: sentValue });
    console.log(
        'getLastFundInUsdawait',
        await contractFundMe.getLastFundInUsd()
    );
    console.log(
        'fundByAddress',
        await contractFundMe.fundByAddress(
            '0x64877721AB602Ed87A8239C68A8d4061B517C090'
        )
    );
    console.log(
        'contractFundMe.getEthPrice(): ',
        await contractFundMe.getEthPrice()
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
