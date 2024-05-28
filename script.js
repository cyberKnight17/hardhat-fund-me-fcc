const hre = require('hardhat');

async function main() {
    const GreeterContractAddress = '0x01B2EcAf51D1574167EA11a448792853ecd5dE1a';
    const Greeter = await hre.ethers.getContractAt(
        'Greeter',
        GreeterContractAddress
    );
    console.log(await Greeter.greet());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
