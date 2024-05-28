const networkConfig = {
    137: {
        name: 'polygon',
        priceFeedAddress: '0xF9680D99D6C9589e2a93a78A04A279e509205945',
    },
    11155111: {
        name: 'sepolia',
        priceFeedAddress: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
    },
    1337: {
        name: 'localhost',
    },
};

const developmentChains = ['hardhat', 'localhost', 'ganache'];
const DECIMALS = 8;
const INITIAL_ANSWER = 200000000000;

module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
};
