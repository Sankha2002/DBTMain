// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.9.0;
pragma experimental ABIEncoderV2;

contract Org {

    //address admin;
    struct Admin {
        address id;
        bytes name;
        bytes addr;
        bytes email;
        bytes con;
        bytes typ;
        bytes role;
        bool verified;
    }

    struct Farmer {
        address id;
        bytes name;
        bytes aadharno;
        bytes addr;
        bytes con; //contacts
        bytes typ;
        bytes landdetails;
        bytes fertilizersused;
        bytes noofcrops;
        bytes role;
        bool verified;
        uint256 orderCount;
    }

    struct Seller {
        address id;
        bytes name;
        bytes email;
        bytes con;
        bytes gstno;
        bytes addr;
        bytes typ;
        bytes role;
        bool verified;
    }

    struct Order {
        bytes orderId;
        bytes buyername;
        bytes contact;
        uint256 order_date;
        //address sellerId;
        //address buyerId;
        bytes product;
        uint256 quantity;
        uint256 price;
        bytes  gstno;
        bytes Mgstno;
        bool fulfilled;
    }

    //Variables for the objects
    //Admin private admin;
    Admin private adminval;
    Farmer[] private farmers;
    Seller[] private sellers;
    Order[] private orders;
    uint256 MAX_ORDER_COUNT = 5;
    uint256 private verifiedBuyerCount = 0;
    uint256 private verifiedSellerCount = 0;

    //Events
    event onFarmerRegistration(Farmer _farmervalue);
    event onRegisterSeller(Seller _sellervalue);
    event onAddOrders(Order _order);
    event onAddOrdersWholeseller(Order _order);
    event VerifyBuyers(string _message);
    event VerifySellers(string _message);

    //Contractor will create the admin for the contract
    constructor(
        bytes memory name,
        bytes memory addr,
        bytes memory email,
        bytes memory con,
        bytes memory typ
    )  {
        adminval = Admin(msg.sender, name, addr, email, con, typ, "admin", true);
    }

    //To onboard new farmer, will this address be other address ? as farmer will not have the technology for the same
    function registerFarmer(
        bytes memory name,
        bytes memory aadharno,
        bytes memory addr,
        bytes memory con,
        bytes memory typ,
        bytes memory landdetails,
        bytes memory fertilizersused,
        bytes memory noofcrops
    ) public {
        //check for same address 
        Farmer memory farmer = getBuyer();

        require(farmer.id == address(0), "Farmer already registerd");
        
        Farmer memory newFarmer = Farmer(
            msg.sender,
            name,
            aadharno,
            addr,
            con,
            typ,
            landdetails,
            fertilizersused,
            noofcrops,
            "buyer",
            false,
            0
        );
        farmers.push(newFarmer);
        emit onFarmerRegistration(newFarmer);
    }

    //Registration of Seller
    function registerSeller(
        bytes memory name,
        bytes memory email,
        bytes memory con,
        bytes memory gstno,
        bytes memory addr,
        bytes memory typ
    ) public {
        Seller memory seller = getSeller();
        //Can't register same seller again and again
        require(seller.id == address(0), "Seller Already Registered");

        Seller memory sellervalue = Seller(
            msg.sender,
            name,
            email,
            con,
            gstno,
            addr,
            typ,
            "seller",
            false
        );
        sellers.push(sellervalue);
        emit onRegisterSeller(sellervalue);
    }

    function addOrders(
        bytes memory orderId,
        bytes memory buyername,
        bytes memory contact,
        uint256 order_date,
        //address sellerId;
        //address buyerId;
        bytes memory product,
        uint256 quantity,
        uint256 price, 
        bytes memory gstno
    ) public {
        Seller memory seller = getSeller();

        require(seller.id != address(0), "Only registered sellers can place orders");

        require(seller.verified, "Only verified sellers can place orders");

        int256 farmerIdx = getFarmerIdxByContact(contact);

        require(farmerIdx >= 0 , "Farmer not found");

        require(farmers[uint256(farmerIdx)].orderCount < MAX_ORDER_COUNT, "You have exceeded your order limit");
        //cannot place more than one order at same day
        int256 OrderAtSameDate=NoOrderAtSameDate(orderId);
        require(OrderAtSameDate >= 0 , "Cannot place multiple order at same day!!");
        Order memory order = Order({
            orderId: orderId,
            buyername: buyername,
            contact: contact,
            order_date: order_date,
            product: product,
            quantity: quantity,
            price: price,
            gstno: gstno,
            Mgstno: "0x30",
            fulfilled:false
        });
        orders.push(order);

        // Update order count for the buyer
        farmers[uint256(farmerIdx)].orderCount++;
        emit onAddOrders(order);
    }

    function getOrders() public view returns (Order[] memory) {
        return orders;
    }
    //Function to forward order from wholeseller to manufacturer
    function forwardToManuFacturer(
        bytes memory orderId,
        bytes memory manufacturerGstno
    ) public{
        Seller memory seller = getSeller();

        require(seller.id != address(0), "Only registered sellers can place orders");

        require(seller.verified, "Only verified sellers can place orders");
        
        int256 orderIdx = getOrderIdxByOrderId(orderId);

        require(orderIdx >= 0 , "Invalid Order Id");
        orders[uint256(orderIdx)].Mgstno=manufacturerGstno;
    }

    //Function to Fulfill/accept order at Manufacturer end 
    function fulfillOrderManufacturer(bytes memory orderId) public {

        Seller memory seller = getSeller();

        require(seller.id != address(0), "Only registered sellers can place orders");

        require(seller.verified, "Only verified sellers can place orders");
       
        int256 orderIdx = getOrderIdxByOrderId(orderId);

        require(orderIdx >= 0 , "Invalid Order Id");
        orders[uint256(orderIdx)].fulfilled=true;
    }


    function getAdmin() public view returns (Admin memory) {
        return adminval;
    }

    function getBuyer() public view returns (Farmer memory) {
        Farmer memory farmer;
        for (uint256 i = 0; i < farmers.length; i++) {
            if (farmers[i].id == msg.sender) {
                farmer = farmers[i];
            }
        }
        return farmer;
    }

    function getSeller() public view returns (Seller memory) {
        Seller memory seller;
        for (uint256 i = 0; i < sellers.length; i++) {
            if (sellers[i].id == msg.sender) {
                seller = sellers[i];
            }
        }
        return seller;
    }

    function getUnverifiedBuyers() public view returns (Farmer[] memory) {
        Farmer[] memory unverifiedFarmer = new Farmer[](farmers.length - verifiedBuyerCount);
        uint256 fidx = 0;
        for (uint256 i = 0; i < farmers.length; i++) {
            if (!farmers[i].verified) {
                unverifiedFarmer[fidx++] = farmers[i];
            }
        }
        return unverifiedFarmer;
    }

    function getUnverifiedSellers() public view returns (Seller[] memory) {
        Seller[] memory unverifiedSellers = new Seller[](sellers.length - verifiedSellerCount);
        uint256 sidx = 0;
        for (uint256 i = 0; i < sellers.length; i++) {
            if (!sellers[i].verified) {
                unverifiedSellers[sidx++] = sellers[i];
            }
        }
        return unverifiedSellers;
    }

    //Get verified farmers
    function getVerifiedBuyers() public view returns (Farmer[] memory) {
        Farmer[] memory verifiedFarmer = new Farmer[](verifiedBuyerCount);
        uint256 fidx = 0;
        for (uint256 i = 0; i < farmers.length; i++) {
            if (farmers[i].verified) {
                verifiedFarmer[fidx++] = farmers[i];
            }
        }
        return verifiedFarmer;
    }

    function getVerifiedSellers() public view returns (Seller[] memory) {
        Seller[] memory verifiedSellers = new Seller[](verifiedSellerCount);
        uint256 sidx = 0;
        for (uint256 i = 0; i < sellers.length; i++) {
            if (sellers[i].verified) {
                verifiedSellers[sidx++] = sellers[i];
            }
        }
        return verifiedSellers;
    }

        //Farmer verification 
    function verifyBuyers(address _address) public {
        require(msg.sender == adminval.id, "Only admin can verify Buyer");
        for(uint256 i = 0; i < farmers.length; i++){
            if(farmers[i].id == _address){
                farmers[i].verified = true;
                verifiedBuyerCount++;
                emit VerifyBuyers("Farmer update success");
                break;
            }
        }
        emit VerifyBuyers("Couldn't find farmer.");
    }

    function verifySellers(address _address) public {
        require(msg.sender == adminval.id, "Only admin can verify Organization");
        for(uint256 i = 0; i < sellers.length; i++){
            if(sellers[i].id == _address){
                sellers[i].verified = true;
                verifiedSellerCount++;
                emit VerifySellers("Seller update success");
                break;
            }
        }
        emit VerifySellers("Couldn't find seller.");
    }

    function getFarmerIdxByContact(bytes memory contact) private view returns (int256){
        bytes32 con = keccak256(contact);
        for (uint256 i = 0; i < farmers.length; i++) {
            if (con == keccak256(farmers[i].con)) {
               return int256(i);
            }
        }
        return -1;
    }
    function getOrderIdxByOrderId(bytes memory orderId) private view returns(int256){
        bytes32 oid=keccak256(orderId);
        for (uint256 i = 0; i < orders.length; i++) {
            if (oid == keccak256(orders[i].orderId)) {
               return int256(i);
            }
        }
        return -1;
    }
 
    /*Function for cannot place more than one order at same day,if oid matches with orderid
    from orders array will return -1 else will return index*/
    function NoOrderAtSameDate(bytes memory orderId) private view returns(int256){
        bytes32 oid=keccak256(orderId);
        uint256 i;
        for (i = 0; i < orders.length; i++) {
            if (oid == keccak256(orders[i].orderId)) {
               return -1;
            }
        }
        return int256(i);
    }


    function getVerifiedBuyerCount() public view returns (uint256){
        return verifiedBuyerCount;
    }

    function getVerifiedSellerCount() public view returns (uint256){
        return verifiedSellerCount;
    }
}