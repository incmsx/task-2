import { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("Vault", function() {
    async function deploy() {
        const [user1] = await ethers.getSigners();

        const Factory = await ethers.getContractFactory("Vault");
        const vault = await Factory.deploy(user1);
        vault.waitForDeployment();

        return { user1, vault }
    }

    it("should be deployed", async function() {
        const { user1, vault } = await loadFixture(deploy);

        console.log(vault.target);
    });


});