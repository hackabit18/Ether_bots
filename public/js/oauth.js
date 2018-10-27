$(document).ready(function(){
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3 = new Web3(web3.currentProvider);
    } else {
        console.log('No web3? You should consider trying MetaMask!')
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        //web3js = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    $("#login").click(function(e){
        e.preventDefault();
        var account_add = $('#account_add').val();
        var password = $('#password').val();
        let msgParams = [
            {
                type: 'bytes32',
                name: 'Message',
                value: password
            }
        ];
        var params = [msgParams, account_add]
        var method = 'eth_signTypedData'
        web3.currentProvider.sendAsync({
            method,
            params,
            account_add
        }, function (err, result) {
            if (err || result.error){
                alert('Account address not registered on Ropsten Testnet or not logged in Metamask');
                return;
            }
            var finalResult = {
                address: account_add,
                signature: result.result
            };
            $.ajax({
                type:"POST",
                url:"http://localhost:3000/api/login",
                data: finalResult,
                success: function(res){
                    if(res.status === 'success'){
                        const token = 'bearer ' +  res.token;
                        localStorage.setItem('token', token);
                        window.location.href = 'registered_flipkart.html';
                    }
                    else{
                        alert(res.message);
                        window.location.href = 'signup_flipkart.html';
                    }
                },
                error: function(err){
                    console.log(err);
                    alert('Some error occured.Please try again.');
                    window.location.href = 'signup_flipkart.html';
                }
            });
        });
    });
});
