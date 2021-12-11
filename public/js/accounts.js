(function ($) {
    $('#account-form').on('submit', function(e) {
        e.preventDefault();
        // console.log("form was submitted");
        $('#account-form').unbind().submit();
    })

    $('#acctSubmit').on('click', function(e) {
        if(!($('#savings').prop('checked') || $('#checkings').prop('checked') || $('#joint').prop('checked'))) {
            e.preventDefault();
            alert("You must select an option");
        }
    })
})(window.jQuery);

