(function ($) {
    let hasErrors = false;
    function validString(str) {
        if (!str) {
            hasErrors = true;
            return false
        }
        return true;
    }

    let loginForm =$('#login-form');
    let usernameInput = $('#username');
    let passwordInput = $('#password');
    let submitButton = $('#loginButton');

    loginForm.submit((event) => {
        event.preventDefault();
        hasErrors = false;
        $('.error').hide();

        usernameInput.removeClass('is-invalid is-valid');
        passwordInput.removeClass('is-invalid is-valid');

        submitButton.prop('disabled', true);
        let info = {
            username: usernameInput.val().trim(),
            password: passwordInput.val().trim(),
        };
        
        if (!validString(info.username)) usernameInput.addClass('is-invalid');
        if (!validString(info.password)) passwordInput.addClass('is-invalid');
        
        if (!hasErrors) {
            loginForm.unbind().submit();
        } else {
            submitButton.prop('disabled', false);
        }
    });
})(window.jQuery);