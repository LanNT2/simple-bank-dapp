const ERC20Token = artifacts.require("ERC20Token");
const CustomOwner = artifacts.require("CustomOwner");
const Dapp = artifacts.require("Dapp");

module.exports = async function (deployer) {
  await  deployer.deploy(CustomOwner);
  await  deployer.deploy(ERC20Token,1000);
  await  deployer.deploy(Dapp,10,100);
};
