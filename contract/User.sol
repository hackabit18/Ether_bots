pragma solidity ^0.4.0;



   
contract UserProfile{
    


    
    struct User{
    
        bytes32 password;
        bytes32 fingerprint;
        bytes32 email;
        bytes32 phone;
        bytes32 perAddr;
        bytes32 country;
        bytes32 name;
        bytes32 dob;

    }
    address private master;
    mapping(address => User) private users;
    
    
    constructor() public{
        master = msg.sender;
    }
    
    function recover(bytes32 hash, bytes sig) internal pure returns (address) {
    bytes32 r;
    bytes32 s;
    uint8 v;

    //Check the signature length
    if (sig.length != 65) {
      return (address(0));
    }

    // Divide the signature in r, s and v variables
    // ecrecover takes the signature parameters, and the only way to get them
    // currently is to use assembly.
    // solium-disable-next-line security/no-inline-assembly
    assembly {
      r := mload(add(sig, 32))
      s := mload(add(sig, 64))
      v := byte(0, mload(add(sig, 96)))
    }

    // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
    if (v < 27) {
      v += 27;
    }

    // If the version is correct return the signer address
    if (v != 27 && v != 28) {
      return (address(0));
    } else {
      return ecrecover(hash, v, r, s);
    }
  }
    function getUserData(address addr,bytes signature) public constant returns(bytes32 email,bytes32 phone,bytes32 perAddr,bytes32 country, bytes32 name, bytes32 dob){
        require(addr==recover(users[addr].password,signature));
       return(users[addr].email,users[addr].phone,users[addr].perAddr,users[addr].country,users[addr].name,users[addr].dob);
      
    }
    function getFingerprint(address addr,bytes signature) public constant returns(bytes32 fingerprint){
        require(addr==recover(users[addr].password,signature));
        return users[addr].fingerprint;
        
    }

    function setUserData(address addr,bytes32 password,bytes32 fingerprint,bytes32 email,bytes32 phone,bytes32 perAddr,bytes32 country,bytes32 name,bytes32 dob) public {
        users[addr].password = password;
        users[addr].fingerprint = fingerprint;
        users[addr].email = email;
        users[addr].phone = phone;
        users[addr].perAddr = perAddr;
        users[addr].country = country;
        users[addr].name = name;
        users[addr].dob = dob;
       
}


}