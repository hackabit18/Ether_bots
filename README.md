# Ether_bots
Ethereum based identity for Students and Refugees

By saying ethereum based identity, it’s meant that every user will be assigned an address which can be universally used to authenticate various attributes associated with his identity. 
As a student, you can easily skip the cumbersome process of reporting at the centers with all the documents by uploading all the documents on the portal and verifying them online itself. Once the documents are verified, the student will get a QR Code which will have a hash embedded in it. This QR Code will be shown to the official at the reporting center indicating him that the documents have been verified.
As a refugee, one can get a BlockID and store all of their data on it. The UN saves your BlockID in their database as a refugee and unlock various schemes for you for eg World Food Programme provides cash for food to various refugees, using this BlockID this scheme will be valid for all those whose BlockID is there in the database. 

A smart contract has been deployed on the Ropsten Test Network using Remix IDE. The contract address of the account is 0x514e011e0Ce512c06E23E192A0469f448b0F52ce.
The contract was deployed from the account This jHVhvbvbwibvvbDVSB. The Ropsten network is just a test network. Ether in these wallets have no value.

This application consists of four sections:
1. Signup: The user enters his details. If he is a student, he will have some extra documents to upload for verification.
2. Login: The user enters his address and password. The user gets authenticated and proceeds to profile page.
Note: The password is not saved anywhere in any database. The user is being verified using the private key-public key logic. The password user enters in the login page is being signed with the private key with the account address user has entered. If the account address is there in the wallet, one will get a pop-up prompting for signing the message. Once the message is signed, signature is sent to the smart contract along with the address. The public key or the address itself is recovered and is compared with the entered the address to authenticate the user. This ensures three things, the user address is a legit address, the password entered is correct, the account owner himself is the one logging in. 
3. Profile: The page will contain all the details of the user. 