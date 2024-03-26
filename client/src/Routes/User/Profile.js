import React from "react";
import { connect } from "react-redux";
import Navbar from "../../Components/Navbar";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
function Profile({ user }) {
    return (
        <>
            <Navbar />

            <div className="container my-4" >
                {/* TODO: Later here display metamask details */}
                <Card className="mb-3" style={{ backgroundColor: '#F1F3F3' }}>
                    <Card.Body>
                        <p className="text-center text-muted m-0">
                            <font color="black"> You are login with metamask</font>
                        </p>
                    </Card.Body>
                </Card>
                <Card style={{ backgroundColor: '#F1F3F3' }}>
                    <Card.Body>
                        {user ? (
                            <>
                                <div >
                                    <span
                                        className="material-icons-two-tone"
                                        style={{ fontSize: "4rem" }}
                                    >
                                    </span>
                                </div>
                                <h5 className="card-title" >
                                    {user.name}{" "}
                                    {user.role === "admin" && (
                                        <>
                                            {"(Admin)"}
                                            <hr />
                                            <p className=" mb-0 text-muted">
                                                Address
                                            </p>
                                            <p>{user.addr}</p>
                                            <p className=" mb-0 text-muted">Email</p>
                                            <p>{user.email}</p>
                                            <p className=" mb-0 text-muted">
                                                Contact Number
                                            </p>
                                            <p>{user.con}</p>
                                            <p className=" mb-0 text-muted">Type
                                            </p>
                                            <p>{user.typ}</p>
                                            <br />
                                            <br />
                                            <br />
                                            <br />
                                            <br />
                                        </>
                                    )}




                                    {user.role === "buyer" && (
                                        <>
                                            {" "}
                                            {user.verified
                                                ? "(Verified)"
                                                : "(Not Verified)"}
                                            <hr />
                                            <p className=" mb-0 text-muted">
                                                AadharNo
                                            </p>
                                            <p>{user.aadharno}</p>
                                            <p className=" mb-0 text-muted">
                                                Address
                                            </p>
                                            <p>{user.addr}</p>
                                            <p className=" mb-0 text-muted">
                                                Contact Number
                                            </p>
                                            <p>{user.con}</p>
                                            <p className=" mb-0 text-muted">Type
                                            </p>
                                            <p>{user.typ}</p>
                                            <p className=" mb-0 text-muted">Land Own(In Acres)</p>
                                            <p>{user.landdetails}</p>
                                            <p className=" mb-0 text-muted">FertilizersUsed</p>
                                            <p>{user.fertilizersused}</p>
                                            <p className=" mb-0 text-muted">Number Of crops grown per year</p>
                                            <p>{user.noofcrops}</p>
                                            <br />
                                            <br />
                                            <br />
                                            <br />
                                            <br />


                                        </>
                                    )}

                                    {user.role === "seller" && (
                                        <>
                                            {" "}
                                            {user.verified
                                                ? "(Verified)"
                                                : "(Not Verified)"}
                                            <hr />
                                            <p className=" mb-0 text-muted">
                                                Email Address
                                            </p>
                                            <p>{user.email}</p>
                                            <p className=" mb-0 text-muted">
                                                Contact Number
                                            </p>
                                            <p>{user.con}</p>
                                            <p className=" mb-0 text-muted">
                                                GST No.
                                            </p>
                                            <p>{user.gstno}</p>
                                            <p className=" mb-0 text-muted">
                                                Address
                                            </p>
                                            <p>{user.addr}</p>
                                            <p className=" mb-0 text-muted">Type
                                            </p>
                                            <p>{user.typ}</p>
                                        </>
                                    )}
                                </h5>
                               
                            </>

                        )
                            : (
                                <p>
                                    Please register first then you will use out
                                    dapp. <Link to="/register">Register</Link>
                                </p>
                            )}
                    </Card.Body>
                </Card>
            </div>
        </>
    );
}

const mapsStateToProps = (state) => {
    return {
        user: state.userReducer,
    };
};

export default connect(mapsStateToProps)(Profile);