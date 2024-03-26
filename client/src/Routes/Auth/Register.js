import React, { useState } from "react";
import { userAdd } from "../../store/actions";
import useValidate from "../../Hooks/useValidate";
import { connect } from "react-redux";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
//import Web3 from "web3";

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


const Register = ({ web3, addUser, orgContract }) => {

    const Web3 = require('web3');
    const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
    const [selectedValue, setSelectedValue] = useState('');

    const [formData, formValidator] = useValidate({
        name: {
            value: "",
            validate: "required|string",
            error: null,
        },
        aadharno: {
            value: "",
            validate: "required|number",
            error: null,
        },
        addr: {
            value: "",
            validate: "required|string",
            error: null
        },
        con: {
            value: "",
            validate: "required|number",
            error: null,
        },
        typ: {
            value: "",
            validate: "required|string",
            error: null,
        },
        email: {
            value: "",
            validate: "required|email",
            error: null,
        },
        gstno: {
            value: "",
            validate: "required|string",
            error: null,
        },
    
        landdetails: {
            value: "",
            validate: "required|string",
            error: null,
        },
        fertilizersused: {
            value: "",
            validate: "required|string",
            error: null,
        },
        noofcrops: {
            value: "",
            validate: "required|string",
            error: null,
        },

    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        e.preventDefault();
        formValidator.validOnChange(e.currentTarget);
    };

    const handleBuyerSubmit = async (e) => {
        e.preventDefault();
        // if (!formValidator.validate()){
        // console.log("validation failed")
        // return;
    //}
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const address = await window.ethereum.request({
                method: "eth_accounts",
            });
            console.log(orgContract);
            const namefarmer = Web3.utils.asciiToHex(formData.name.value);
            const aadharno = Web3.utils.asciiToHex(formData.aadharno.value);
            const addr = Web3.utils.asciiToHex(formData.addr.value);
            const con = Web3.utils.asciiToHex(formData.con.value);
            const typ = Web3.utils.asciiToHex(formData.typ.value);
            const landdetails=Web3.utils.asciiToHex(formData.landdetails.value);
            const fertilizersused=Web3.utils.asciiToHex(formData.fertilizersused.value);
            const noofcrops=Web3.utils.asciiToHex(formData.noofcrops.value);

            console.log({namefarmer});
            await orgContract.contract.methods.registerFarmer(
                namefarmer,
                aadharno,
                addr,
                con,
                typ,
                landdetails,
                fertilizersused,
                noofcrops
            ).send({ from: address[0] });

            setLoading(false);
            setSuccess("Successfully registered as Buyer! Waiting for confirmation.");
        } catch (e) {
            setLoading(false);
            console.log(e);
            setError("Error while registering as Buyer");
        }
    };

    const handleSellerSubmit = async (e) => {
        e.preventDefault();
        //if (!formValidator.validate()) return;
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const address = await window.ethereum.request({
                method: "eth_accounts",
            });

            const name = Web3.utils.asciiToHex(formData.name.value);
            const email = Web3.utils.asciiToHex(formData.email.value);
            const addr = Web3.utils.asciiToHex(formData.addr.value);
            const con = Web3.utils.asciiToHex(formData.con.value);
            const gstno = Web3.utils.asciiToHex(formData.gstno.value);
            const typ = Web3.utils.asciiToHex(formData.typ.value);

            await orgContract.contract.methods.registerSeller(
                name,
                email,
                con,
                gstno,
                addr,
                typ
            ).send({ from: address[0] });

            setLoading(false);
            setSuccess("Successfully registered as Seller! Waiting for confirmation.");
        } catch (e) {
            setLoading(false);
            setError("Error while registering as Seller");
        }
    };

    const handleDropdownChange = (e) => {
        setSelectedValue(e.target.value);
    };

    return (
        <div className="register-wrapper">
            <div className="row g-0">
                <div className="col-md-4 left-wrapper"></div>
                <div className="col-md-8 p-3 right-wrapper">
                    <select
                        className="form-select mb-3"
                        value={selectedValue}
                        onChange={handleDropdownChange}
                    >
                        <option value="">Select registration type</option>
                        <option value="buyer">Register as Buyer</option>
                        <option value="seller">Register as Seller</option>
                    </select>
                    {selectedValue === "buyer" && (
                        <form className="register-form" onSubmit={handleBuyerSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    onChange={handleChange}
                                    value={formData.name.value}
                                    name="name"
                                    placeholder="Enter name of the Farmer"
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
                                <label className="form-label">Aadhar No.</label>
                                <input
                                    type="text"
                                    onChange={handleChange}
                                    value={formData.aadharno.value}
                                    name="aadharno"
                                    placeholder="Enter Aadhar No."
                                    className={`form-control ${
                                        formData.aadharno.error ? "is-invalid" : ""
                                    }`}
                                />
                                {formData.aadharno.error && (
                                    <div className="invalid-feedback">
                                        {formData.aadharno.error}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Address</label>
                                <input
                                    onChange={handleChange}
                                    value={formData.addr.value}
                                    type="text"
                                    placeholder="Enter address"
                                    name="addr"
                                    className={`form-control ${
                                        formData.addr.error ? "is-invalid" : ""
                                    }`}
                                />
                                {formData.addr.error && (
                                    <div className="invalid-feedback">
                                        {formData.addr.error}
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Mobile No.</label>
                                <div className="input-group">
                                    <span className="input-group-text">+91</span>
                                    <input
                                        onChange={handleChange}
                                        value={formData.con.value}
                                        name="con"
                                        placeholder="Enter mobile number"
                                        type="text"
                                        className={`form-control ${
                                            formData.con.error ? "is-invalid" : ""
                                        }`}
                                    />
                                    {formData.con.error && (
                                        <div className="invalid-feedback">
                                            {formData.con.error}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Type</label>
                                <input
                                    onChange={handleChange}
                                    value={formData.typ.value}
                                    name="typ"
                                    placeholder="Enter Type"
                                    type="text"
                                    className={`form-control ${
                                        formData.typ.error ? "is-invalid" : ""
                                    }`}
                                />
                                {formData.typ.error && (
                                    <div className="invalid-feedback">
                                        {formData.typ.error}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Land Own(in Acres)</label>
                                <input
                                    type="text"
                                    onChange={handleChange}
                                    value={formData.landdetails.value}
                                    name="landdetails"
                                    placeholder="Enter how much land own"
                                    className={`form-control ${
                                        formData.landdetails.error ? "is-invalid" : ""
                                    }`}
                                />
                                {formData.landdetails.error && (
                                    <div className="invalid-feedback">
                                        {formData.landdetails.error}
                                    </div>
                                )}
                            </div>


                            <div className="mb-3">
                                <label className="form-label">Fertilizer Required</label>
                                <input
                                    type="text"
                                    onChange={handleChange}
                                    value={formData.fertilizersused.value}
                                    name="fertilizersused"
                                    placeholder="Enter name of the fertilizers you want to use"
                                    className={`form-control ${
                                        formData.fertilizersused.error ? "is-invalid" : ""
                                    }`}
                                />
                                {formData.fertilizersused.error && (
                                    <div className="invalid-feedback">
                                        {formData.fertilizersused.error}
                                    </div>
                                )}
                            </div>


                            <div className="mb-3">
                                <label className="form-label">No. of crops grown per year</label>
                                <input
                                    type="text"
                                    onChange={handleChange}
                                    value={formData.noofcrops.value}
                                    name="noofcrops"
                                    placeholder="Enter no. of crops you want to grow"
                                    className={`form-control ${
                                        formData.noofcrops.error ? "is-invalid" : ""
                                    }`}
                                />
                                {formData.noofcrops.error && (
                                    <div className="invalid-feedback">
                                        {formData.noofcrops.error}
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="btn btn-primary">Register as Buyer</button>
                        </form>
                    )}
                    {selectedValue === "seller" && (
                        <form className="register-form" onSubmit={handleSellerSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    onChange={handleChange}
                                    value={formData.name.value}
                                    name="name"
                                    placeholder="Enter name of the seller"
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
                                <label className="form-label">Email address</label>
                                <input
                                    onChange={handleChange}
                                    value={formData.email.value}
                                    placeholder="Enter email address"
                                    type="email"
                                    className={`form-control ${
                                        formData.email.error ? "is-invalid" : ""
                                    }`}
                                    name="email"
                                />
                                {formData.email.error && (
                                    <div className="invalid-feedback">
                                        {formData.email.error}
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Mobile No.</label>
                                <div className="input-group">
                                    <span className="input-group-text">+91</span>
                                    <input
                                        onChange={handleChange}
                                        value={formData.con.value}
                                        name="con"
                                        placeholder="Enter mobile number"
                                        type="text"
                                        className={`form-control ${
                                            formData.con.error ? "is-invalid" : ""
                                        }`}
                                    />
                                    {formData.con.error && (
                                        <div className="invalid-feedback">
                                            {formData.con.error}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">GST No.</label>
                                <input
                                    onChange={handleChange}
                                    value={formData.gstno.value}
                                    name="gstno"
                                    placeholder="Enter GST No."
                                    type="text"
                                    className={`form-control ${
                                        formData.gstno.error ? "is-invalid" : ""
                                    }`}
                                />
                                {formData.gstno.error && (
                                    <div className="invalid-feedback">
                                        {formData.gstno.error}
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Address</label>
                                <input
                                    onChange={handleChange}
                                    value={formData.addr.value}
                                    type="text"
                                    placeholder="Enter address"
                                    name="addr"
                                    className={`form-control ${
                                        formData.addr.error ? "is-invalid" : ""
                                    }`}
                                />
                                {formData.addr.error && (
                                    <div className="invalid-feedback">
                                        {formData.addr.error}
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Type</label>
                                <input
                                    onChange={handleChange}
                                    value={formData.typ.value}
                                    name="typ"
                                    placeholder="Enter Type"
                                    type="text"
                                    className={`form-control ${
                                        formData.typ.error ? "is-invalid" : ""
                                    }`}
                                />
                                {formData.typ.error && (
                                    <div className="invalid-feedback">
                                        {formData.typ.error}
                                    </div>
                                )}
                            </div>
                            <button type="submit" className="btn btn-primary">Register as Seller</button>
                        </form>
                    )}
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        web3: state.web3Provider,
        orgContract: state.contractReducer,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setUser: (user) => {
            dispatch(userAdd(user));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
