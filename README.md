# Ether_bots
Ethereum based Unique Identity System for Students and Refugees

## Project Idea
By saying ethereum based identity, it’s meant that every user will be assigned an address which can be universally used to authenticate various attributes associated with his identity. 
As a **student**, you can easily skip the cumbersome process of reporting at the centers for verification of documents regarding their admission, by uploading all the documents(10th & 12th marksheet,Transaction receipt,JEE Scorecard) on the portal and verifying them online itself. Once the documents are verified, the student will get a QR Code which will have a hash embedded in it. This QR Code will be shown to the official at the College indicating him that the documents have been verified.
As a **refugee**, who lost their citizenship one can get a BlockID and store all of their data on it. The UN saves your BlockID in their database as a refugee and unlock various schemes for you for example, *World Food Programme* provides cash for food to various refugees, using this BlockID this scheme will be valid for all those whose BlockID is there in the database. 


## Tools and Technologies
A smart contract has been deployed on the *Ropsten Test Network* using Remix IDE. The contract address of the account is 0x19781bcfbed8c82fcf6b226b2febceff3f26c848.
The contract was deployed from the account 0x8d94f5549ec081d77acfae6a0b42692fed75d52f. The Ropsten network is just a test network. Ether in these wallets have no value.
*Metamask* chrome extension wallet is used to store the private-key of various accounts and to sign the messages with the respective private-key.

## Modules & Libraries used :
1. web3 - web3.js library is a collection of modules which contain specific functionality for the ethereum ecosystem.
2. express - minimal and flexible Node.js web application framework used for creating routes.
3. fs - File system module for reading and writing into files.
4. mongoose - MongoDB object modeling tool designed to work in an asynchronous environment.
5. jsonwebtoken - used for implementing JSON Web Tokens.
6. ethereumjs-tx - used for creating, manipulating and signing ethereum transactions.
7. eth-sig-util - used for hashing the password.
8. body-parser - used for parsing middleware.
9. morgan - HTTP request logger middleware for node.js.
10. cors - used for handling CORS errors.

## Running Locally :
Cloning and installing dependencies
```
  git clone https://github.com/hackabit18/Ether_bots
  cd Ether_bots
  npm install
```
Start the server on port 3000 :
```
  cd server
  npm start
```
## Future Scope
This idea would eventually ease the process of physical verification which is quite exhausting and would also be used by the United Nation for providing welfare schemes for Refugees.

## Description and Working
This application consists of four sections:
1. Signup: The user enters his details. If he is a student, he will have some extra documents to upload for verification.
2. Login: The user enters his account address and password. The user gets authenticated and proceeds to profile page.
Note: The password is not saved anywhere in any database. The user is being verified using the *private key-public key logic*. The password user enters in the login page is being signed with the private key with the account address user has entered. If the account address is there in the *Metamask wallet* stored locally, one will get a pop-up prompting for signing the message. Once the message is signed, signature is sent to the smart contract along with the address. The public key or the address itself is recovered and is compared with the entered account address to authenticate the user. This ensures three things, the user address has a legit account address, the password entered is correct, the account owner himself is the one logging in. 
3. Profile: The page will contain all the details of the user. 
