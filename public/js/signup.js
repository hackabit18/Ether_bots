$(document).ready(function(){
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3 = new Web3(web3.currentProvider);
    } else {
        console.log('No web3? You should consider trying MetaMask!')
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        //web3js = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    var ch = false;
    /* Validation part */
    $('#address_error').hide();
    $('#email_error').hide();
    $('#phone_error').hide();
    $('#password_error').hide();
    $('#country_error').hide();

    var address_error = false;
    var name_error = false;
    var email_error = false;
    var phone_error = false;
    var password_error = false;
    var country_error = false;
    $('#name').focusout(function(){
        check_name();
    });
    $('#email').focusout(function(){
        check_email();
    });
    $('#phone').focusout(function(){
        check_phone();
    });
    $('#password, #password2').focusout(function(){
        check_password();
    });
    $('#country_error').focusout(function(){
        check_country();
    });

    function check_name() {
        var name = $('#name').val();
        //name.trim();
        if(name!='') {
            $('#name_error').hide();
        }
        else {
            $('#name_error').html("Name field cannot be empty");
            $('#name_error').show();
            name_error=true;
        }
    }
    function check_email() {
        var pattern = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@(([0-9a-zA-Z])+([-\w]*[0-9a-zA-Z])*\.)+[a-zA-Z]{2,9})$/;
        var email = $('#email').val().trim();
        if(pattern.test(email)&&email!='') {
            $('#email_error').hide();
        }
        else {
            $('#email_error').html("Invalid email address");
            $('#email_error').show();
            email_error=true;
        }
    }
    function check_phone() {
        var pattern = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
        var phone = $('#phone').val().trim();
        if(pattern.test(phone)&&phone!='') {
            $('#phone_error').hide();
        }
        else {
            $('#phone_error').html("Invalid phone number");
            $('#phone_error').show();
            phone_error=true;
        }
    }
    function check_password() {
        var password = $('#password').val();
        var password2 = $('#password2').val();
        if(password!='' && password2!='') {
            if(password == password2) {
                $('#password_error').hide();
                password_error = false;
            }
            else {
                $('#password_error').html("Passwords do not match");
                $('#password_error').show();
                password_error=true;
                var password = $('#password').val('');
                var password2 = $('#password2').val('');
            }
        }

    }
    function check_country() {
        var country = $('#country').val();
        var temp=country.trim();
        if(temp!='') {
            $('#country_error').hide();
        }
        else {
            $('#country_error').html("Enter country name");
            $('#country_error').show();
            country_error=true;
        }
    }
    /* Validation ends */

    /* Random Fingerprint */
    function randomFingerprint() {
        var fingerprint = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 32; i++)
        fingerprint += possible.charAt(Math.floor(Math.random() * possible.length));

        return fingerprint;
    }
    $('#fingerprint').val(randomFingerprint());

    $(".form-wrapper .button").click(function(e){

        e.preventDefault();
        var button = $(this);
        var currentSection = button.parents(".section");
        var currentSectionIndex = currentSection.index();
        var account_add = $('#account_add').val();
        var password = $('#password').val();
        check_password();
        if(password_error == false){
            if(currentSectionIndex == 0) {
                if(web3.isAddress(account_add)){
                    var headerSection = $('.steps li').eq(currentSectionIndex);
                    currentSection.removeClass("is-active").next().addClass("is-active");
                    headerSection.removeClass("is-active").next().addClass("is-active");
                }
                else{
                    alert('This account address is not valid.');
                }
            }
        }
    });
    $('#next').click(function(){
        password_error = false;
        check_password();
    });
    $('#submit').click(function() {
        email_error=false;
        password_error=false;
        phone_error=false;
        check_email();
        check_password();
        check_phone();
        check_country();
        if(!name_error & !email_error && !password_error && !phone_error && !country_error) {
            var account_add = $('#account_add').val();
            var name  = $('#name').val();
            var email = $('#email').val();
            var password = $('#password').val();
            var phone = $('#phone').val();
            var country = $('#country').val();
            var fingerprint = $('#fingerprint').val();
            var dob = $('#dob').val();
            var perAddr = $('#address').val();
            var utr_no = "<i>NA</i>";
            var score = "<i>NA</i>";
            var boards_marks = "<i>NA</i>";
            var admit_no = "<i>NA</i>";
            if(ch){
                utr_no = $('#utr_no').val();
                score = $('#score').val();
                boards_marks = $('#boards_marks').val();
                admit_no = $('#admit_no').val();
            }
            var finalResult = {
                address:account_add,
                password:password,
                fingerprint: fingerprint,
                email:email,
                phone:phone,
                perAddr:perAddr,
                country:country,
                name:name,
                dob:dob,
                utrNo: utr_no,
                idNo: boards_marks,
                admitNumber: admit_no,
                score: score
            };
            $.ajax({
                type:"POST",
                url:"http://localhost:3000/api/signup",
                data:finalResult,
                success: function(res){
                    if(res.status === 'success'){
                        alert(res.message);
                        location.reload(true);
                    }else{
                        alert(res.message);
                        location.reload(true);
                    }
                },
                error: function(err){
                    alert('Some error occured.Please try again.');
                    location.reload(true);
                    $('.section').append("");
                }
            });
        }
    });


    /*
    * toggle options
    */

    $('#is_student_select').on('change',function() {
        ch = !ch;
        if($('#is_student_select').val()=='Yes') {
            $('#student_options').append('<input type="text" name="utr_no" id="utr_no" placeholder="UTR Number"><input type="text" name="admit_no" id="admit_no" placeholder="Admit Number"><input type="text" name="score" id="score" placeholder="Score"><input type="text" name="boards_marks" id="boards_marks" placeholder="Boards Marks"><br><div class="verified"><i class="fa fa-check-circle-o" aria-hidden="true"></i></div>');
            $('#verify').css("opacity","1");
        } else {
            $('#student_options').empty();
        }
    });

    $('#verify').click(function(e) {
        e.preventDefault;
        $('.verified').css("opacity","1");
    });
});
