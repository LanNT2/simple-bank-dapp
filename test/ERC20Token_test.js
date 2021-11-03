const ERC20Token = artifacts.require("ERC20Token");

contract("ERC20Token",accounts =>{
    it("Test initialize Token", async function(){
        const tokenInstance = await ERC20Token.deployed();
        const name = await tokenInstance.name();
        const symbol = await tokenInstance.symbol();
        assert.equal(name,"RK Token");
        assert.equal(symbol,"RKToken");
    });
});