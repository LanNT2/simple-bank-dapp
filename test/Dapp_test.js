const Dapp = artifacts.require("Dapp");
const ERC20Token = artifacts.require("ERC20Token");

contract("Dapp",async accounts =>{
    it("Test Dapp event", async function(){
        const tokenContract = await ERC20Token.deployed();
        const DappInstance = await Dapp.deployed();
        const depositRatePerYear = await DappInstance.depositRatePerYear();
        const numberOfDays = await DappInstance.numberOfDays();
        assert.equal(depositRatePerYear.valueOf(),10);
        assert.equal(numberOfDays.valueOf(),100);

        const totalSupply = await tokenContract.totalSupply();
        assert.equal(totalSupply.valueOf(),1000);
        const customer = accounts[0];
        const numberOfTokens = 50;
        const tokenAddress = await tokenContract.getAddress();
        const dappAddress = await DappInstance.getAddress();
        await tokenContract.approve(tokenAddress,200);
        await tokenContract.approve(dappAddress,200);
        await DappInstance.setTokenContract(tokenAddress);
        await DappInstance.setCustomerAddress(customer);

        //deposit
        await DappInstance.deposit(numberOfTokens);
        let dappBalance = await tokenContract.balanceOf(dappAddress);
        let customerBalance = await tokenContract.balanceOf(customer);
        console.log("dappBalance: "+ dappBalance.toNumber());
        assert.deepEqual(dappBalance.toString(),numberOfTokens.toString());
        assert.equal(customerBalance.toString(),(totalSupply-numberOfTokens).toString());

        //withdraw
        const withdrawAmount = 20;
        await DappInstance.withDraw(withdrawAmount);
        let dappTotalSupply = await DappInstance.totalSupply();
        dappBalance = await tokenContract.balanceOf(dappAddress);
        assert.equal(dappBalance.toString(),dappTotalSupply.toString()),"Customer can withdraw money if not reach the withDrawTimeLimit";

    });
});