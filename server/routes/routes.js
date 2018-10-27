const express = require("express");
const router = express.Router();
const users = require("../models/users.js");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/checkAuth.js');
const Web3 = require('web3');
const fs = require('fs');
const EthereumTx = require('ethereumjs-tx');
const sigUtil = require('eth-sig-util');
const config = require('../config.json');

var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/c3e5ff7e41d34e45bd5e4338a8f6806a"));
/* contract declaration */
web3.eth.defaultAccount = '0x8d94f5549ec081d77acfae6a0b42692fed75d52f';
var privKey = "5D511D4051388235C03AA1D49A847A91269864EAFFFE753FFC0ACD7F685C75C9";
var abi = JSON.parse(fs.readFileSync('./UserAbi.json'));
var address = '0xeea4d4a04d2c01d0402151538e0300753298ceb4';

router.post('/signup',(req,res,next) => {
    users
    .find({accountAddr: req.body.address})
    .exec()
    .then((user) => {
        if(user && user.length>0){
            return res.status(200).json({
                status: "fail",
                message: "The user already exists!"
            });
        }
        //inserting value in the contract;
        var userAddress = req.body.address;
        var bod = req.body;
        let msgParams = [
            {
                type: 'bytes32',
                name: 'Message',
                value: bod.password
            }
        ]
        var password =  sigUtil.typedSignatureHash(msgParams);
        var fingerprint = web3.utils.fromAscii(bod.fingerprint);
        var email = web3.utils.fromAscii(bod.email);;
        var phone = web3.utils.fromAscii(bod.phone);
        var perAddr = web3.utils.fromAscii(bod.perAddr);
        var country = web3.utils.fromAscii(bod.country);
        var name = web3.utils.fromAscii(bod.name);
        var dob = web3.utils.fromAscii(bod.dob);
        web3.eth.getTransactionCount(web3.eth.defaultAccount,(err,nonce) => {
            if(err){
                console.log("err1: "+err);
                res.status(500).json({
                    status: "fail",
                    message: err
                });
            }
            console.log("Nonce value is "+nonce);
            const contract = new web3.eth.Contract(abi, address, {
                from: web3.eth.defaultAccount ,
                gas: 3000000,
            });
            const functionAbi = contract.methods.setUserData(userAddress,password,fingerprint,email,phone,perAddr,country,name,dob).encodeABI();
            var details = {
                "nonce": nonce,
                "gasPrice": web3.utils.toHex(web3.utils.toWei('70', 'gwei')),
                "gas": 3000000,
                "to": address,
                "value": 0,
                "data": functionAbi,
            };
            const transaction = new EthereumTx(details);
            transaction.sign(Buffer.from(privKey,'hex'));
            var rawdata = '0x' + transaction.serialize().toString('hex');
            web3.eth.sendSignedTransaction(rawdata,(err,txHash) => {
                if(err){
                    console.log("err2: ",err);
                    res.status(500).json({
                        status: "fail",
                        message: err
                    });
                }
                console.log("TxHash: ",txHash);
            }).on('receipt', function(receipt){
                console.log("Receipt: ",receipt);
                const newuser = new users({
                    _id: mongoose.Types.ObjectId(),
                    accountAddr: userAddress
                });
                newuser
                .save()
                .then((result) => {
                    console.log(result);
                    res.status(200).json({
                        status: "success",
                        message: "Block_Id created successfully!"
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        status: "fail",
                        message: err
                    });
                });
            });
        });
    })
    .catch((err) => {
        console.log('catch',err);
        res.status(500).json({
            status: "fail",
            message: err
        });
    });
});

router.post('/login',(req, res, next) => {
    const contract = new web3.eth.Contract(abi, address, {
        from: web3.eth.defaultAccount ,
        gas: 3000000,
    });
    contract.methods.getUserData(req.body.address,req.body.signature)
        .call({from:web3.eth.defaultAccount},function(err,result){
            if(err){
                return res.status(200).json({
                    status: 'fail',
                    message: 'Password Matching Error'
                });
            }
            console.log(web3.utils.hexToAscii(result['email']));
            const token = jwt.sign({
                address: req.body.address,
                signature: req.body.signature
            },
            config.secret_key, {
                'expiresIn': '1h'
            });
            return res.status(200).json({
                status: "success",
                message: "Successfully Logged In.",
                token: token
            });
        });
});

router.get('/profile', checkAuth, (req, res, next) => {
    const contract = new web3.eth.Contract(abi, address, {
        from: web3.eth.defaultAccount ,
        gas: 3000000,
    });
    contract.methods.getUserData(req.userData.address,req.userData.signature)
        .call({from:web3.eth.defaultAccount},function(err,result){
            if(err){
                return res.status(200).json({
                    status: 'fail',
                    message: 'User not found.'
                });
            }
            var name = web3.utils.hexToAscii(result['name']);
            var email = web3.utils.hexToAscii(result['email']);
            var accountAddr = req.userData.address;
            var perAddr = web3.utils.hexToAscii(result['perAddr']);
            var phone = web3.utils.hexToAscii(result['phone']);
            var country = web3.utils.hexToAscii(result['country']);
            var dob = web3.utils.hexToAscii(result['dob']);
            var finalResult ={
                name,email,accountAddr,perAddr,phone,country,dob
            };
            contract.methods.getFingerprint(req.userData.address,req.userData.signature)
                .call({from:web3.eth.defaultAccount},function(error,result2){
                    if(error){
                        return res.status(200).json({
                            status: 'fail',
                            message: 'User not found.'
                        });
                    }
                    var fingerprint = web3.utils.hexToAscii(result2);
                    finalResult.fingerprint = fingerprint;
                    return res.status(200).json({
                        status: "success",
                        message: "User Data fetched.",
                        data: finalResult
                    });
                });
        });
});

module.exports = router;
