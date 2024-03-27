import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Navbar from "../Components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import Web3 from 'web3'; // Import Web3 if not already imported
import "react-toastify/dist/ReactToastify.css";

const Request = ({ contract, user }) => {
    const [orders, setOrders] = useState([]);
    const [selectedValue, setSelectedValue] = useState('');
    const [sellerData, setSellerData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [worders, setWOrders] = useState([]);
    const [morders, setMOrders] = useState([]);
    const [finorders, setFinOrders] = useState([]);

    useEffect(() => {
        //handleDropdownChange(); // Fetch seller data when component mounts
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
                const userOrders = order.filter(o => o.contact=== user.con);
                setWOrders(userOrders.filter(o =>o.manufacturerGstno === '0x30' && o.gstno !== '0x30'))
                setMOrders(userOrders.filter(o =>o.manufacturerGstno !== '0x30' && o.gstno !== '0x30' && o.fulfilled ===false))
                setFinOrders(userOrders.filter(o =>o.manufacturerGstno !== '0x30' && o.gstno !== '0x30' && o.fulfilled ===true))
                setOrders(userOrders);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [contract, user.con]); // Include user's GST number in dependencies

   

    

    const convertHexToAsciiOrders = (orders) => {
        let data = [];
        orders.map((order) => {
            data.push({
                orderId: Web3.utils.hexToAscii(order.orderId),
                buyername: Web3.utils.hexToAscii(order.buyername),
                contact: Web3.utils.hexToAscii(order.contact),
                order_date: parseInt(order.order_date), // Convert to number
                product: Web3.utils.hexToAscii(order.product),
                quantity: order.quantity,
                price: order.price,
                gstno: Web3.utils.hexToAscii(order.gstno),
                manufacturerGstno:Web3.utils.hexToAscii(order.Mgstno),
                fulfilled:order.fulfilled,
            });
        });
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
                {/* {orders.length > 0 && orders.manufacturerGstno !== '0x30' && orders.gstno !== '0x30' &&(
                    <p className="no-orders text-center">Order Request is forwarded to Wholeseller.</p>
                )} 
                {orders.length > 0 && orders.manufacturerGstno !== '0x30' && orders.gstno !== '0x30' && orders.fulfilled === false &&(
                    <p className="no-orders text-center">Order Request is forwarded to Manufacturer.</p>
                )}
                {orders.length > 0 && orders.manufacturerGstno !== '0x30' && orders.gstno !== '0x30' && orders.fulfilled === true &&(
                    <p className="no-orders text-center">Order Request is accepted by Manufacturer and ready to dispatch.</p>
                )}
                {orders.length < 0  &&(
                    <p className="no-orders text-center">No Order Request for you.</p>
                )} */}
                <table className="request-table">
                    <thead>
                        <tr>
                            <th>Order Id</th>
                            <th>Order Status</th>
                            
                        </tr>
                    </thead>
                {worders.length > 0 ?(
                    
                    <tbody>
                        {worders.map((worder, index) => (
                            <tr key={index}>
                                <td>{worder.orderId}</td>
                                <td>Order Request is forwarded to Wholeseller</td>
                               
                                 {/* Display manufacturer GST No */}
                                
                            </tr>
                        ))}
                    </tbody>
                
                    //  <p className="no-orders text-center">Order Request is forwarded to Wholeseller.</p>
                ):(
                    <p className="no-orders text-center"></p>
                )}
                {morders.length > 0 ?(
                    // <table className="request-table">
                    // <thead>
                    //     <tr>
                    //         <th>Order Id</th>
                    //         <th>Order Status</th>
                            
                    //     </tr>
                    // </thead>
                    <tbody>
                        {morders.map((morder, index) => (
                            <tr key={index}>
                                <td>{morder.orderId}</td>
                                <td>Order Request is forwarded to Manufacturer</td>
                               
                                 {/* Display manufacturer GST No */}
                                
                            </tr>
                        ))}
                    </tbody>
                //</table>
                     //<p className="no-orders text-center">Order Request is forwarded to Manufacturer.</p>
                ):(
                    <p className="no-orders text-center"></p>
                )}
                {finorders.length > 0 ?(
                    // <table className="request-table">
                    // <thead>
                    //     <tr>
                    //         <th>Order Id</th>
                    //         <th>Order Status</th>
                            
                    //     </tr>
                    // </thead>
                    <tbody>
                        {finorders.map((finorder, index) => (
                            <tr key={index}>
                                <td>{finorder.orderId}</td>
                                <td>Order Request is accepted and dispatched by Manufacturer</td>
                               
                                 {/* Display manufacturer GST No */}
                                
                            </tr>
                        ))}
                    </tbody>
               // </table>
                     //<p className="no-orders text-center">Order Request is accepted by Manufacturer and ready to dispatch</p>
                ):(
                    <p className="no-orders text-center"></p>
                )}
                </table>
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






// CSS Styles
const styles = `
.request-table th,
.request-table td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #ccc; /* Change border color if needed */
}

.request-table th {
    background-color: #f2f2f2;
}

.request-table tr:hover {
    background-color: #f5f5f5;
}

.request-table button {
    padding: 8px 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.request-table button:last-child {
    margin-right: 0;
}

.loading,
.error,
.no-orders {
    font-size: 18px;
    color: #777;
}

.dropdown-container {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.custom-dropdown {
    color: black; /* Set text color for the dropdown */
  }

  p.no-orders text-center{
    color: black; /* Set text color for the options */
  }

`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);


