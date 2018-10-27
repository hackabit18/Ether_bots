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

var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/c3e5ff7e41d34e45bd5e4338a8f6806a"));
/* contract declaration */
web3.eth.defaultAccount = '0x514e011e0Ce512c06E23E192A0469f448b0F52ce';
var privKey = "3D6A8A4B7B59F3EFC165B58B8AD9004DF7828F81B793E44601DB08AFAB83405E";
var abi = JSON.parse(fs.readFileSync('./UserAbi.json'));
var address = '0xec5c6F39979fA319Fb76C0b8643324A7c9Ccd125';

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
                type: 'bytes32',      // Any valid solidity type
                name: 'Message',     // Any string label you want
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
    contract.methods.getUserData(userAddress,bod.signature).call({from:web3.eth.defaultAccount},function(err,result){
        if(err){
            console.log(err);
        }
        console.log(result);



    });
});

router.get('/transactions', checkAuth, (req, res, next) => {

});

router.get('/profile', checkAuth, (req, res, next) => {

});

module.exports = router;
