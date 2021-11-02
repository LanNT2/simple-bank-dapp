const ERC20Token = artifacts.require("ERC20Token");

contract("ERC20Token",accounts =>{
    it("totalSupply should be 1000", async function(){
        const tokenInstance = await ERC20Token.deployed();
        const totalSupply = await tokenInstance.totalSupply();
        assert.equal(totalSupply.valueOf(),1000);
    });
});