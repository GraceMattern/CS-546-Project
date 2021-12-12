(function ($) {
    let hasErrors = false;
    function validString(str) {
        if (!str) {
            hasErrors = true;
            return false
        }
        return true;
    }

    let depositEditForm =$('#edit-deposit-form');
    let depositInput = $('#deposit');
    let depositDateInput = $('#date')
    let depositTagInput = $('#tag');
    let depositSubmitButton = $('#depositSubmit');

    depositEditForm.submit((event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        hasErrors = false;
        $('.error').hide();

        depositInput.removeClass('is-invalid is-valid');
        depositDateInput.removeClass('is-invalid is-valid')
        depositTagInput.removeClass('is-invalid is-valid');

        depositSubmitButton.prop('disabled', true);
        let info = {
            amount: depositInput,
            date: depositDateInput.val(),
            tag: depositTagInput.val().trim(),
        };
        
        // if (!validString(info.amount)) {
        //     depositInput.addClass('is-invalid');
        //     console.log(`hello 1 ${info.amount}`)
        // }
        if (!validString(info.tag)) depositTagInput.addClass('is-invalid');
        // if (!validString(info.date)) depositDateInput.addClass('is-invalid');
        
        if(parseFloat(info.amount) < 0.01) {
            depositInput.addClass('is-invalid');
            hasErrors = true;
        }
        if(!info.tag) {
            depositTagInput.addClass('is-invalid');
            hasErrors = true;
        }
        if(!info.date) {
            depositDateInput.addClass('is-invalid');
            hasErrors = true;
            depositSubmitButton.prop('disabled', false);
        }

        if (!hasErrors && info.date && info.amount) {
        // if (!hasErrors && info.tag) {
            depositEditForm.unbind().submit();
        } 
        
        if(info.amount[1]==undefined) {
            // depositInput.addClass('is-invalid');
            hasErrors = true;
            depositSubmitButton.prop('disabled', false);
        }
        else {
            depositSubmitButton.prop('disabled', false);
        }
    });

    let transEditForm =$('#edit-trans-form');
    let transInput = $('#transaction');
    let transDateInput = $('#date')
    let transTagInput = $('#tag');
    let transSubmitButton = $('#transSubmit');

    transEditForm.submit((event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        hasErrors = false;
        $('.error').hide();

        transInput.removeClass('is-invalid is-valid');
        transDateInput.removeClass('is-invalid is-valid')
        transTagInput.removeClass('is-invalid is-valid');

        transSubmitButton.prop('disabled', true);
        let info = {
            amount: transInput,
            date: transDateInput.val(),
            tag: transTagInput.val().trim(),
        };
        
        // if (!validString(info.amount)) transInput.addClass('is-invalid');
        if (!validString(info.tag)) transTagInput.addClass('is-invalid');
        // if (!validString(info.date)) transDateInput.addClass('is-invalid');
        
        if(parseFloat(info.amount) < 0.01) {
            transInput.addClass('is-invalid');
            hasErrors = true;
        }
        if(!info.tag) {
            transTagInput.addClass('is-invalid');
            hasErrors = true;
        }
        if(!info.date) {
            transDateInput.addClass('is-invalid');
            hasErrors = true;
            depositSubmitButton.prop('disabled', false);
        }

        if (!hasErrors && info.date  && info.amount) {
        // if (!hasErrors && info.tag) {
            transEditForm.unbind().submit();
        } 
        if(info.amount[1]==undefined) {
            // transInput.addClass('is-invalid');
            hasErrors = true;
            depositSubmitButton.prop('disabled', false);
        }
        else {
            transSubmitButton.prop('disabled', false);
        }
    });
})(window.jQuery);