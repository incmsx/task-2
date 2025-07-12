import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";

const VaultModule = buildModule("VaultModule", (m) => {
    const OWNER = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    const initalAddress = m.getParameter("initialAddress", OWNER);

    const vault = m.contract("Vault", [initalAddress]);

    return { vault };
});

export default VaultModule;