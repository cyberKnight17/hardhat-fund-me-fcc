const { deployments, ethers, getNamedAccounts } = require('hardhat');
const hre = require('hardhat');
const { assert, expect } = require('chai');
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require('../../helper-hardhat-config');

developmentChains.includes(network.name)
    ? describe.skip
    : describe('FundMe', async function () {
          let contractFundMe;
          let contractFundMePriceFeedAddress;
          let contractMockV3Aggregator;
          let contractMockV3AggregatorAddress;

          const deployer = '0xee2b2BB12eA50c54dA97288Cb87cf38824D76951';

          const sentValue1 = ethers.parseEther('0');
          const sentValue2 = ethers.parseEther('2');

          beforeEach(async function () {
              // deploy our FundMe contract using hardhat-deploy
              const { deployer } = await getNamedAccounts();

              // deployments.fixture(['mock']);
              // deployments.fixture(['fundMe']);

              contractFundMe = await ethers.getContract('FundMe', deployer);
              contractFundMeAddress = await contractFundMe.getAddress();
              console.log('contractFundMeAddress', contractFundMeAddress);
              contractFundMePriceFeedAddress =
                  await contractFundMe.getPriceFeed();
              console.log(
                  'contractFundMePriceFeedAddress',
                  contractFundMePriceFeedAddress
              );

              // console.log('testFund: ', await contractFundMe.testFund({ value: 1 }));

              contractMockV3Aggregator = await ethers.getContract(
                  'MockV3Aggregator',
                  deployer
              );
              contractMockV3AggregatorAddress = contractMockV3Aggregator.target;
              console.log(
                  'contractMockV3AggregatorAddress',
                  contractMockV3AggregatorAddress
              );
          });

          describe('constructor', async function () {
              it('sets aggregator address correctly', async function () {
                  assert.equal(
                      contractFundMePriceFeedAddress,
                      contractMockV3AggregatorAddress
                  );
              });
          });

          describe('fund', async function () {
              it('not enough ETH were sent', async function () {
                  expect(
                      contractFundMe.fund({ value: sentValue1 })
                  ).to.be.revertedWith('not enough ETH were sent');
              });

              it('send enought ETH', async function () {
                  await contractFundMe.fund({ value: sentValue2 });
                  assert.equal(sentValue2, await contractFundMe.getLastFund());
              });

              it('add latest funder to funder list', async function () {
                  await contractFundMe.fund({ value: sentValue2 });
                  funders = await contractFundMe.getFunders();
                  lastestFunder = funders[funders.length - 1];
                  console.log('funders', funders);
                  console.log('lastestFunder', lastestFunder);
                  assert.equal(lastestFunder, deployer);
              });
          });

          describe('withdraw', async function () {
              it('owner of contract withdraw all balance', async function () {
                  // Arrange
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(
                          '0x29E78BfEEFFD4fD9c1CEB02149Cf50D1C78a7731'
                      );
                  console.log('startingFundMeBalance', startingFundMeBalance);

                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer);
                  console.log(
                      'startingDeployerBalance',
                      startingDeployerBalance
                  );

                  // Act
                  const transactionResponse = await contractFundMe.withdraw();
                  const transactionReceipt = await transactionResponse.wait(1);

                  const { gasUsed, gasPrice } = transactionReceipt;
                  console.log('gasUsed', gasUsed);
                  console.log('type of gasUsed: ', typeof gasUsed);
                  const gasCost1 = gasUsed * gasPrice;
                  console.log('gasCost1: ', gasCost1);

                  const endingFundMeBalance = await ethers.provider.getBalance(
                      '0x29E78BfEEFFD4fD9c1CEB02149Cf50D1C78a7731'
                  );
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer);

                  assert;
                  assert.equal(endingFundMeBalance, 0);
                  console.log('endingDeployerBalance', endingDeployerBalance);
                  console.log(
                      'calculated endingDeployerBalance: ',
                      startingFundMeBalance + startingDeployerBalance - gasCost1
                  );
                  assert.equal(
                      endingDeployerBalance,
                      startingFundMeBalance + startingDeployerBalance - gasCost1
                  );
              });

              it('allows us to withdraw fund from multiple funders', async function () {
                  // Arrange
                  const signers = await ethers.getSigners();
                  for (let i = 0; i < signers.length; i++) {
                      const signer = signers[i];
                      await contractFundMe
                          .connect(signer)
                          .fund({ value: sentValue2 });
                  }

                  const startingFundMeBalance =
                      await ethers.provider.getBalance(
                          '0x29E78BfEEFFD4fD9c1CEB02149Cf50D1C78a7731'
                      );
                  console.log('startingFundMeBalance', startingFundMeBalance);

                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer);
                  console.log(
                      'startingDeployerBalance',
                      startingDeployerBalance
                  );

                  // Act
                  const transactionResponse = await contractFundMe.withdraw();
                  const transactionReceipt = await transactionResponse.wait(1);
                  const { gasUsed, gasPrice } = transactionReceipt;
                  const gasCost2 = gasUsed * gasPrice;
                  console.log('gasCost2: ', gasCost2);

                  const endingFundMeBalance = await ethers.provider.getBalance(
                      '0x29E78BfEEFFD4fD9c1CEB02149Cf50D1C78a7731'
                  );
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer);

                  // assert
                  assert.equal(endingFundMeBalance, 0);
                  assert.equal(
                      endingDeployerBalance,
                      startingFundMeBalance + startingDeployerBalance - gasCost2
                  );
              });

              it('only allows the owener of contract FundMe to withdraw money from contract', async function () {
                  const signers = await ethers.getSigners();
                  const signer2 = signers[1];

                  // 为什么 await  expect(contractFundMe.connect(signer2).withdraw()).to.be.reverted;不行
                  expect(
                      contractFundMe.connect(signer2).withdraw()
                  ).to.be.revertedWith('FundMe__NotOwner');
              });
          });

          describe('cheaperWithdraw', async function () {
              it('owner of contract withdraw all balance', async function () {
                  // Arrange
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(
                          '0x29E78BfEEFFD4fD9c1CEB02149Cf50D1C78a7731'
                      );
                  console.log('startingFundMeBalance', startingFundMeBalance);

                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer);
                  console.log(
                      'startingDeployerBalance',
                      startingDeployerBalance
                  );

                  // Act
                  const transactionResponse =
                      await contractFundMe.cheaperWithdraw();
                  const transactionReceipt = await transactionResponse.wait(1);

                  const { gasUsed, gasPrice } = transactionReceipt;
                  console.log('gasUsed', gasUsed);
                  console.log('type of gasUsed: ', typeof gasUsed);
                  const gasCost1_1 = gasUsed * gasPrice;
                  console.log('gasCost1_1: ', gasCost1_1);

                  const endingFundMeBalance = await ethers.provider.getBalance(
                      '0x29E78BfEEFFD4fD9c1CEB02149Cf50D1C78a7731'
                  );
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer);

                  assert;
                  assert.equal(endingFundMeBalance, 0);
                  console.log('endingDeployerBalance', endingDeployerBalance);
                  console.log(
                      'calculated endingDeployerBalance: ',
                      startingFundMeBalance +
                          startingDeployerBalance -
                          gasCost1_1
                  );
                  assert.equal(
                      endingDeployerBalance,
                      startingFundMeBalance +
                          startingDeployerBalance -
                          gasCost1_1
                  );
              });

              it('allows us to withdraw fund from multiple funders', async function () {
                  // Arrange
                  const signers = await ethers.getSigners();
                  for (let i = 0; i < signers.length; i++) {
                      const signer = signers[i];
                      await contractFundMe
                          .connect(signer)
                          .fund({ value: sentValue2 });
                  }

                  const startingFundMeBalance =
                      await ethers.provider.getBalance(
                          '0x29E78BfEEFFD4fD9c1CEB02149Cf50D1C78a7731'
                      );
                  console.log('startingFundMeBalance', startingFundMeBalance);

                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer);
                  console.log(
                      'startingDeployerBalance',
                      startingDeployerBalance
                  );

                  // Act
                  const transactionResponse =
                      await contractFundMe.cheaperWithdraw();
                  const transactionReceipt = await transactionResponse.wait(1);
                  const { gasUsed, gasPrice } = transactionReceipt;
                  const gasCost2_1 = gasUsed * gasPrice;
                  console.log('gasCost2_1: ', gasCost2_1);

                  const endingFundMeBalance = await ethers.provider.getBalance(
                      '0x29E78BfEEFFD4fD9c1CEB02149Cf50D1C78a7731'
                  );
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer);

                  // assert
                  assert.equal(endingFundMeBalance, 0);
                  assert.equal(
                      endingDeployerBalance,
                      startingFundMeBalance +
                          startingDeployerBalance -
                          gasCost2_1
                  );
              });
          });
      });
