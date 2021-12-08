(function($){
    
    var requestConfig = {
        method: 'GET',
        url: 'http://localhost:3000/transactions/'+$('#accountId').attr('title')
    }
    //show all transactions
    $.ajax(requestConfig).then(function(responseMassage){
        var newElement = $(responseMassage);
        if(newElement.length == 0){
            $('#transList').hide();
            $('#noTrans').show();
        }
        else{
            $('#transList').show();
            $('#noTrans').hide();
            for (var i = 0; i < newElement.length; i++){
                if(newElement[i].toAccountId == "external_transaction"){
                    var edit = `<a href="/edit/transaction/${newElement[i]._id}">Edit</a>`;
                    var del = `<a href="/delete/transaction/${newElement[i]._id}">Delete</a>`;
                }
                if(newElement[i].toAccountId == "internal_deposit"){
                    var edit = `<a href="/edit/deposit/${newElement[i]._id}">Edit</a>`;
                    var del = `<a href="/delete/deposit/${newElement[i]._id}">Delete</a>`;
                }
                var li = `<li">
                                ${newElement[i].transAmount}
                                ${newElement[i].date.DD}.${newElement[i].date.MM}.${newElement[i].date.YYYY}
                                ${newElement[i].tag}
                            ${edit}
                            ${del}
                        </li><br>`;
                $('#transList').append(li);
            }
        }
    })

    function transFilterByMonth(accountId,selectMonth) {
        var requestConfig = {
            method: 'GET',
            url: 'http://localhost:3000/transFilter/'+accountId+"/"+selectMonth
        }
        $.ajax(requestConfig).then(function(responseMassage){
            var newElement = $(responseMassage);
            if(newElement.length == 0){
                $('#transList').hide();
                $('#noTrans').show();
            }
            else{
                $('#transList').show();
                $('#noTrans').hide();
                for (var i = 0; i < newElement.length; i++){
                    if(newElement[i].toAccountId == "external_transaction"){
                        var edit = `<a href="/edit/transaction/${newElement[i]._id}">Edit</a>`;
                        var del = `<a href="/delete/transaction/${newElement[i]._id}">Delete</a>`;
                    }
                    if(newElement[i].toAccountId == "internal_deposit"){
                        var edit = `<a href="/edit/deposit/${newElement[i]._id}">Edit</a>`;
                        var del = `<a href="/delete/deposit/${newElement[i]._id}">Delete</a>`;
                    }
                    var li = `<li">
                                    ${newElement[i].transAmount}
                                    ${newElement[i].date.DD}.${newElement[i].date.MM}.${newElement[i].date.YYYY}
                                    ${newElement[i].tag}
                                ${edit}
                                ${del}
                            </li><br>`;
                    $('#transList').append(li);
                }
            }
        })
    }

    $('#selectMonth-form').submit((event) => {
        event.preventDefault();
        if($('#selectMonth').val().trim()){
            $('#transList').empty();
            transFilterByMonth($('#accountId').attr('title'), $('#selectMonth').val())
        }
    })

    $('#showAll').click((event) => {
        window.location.reload();
    })
})(window.jQuery);