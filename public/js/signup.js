(function ($) {
    let hasErrors = false;
    function validString(str) {
        if (!str) {
            hasErrors = true;
            return false
        }
        return true;
    }

    let signupForm =$('#signup-form');
    let firstNameInput = $('#firstName');
    let lastNameInput = $('#lastName');
    let bankInput = $('#bank');
    let emailInput = $('#email');
    let passwordInput = $('#password');
    let ageInput = $('#age');
    let submitButton = $('#submit');

    signupForm.submit((event) => {
        event.preventDefault();
        hasErrors = false;
        $('.error').hide();

        firstNameInput.removeClass('is-invalid is-valid');
        lastNameInput.removeClass('is-invalid is-valid');
        bankInput.removeClass('is-invalid is-valid');
        passwordInput.removeClass('is-invalid is-valid');
        emailInput.removeClass('is-invalid is-valid');
        ageInput.removeClass('is-invalid is-valid');

        // submitButton.prop('disabled', true);
        let info = {
            firstName: firstNameInput.val().trim(),
            lastName: lastNameInput.val().trim(),
            bank: bankInput.val().trim(),
            email: emailInput.val().trim(),
            password: passwordInput.val().trim(),
            age: ageInput.val().trim()
        };
        
        if (!validString(info.firstName)) firstNameInput.addClass('is-invalid');
        if (!validString(info.lastName)) lastNameInput.addClass('is-invalid');
        if (!validString(info.bank)) bankInput.addClass('is-invalid');
        if (!validString(info.email)) emailInput.addClass('is-invalid');
        if (!validString(info.password)) passwordInput.addClass('is-invalid');
        if (!validString(info.age)) ageInput.addClass('is-invalid');
        
        if(!info.age) ageInput.addClass('is-invalid'); 
        // if(parseInt(info.age) < 18) ageInput.addClass('is-invalid'); 
        
        if (info.email.trim() != info.email.trim().replace(/\s+/g, "")) 
            emailInput.addClass('is-invalid'); 
        if ( info.email.trim().split("@")[1] != `${info.bank.trim().replace(/\s/g, "")}.com`) 
            emailInput.addClass('is-invalid'); 
        if (/([a-zA-Z0-9]+)([\_\.\-{1}])?([a-zA-Z0-9]+)\@([a-zA-Z0-9]+)([\.])com/.test(info.email.trim()) == false) 
            emailInput.addClass('is-invalid'); 


        if (info.password.trim() != info.password.trim().replace(/\s+/g, ""))
            passwordInput.addClass('is-invalid');
        let strippedStr = info.password.trim().replace(/\s+/g, "");
        if (strippedStr.length < 6) passwordInput.addClass('is-invalid');
        
        if (!hasErrors) { 
            signupForm.unbind().submit();
        } 
        else {
            submitButton.prop('disabled', false);
        }
    });
})(window.jQuery);