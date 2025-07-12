import { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Vault", function() {
    async function deploy() {
        const [user1] = await ethers.getSigners();

        const ownerAddress = user1.address;

        const Factory = await ethers.getContractFactory("Vault");
        const vault = await Factory.deploy(ownerAddress);
        vault.waitForDeployment();

        return { user1, vault, ownerAddress }
    }

    it("should be deployed", async function() {
        const { vault } = await loadFixture(deploy);

        console.log(vault.target);
    });
    

    describe("Constructor", function () {

        it("should be proper initalAddress", async function() {
            const { ownerAddress } = await loadFixture(deploy);

            expect(ownerAddress).to.be.properAddress;
        });
    });

    async function payment(signers:HardhatEthersSigner[], amount:bigint) {
        const { vault } = await loadFixture(deploy);

        for(const signer of signers){
            await signer.sendTransaction({
                to: vault.target,
                value: amount
            });
        }

        return { vault, amount, signers }
    }

    describe("Payble", function () {
        async function receiveData() {
            const signers = await ethers.getSigners();
            const user = signers[1];
            const amount = ethers.parseEther("1");

            return await payment([user], amount);
        }

        async function donateData() {
            const signers = await ethers.getSigners();
            const user = signers[1];
            const amount = ethers.parseEther("1");

            return await payment([user], amount);
        }

        it("should accept ETH via receive()", async function() {
            const { vault, amount }  = await loadFixture(receiveData);

            expect(await ethers.provider.getBalance(vault.target) == amount);
        });

        it("should accept ETH via donate() ", async function () {
            const { vault, amount }  = await loadFixture(donateData);

            expect(await ethers.provider.getBalance(vault.target) == amount);
        });

        it("should reverted", async function () {
            const { user1, vault } = await loadFixture(deploy);
            const amount = ethers.parseEther("1");

            await expect(
                user1.sendTransaction({
                to: vault.target,
                data: "0x12345678",
                value: amount,
                })
            ).to.be.revertedWith("Something gone wrong");
        });
    });

    describe("Refund", function(){

        async function refund() {
            const signers = await ethers.getSigners();
            const user1 = signers[0];
            const amount = ethers.parseEther("1");

            return await payment([user1], amount);
        }

        it("should refund money to sender", async function () {
            
            const { vault, signers, amount } = await loadFixture(refund);
            const user1 = signers[0];

            await expect(
                vault.connect(user1).refund()
            ).to.changeEtherBalances(
                [vault, user1],
                [-amount, amount],
                // { includeFee: true }
            )
        });

    });

    describe("Withdraw", function(){

        async function payFromAllSigners() {
            const signers = await ethers.getSigners();
            const amount = ethers.parseEther("1");

            return await payment(signers, amount);
        }

        it("should withdraw money to owner", async function () {
            const { vault, signers, amount } = await loadFixture(payFromAllSigners);
            const owner = signers[0];

            const summ = amount * BigInt(signers.length);

            await expect(
                vault.connect(owner).withdraw()
            ).to.changeEtherBalances(
                [vault, owner],
                [-summ, summ],
            )
        })

    });
    
});