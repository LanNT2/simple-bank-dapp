const Dapp = artifacts.require("Dapp");
const RKToken = artifacts.require("RKToken");

contract("Dapp", async accounts => {
    //token
    var rkToken;
    var tokenDecimals;

    //dapp
    var dappInstance;
    var depositRatePerYear;
    var numberOfDays;
    var deadline;
    var dappAddress;
    var rkTokenAddress;
    var customer;
    var balanceOfCustomer;

    before("mint() RKToken ", async function () {
        customer = accounts[0];
        rkToken = await RKToken.deployed();

        //decimals
        tokenDecimals = await rkToken.decimals();

        await rkToken.mint(customer, web3.utils.toBN(999 * Math.pow(10, tokenDecimals)));

        totalSupply = await rkToken.totalSupply();

        dappInstance = await Dapp.deployed();

        depositRatePerYear = await dappInstance.depositRatePerYear();

        numberOfDays = await dappInstance.numberOfDays();

        dappAddress = await dappInstance.getAddress();

        rkTokenAddress = await rkToken.getAddress();

        await rkToken.approve(rkTokenAddress, web3.utils.toBN(100 * Math.pow(10, tokenDecimals)));

        await rkToken.approve(dappAddress, web3.utils.toBN(100 * Math.pow(10, tokenDecimals)));

        await dappInstance.setRKToken(rkTokenAddress);

        await dappInstance.setCustomerAddress(customer);
    });

    it("Test mint() RKToken", async function () {
        assert.equal(tokenDecimals.toString(), 18);
        balanceOfCustomer = await rkToken.balanceOf(customer);
        console.log("balanceOfCustomer: " + balanceOfCustomer);
        assert.equal(balanceOfCustomer.toString(), web3.utils.toBN(999 * Math.pow(10, tokenDecimals)).toString());
    });

    it("Test Initialize Dapp", async function () {
        assert.equal(depositRatePerYear.valueOf(), 10);
        assert.equal(numberOfDays.valueOf(), 100);

        deadline = await dappInstance.deadline();
        console.log("deadline: " + deadline);

    });

    it("Test deposit success", async function () {
        let numberOfTokens = 50.05;
        let m = web3.utils.toBN(numberOfTokens * Math.pow(10, tokenDecimals));
        await dappInstance.deposit(m);
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
            await dappInstance.deposit(m, { from: caller });
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

    it("Test setRKToken fail when caller is not owner", async function () {
        try {
            let caller = accounts[1];
            await dappInstance.setRKToken(rkTokenAddress,{ from: caller });
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
});