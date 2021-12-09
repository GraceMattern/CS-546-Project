// const { json } = require("body-parser");

const { json } = require("body-parser");

(function($) {
    var mySignUpForm = $('#signup-form'),
        FirstNameInput = $('#firstName'),
        LastNameInput = $('#lastName'),
        BankInput = $('#bank'),
        EmailInput = $('#email'),
        PasswordInput = $('#password'),
        AgeInput = $('#age');
    mySignUpForm.submit(function(event) {
        event.preventDefault();

        var FirstName = FirstNameInput.val().toLowerCase().trim();
        var LastName = LastNameInput.val().toLowerCase().trim();
        var Bank = BankInput.val().toLowerCase().trim();
        var Email = EmailInput.val().toLowerCase().trim();
        var Password = PasswordInput.val();
        var Age = AgeInput.val();

        var newContent = $('#new-content');

        if (FirstName && LastName && Bank && Email && Password && Age) {
            var useJson = false;
            if (useJson) {
                var requestConfig = {
                    method: 'POST',
                    url: '/signup',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        firstName : FirstName,
                        lastName: LastName,
                        bank: Bank,
                        username: Email,
                        password: Password,
                        age: Age
                    })
                };

                $.ajax(requestConfig).then(function (responseMessage) {
                    console.log(responseMessage);
                    newContent.html(responseMessage.message);
                  });
            }
        }
    })

})

// $(document).ready(function () {
//     if($('#signup-form')) {
//         $('#submit').submit(function (event) {
//             event.preventDefault();

//             let firstName = $('#firstName').val().trim().toLowerCase();
//             let lastName = $('#lastName').val().trim().toLowerCase();
//             let bank = $('#bank').val().trim().toLowerCase();
//             let email = $('#email').val().trim().toLowerCase();
//             let password = $('#password').val().trim();
//             let age = $('#age').val();

//             if (firstName && lastName && bank && email && password && age) {
//                 $.ajax({
//                     type: "POST",
//                     url: "http://localhost:3000/transactions/signup",
//                     data: JSON.stringify({
//                         firstName : firstName,
//                         lastName: lastName,
//                         bank: bank,
//                         username: email,
//                         password: password,
//                         age: age
//                     }),
//                     contentType: "application/json",
//                 })
//             }

//         })
//     }
// })