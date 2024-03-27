import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Navbar from "../Components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import Web3 from 'web3'; // Import Web3 if not already imported
import "react-toastify/dist/ReactToastify.css";

const Request = ({ contract, user }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                let accounts = await window.ethereum.request({
                    method: "eth_accounts",
                });
                let order = await contract.contract.methods
                    .getOrders()
                    .call({ from: accounts[0] });
                    console.log({order});
                // Convert orders from bytes to ASCII
                order = convertHexToAsciiOrders(order);
                console.log({order});
                // Filter orders based on user's GST number
                const userOrders = order.filter(o => o.gstno === user.gstno && o.manufacturerGstno !== '0x30' );
                setOrders(userOrders);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [contract, user.gstno]);

    const convertHexToAsciiOrders = (orders) => {
        let data = orders.map((order) => ({
            orderId: Web3.utils.hexToAscii(order.orderId),
            buyername: Web3.utils.hexToAscii(order.buyername),
            contact: Web3.utils.hexToAscii(order.contact),
            order_date: parseInt(order.order_date), // Convert to number
            product: Web3.utils.hexToAscii(order.product),
            quantity: order.quantity,
            price: order.price,
            rgst: Web3.utils.hexToAscii(order.Rgstno),
            gstno: Web3.utils.hexToAscii(order.gstno),
            manufacturerGstno:Web3.utils.hexToAscii(order.Mgstno),
        }));
        console.log({data});
        return data;
    };

    return (
        <>
            <Navbar />
            <div className="container my-5">
                <h5 className="card-title">Orders</h5>
                <hr />
                {loading && <p className="loading">Loading...</p>}
                {error && <p className="error">{error}</p>}
                {orders.length > 0 ? (
                    <table className="request-table">
                        <thead>
                            <tr>
                                <th>Order Id</th>
                                <th>Name</th>
                                <th>Contact</th>
                                <th>Order Date</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Retailer GST No</th>
                                <th>Wholeseller GST No</th>
                                <th>Manufacturer GST No</th> {/* New column for dropdown */}
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr key={index}>
                                    <td>{order.orderId}</td>
                                    <td>{order.buyername}</td>
                                    <td>{order.contact}</td>
                                    <td>{new Date(order.order_date).toLocaleDateString()}</td>
                                    <td>{order.product}</td>
                                    <td>{order.quantity}</td>
                                    <td>{order.price}</td>
                                    <td>{order.rgst}</td>
                                    <td>{order.gstno}</td>
                                    <td>{order.manufacturerGstno}</td> {/* Display manufacturer GST No */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ):( 
                    <p className="no-orders text-center"> "No orders placed by you." </p>
                )}
            </div>
            <ToastContainer />
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        contract: state.contractReducer,
        user: state.userReducer // Assuming you have a user state
    };
};

export default connect(mapStateToProps)(Request);
