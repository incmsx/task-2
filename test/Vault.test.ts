import { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

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

    describe("Payble", function () {

        async function receive() {
            const { vault } = await loadFixture(deploy);
            const amount = ethers.parseEther("1");
            
            const signers = await ethers.getSigners();
            const user2 = signers[1];

            user2.sendTransaction({
                to: vault.target,
                value: amount
            });

            return { vault, amount }
         
        }

        it("should be accept ETH via receive()", async function() {
            
            const { vault, amount } = await loadFixture(receive);

            expect(await ethers.provider.getBalance(vault.target) == amount);

        });

    });
    
});