const Dapp = artifacts.require("Dapp");
const RKToken = artifacts.require("RKToken");

contract("Dapp", async accounts => {
    //token
    var rkToken;
    var tokenDecimals;

    //dapp
    var dappInstance;
    var depositRatePerYear;
    var dappAddress;
    var rkTokenAddress;
    var customer;
    var balanceOfCustomer;

    before("mint() RKToken ", async function () {
        customer = accounts[0];
        rkToken = await RKToken.deployed();
        dappInstance = await Dapp.deployed();

        //decimals
        tokenDecimals = await rkToken.decimals();

        totalSupply = await rkToken.totalSupply();

        depositRatePerYear = await dappInstance.depositRatePerYear();

        dappAddress = await dappInstance.getAddress();

        rkTokenAddress = await rkToken.getAddress();

      // await rkToken.approve(rkTokenAddress, web3.utils.toBN(100 * Math.pow(10, tokenDecimals)));

        await rkToken.approve(dappAddress, web3.utils.toBN(100 * Math.pow(10, tokenDecimals)));
    });

    it("Test mint() RKToken", async function () {
        assert.equal(tokenDecimals.toString(), 18);
        balanceOfCustomer = await rkToken.balanceOf(customer);
        console.log("balanceOfCustomer: " + balanceOfCustomer);
        assert.equal(balanceOfCustomer.toString(), web3.utils.toBN(999 * Math.pow(10, tokenDecimals)).toString());
    });

    it("Test Initialize Dapp", async function () {
        assert.equal(depositRatePerYear.valueOf(), 10);
    });

    it("Test deposit success", async function () {
        let numberOfTokens = 50.05;
        let m = web3.utils.toBN(numberOfTokens * Math.pow(10, tokenDecimals));
        await dappInstance.deposit(customer,m,100);
        let dappBalance = await rkToken.balanceOf(dappAddress);
        let customerBalanceAfterDeposit = await rkToken.balanceOf(customer);
        assert.deepEqual(dappBalance.toString(), m.toString());
        assert.equal(customerBalanceAfterDeposit.toString(), (balanceOfCustomer - m).toString());
    });

    it("Test deposit fail when caller is not owner", async function () {
        try {
            let caller = accounts[1];
            let numberOfTokens = 50.05;
            let m = web3.utils.toBN(numberOfTokens * Math.pow(10, tokenDecimals));
            await dappInstance.deposit(customer,m,100, { from: caller });
            let dappBalance = await rkToken.balanceOf(dappAddress);
            let customerBalanceAfterDeposit = await rkToken.balanceOf(customer);
            assert.deepEqual(dappBalance.toString(), m.toString());
            assert.equal(customerBalanceAfterDeposit.toString(), (balanceOfCustomer - m).toString());
        } catch (error) {
            assert.include(error.message, 'Caller is not owner');
        }
    });

    it("Test withdraw", async function () {
        try {
            const withdrawAmount = 20.002;
            var w = web3.utils.toBN(withdrawAmount * Math.pow(10, tokenDecimals));
            await dappInstance.withDraw(w);
            let dappTotalSupply = await dappInstance.totalSupply();
            dappBalance = await rkToken.balanceOf(dappAddress);
            assert.equal(dappBalance.toString(), dappTotalSupply.toString()), "'Customer can withdraw money if not reach the deadline'";
        } catch (error) {
            assert.include(error.message, 'Customer can withdraw money if not reach the deadline');
        }
    });

    it("Test withdraw fail when caller is not owner", async function () {
        try {
            let caller = accounts[1];
            const withdrawAmount = 20.002;
            var w = web3.utils.toBN(withdrawAmount * Math.pow(10, tokenDecimals));
            await dappInstance.withDraw(w,{ from: caller });
            let dappTotalSupply = await dappInstance.totalSupply();
            dappBalance = await rkToken.balanceOf(dappAddress);
            assert.equal(dappBalance.toString(), dappTotalSupply.toString()), "'Customer can withdraw money if not reach the deadline'";
        } catch (error) {
            assert.include(error.message, 'Caller is not owner');
        }
    });

    it("Test transferAmount", async function () {
            const amount = 10.002;
            var w = web3.utils.toBN(amount * Math.pow(10, tokenDecimals));
            await dappInstance.transferAmount(customer,accounts[1],w);
            let customerBalanceAfterTransfer = await rkToken.balanceOf(customer);
            let recipientBalance = await rkToken.balanceOf(accounts[1]);
            assert.equal(customerBalanceAfterTransfer.toString(), ((938.948)* Math.pow(10, tokenDecimals)).toString());
            assert.equal(recipientBalance.toString(), w.toString());
    });

    it("Test transferAmount fail when caller is not owner", async function () {
        try {
            let caller = accounts[1];
            const amount = 10.002;
            var w = web3.utils.toBN(amount * Math.pow(10, tokenDecimals));
            await dappInstance.transferAmount(customer,accounts[1],w,{from:caller});
            let customerBalanceAfterTransfer = await rkToken.balanceOf(customer);
            let recipientBalance = await rkToken.balanceOf(accounts[1]);
            assert.equal(customerBalanceAfterTransfer.toString(), ((938.948)* Math.pow(10, tokenDecimals)).toString());
            assert.equal(recipientBalance.toString(), w.toString());
        } catch (error) {
            assert.include(error.message, 'Caller is not owner');
        }
    });


    it("Test setCustomerAddress fail when caller is not owner", async function () {
        try {
            let caller = accounts[1];
            await dappInstance.setCustomerAddress(customer,{ from: caller });
        } catch (error) {
            assert.include(error.message, 'Caller is not owner');
        }
    });

    //Test Pausable

    it("Test deposit fail when owner pause every transactions", async function () {
        try {
            await dappInstance.pause();
            let numberOfTokens = 50.05;
            let m = web3.utils.toBN(numberOfTokens * Math.pow(10, tokenDecimals));
            await dappInstance.deposit(customer,m,100);
            let dappBalance = await rkToken.balanceOf(dappAddress);
            let customerBalanceAfterDeposit = await rkToken.balanceOf(customer);
            assert.deepEqual(dappBalance.toString(), m.toString());
            assert.equal(customerBalanceAfterDeposit.toString(), (balanceOfCustomer - m).toString());
        } catch (error) {
            assert.include(error.message, "Pausable: paused");
        }
    });

    it("Test withdraw fail when owner pause the every transactions", async function () {
        try {
            await dappInstance.pause();
            const withdrawAmount = 20.002;
            var w = web3.utils.toBN(withdrawAmount * Math.pow(10, tokenDecimals));
            await dappInstance.withDraw(w);
            let dappTotalSupply = await dappInstance.totalSupply();
            dappBalance = await rkToken.balanceOf(dappAddress);
            assert.equal(dappBalance.toString(), dappTotalSupply.toString()), "'Customer can withdraw money if not reach the deadline'";
        } catch (error) {
            assert.include(error.message, "Pausable: paused");
        }
    });

    it("Test transferAmount fail when owner pause every transactions", async function () {
        try {
            await dappInstance.pause();
            const amount = 10.002;
            var w = web3.utils.toBN(amount * Math.pow(10, tokenDecimals));
            await dappInstance.transferAmount(accounts[1],w);
            let customerBalanceAfterTransfer = await rkToken.balanceOf(customer);
            let recipientBalance = await rkToken.balanceOf(accounts[1]);
            assert.equal(customerBalanceAfterTransfer.toString(), ((938.948)* Math.pow(10, tokenDecimals)).toString());
            assert.equal(recipientBalance.toString(), w.toString());
        } catch (error) {
            assert.include(error.message, "Pausable: paused");
        }
    });

});