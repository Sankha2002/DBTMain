const ercToken= artifacts.require("MyToken");
module.exports=function(deployer){
    deployer.deploy(ercToken);
}