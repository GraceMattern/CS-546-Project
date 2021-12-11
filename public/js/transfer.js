(function ($) {
    let hasErrors = false;
    function validString(str) {
        if (!str) {
            hasErrors = true;
            return false
        }
        return true;
    }

    let transferForm =$('#transfer-form');
    let from = $('#from');
    let amount = $('#amount');
    let to = $('#to');
    let submitButton = $('#transferSubmit');

    transferForm.submit((event) => {
        event.preventDefault();
        event.stopImmediatePropagation()
        hasErrors = false;
        $('.error').hide();

        from.removeClass('is-invalid is-valid');
        amount.removeClass('is-invalid is-valid');
        to.removeClass('is-invalid is-valid');

        submitButton.prop('disabled', true);
        let info = {
            from: from.val(),
            amount: amount.val(),
            to: to.val(),
        };
        
        if (!validString(info.amount)) {
            amount.addClass('is-invalid');
            hasErrors =true;
        }
        if (info.from == info.to) {
            from.addClass('is-invalid');
            to.addClass('is-invalid');
            hasErrors =true;
        }

        if (!hasErrors && (info.from != info.to)) {
            transferForm.unbind().submit();
        } 
        else {
            submitButton.prop('disabled', false);
            // console.dir(`${hasErrors} and ${info.from} and ${info.to}`,  { depth: null })
        }
    });
})(window.jQuery);