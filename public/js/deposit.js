(function ($) {
    let hasErrors = false;
    function validString(str) {
        if (!str) {
            hasErrors = true;
            return false
        }
        return true;
    }

    let depositForm =$('#deposit-form');
    let amountInput = $('#deposit');
    let tagInput = $('#tag');
    let submitButton = $('#depositSubmit');

    depositForm.submit((event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        hasErrors = false;
        $('.error').hide();

        amountInput.removeClass('is-invalid is-valid');
        tagInput.removeClass('is-invalid is-valid');

        submitButton.prop('disabled', true);
        let info = {
            amount: amountInput.val().trim(),
            tag: tagInput.val().trim(),
        };
        
        if (!validString(info.amount)) amountInput.addClass('is-invalid');
        if (!validString(info.tag)) tagInput.addClass('is-invalid');
        
        if(parseFloat(info.amount) < 0.01) {
            amountInput.addClass('is-invalid');
            hasErrors = true;
        }
        if(!info.tag) {
            tagInput.addClass('is-invalid');
            hasErrors = true;
        }

        if (!hasErrors) {
        // if (!hasErrors && info.tag) {
            depositForm.unbind().submit();
        } else {
            submitButton.prop('disabled', false);
        }
    });
})(window.jQuery);