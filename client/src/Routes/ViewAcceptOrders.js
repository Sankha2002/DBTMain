import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Navbar from "../Components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import Web3 from 'web3'; // Import Web3 if not already imported
import "react-toastify/dist/ReactToastify.css";

const Request = ({ contract, user }) => {
    const [orders, setOrders] = useState([]);
    const [selectedValue, setSelectedValue] = useState('');
    //const [sellerData, setSellerData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
       // handleDropdownChange(); // Fetch seller data when component mounts
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
                console.log(user.gstno);
                // Filter orders based on user's GST number
                const userOrders = order.filter(o => o.manufacturerGstno === user.gstno && o.fulfilled == true );

                setOrders(userOrders);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [contract, user.gstno]); // Include user's GST number in dependencies

   

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
                rgst: Web3.utils.hexToAscii(order.Rgstno),
                gstno: Web3.utils.hexToAscii(order.gstno),
                manufacturerGstno:Web3.utils.hexToAscii(order.Mgstno),
                fulfilled:order.fulfilled,
            });
        });
        console.log({data});
        return data;
    };

   

    // const handleChange = (event) => {
    //     const { name, value } = event.target;
    //     if (name === 'TestDropDown') { // Check if dropdown value changed
    //         setSelectedValue(value); // Set selected value to setSelectedValue
    //     }
    //     // Add your logic here for handling dropdown change
    // };

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
                ) : (
                    <p className="no-orders text-center">No orders available for you.</p>
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

  .custom-dropdown option {
    color: black; /* Set text color for the options */
  }

`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);


