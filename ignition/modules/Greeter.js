const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

module.exports = buildModule('Greeter1Module', (m) => {
    const greeter = m.contract('Greeter');

    return { greeter };
});

// yarn hardhat ignition deploy ./ignition/modules/Greeter.js
