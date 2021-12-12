const mongoCollections = require("../config/mongoCollections");
const transactions = mongoCollections.transactions;
const accountsCollections = mongoCollections.accounts;
const accounts = require("./accounts");
let { ObjectId } = require("mongodb");
const data = require(".");

function isString(a) {
  if (typeof a != "string") throw "Type is not String";
  if (a.trim().length == 0) throw "content is empty";
}
//create new transaction after successful transaction and return object
async function createTrans(userId, accountId, toAccountId, amount, tag) {
  if (
    !userId ||
    isString(userId) ||
    !accountId ||
    isString(accountId) ||
    !toAccountId ||
    isString(toAccountId)
  )
    throw "Please input a non empty Ids!";

  if (!tag || isString(tag)) throw `Tag must be a string`;

  if (!amount || typeof parseFloat(amount) !== "number")
    throw `Amount must be a number`;

  if (parseFloat(amount) <= 0)
    throw "Amount must be a positive, non zero number";

  let CurrDate = new Date();
  let newTrans = {
    accountId: accountId,
    userId: userId,
    toAccountId: toAccountId,
    transAmount: parseFloat(amount).toFixed(2),
    date: {
      MM: CurrDate.getMonth() + 1,
      DD: CurrDate.getDate(),
      YYYY: CurrDate.getFullYear(),
    },
    tag: tag,
  };
  const transCollection = await transactions();
  const insertInfo = await transCollection.insertOne(newTrans);
  if (insertInfo.insertedCount === 0) throw "Could not add Transaction";

  const newId = insertInfo.insertedId.toString();
  const transResult = await this.getTransById(newId);
  if (!transResult) throw `there is no transaction with that id`;
  transResult._id = transResult._id.toString();

  // add transaction to user's account and update balance
  const accCollect = await accountsCollections();
  const found = await accounts.getAccount(accountId.toString());
  if (!found) throw "The Account does not exists!";
  found["transactions"].push(newId);
  if (toAccountId == "internal_deposit") {
    // deposit
    found.balance = (parseFloat(found.balance) + parseFloat(amount)).toFixed(2);
    delete found._id;
    let parsedId;
    try {
      parsedId = ObjectId(accountId.trim());
    } catch (e) {
      throw e.message;
    }
    const updatedInfo = await accCollect.updateOne(
      { _id: parsedId },
      { $set: found }
    );
    if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount)
      throw "Update failed";
    // return await accounts.getAccount(accountId);
    return transResult;
  }
  if (toAccountId == "external_transaction") {
    // transaction
    if (parseFloat(found.balance) < parseFloat(amount))
      throw `You have insuffient funds to make this transaction`;
    found.balance = (parseFloat(found.balance) - parseFloat(amount)).toFixed(2);
    delete found._id;
    let parsedId;
    try {
      parsedId = ObjectId(accountId.trim());
    } catch (e) {
      throw e.message;
    }
    const updatedInfo = await accCollect.updateOne(
      { _id: parsedId },
      { $set: found }
    );
    if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount)
      throw "Update failed";
    // return await accounts.getAccount(accountId);
    return transResult;
  }
}

//return all Transaction in array
async function getAlltrans() {
  const transCollection = await transactions();
  const transList = await transCollection.find({}).toArray();
  if (!transList) throw `No transaction in the system`;
  for (let i of transList) {
    i._id = i._id.toString();
  }
  return transList;
}

//Get all transactions between given intervals
async function getFilterTrans(fromDate, toDate) {
  if (!fromDate || !toDate) throw "Please provide both dates";
  const transCollection = await transactions();
  const transList = await transCollection.find({}).toArray();
  var ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  allDates = [];
  const startDate = new Date(fromDate);
  const endDate = new Date(toDate);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw "Date is not Valid";
  }

  if (startDate.getTime() > endDate.getTime()) {
    throw "Start Date should not be greater than End Date";
  }
  if (endDate.getTime() > new Date()) {
    throw "End Date should not be greater than Current Date";
  }
  // console.log(moment("06/22/2015", "MM/DD/YYYY", true).isValid())
  for (i = 0; i < transList.length; i++) {
    tempDate =
      transList[i]["date"]["MM"] +
      "-" +
      transList[i]["date"]["DD"] +
      "-" +
      transList[i]["date"]["YYYY"];
    tempDate = new Date(tempDate);
    if (tempDate >= startDate && tempDate <= endDate) {
      allDates.push({ id: transList[i]["_id"].toString(), date: tempDate });
    }
  }
  allDates.sort((a, b) => a.date - b.date);
  finalList = [];
  for (i = 0; i < allDates.length; i++) {
    finalList.push({
      id: allDates[i]["id"],
      Date:
        allDates[i]["date"].getMonth() +
        1 +
        "-" +
        allDates[i]["date"].getDate() +
        "-" +
        allDates[i]["date"].getFullYear(),
    });
  }
  return finalList;
}

// Return userId in string
async function getTransById(transID) {
  if (!transID || isString(transID))
    throw "Please input non-empty Transaction ID";
  if (arguments.length != 1)
    throw "transaction.getTransById(transID) Please only input transaction id";
  let objId;
  try {
    objId = ObjectId(transID.trim());
  } catch (e) {
    throw e.message;
  }

  const transCollection = await transactions();
  const transact = await transCollection.findOne({ _id: objId });
  if (!transact) throw "trans not found";
  transact._id = transact._id.toString();
  return transact;
}

async function update(transId, toAccountId, amount, tag, date) {
  if (!transId || isString(transId) || !toAccountId || isString(toAccountId))
    throw "Please input a non empty Account Ids!";

  if (!amount || typeof parseFloat(amount) !== "number")
    throw `Amount must be a number`;

  if (parseFloat(amount) <= 0)
    throw "Amount must be a positive, non zero number";

  if(!tag || isString(tag)) throw `A tag must be supplied`

  if(!date || isString(date)) throw `A date must be supplied`

  if (toAccountId === "internal_deposit") {
    const transCollect = await transactions();
    let objId;
    try {
      objId = ObjectId(transId.trim());
    } catch (e) {
      throw e.message;
    }
    let foundFrom = await transCollect.findOne({ _id: objId });
    if (!foundFrom) throw "transaction not found";
    let oldAmount = foundFrom.transAmount;
    // if (foundFrom["balance"] < amount)
    //   throw "Minimum balance requirement(Cant deduct amount)!!!";
    // foundFrom["balance"] -= amount;
    let updatedFrom = await transCollect.updateOne(
      { _id: objId },
      {
        $set: {
          transAmount: parseFloat(amount).toFixed(2),
          tag: tag,
          date: {
            MM: parseInt(date.substring(5, 7)),
            DD: parseInt(date.substring(8, 10)),
            YYYY: parseInt(date.substring(0, 4)),
          },
        },
      }
    );
    // if (updatedFrom.modifiedCount === 0) throw "could not update transaction";

    let accCollect = await accountsCollections();
    let accountId = await accounts.getAccountByTransId(transId.toString());

    try {
      accountId = ObjectId(accountId);
    } catch (e) {
      throw e.message;
    }
    let foundTo = await accCollect.findOne({ _id: accountId });
    if (!foundTo) throw "account not found";
    foundTo["balance"] = (
      parseFloat(foundTo["balance"]) -
      (parseFloat(oldAmount) - parseFloat(amount))
    ).toFixed(2);

    let updatedTo = await accCollect.updateOne(
      { _id: accountId },
      { $set: { balance: foundTo["balance"] } }
    );
    // if (updatedTo.modifiedCount === 0) throw "could not update balance";
    // createTrans(accountId, toAccountId, amount);
    // return await accounts.getAccount(accountId);
    return await this.getTransById(transId);
  }
  if (toAccountId == "external_transaction") {
    let transCollect = await transactions();
    let objId;
    try {
      objId = ObjectId(transId.trim());
    } catch (e) {
      throw e.message;
    }
    let foundFrom = await transCollect.findOne({ _id: objId });
    if (!foundFrom) throw "transaction not found";
    let oldAmount = foundFrom.transAmount;
    // if (foundFrom["balance"] < amount)
    //   throw "Minimum balance requirement(Cant deduct amount)!!!";
    // foundFrom["balance"] -= amount;
    let updatedFrom = await transCollect.updateOne(
      { _id: objId },
      {
        $set: {
          transAmount: parseFloat(amount).toFixed(2),
          tag: tag,
          date: {
            MM: parseInt(date.substring(5, 7)),
            DD: parseInt(date.substring(8, 10)),
            YYYY: parseInt(date.substring(0, 4)),
          },
        },
      }
    );
    // if (updatedFrom.modifiedCount === 0) throw "could not update transaction";

    let accCollect = await accountsCollections();
    let accountId = await accounts.getAccountByTransId(transId.toString());

    try {
      accountId = ObjectId(accountId);
    } catch (e) {
      throw e.message;
    }
    let foundTo = await accCollect.findOne({ _id: accountId });
    if (!foundTo) throw "account not found";
    foundTo["balance"] = (
      parseFloat(foundTo["balance"]) +
      (parseFloat(oldAmount) - parseFloat(amount))
    ).toFixed(2);

    let updatedTo = await accCollect.updateOne(
      { _id: accountId },
      { $set: { balance: foundTo["balance"] } }
    );
    // if (updatedTo.modifiedCount === 0) throw "could not update balance";
    // createTrans(accountId, accountId, amount);
    // return await accounts.getAccount(accountId);
    return await this.getTransById(transId);
  }
}

async function getDetails(arr) {
  if (!Array.isArray(arr)) throw `you must supply an array`
  if (!arr) return [];
  // arr can be empty since if there are no transactions
  else {
    let result = [];
    for (let id of arr) {
      let temp = await this.getTransById(id.toString());
      result.push(temp);
    }
    if (!result) throw `unable to find details of the transaction id(s) given`;
    return result;
  }
}

async function deleteTrans(transId, type) {
  if (!transId || isString(transId) || !type || isString(type))
    throw "Please input non-empty Transaction ID";
  if (arguments.length != 2)
    throw "transaction.getTransById(transId) Please only input transaction id";
  let objId;
  try {
    objId = ObjectId(transId.trim());
  } catch (e) {
    throw e.message;
  }
  const transCollection = await transactions();
  let transaction = await this.getTransById(transId.trim());
  if (!transaction) throw `there is no transaction with that id`;

  // remove transId from account collection, update balance
  const accountCollection = await accountsCollections();
  let accountInfo = await accounts.getAccount(transaction.accountId);
  if (!accountInfo) throw `there is no account with that id`;
  let length = accountInfo["transactions"].length;
  for (let i = 0; i < length; i++) {
    if (accountInfo.transactions[i] == transId) {
      accountInfo.transactions.splice(i, 1);
      break;
    }
    if (i == length - 1) throw `no account with that transaction id`;
  }
  if (type == "deposit") {
    accountInfo.balance = (
      parseFloat(accountInfo.balance) - parseFloat(transaction.transAmount)
    ).toFixed(2);
  }
  if (type == "transaction") {
    accountInfo.balance = (
      parseFloat(accountInfo.balance) + parseFloat(transaction.transAmount)
    ).toFixed(2);
  }
  delete accountInfo._id;
  let ObjAcctId;
  try {
    ObjAcctId = ObjectId(transaction["accountId"].trim());
  } catch (e) {
    throw e.message;
  }

  const updateInfo = await accountCollection.updateOne(
    { _id: ObjAcctId },
    { $set: accountInfo }
  );
  if (updateInfo.modifiedCount === 0) {
    throw "Could not remove transaction in the account collection";
  }

  // remove
  const deleteTrans = await transCollection.deleteOne({ _id: objId });
  if (deleteTrans.deleteCount === 0)
    throw `Could not delete transaction with that id`;

  return accountInfo.transactions;
}

//Filter by month, year and accountId
async function transFilterByMonth(accountId, YYYY, MM, sort) {
  if (!accountId || !YYYY || !MM || !sort)
    throw "please enter accountId, year, month, sort way";
  isString(accountId);
  isString(YYYY);
  isString(MM);
  isString(sort);
  const transactionCollection = await transactions();
  sort = parseInt(sort);
  if (sort == 0) {
    const transactionList = await transactionCollection
      .find({
        accountId: accountId,
        "date.YYYY": parseInt(YYYY),
        "date.MM": parseInt(MM),
      })
      .toArray();
    return transactionList;
  } else {
    const transactionList = await transactionCollection
      .find({
        accountId: accountId,
        "date.YYYY": parseInt(YYYY),
        "date.MM": parseInt(MM),
      })
      .sort({ transAmount: sort })
      .toArray();
    return transactionList;
  }
}

//Filter by tag and accountId
async function transFilterByTag(accountId, selectTag, sort) {
  if (!accountId || !selectTag || !sort)
    throw "please enter accountId, tag, sort way";
  isString(accountId);
  isString(selectTag);
  isString(sort);
  const transactionCollection = await transactions();
  sort = parseInt(sort);
  if (sort == 0) {
    const transactionList = await transactionCollection
      .find({
        accountId: accountId,
        tag: selectTag,
      })
      .toArray();
    return transactionList;
  } else {
    const transactionList = await transactionCollection
      .find({
        accountId: accountId,
        tag: selectTag,
      })
      .sort({ transAmount: sort })
      .toArray();
    return transactionList;
  }
}

//Filter by type(toAccountId) and accountId
async function transFilterByType(accountId, selectType, sort) {
  if (!accountId || !selectType || !sort)
    throw "please enter accountId, Type, sort way";
  isString(accountId);
  isString(selectType);
  isString(sort);
  const transactionCollection = await transactions();
  sort = parseInt(sort);
  if (sort == 0) {
    const transactionList = await transactionCollection
      .find({
        accountId: accountId,
        toAccountId: selectType,
      })
      .toArray();
    return transactionList;
  } else {
    const transactionList = await transactionCollection
      .find({
        accountId: accountId,
        toAccountId: selectType,
      })
      .sort({ transAmount: sort })
      .toArray();
    return transactionList;
  }
}

//Trend compare with last month by tag
async function trendByTag(accountId, thisMonth, YYYY, tag) {
  if (!accountId || !thisMonth || !YYYY || !tag)
    throw "please enter accountId, month and tag";
  isString(accountId);
  isString(tag);
  // if (thisMonth > 12 || thisMonth < 1) throw `must provide valid numerical month number`

  if (thisMonth == 1) {
    var lastMonth = 12;
  } 
  if (thisMonth >12 || thisMonth < 1) {
    throw "month number must be between 1 and 12"
  } else {
    var lastMonth = thisMonth - 1;
  }
  const transactionCollection = await transactions();

  const lastMonthTransactionList = await transactionCollection
    .find({
      accountId: accountId,
      "date.YYYY": YYYY,
      "date.MM": lastMonth,
      tag: tag,
    })
    .toArray();

  var lastAmount = 0;
  var lastListLength = lastMonthTransactionList.length;
  if (lastListLength != 0) {
    for (let i = 0; i < lastListLength; i++) {
      lastAmount += parseFloat(lastMonthTransactionList[i].transAmount);
    }
  }

  const thisMonthTransactionList = await transactionCollection
    .find({
      accountId: accountId,
      "date.YYYY": YYYY,
      "date.MM": thisMonth,
      tag: tag,
    })
    .toArray();
  var thisAmount = 0;
  var thisListLength = thisMonthTransactionList.length;
  if (thisListLength != 0) {
    for (let i = 0; i < thisListLength; i++) {
      thisAmount += parseFloat(thisMonthTransactionList[i].transAmount);
    }
  }
  var trend = 0;
  if(lastAmount == 0 && thisAmount != 0){trend = 1}
  if(lastAmount != 0 && thisAmount == 0){trend = -1}
  if(lastAmount != 0 && thisAmount != 0) {trend = (thisAmount - lastAmount) / lastAmount};
  var result = {
    lastAmount: parseFloat(lastAmount).toFixed(2),
    thisAmount: parseFloat(thisAmount).toFixed(2),
    trend: parseFloat(trend.toFixed(2)),
  };

  return result;
}

module.exports = {
  createTrans,
  getAlltrans,
  getTransById,
  getFilterTrans,
  update,
  getDetails,
  deleteTrans,
  transFilterByMonth,
  transFilterByTag,
  transFilterByType,
  trendByTag,
};
