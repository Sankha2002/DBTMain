const Organization = artifacts.require("Org");
const Web3 = require('web3');

module.exports = function (deployer) {
    
    const name = Web3.utils.asciiToHex("Department of Chemicals and Fertilizers");
    const addr = Web3.utils.asciiToHex("Shastri Bhawan, New Delhi - 110001 (India)");
    const email = Web3.utils.asciiToHex("dbtcell-fert@gov.in");
    const con = Web3.utils.asciiToHex("1800115501");
    const typ = Web3.utils.asciiToHex("dbtcell-fertilzer");

    /*const nameHex = Web3.utils.asciiToHex("Department of Chemicals and Fertilizers");
    const name = Web3.utils.hexToBytes(nameHex);
    const addrHex = Web3.utils.asciiToHex("Shastri Bhawan, New Delhi - 110001 (India)");
    const addr = Web3.utils.hexToBytes(addrHex);
    const emailHex = Web3.utils.asciiToHex("dbtcell-fert@gov.in");
    const email = Web3.utils.hexToBytes(emailHex);
    const conHex = Web3.utils.asciiToHex("1800115501");
    const con = Web3.utils.hexToBytes(conHex);
    const typHex = Web3.utils.asciiToHex("dbtcell-fertilzer");
    const typ = Web3.utils.hexToBytes(typHex);*/

    deployer.deploy(Organization, name, addr, email, con, typ);
};
