import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import Navbar from '../Navbar';
import { Dropdown, Form } from "react-bootstrap";

const firebaseConfig = {
  apiKey: "AIzaSyBlsn1YfQ_KNilp9dA2LG2g3ARPqH55Do0",
  authDomain: "dbttest-ce8bc.firebaseapp.com",
  projectId: "dbttest-ce8bc",
  storageBucket: "dbttest-ce8bc.appspot.com",
  messagingSenderId: "92632875625",
  appId: "1:92632875625:web:d824d71da18fc796e298f8"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const PlaceOrder = ({ web3, orgContract, user }) => {
  const Web3 = require('web3');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [sellerData, setSellerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const rgst=Web3.utils.asciiToHex(user.gstno);
  const [formData, setFormData] = useState({
    name: {
      value: '',
      validate: 'required|string',
      error: null,
    },
    con: {
      value: '',
      validate: 'required|number',
      error: null,
    },
    order_date: {
      value: '',
      validate: 'required|date',
      error: null,
    },
    productname: {
      value: '',
      validate: 'required|string',
      error: null,
    },
    quantity: {
      value: '',
      validate: 'required|number',
      error: null,
    },
    price: {
      value: '',
      validate: 'required|number',
      error: null,
    },
    rgst: {
      value: '',
      validate: 'required|string',
      error: null,
    },
  });

  useEffect(() => {
    
    handleDropdownChange(); // Fetch seller data when component mounts
  }, []); // Run only once after initial render

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile') {
      setMobile(value);
    } else if (name === 'otp') {
      setOtp(value);
    } else if (name === 'TestDropDown') { // Check if dropdown value changed
      setSelectedValue(value); // Set selected value to setSelectedValue
    } else {
      setFormData({
        ...formData,
        [name]: {
          ...formData[name],
          value: value,

        },
      });
    }
  };

  const handleDropdownChange = async () => {
    setLoading(true);
    let accounts = await window.ethereum.request({
      method: "eth_accounts",
    });

    try {
      let seller = [];
      let sellerorgs = await orgContract.contract.methods.getVerifiedSellers().call({ from: accounts[0] });

      sellerorgs = convertHexToAsciiSeller(sellerorgs);

      for (var i = 0; i < sellerorgs.length; i++) {
        if (sellerorgs[i]['typ'] === "Wholeseller") {
          seller.push(sellerorgs[i]);
        }
      }

      setSellerData(seller);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError("Error fetching seller data. Please try again.");
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
  
      const phoneNumber = '+91' + formData.con.value;
      const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
        size: 'invisible',
        callback: (response) => {
          console.log('Recaptcha verified');
        },
        defaultCountry: 'IN',
      });
  
      const confirmationResult = await firebase.auth().signInWithPhoneNumber(phoneNumber, recaptchaVerifier);
      window.confirmationResult = confirmationResult;
      console.log('OTP has been sent');
      alert('OTP has been sent');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  
  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const Web3 = require('web3');
    let date = new Date(formData.order_date.value);
    function generateOrderId(){
      const id=formData.con.value+formData.order_date.value;
      return id;
    }
    const oid=generateOrderId();
    
    try {
      console.log("Hello");
      setLoading(true);
      setError(null);
      setSuccess(null);
      console.log("Hello1");
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;
      console.log(oid);
      console.log('User is verified:', user);
      console.log(oid);
      alert('Farmer is verified');
  
      let address = await window.ethereum.request({
        method: "eth_accounts",
      });
      const orderid = Web3.utils.asciiToHex(oid);
      console.log(oid);
      const name = Web3.utils.asciiToHex(formData.name.value);
  
      const contact = Web3.utils.asciiToHex(formData.con.value);
  
      const productname = Web3.utils.asciiToHex(formData.productname.value);
      console.log(rgst)
      
      let Wgstno = selectedValue; // Assuming selectedValue holds the selected seller id
      console.log(Wgstno);
      let gstno=Web3.utils.asciiToHex(Wgstno);
      //const Mgstno=Web3.utils.asciiToHex(" ");
      

      await orgContract.contract.methods
        .addOrders(
          orderid,
          name,
          contact,
          date.getTime(),
          productname,
          formData.quantity.value,
          formData.price.value,
          rgst,
          gstno, // Include the selected seller id here
        )
        .send({ from: address[0] });
  
      setLoading(false);
      setSuccess('Successfully Placeorder waiting for confirmation!!!');
    } catch (e) {
      setLoading(false);
      setError('Error while Placeordering');
    }
  };
  

  return (
    <>
      <style>
        {`
          .Placeorder-wrapper {
            margin: 20px;
          }

          .Placeorder-form {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          
          .form-label {
            font-weight: bold;
          }
          
          .invalid-feedback {
            color: red;
          }
          
          .input-group-text {
            background-color: #f9f9f9;
          }
          
          .btn-primary {
            background-color: #007bff;
            border-color: #007bff;
          }
          
          .btn-primary:hover {
            background-color: #0056b3;
            border-color: #0056b3;
          }
          
          .left-wrapper {
            background-color: #f0f0f0;
          }
          
          .right-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          @media (max-width: 768px) {
            .right-wrapper {
              padding-top: 20px;
            }
          }
          
          /* Dropdown container */
          .dropdown-container {
            position: relative;
            display: inline-block;
          }
          
          /* Dropdown select */
          .dropdown-select {
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            background-color: #fff;
            cursor: pointer;
            color: black; /* Change the color to your desired color */
          }
          
          .custom-dropdown {
            color: black; /* Set text color for the dropdown */
          }
          
          .custom-dropdown option {
            color: black; /* Set text color for the options */
          }
          `}
          </style>
          <Navbar />
          <div className="Placeorder-wrapper">
            <div className="row g-0">
              <div className="col-md-4 left-wrapper"></div>
              <div className="col-md-8 p-3 right-wrapper">
                <form className="Placeorder-form" onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="alert alert-primary" role="alert">
                      {success}
                    </div>
                  )}
                  <div>
                    <h2 className="mb-1">New Order</h2>
                    <hr />
          
                    <div className="mb-3">
                      <label className="form-label">
                        <font color="black">Buyer Name</font>
                      </label>
                      <input
                        type="text"
                        onChange={handleChange}
                        value={formData.name.value}
                        name="name"
                        placeholder="Enter name of the farmer"
                        className={`form-control ${
                          formData.name.error ? "is-invalid" : ""
                        }`}
                      />
                      {formData.name.error && (
                        <div className="invalid-feedback">
                          {formData.name.error}
                        </div>
                      )}
                    </div>
          
                    <div className="mb-3">
                      <label className="form-label">
                        <font color="black">Mobile Number</font>
                      </label>
                      <input
                        type="number"
                        onChange={handleChange}
                        value={formData.con.value}
                        name="con"
                        placeholder="Enter mobile number"
                        className={`form-control ${
                          formData.con.error ? "is-invalid" : ""
                        }`}
                      />
                      {formData.con.error && (
                        <div className="invalid-feedback">{formData.con.error}</div>
                      )}
                    </div>
          
                    <div className="col-md-6">
                      <label className="form-label">Order Date</label>
                      <input
                        type="date"
                        onChange={handleChange}
                        value={formData.order_date.value}
                        name="order_date"
                        placeholder="Enter Order Date"
                        className={`form-control ${
                          formData.order_date.error ? "is-invalid" : ""
                        }`}
                      />
          
                      {formData.order_date.error && (
                        <div className="invalid-feedback">
                          {formData.order_date.error}
                        </div>
                      )}
                    </div>
          
                    <div className="mb-3">
                      <label className="form-label">
                        <font color="black">Product Name</font>
                      </label>
                      <input
                        type="text"
                        onChange={handleChange}
                        value={formData.productname.value}
                        name="productname"
                        placeholder="Enter product name"
                        className={`form-control ${
                          formData.productname.error ? "is-invalid" : ""
                        }`}
                      />
                      {formData.productname.error && (
                        <div className="invalid-feedback">
                          {formData.productname.error}
                        </div>
                      )}
                    </div>
          
                    <div className="mb-3">
                      <label className="form-label">
                        <font color="black">Quantity(in Kg)</font>
                      </label>
                      <input
                        type="number"
                        onChange={handleChange}
                        value={formData.quantity.value}
                        name="quantity"
                        placeholder="Enter Quantity Required"
                        className={`form-control ${
                          formData.quantity.error ? "is-invalid" : ""
                        }`}
                      />
          
                      {formData.quantity.error && (
                        <div className="invalid-feedback">
                          {formData.quantity.error}
                        </div>
                      )}
                    </div>
                   
                    <div className="mb-3">
                      <label className="form-label">
                        <font color="black">Price(in Rs)</font>
                      </label>
                      <input
                        type="number"
                        onChange={handleChange}
                        value={formData.price.value}
                        name="price"
                        placeholder="Enter the Price"
                        className={`form-control ${
                          formData.price.error ? "is-invalid" : ""
                        }`}
                      />
          
                      {formData.price.error && (
                        <div className="invalid-feedback">
                          {formData.price.error}
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">
                        <font color="black">Retailer GST No.</font>
                      </label>
                      <input
                        type="text"
                        onChange={handleChange}
                        value={formData.rgst.value || user.gstno}
                        name="rgst"
                        readOnly
                        className={`form-control ${
                          formData.rgst.error ? "is-invalid" : ""
                        }`}
                      />
                      {formData.rgst.error && (
                        <div className="invalid-feedback">
                          {formData.rgst.error}
                        </div>
                      )}
                    </div>
                    <h5>Select Wholeseller GST No.</h5>
                    <div className="dropdown-container">
                      <select
                        name="TestDropDown"
                        id="TestDropDown"
                        onChange={handleChange}
                        className="custom-dropdown" // Add a class for custom styling
                      >
                        <option value="setSelectedValue">Select from dropdown</option>
                        {sellerData.map((item, index) => (
                          <option key={index} value={item.gstno}>
                            {item.gstno}
                          </option>
                        ))}
                      </select>
                    
          
                      {/* <div className="dropdown-options">
                          {sellerData.map((item, index) => (
                            <div
                              key={index}
                              className="dropdown-option"
                            >
                              {item.gstno}
                            </div>
                          ))}
                        </div> */}
                    </div>
          
                    <button
                      type="submit"
                      className="btn btn-primary"
                      id="sign-in-button"
                    >
                      {loading && (
                        <div
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      )}
                      Place Order
                    </button>
                  </div>
                </form>
                <form onSubmit={onSubmitOTP}>
                  <input
                    type="text"
                    onChange={handleChange}
                    value={otp}
                    name="otp"
                    placeholder="Enter OTP"
                    className="form-control mb-3"
                  />
                  <button type="submit" className="btn btn-primary">
                    Verify OTP
                  </button>
                </form>
              </div>
            </div>
          </div>
          </>
  );
};

const mapStateToProps = (state) => {
  return {
    web3: state.web3Provider,
    orgContract: state.contractReducer,
    user: state.userReducer // Assuming you have a user state in your Redux store
  };
};

export default connect(mapStateToProps)(PlaceOrder);
