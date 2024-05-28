const { developmentChains } = require('../../helper-hardhat-config');
const { ethers, getNamedAccounts } = require('hardhat');
const { assert } = require('chai');

!developmentChains.includes(network.name)
    ? describe.skip
    : describe('FundeMe', async function () {
          let fundMe;
          const sendValue = ethers.parseEther('2');
          this.beforeEach(async function () {
              let { deployer } = await getNamedAccounts();
              console.log('deployer', deployer);
              fundMe = await ethers.getContract('FundMe', deployer);
              contractAddress = await fundMe.getAddress();
              console.log('contractAddress: ', contractAddress);
          });

          it('allows people to fund and withdraw', async function () {
              await fundMe.fund({ value: sendValue });
              await fundMe.withdraw();
              const endingContractBalance = await ethers.provider.getBalance(
                  contractAddress
              );
              assert.equal(endingContractBalance, '0');
          });
      });
