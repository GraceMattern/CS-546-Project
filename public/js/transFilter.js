(function($){
    //showList
    function showList(newElement){
        if(newElement.length == 0){
            $('#transList').hide();
            $('#print').hide()
            $('#noTrans').show();
        }
        else{
            $('#transList').show();
            $('#print').show();
            $('#noTrans').hide();
            var title = `<tr>
                            <td>Amount</td>
                            <td>date</td>
                            <td>tag</td>
                            <td>income/expense</td>
                            <td>operate</td>
                        </tr>`
            $('#transList').append(title);
            for (var i = 0; i < newElement.length; i++){
                if(newElement[i].toAccountId == "external_transaction"){
                    var edit = `<a href="/edit/transaction/${newElement[i]._id}">Edit</a>`;
                    var del = `<a href="/delete/transaction/${newElement[i]._id}">Delete</a>`;
                    var toAccountId = 'expense';
                }
                if(newElement[i].toAccountId == "internal_deposit"){
                    var edit = `<a href="/edit/deposit/${newElement[i]._id}">Edit</a>`;
                    var del = `<a href="/delete/deposit/${newElement[i]._id}">Delete</a>`;
                    var toAccountId = 'income';
                }
                var tr = `<tr>
                                <td>${newElement[i].transAmount}</td>
                                <td>${newElement[i].date.DD}.${newElement[i].date.MM}.${newElement[i].date.YYYY}</td>
                                <td>${newElement[i].tag}</td>
                                <td>${toAccountId}</td>
                                <td>${edit} ${del}</td>
                        </tr>`
                // var li = `<li">
                //                 ${newElement[i].transAmount}
                //                 ${newElement[i].date.DD}.${newElement[i].date.MM}.${newElement[i].date.YYYY}
                //                 ${newElement[i].tag}
                //             ${edit}
                //             ${del}
                //         </li><br>`;
                $('#transList').append(tr);
            }
        }
    }


    //show all transactions
    var requestConfig = {
        method: 'GET',
        url: 'http://localhost:3000/transactions/'+$('#accountId').attr('title')
    }
    $.ajax(requestConfig).then(function(responseMassage){
        var newElement = $(responseMassage);
        showList(newElement);
    })

    //Filter by month
    function transFilterByMonth(accountId,selectMonth) {
        var requestConfig = {
            method: 'GET',
            url: 'http://localhost:3000/transFilterByMonth/'+accountId+"/"+selectMonth
        }
        $.ajax(requestConfig).then(function(responseMassage){
            var newElement = $(responseMassage);
            showList(newElement);
        })
    }
    $('#selectMonth-form').submit((event) => {
        event.preventDefault();
        if($('#selectMonth').val().trim()){
            $('#transList').empty();
            transFilterByMonth($('#accountId').attr('title'), $('#selectMonth').val());
        }
    })

    //Filter by tag
    function transFilterByTag(accountId,selectTag) {
        var requestConfig = {
            method: 'GET',
            url: 'http://localhost:3000/transFilterByTag/'+accountId+"/"+selectTag
        }
        $.ajax(requestConfig).then(function(responseMassage){
            var newElement = $(responseMassage);
            showList(newElement);
        })
    }
    $('#selectTag-form').submit((event) => {
        event.preventDefault();

        if($('#selectTag').val().trim()){
            $('#transList').empty();
            transFilterByTag($('#accountId').attr('title'), $('#selectTag').val());
            
        }
    })

    $('#showAll').click(function(event){
        event.preventDefault();
        $('#transList').empty();
        var requestConfig = {
            method: 'GET',
            url: 'http://localhost:3000/transactions/'+$('#accountId').attr('title')
        }
        $.ajax(requestConfig).then(function(responseMassage){
            var newElement = $(responseMassage);
            showList(newElement);
        })
    })
})(window.jQuery);