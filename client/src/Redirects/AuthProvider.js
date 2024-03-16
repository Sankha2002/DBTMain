import { Navigate, useLocation, Outlet } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
    web3Loading,
    web3Success,
    web3Error,
    contractSuccess,
    userAdd,
} from "../store/actions";
import OrgArtifact from "../artifact/Org.json";
import Web3 from "web3";
import { Loader } from "../Components/Loader";

function AuthProvider({
    web3,
    contractSuccess,
    web3Success,
    web3Error,
    userAdd,
}) {
    let location = useLocation();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async function () {
            const { abi, networks } = OrgArtifact;
            let web3 = null;
            let accounts;
            if (window.ethereum) {
                accounts = await window.ethereum.request({
                    method: "eth_accounts",
                });
                if (accounts.length === 0) {
                    setLoading(false);
                    return;
                }
                try {
                    await window.ethereum.request({
                        method: "eth_requestAccounts",
                    });
                    web3 = new Web3(window.ethereum);
                } catch (e) {
                    web3Error(e.message);
                    setLoading(false);
                    return;
                }
            } else if (window.web3) {
                web3 = new Web3(window.web3.currentProvider);
            } else web3 = new Web3("http://127.0.0.1:7545/");
            console.log(networks);
            let contract = new web3.eth.Contract(abi, networks[5777].address);
            
           // Fetch admin details
        let admin = await contract.methods.getAdmin().call({ from: accounts[0] });
		// Fetch buyer details
		let buyer = await contract.methods.getBuyer().call({ from: accounts[0] });

        let seller = await contract.methods.getSeller().call({ from: accounts[0] });
        console.log({admin,buyer,seller});
        const accountid=accounts[0];
        console.log(typeof(accounts[0]));
        console.log(typeof(admin.id));
        console.log(parseInt(admin.id,16)==parseInt(accountid,16));
       // if(admin.id!=="0x"){
        if (parseInt(admin.id,16)==parseInt(accountid,16)) {
            //console.log(parseInt(admin.id,16)==parseInt(accountid,16));
            userAdd({
                email: web3.utils.hexToAscii(admin.email),
                name: web3.utils.hexToAscii(admin.name),
                addr: web3.utils.hexToAscii(admin.addr),
                con: web3.utils.hexToAscii(admin.con),
                role: web3.utils.hexToAscii(admin.role),
                typ: web3.utils.hexToAscii(admin.typ),
                verified: admin.verified
            });
        }
        else if(parseInt(buyer.id,16)==parseInt(accountid,16))
        {
        // } 
        // else if (buyer.id == accounts[0]) {
            
                userAdd({
                        name: web3.utils.hexToAscii(buyer.name),
                        aadharno:web3.utils.hexToAscii(buyer.aadharno),
                        addr: web3.utils.hexToAscii(buyer.addr),
                        con: web3.utils.hexToAscii(buyer.con),
                        role: web3.utils.hexToAscii(buyer.role),
                        typ: web3.utils.hexToAscii(buyer.typ),
                        landdetails: web3.utils.hexToAscii(buyer.landdetails),
                        fertilizersused: web3.utils.hexToAscii(buyer.fertilizersused),
                        noofcrops: web3.utils.hexToAscii(buyer.noofcrops),
                        verified: buyer.verified
                });
            
         } 
         else if(parseInt(seller.id,16)==parseInt(accountid,16)){
        //     // Fetch seller details
       
        //     if (seller.id == accounts[0]) {
                userAdd({
                        name: web3.utils.hexToAscii(seller.name),
                        email: web3.utils.hexToAscii(seller.email),
                        con: web3.utils.hexToAscii(seller.con),
                        gstno: web3.utils.hexToAscii(seller.gstno),
                        addr: web3.utils.hexToAscii(seller.addr),
                        role: web3.utils.hexToAscii(seller.role),
                        typ: web3.utils.hexToAscii(seller.typ),
                        verified: seller.verified                });
            }
               
                 console.log(buyer.id);
                 console.log(accounts[0]);
            contractSuccess(contract);
            web3Success(web3);
            setLoading(false);
        })();
    }, [contractSuccess, web3Success, web3Error, userAdd]);
    if (loading) {
        return <Loader />;
    } else if (web3.error) {
        return <p>{web3.error}</p>;
    } else if (web3.web3) {
        return <Outlet />;
    } else {
        return <Navigate to="/login" state={{ from: location }} />;
    }
}
const mapStateToProps = (state) => {
    return {
        web3: state.web3Reducer,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        web3Loading: () => {
            dispatch(web3Loading());
        },
        web3Error: (e) => {
            dispatch(web3Error(e));
        },
        web3Success: (web3) => {
            dispatch(web3Success(web3));
        },
        contractSuccess: (contract) => {
            dispatch(contractSuccess(contract));
        },
        userAdd: (user) => {
            dispatch(userAdd(user));
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(AuthProvider);
