import { useEffect, useState } from "react";
import { connect } from "react-redux";
import Navbar from "../Components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Request.css"; // Import CSS file for styling

const Request = ({ contract, web3 }) => {
    const Web3 = require('web3');
    const [buyerData, setBuyerData] = useState(null);
    const [sellerData, setSellerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            let accounts = await window.ethereum.request({
                method: "eth_accounts",
            });
            try {
                let buyerOrgs = await contract.contract.methods
                    .getUnverifiedBuyers()
                    .call({ from: accounts[0] });
                let sellerOrgs = await contract.contract.methods
                    .getUnverifiedSellers()
                    .call({ from: accounts[0] });

                buyerOrgs = convertHexToAsciiBuyers(buyerOrgs);
                sellerOrgs = convertHexToAsciiSeller(sellerOrgs);

                setBuyerData(buyerOrgs);
                setSellerData(sellerOrgs);
            } catch (err) {
                setError(err.message);
            }
            setLoading(false);
        })();
    }, []);

    const convertHexToAsciiBuyers = (orgs) => {
        let data = []
        orgs.map((org) => {
            data.push({
                id: org.id,
                name: Web3.utils.hexToAscii(org["name"]),
                aadharno: Web3.utils.hexToAscii(org["aadharno"]),
                addr: Web3.utils.hexToAscii(org["addr"]),
                con: Web3.utils.hexToAscii(org["con"]),
                role: Web3.utils.hexToAscii(org["role"]),
                typ: Web3.utils.hexToAscii(org["typ"]),
                landdetails: Web3.utils.hexToAscii(org["landdetails"]),
                fertilizersused: Web3.utils.hexToAscii(org["fertilizersused"]),
                noofcrops: Web3.utils.hexToAscii(org["noofcrops"])
            })
        });
        //console.log({data});
        return data;
    };

    const convertHexToAsciiSeller = (orgs) => {
        let data = []
        orgs.map((org) => {
            data.push({
                id: org.id,
                name: Web3.utils.hexToAscii(org["name"]),
                email: Web3.utils.hexToAscii(org["email"]),
                con: Web3.utils.hexToAscii(org["con"]),
                gstno: Web3.utils.hexToAscii(org["gstno"]),
                addr: Web3.utils.hexToAscii(org["addr"]),
                role: Web3.utils.hexToAscii(org["role"]),
                typ: Web3.utils.hexToAscii(org["typ"])
            })
        });
        return data;
    };

    // const convertAsciiToHexBuyer = (org) => {
    //     return {
    //         id: org.id,
    //         name: Web3.utils.asciiToHex(org["name"]),
    //         aadharno: Web3.utils.asciiToHex(org["aadharno"]),
    //         addr: Web3.utils.asciiToHex(org["addr"]),
    //         con: Web3.utils.asciiToHex(org["con"]),
    //         role: Web3.utils.asciiToHex(org["role"]),
    //         typ: Web3.utils.asciiToHex(org["typ"]),
    //         landdetails: Web3.utils.asciiToHex(org["landdetails"]),
    //         fertilizersused: Web3.utils.asciiToHex(org["fertilizersused"]),
    //         noofcrops: Web3.utils.asciiToHex(org["noofcrops"])
    //     };

    // };


    // const convertAsciiToHexSeller = (org) => {
    //     return {
    //         id: org.id,
    //         name: Web3.utils.asciiToHex(org["name"]),
    //         email: Web3.utils.asciiToHex(org["email"]),
    //         con: Web3.utils.asciiToHex(org["con"]),
    //         gstno: Web3.utils.asciiToHex(org["gstno"]),
    //         addr: Web3.utils.asciiToHex(org["addr"]),
    //         role: Web3.utils.asciiToHex(org["role"]),
    //         typ: Web3.utils.asciiToHex(org["typ"])
    //     };
    // };

    const approveBuyer = async (org) => {
        // console.log({org});
        // console.log(org);
        await approveOrg(org, "buyer");
    };

    const approveSeller = async (org) => {
        await approveOrg(org, "seller");
    };

    const approveOrg = async (org, role) => {
        let toastOption = {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        };
        console.log(org);
        console.log(typeof(org));
        // const address=Web3.utils.asciiToHex(org);
        // console.log(address);
        // const buyerToApprove = convertAsciiToHexBuyer(org);
        // if (!web3.web3.utils.isAddress(org)) {
        //     toast.error("Invalid address error", toastOption);
        //     return;
        // }
        let accounts = await window.ethereum.request({
            method: "eth_accounts",
        });

        //const buyerToApprove = convertAsciiToHexBuyer(org);
        //const sellerToApprove = convertAsciiToHexSeller(org);
        await toast.promise(
            role === "buyer"
                ? contract.contract.methods.verifyBuyers(org).send({ from: accounts[0] })
                : contract.contract.methods.verifySellers(org).send({ from: accounts[0] }),
            {
                pending: "Waiting...",
                success: {
                    render({ data }) {
                       // let message = data.events.VerifyOrganization.returnValues._message;
                        if (role === "buyer") {
                            setBuyerData((prevState) =>
                                prevState.filter((item) => item.id !== org.id)
                            );
                        } else {
                            setSellerData((prevState) =>
                                prevState.filter((item) => item.id !== org.id)
                            );
                        }
                        return "Successfully approved";
                    },
                },
                error: {
                    render({ err }) {
                        return "Error : " + err;
                    },
                },
            }
        );
    };

    return (
        <>
            <Navbar />
            <div className="container my-5">
                <h5 className="card-title">New Organization Requests</h5>
                <hr />
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                {buyerData && buyerData.length !== 0 && (
                    <div>
                        <h6>Buyer Requests</h6>
                        <RenderbuyerTable data={buyerData} role="buyer" onApprove={approveBuyer} />
                    </div>
                )}
                {sellerData && sellerData.length !== 0 && (
                    <div>
                        <h6>Seller Requests</h6>
                        <RendersellerTable data={sellerData} role="seller" onApprove={approveSeller} />
                    </div>
                )}
                {(buyerData && buyerData.length === 0) && (sellerData && sellerData.length === 0) && (
                    <p className="text-center">There is no unverified organization</p>
                )}
            </div>
            <ToastContainer />
        </>
    );
};

const RenderbuyerTable = ({ data, role, onApprove }) => {
    return (
        <table className="request-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Aadhar No</th>
                    <th>Address</th>
                    <th>Contact Number</th>
                    <th>Role</th>
                    <th>Type</th>
                    <th>Land Own(in Acres)</th>
                    <th>Fertilizers Used</th>
                    <th>No. of crops grown</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.aadharno}</td>
                        <td>{item.addr}</td>
                        <td>{item.con}</td>
                        <td>{item.role}</td>
                        <td>{item.typ}</td>
                        <td>{item.landdetails}</td>
                        <td>{item.fertilizersused}</td>
                        <td>{item.noofcrops}</td>
                        <td>
                            <button onClick={() => onApprove(item['id'])}>Approve</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

const RendersellerTable = ({ data, role, onApprove }) => {
    return (
        <table className="request-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email Address</th>
                    <th>Contact Number</th>
                    <th>GST Number</th>
                    <th>Address</th>
                    <th>Role</th>
                    <th>Type</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>{item.con}</td>
                        <td>{item.gstno}</td>
                        <td>{item.addr}</td>
                        <td>{item.role}</td>
                        <td>{item.typ}</td>
                        <td>
                            <button onClick={() => onApprove(item['id'])}>Approve</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

const mapStateToProps = (state) => {
    return {
        contract: state.contractReducer,
        web3: state.web3Reducer,
    };
};

export default connect(mapStateToProps)(Request);
