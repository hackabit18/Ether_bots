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
                
            }
        })
        .fail((err) => {
            alert('Some error occured.Please try again.');
            window.location.href = 'profile.html';
        });
});
