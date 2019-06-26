var Collection = artifacts.require("./Collection.sol");
var Election = artifacts.require("./Election.sol");

module.exports = function (deployer) {
    deployer.deploy(Election);
};
    module.exports = function(deployer) {
    deployer.deploy(Collection);
};
