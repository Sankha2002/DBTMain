import { Routes, Route } from "react-router-dom";
import Home from "./Routes/Home.js";
import Login from "./Routes/Auth/Login.js";
import AuthProvider from "./Redirects/AuthProvider.js";
import Profile from "./Routes/User/Profile.js";
import Register from "./Routes/Auth/Register.js";
import RegisterProvide from "./Redirects/RegisterProvide.js";
import AdminProvider from "./Redirects/AdminProvider.js";
import Request from "./Routes/Request.js";
// import AddPatient from "./Components/Forms/AddPatient.js";
//import NewPatient from "./Components/Forms/NewPatient.js";
import PlaceOrder from "./Components/Forms/placeorder.js"
import ViewOrg from "./Routes/ViewOrg.js";
//import AddPatient from "./Components/Forms/AddPatient.js"

import Patient from "./Routes/Patient.js"
import OrderSearch from "./Routes/OrderSearch.js";
import OrderSearchManu from "./Routes/OrderSearchManu.js";
import ViewOrdersFarmer from "./Routes/ViewOrderFarmer.js";
import ViewOrdersWholeseller from "./Routes/ViewOrderWholeseller.js";
import ViewOrdersManufacturer from "./Routes/ViewAcceptOrders.js";
import OrderTrack from "./Routes/OrderTrack.js";


import "react-toastify/dist/ReactToastify.css";

import About from "./Routes/About";
function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About/>}/>
                <Route element={<AuthProvider />}>

                    <Route path="/profile" element={<Profile />} />
                    <Route element={<RegisterProvide />}>
                        <Route path="/register" element={<Register />} />
                    </Route>
                    <Route element={<AdminProvider />}>
                        <Route path="/org-request" element={<Request />} />
                        <Route path="/view-org" element={<ViewOrg />} />
                    </Route>
                     </Route>
                     <Route path="/placeorder" element={<PlaceOrder/>}/>
                     <Route path="/search" element={<OrderSearch/>}/>
                     <Route path="/view-orders" element={<OrderSearchManu/>}/>
                     <Route path="/view-orders-Farmers" element={<ViewOrdersFarmer/>}/>
                     <Route path="/view-orders-Wholeseller" element={<ViewOrdersWholeseller/>}/>
                     <Route path="/view-orders-Manufacturer" element={<ViewOrdersManufacturer/>}/>
                     <Route path="/order-track" element={<OrderTrack/>}/>


                     
                <Route path="/login" element={<Login />} />
            </Routes>
        </>
    );
}

export default App;
