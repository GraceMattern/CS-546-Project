(function ($) {
  //showList
  function showList(newElement) {
    if (newElement.length == 0) {
      $("#transList").hide();
      $("#print").hide();
      $("#noTrans").show();
    } else {
      $("#transList").show();
      $("#print").show();
      $("#noTrans").hide();
      var title = `<tr>
                            <td>Amount</td>
                            <td>Date</td>
                            <td>Tag</td>
                            <td>Type</td>
                            <td>Options</td>
                        </tr>`;
      $("#transList").append(title);
      for (var i = 0; i < newElement.length; i++) {
        if (newElement[i].toAccountId == "external_transaction") {
          var edit = `<a href="/edit/transaction/${newElement[i]._id}">Edit</a>`;
          var del = `<a href="/delete/transaction/${newElement[i]._id}">Delete</a>`;
          var toAccountId = "expense";
        }
        if (newElement[i].toAccountId == "internal_deposit") {
          var edit = `<a href="/edit/deposit/${newElement[i]._id}">Edit</a>`;
          var del = `<a href="/delete/deposit/${newElement[i]._id}">Delete</a>`;
          var toAccountId = "income";
        }
        var tr = `<tr>
                                <td>${newElement[i].transAmount}</td>
                                <td>${newElement[i].date.DD}.${newElement[i].date.MM}.${newElement[i].date.YYYY}</td>
                                <td>${newElement[i].tag}</td>
                                <td>${toAccountId}</td>
                                <td>${edit} ${del}</td>
                        </tr>`;
        $("#transList").append(tr);
      }
    }
  }

  //show all transactions
  var requestConfig = {
    method: "GET",
    url: "http://localhost:3000/transactions/" + $("#accountId").attr("title"),
  };
  $.ajax(requestConfig).then(function (responseMassage) {
    var newElement = $(responseMassage);
    showList(newElement);
    $("#trend").hide();
  });

  //Filter by month
  function transFilterByMonth(accountId, selectMonth, sort) {
    var requestConfig = {
      method: "GET",
      url:
        "http://localhost:3000/transFilterByMonth/" +
        accountId +
        "/" +
        selectMonth +
        "/" +
        sort,
    };
    $.ajax(requestConfig).then(function (responseMassage) {
      var newElement = $(responseMassage);
      showList(newElement);
    });
  }
  $("#selectMonth-form").submit((event) => {
    event.preventDefault();

    if ($("#selectMonth").val().trim()) {
      $("#transList").empty();
      transFilterByMonth(
        $("#accountId").attr("title"),
        $("#selectMonth").val(),
        $("input[name='monthSort']:checked").val()
      );
    }
  });

  //Filter by tag
  function transFilterByTag(accountId, selectTag, sort) {
    var requestConfig = {
      method: "GET",
      url:
        "http://localhost:3000/transFilterByTag/" +
        accountId +
        "/" +
        selectTag +
        "/" +
        sort,
    };
    $.ajax(requestConfig).then(function (responseMassage) {
      var newElement = $(responseMassage);
      showList(newElement);
    });
  }
  $("#selectTag-form").submit((event) => {
    event.preventDefault();

    if ($("#selectTag").val().trim()) {
      $("#transList").empty();
      transFilterByTag(
        $("#accountId").attr("title"),
        $("#selectTag").val(),
        $("input[name='tagSort']:checked").val()
      );
    }
  });

  //Filter by type(external_transaction or internal_deposit)
  function transFilterByType(accountId, selectType, sort) {
    var requestConfig = {
      method: "GET",
      url:
        "http://localhost:3000/transFilterByType/" +
        accountId +
        "/" +
        selectType +
        "/" +
        sort,
    };
    $.ajax(requestConfig).then(function (responseMassage) {
      var newElement = $(responseMassage);
      showList(newElement);
    });
  }
  $("#selectType-form").submit((event) => {
    event.preventDefault();

    if ($("#selectType").val().trim()) {
      $("#transList").empty();
      transFilterByType(
        $("#accountId").attr("title"),
        $("#selectType").val(),
        $("input[name='typeSort']:checked").val()
      );
    }
  });

  //Show all transactions
  $("#showAll").click(function (event) {
    event.preventDefault();
    $("#transList").empty();
    var requestConfig = {
      method: "GET",
      url:
        "http://localhost:3000/transactions/" + $("#accountId").attr("title"),
    };
    $.ajax(requestConfig).then(function (responseMassage) {
      var newElement = $(responseMassage);
      showList(newElement);
    });
  });

  //Trend by tag
  function trendByTag(accountId, tag) {
    var requestConfig = {
      method: "GET",
      url: "http://localhost:3000/trendByTag/" + accountId + "/" + tag,
    };
    $.ajax(requestConfig).then(function (responseMassage) {
      var result = $(responseMassage);
      console.log(result);
      //show result
      $("#trend").show();
      $("#trend").empty();
      var lastMonth = `<li>
                                Last month your total transactions in ${tag} was ${result[0].lastAmount}.
                            </li>`;
      var thisMonth = `<li>
                                This month your total transactions in ${tag} was ${result[0].thisAmount}.
                            </li>`;
      var trend = `<li>
                            The trend is ${result[0].trend * 100}%
                        </li>`;
      $("#trend").append(lastMonth);
      $("#trend").append(thisMonth);
      $("#trend").append(trend);
    });
  }
  $("#trend-form").submit((event) => {
    event.preventDefault();

    if ($("#trendTag").val().trim()) {
      $("#trend").empty();
      trendByTag($("#accountId").attr("title"), $("#trendTag").val());
    }
  });
})(window.jQuery);