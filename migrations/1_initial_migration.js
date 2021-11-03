const ERC20Token = artifacts.require("ERC20Token");
const CustomOwner = artifacts.require("CustomOwner");
const RKToken = artifacts.require("RKToken");
const Dapp = artifacts.require("Dapp");

module.exports = async function (deployer) {
  await  deployer.deploy(CustomOwner);
  await  deployer.deploy(ERC20Token,"RK Token", "RKToken");
  await  deployer.deploy(RKToken);
  await  deployer.deploy(Dapp,10,100);
};
