$(document).ready(function(){
    $.ajax({
            type: 'GET',
            url: 'http://localhost:3000/api/profile',
            headers: {
                'token': localStorage.getItem('token')
            }
        })
        .done((result) => {
            if(result.status === 'fail') {
                alert(result.message);
                window.location.href = "login.html";
            } else {
                $('#name').html(result.data.name);
                $('#account_add').html(result.data.accountAddr);
                $('#email').html(result.data.email);
                $('#per_add').html(result.data.perAddr);
                $('#dob').html(result.data.dob);
                $('#fingerprint').html(result.data.fingerprint);
                $('#phone').html(result.data.phone);
                $('#country').html(result.data.country);
                
                      
                      var typeNumber = 0;
                      var errorCorrectionLevel = 'L';
                      var qr = qrcode(typeNumber, errorCorrectionLevel);
                      qr.addData("jVrT56ad76");
                      qr.make();
                      $('#qrcode').html(qr.createSvgTag(6,4));
          
                 
            
          
            }
        })
        .fail((err) => {
            alert('Some error occured.Please try again.');
            window.location.href = 'profile.html';
        });
});
