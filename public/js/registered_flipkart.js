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
                window.location.href = "signup_flipkart.html";
            } else {
                $('#name').html(result.data.name);
                $('#email').html(result.data.email);
                $('#phone').html(result.data.phone);
            }
        })
        .fail((err) => {
            alert('Some error occured.Please try again.');
            window.location.href = 'signup_flipkart.html';
        });
});
